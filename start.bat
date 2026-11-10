@echo off
setlocal
cd /d "%~dp0"
set "PORT=3001"
echo ======================================================
echo   KONOHA OPERATIONS CENTER - Naruto campaign monitor
echo   Local server: http://localhost:%PORT%
echo   Press Ctrl+C to stop the local automation runner.
echo ======================================================
start "" "http://localhost:%PORT%"
node server.js
