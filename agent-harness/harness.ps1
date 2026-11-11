$ErrorActionPreference = 'Stop'
$runtime = Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe'
if ($env:HARNESS_PYTHON) { $runtime = $env:HARNESS_PYTHON }
if (-not (Test-Path -LiteralPath $runtime)) { throw 'Python unavailable. Set HARNESS_PYTHON to a Python 3.10+ executable.' }
& $runtime (Join-Path $PSScriptRoot 'harness.py') @args
exit $LASTEXITCODE
