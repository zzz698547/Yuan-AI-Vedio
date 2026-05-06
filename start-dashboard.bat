@echo off
setlocal

if /i not "%~1"=="__inner" (
  start "AI Video SaaS Dashboard" cmd /k ""%~f0" __inner"
  exit /b
)

title AI Video SaaS Dashboard Dev Server

cd /d "%~dp0"

echo ========================================
echo  AI Video SaaS Dashboard Dev Server
echo ========================================
echo.
echo [Debug] This window stays open for debugging.
echo [Debug] Project path: %CD%
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [Error] Node.js was not found. Please install Node.js LTS first.
  echo https://nodejs.org/
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo [Error] npm was not found. Please check your Node.js installation.
  pause
  exit /b 1
)

echo [Debug] Node version:
node --version
echo [Debug] npm version:
call npm --version
echo.

if not exist "node_modules" (
  echo [Setup] node_modules not found. Running npm install...
  echo [Debug] Command: npm install
  call npm install
  if errorlevel 1 (
    echo.
    echo [Error] npm install failed. Check the error above.
    pause
    exit /b 1
  )
)

echo [Debug] Checking for an existing dashboard dev server...
set EXISTING_PORT=
for /f %%P in ('powershell -NoProfile -ExecutionPolicy Bypass -Command "foreach ($p in 3000..3020) { try { $url = 'http://localhost:' + $p + '/admin/dashboard'; $r = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 1; if ($r.StatusCode -eq 200) { Write-Output $p; exit 0 } } catch { } }"') do set EXISTING_PORT=%%P

if not "%EXISTING_PORT%"=="" (
  echo [Info] Existing dashboard server detected on port %EXISTING_PORT%.
  echo [Info] Opening: http://localhost:%EXISTING_PORT%/admin/dashboard
  start "" "http://localhost:%EXISTING_PORT%/admin/dashboard"
  echo.
  echo [Info] No new dev server was started.
  echo [Info] Close the old dev server terminal if you want to restart it.
  echo [Debug] Press any key to close this launcher window.
  pause >nul
  exit /b 0
)

echo [Debug] Finding an available port...
set APP_PORT=3000

:find_available_port
netstat -ano | findstr /R /C:":%APP_PORT% .*LISTENING" >nul 2>nul
if not errorlevel 1 (
  set /a APP_PORT+=1
  goto find_available_port
)

if "%APP_PORT%"=="" (
  echo [Error] Could not find an available port.
  pause
  exit /b 1
)

echo [Start] Selected port: %APP_PORT%
echo [Start] URL: http://localhost:%APP_PORT%/admin/dashboard
echo [Debug] Command: npm run dev -- -p %APP_PORT%
echo [Debug] Browser will open when the dashboard is ready.
echo.

start "" powershell -NoProfile -ExecutionPolicy Bypass -Command "$url = 'http://localhost:%APP_PORT%/admin/dashboard'; for ($i = 0; $i -lt 60; $i++) { try { $r = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 2; if ($r.StatusCode -eq 200) { Start-Process $url; exit 0 } } catch { }; Start-Sleep -Seconds 1 }; Start-Process $url"
call npm run dev -- -p %APP_PORT%

echo.
if errorlevel 1 (
  echo [Error] Dev server failed. Check the error above.
) else (
  echo [Done] Dev server stopped.
)

echo [Debug] Press any key to close this window.
pause >nul

endlocal
