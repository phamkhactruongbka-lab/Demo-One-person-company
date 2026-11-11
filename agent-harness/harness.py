"""Local Codex job runner. Python standard library only."""
import argparse
from contextlib import contextmanager
import datetime as dt
import json
import os
from pathlib import Path
import shutil
import sqlite3
import subprocess
import sys
import time
import uuid

ROOT = Path(__file__).resolve().parent
DATA = ROOT / 'data'


def now():
    return dt.datetime.now(dt.timezone.utc).isoformat()


@contextmanager
def db():
    DATA.mkdir(parents=True, exist_ok=True)
    c = sqlite3.connect(DATA / 'harness.db', timeout=10)
    c.row_factory = sqlite3.Row
    c.execute('CREATE TABLE IF NOT EXISTS jobs (id TEXT PRIMARY KEY, created TEXT, status TEXT, spec TEXT, detail TEXT)')
    try:
        with c:
            yield c
    finally:
        c.close()


def command(argv, cwd=None):
    if argv[0] == 'git':
        trusted = cwd or (argv[2] if len(argv) > 2 and argv[1] == '-C' else None)
        if trusted:
            argv = ['git', '-c', 'safe.directory=' + Path(trusted).resolve().as_posix()] + argv[1:]
    p = subprocess.run(argv, cwd=cwd, capture_output=True, text=True, encoding='utf-8', errors='replace', timeout=60)
    if p.returncode:
        raise ValueError(p.stderr.strip() or p.stdout.strip() or f'Exit {p.returncode}')
    return p.stdout.strip()


def validate(spec):
    repo = Path(spec['repo']).resolve(strict=True)
    if not repo.is_dir() or str(repo) != command(['git', '-C', str(repo), 'rev-parse', '--show-toplevel']).replace('/', os.sep):
        raise ValueError('repo must be the Git repository root')
    command(['git', '-C', str(repo), 'rev-parse', 'HEAD'])
    if command(['git', '-C', str(repo), 'status', '--porcelain']):
        raise ValueError('Repository has uncommitted/untracked changes. Commit or choose a clean repository first.')
    if (repo / '.gitmodules').exists():
        raise ValueError('Submodules are not supported in v1')
    if not isinstance(spec.get('task'), str) or not spec['task'].strip():
        raise ValueError('task is required')
    if spec.get('mode', 'review') not in ('review', 'edit'):
        raise ValueError('mode must be review or edit')
    tests = spec.get('tests', [])
    if not isinstance(tests, list) or any(not isinstance(t, list) or not t or any(not isinstance(a, str) for a in t) for t in tests):
        raise ValueError('tests must be an array of argv arrays')
    if not isinstance(spec.get('timeout_seconds', 900), int) or not 10 <= spec.get('timeout_seconds', 900) <= 7200:
        raise ValueError('timeout_seconds must be 10..7200')
    spec['repo'] = str(repo)
    spec['base_commit'] = command(['git', '-C', str(repo), 'rev-parse', 'HEAD'])
    return spec


def add(spec):
    spec = validate(dict(spec))
    ident = uuid.uuid4().hex[:12]
    with db() as c:
        c.execute('INSERT INTO jobs VALUES (?,?,?,?,?)', (ident, now(), 'queued', json.dumps(spec, ensure_ascii=False), ''))
    return ident


def get(ident):
    with db() as c:
        row = c.execute('SELECT * FROM jobs WHERE id=?', (ident,)).fetchone()
    if not row:
        raise ValueError('Unknown job ID')
    return dict(row)


def set_status(ident, status, detail=''):
    with db() as c:
        c.execute('UPDATE jobs SET status=?,detail=? WHERE id=?', (status, detail, ident))


def terminate(p):
    if os.name == 'nt':
        subprocess.run(['taskkill', '/PID', str(p.pid), '/T', '/F'], capture_output=True)
    else:
        import signal
        os.killpg(p.pid, signal.SIGKILL)
    p.wait()


