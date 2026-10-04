@echo off
title Black Box Local Server
set "PATH=C:\Users\sharwari narvekar\AppData\Local\Programs\nodejs;%PATH%"
cd /d "C:\Users\sharwari narvekar\.gemini\antigravity\scratch\blackbox"
echo ========================================================
echo   Starting Black Box Flight Recorder Server...
echo   Local URL: http://localhost:3000/dashboard
echo ========================================================
timeout /t 2 >nul
start http://localhost:3000/dashboard
npm run dev
pause
