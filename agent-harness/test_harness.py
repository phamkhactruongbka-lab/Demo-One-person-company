import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
import harness as h


class HarnessTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(dir=h.ROOT)
        self.root = Path(self.temp.name)
        self.old = h.DATA
        h.DATA = self.root / 'data'
        self.repo = self.root / 'repo'
        self.repo.mkdir()
        h.command(['git', 'init', str(self.repo)])
        (self.repo / 'main.py').write_text('x = 1\n')
        h.command(['git', 'add', '.'], self.repo)
        h.command(['git', '-c', 'user.name=Test', '-c', 'user.email=test@example.invalid', 'commit', '-m', 'initial'], self.repo)
        self.spec = dict(repo=str(self.repo), task='Review', tests=[])

    def tearDown(self):
        h.DATA = self.old
        self.temp.cleanup()

    def fake(self, argv, cwd, out, err, timeout, prompt=None):
        out.write_text('{"type":"turn.completed"}\n')
        err.write_text('')
        if prompt:
            (cwd / 'new.txt').write_text('new file\n')
        return 0

    def test_dirty_repository_rejected(self):
        (self.repo / 'untracked.txt').write_text('keep')
        with self.assertRaisesRegex(ValueError, 'uncommitted'):
            h.add(self.spec)

    def test_success_preserves_source_and_captures_new_files(self):
        ident = h.add(self.spec)
        with patch.object(h, 'execute', side_effect=self.fake):
            self.assertEqual(h.run(ident), 0)
        self.assertEqual(h.get(ident)['status'], 'needs_review')
        self.assertFalse((self.repo / 'new.txt').exists())
        self.assertIn('new file', (h.DATA / 'jobs' / ident / 'changes.patch').read_text())
        with self.assertRaises(ValueError):
            h.run(ident)

    def test_failed_test_cannot_pass_gate(self):
        ident = h.add(dict(self.spec, tests=[['false']]))
        def fail_test(*args, **kwargs):
            return self.fake(*args, **kwargs) if len(args) > 5 or kwargs.get('prompt') else 3
        with patch.object(h, 'execute', side_effect=fail_test):
            self.assertEqual(h.run(ident), 1)
        self.assertEqual(h.get(ident)['status'], 'failed')
        self.assertIn('Test 1 failed', h.get(ident)['detail'])

    def test_missing_completed_event_rejected(self):
        ident = h.add(self.spec)
        def incomplete(argv, cwd, out, err, timeout, prompt=None):
            out.write_text('{"type":"turn.started"}\n'); err.write_text(''); return 0
        with patch.object(h, 'execute', side_effect=incomplete):
            self.assertEqual(h.run(ident), 1)
        self.assertIn('incomplete', h.get(ident)['detail'])

    def test_command_arrays_required(self):
        with self.assertRaises(ValueError):
            h.add(dict(self.spec, tests=['python -m unittest']))


if __name__ == '__main__':
    unittest.main()\n