def execute(argv, cwd, out, err, timeout, prompt=None):
    with out.open('w', encoding='utf-8') as stdout, err.open('w', encoding='utf-8') as stderr:
        p = subprocess.Popen(argv, cwd=cwd, stdin=subprocess.PIPE if prompt is not None else subprocess.DEVNULL,
                             stdout=stdout, stderr=stderr, text=True, encoding='utf-8',
                             start_new_session=os.name != 'nt')
        try:
            p.communicate(prompt, timeout=timeout)
        except (subprocess.TimeoutExpired, KeyboardInterrupt):
            terminate(p)
            raise
        return p.returncode


def run(ident):
    row = get(ident)
    spec = json.loads(row['spec'])
    exe = shutil.which('codex')
    if not exe:
        raise ValueError('Codex CLI missing from PATH')
    with db() as c:
        if c.execute("UPDATE jobs SET status='running' WHERE id=? AND status='queued'", (ident,)).rowcount != 1:
            raise ValueError('Only queued jobs can run. Use retry for a new job.')
    folder = DATA / 'jobs' / ident
    folder.mkdir(parents=True, exist_ok=True)
    work = folder / 'workspace'
    status, detail = 'failed', ''
    try:
        # Independent clone avoids modifying the original index or Git metadata.
        command(['git', 'clone', '--local', '--no-hardlinks', '--', Path(spec['repo']).as_posix(), str(work)])
        command(['git', 'checkout', '--detach', spec['base_commit']], work)
        command(['git', 'remote', 'remove', 'origin'], work)
        mode = spec.get('mode', 'review')
        prompt = ('Work only on the requested task in this checkout. Do not push, deploy, commit, or launch background processes. '
                  'Do not use subagents. Explain changes, tests, and unresolved issues. '
                  + ('Read and analyze only; do not edit files. ' if mode == 'review' else '')
                  + '\nTASK:\n' + spec['task'] + '\nACCEPTANCE:\n' + spec.get('acceptance', 'Report evidence and limitations.'))
        (folder / 'prompt.txt').write_text(prompt, encoding='utf-8')
        argv = [exe, 'exec', '--json', '--color', 'never', '--sandbox',
                'read-only' if mode == 'review' else 'workspace-write',
                '-c', 'approval_policy="never"', '-C', str(work), '-o', str(folder / 'answer.md'), '-']
        (folder / 'command.json').write_text(json.dumps(argv, ensure_ascii=False, indent=2), encoding='utf-8')
        rc = execute(argv, work, folder / 'events.jsonl', folder / 'stderr.log', spec.get('timeout_seconds', 900), prompt)
        if rc:
            raise ValueError(f'Codex exit {rc}; see stderr.log and events.jsonl')
        events = [json.loads(line) for line in (folder / 'events.jsonl').read_text(encoding='utf-8').splitlines() if line.strip()]
        if not any(e.get('type') == 'turn.completed' for e in events):
            raise ValueError('No turn.completed event; result is incomplete')
        status = 'needs_review'
        for i, test in enumerate(spec.get('tests', []), 1):
            argv = [sys.executable if a == '{python}' else a for a in test]
            rc = execute(argv, work, folder / f'test-{i}.stdout.log', folder / f'test-{i}.stderr.log', spec.get('timeout_seconds', 900))
            if rc:
                raise ValueError(f'Test {i} failed, exit {rc}')
        detail = f"Codex completed; {len(spec.get('tests', []))} test command(s) passed. Human review required."
    except KeyboardInterrupt:
        status, detail = 'interrupted', 'Stopped by user; process tree terminated.'
    except Exception as e:
        status, detail = 'failed', str(e)
    finally:
        if (work / '.git').exists():
            try:
                # Includes tracked modifications, staged changes and newly added files; clone only.
                command(['git', 'add', '-N', '.'], work)
                diff = command(['git', 'diff', '--binary', spec['base_commit']], work)
                (folder / 'changes.patch').write_text(diff + '\n', encoding='utf-8')
                (folder / 'git-status.txt').write_text(command(['git', 'status', '--short'], work), encoding='utf-8')
            except Exception as e:
                status, detail = 'failed', detail + '\nCannot capture diff: ' + str(e)
        set_status(ident, status, detail)
        (folder / 'report.md').write_text(f'# Job {ident}\n\nStatus: {status}\n\n{detail}\n\nBase: {spec["base_commit"]}\n\nWorkspace: {work}\n', encoding='utf-8')
    print(json.dumps(get(ident), ensure_ascii=False, indent=2))
    return 0 if status == 'needs_review' else 1


