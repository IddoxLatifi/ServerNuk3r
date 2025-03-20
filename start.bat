@echo off

REM
powershell -NoProfile -Command "Write-Host '=======================================' -ForegroundColor Red"
powershell -NoProfile -Command "Write-Host '      Start Discord Nuker by Iddox     ' -ForegroundColor Red"
powershell -NoProfile -Command "Write-Host '=======================================' -ForegroundColor Red"
echo.

REM 
for /f "delims=" %%A in ('powershell -NoProfile -Command "Read-Host 'Enter Bot Token'"') do set BOT_TOKEN=%%A
for /f "delims=" %%A in ('powershell -NoProfile -Command "Read-Host 'Enter Guild ID (Server ID)'"') do set GUILD_ID=%%A
for /f "delims=" %%A in ('powershell -NoProfile -Command "Read-Host 'Enter Client ID (Bot ID)'"') do set CLIENT_ID=%%A

REM 
(
    echo BOT_TOKEN=%BOT_TOKEN%
    echo GUILD_ID=%GUILD_ID%
    echo CLIENT_ID=%CLIENT_ID%
) > .env

REM
if exist .env (
    powershell -NoProfile -Command "Write-Host '.env file created successfully.' -ForegroundColor Green"
) else (
    powershell -NoProfile -Command "Write-Host 'Error: .env file was not created.' -ForegroundColor Red"
    pause
    exit /b 1
)

echo.
powershell -NoProfile -Command "Write-Host 'Installing dotenv...' -ForegroundColor Blue"
start /wait "Install dotenv" cmd /c "npm install dotenv"
timeout /t 5 >nul

echo.
powershell -NoProfile -Command "Write-Host 'Installing all dependencies...' -ForegroundColor Blue"
start /wait "Install Dependencies" cmd /c "npm install"
timeout /t 5 >nul

echo.
powershell -NoProfile -Command "Write-Host 'Deploying slash commands...' -ForegroundColor Blue"
start /wait "Deploy Commands" cmd /c "node deploy-commands.js"
timeout /t 5 >nul

echo.
powershell -NoProfile -Command "Write-Host 'Starting bot (nuke.js)...' -ForegroundColor Blue"
start "Start Bot" cmd /k "node nuke.js"

REM 
exit
