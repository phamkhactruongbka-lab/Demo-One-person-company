$ErrorActionPreference = 'Stop'

$taskName = 'Konoha-Agent-Harness-Worker'
$workerScript = Join-Path $PSScriptRoot 'harness.ps1'
if (-not (Test-Path -LiteralPath $workerScript)) { throw "Harness entrypoint not found: $workerScript" }
if (-not (Get-Command codex -ErrorAction SilentlyContinue)) { throw 'Codex CLI is missing from PATH for the Windows user.' }

$identity = [System.Security.Principal.WindowsIdentity]::GetCurrent().Name
$action = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument "-NoLogo -NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$workerScript`" worker --poll-seconds 30"
$trigger = New-ScheduledTaskTrigger -AtLogOn -User $identity
$principal = New-ScheduledTaskPrincipal -UserId $identity -LogonType Interactive -RunLevel Limited
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -MultipleInstances IgnoreNew -RestartCount 3 -RestartInterval (New-TimeSpan -Minutes 5) -ExecutionTimeLimit ([TimeSpan]::Zero)

Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Principal $principal -Settings $settings -Description 'Processes queued local Codex Harness jobs while this Windows user is logged in.' -Force | Out-Null
Start-ScheduledTask -TaskName $taskName
Write-Output "Scheduled task '$taskName' is installed and started. It runs only while this Windows user is logged in; logs: $PSScriptRoot\data\worker.log"
