@echo off
echo MovieHub Platform Starter
echo ========================
echo.

REM Check if MongoDB is running
echo Checking MongoDB status...
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo MongoDB is running.
) else (
    echo MongoDB is not running. Please start MongoDB before continuing.
    echo You can start MongoDB by running "mongod" in a separate terminal.
    echo.
    pause
    exit /b
)

echo.
echo Starting backend server...
start cmd /k "cd backend && npm start"

echo.
echo Starting frontend development server...
start cmd /k "cd frontend && npm start"

echo.
echo Both servers are starting up...
echo.
echo - Backend will be available at: http://localhost:5000/api
echo - Frontend will be available at: http://localhost:3000
echo.
echo Press any key to shut down both servers.
pause

echo.
echo Shutting down servers...
taskkill /FI "WindowTitle eq *backend*" /F
taskkill /FI "WindowTitle eq *frontend*" /F
echo Done.
pause 