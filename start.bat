@echo off
echo Starting StudentOS AI...

echo Starting Backend Server...
start "StudentOS Backend" cmd /c "cd server && npm run dev"

echo Starting Frontend Server...
start "StudentOS Frontend" cmd /c "cd client && npm run dev"

echo.
echo Both servers are starting in separate windows.
echo Please wait a few seconds and then visit http://localhost:5173 in your browser.
pause
