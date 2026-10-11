@echo off
cd /d "%~dp0"
if not exist "node_modules\ws\package.json" call npm ci
if errorlevel 1 exit /b 1
start "" http://localhost:4173
node server.cjs
pause
