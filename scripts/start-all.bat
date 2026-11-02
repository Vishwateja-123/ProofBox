@echo off
REM ==============================================================================
REM ProofBox — Full-Stack Application Startup Script (Windows)
REM ==============================================================================

echo ==================================================
echo   Starting ProofBox - Warranty and Receipt Vault
echo ==================================================

echo [1/3] Ensuring MongoDB is running...
echo Please ensure MongoDB Community Server is started on localhost:27017

echo [2/3] Launching Express Backend Server (Port 5001)...
start "ProofBox Backend (Port 5001)" cmd /k "cd backend && npm run dev"

timeout /t 2 /nobreak >nul

echo [3/3] Launching React Frontend (Port 5173)...
start "ProofBox Frontend (Port 5173)" cmd /k "cd frontend && npm run dev"

echo.
echo ==================================================
echo   ProofBox services launched!
echo   Frontend Application: http://localhost:5173
echo   Backend REST API:     http://localhost:5001
echo   Demo Email:           demo@proofbox.com
echo   Demo Password:        DemoPassword123!
echo ==================================================
echo.