def queued_jobs():
    with db() as c:
        return [row['id'] for row in c.execute("SELECT id FROM jobs WHERE status='queued' ORDER BY created")]


def worker(poll_seconds=30, once=False):
    if not 10 <= poll_seconds <= 300:
        raise ValueError('poll_seconds must be 10..300')
    DATA.mkdir(parents=True, exist_ok=True)
    log_path = DATA / 'worker.log'

    def log(message):
        stamp = dt.datetime.now().astimezone().isoformat(timespec='seconds')
        line = f'{stamp} {message}'
        with log_path.open('a', encoding='utf-8') as stream:
            stream.write(line + '\n')
        print(line, flush=True)

    log(f'Worker started; poll interval={poll_seconds}s; single worker; queued jobs only.')
    try:
        while True:
            pending = queued_jobs()
            if not pending:
                if once:
                    log('No queued jobs; one-shot worker finished.')
                    return 0
                time.sleep(poll_seconds)
                continue
            if not shutil.which('codex'):
                log('Codex CLI missing from PATH; queue preserved and worker will retry discovery later.')
                if once:
                    return 1
                time.sleep(poll_seconds)
                continue
            for ident in pending:
                log(f'Processing queued job {ident}.')
                try:
                    result = run(ident)
                    log(f'Job {ident} finished with exit={result}; inspect report before release.')
                except (ValueError, OSError, subprocess.SubprocessError) as error:
                    log(f'Job {ident} could not start: {error}')
                if once:
                    return 0
    except KeyboardInterrupt:
        log('Worker stopped by user.')
        return 0


def main():
    p = argparse.ArgumentParser(description='Local Agent Harness for Codex')
    sub = p.add_subparsers(dest='cmd', required=True)
    sub.add_parser('doctor')
    sub.add_parser('list')
    q = sub.add_parser('worker'); q.add_argument('--poll-seconds', type=int, default=30); q.add_argument('--once', action='store_true')
    q = sub.add_parser('submit'); q.add_argument('spec')
    for name in ('run', 'show', 'retry'):
        q = sub.add_parser(name); q.add_argument('id')
    args = p.parse_args()
    if args.cmd == 'doctor':
        print('Python:', sys.executable)
        print('Data:', DATA)
        print(command(['git', '--version']))
        print(command(['codex', '--version']))
        login = subprocess.run(['codex', 'login', 'status'], capture_output=True, text=True, timeout=30)
        print((login.stdout + login.stderr).strip())
        return login.returncode
    elif args.cmd == 'submit':
        print(add(json.loads(Path(args.spec).read_text(encoding='utf-8-sig'))))
    elif args.cmd == 'list':
        with db() as c:
            for row in c.execute('SELECT id,created,status,detail FROM jobs ORDER BY created DESC'):
                print(json.dumps(dict(row), ensure_ascii=False))
    elif args.cmd == 'worker':
        return worker(args.poll_seconds, args.once)
    elif args.cmd == 'show':
        print(json.dumps(get(args.id), ensure_ascii=False, indent=2))
        print('Artifacts:', DATA / 'jobs' / args.id)
    elif args.cmd == 'retry':
        previous = get(args.id)
        if previous['status'] == 'running':
            raise ValueError('Job still marked running. Check its processes before retrying or submitting again.')
        print(add(json.loads(previous['spec'])))
    elif args.cmd == 'run':
        return run(args.id)
    return 0


if __name__ == '__main__':
    try:
        raise SystemExit(main())
    except (ValueError, OSError, KeyError, subprocess.SubprocessError) as e:
        print('ERROR:', e, file=sys.stderr)
        raise SystemExit(1)
