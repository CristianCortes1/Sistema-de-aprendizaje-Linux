@echo off
REM Script de desarrollo para PenguinPath en Windows

echo PenguinPath - Development Setup
echo ==================================
echo.

REM Verificar Docker
echo Checking Docker...
docker info >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Docker is not running!
    echo Docker is needed for terminal functionality.
    echo Please start Docker Desktop and try again.
    exit /b 1
)
echo Docker is running
echo.

REM Backend
echo Setting up Backend...
cd Backend

if not exist ".env" (
    echo Creating .env file...
    copy .env.example .env
    echo Please edit Backend\.env and set JWT_SECRET!
)

if not exist "node_modules" (
    echo Installing Backend dependencies...
    call pnpm install
)

echo Generating Prisma Client...
call npx prisma generate

echo Running database migrations...
call npx prisma migrate dev

cd ..

REM Frontend
echo.
echo Setting up Frontend...
cd Frontend

if not exist "node_modules" (
    echo Installing Frontend dependencies...
    call pnpm install
)

cd ..

REM Ubuntu image
echo.
echo Building custom Ubuntu image...
docker build -f Backend\Dockerfile.ubuntu-user -t penguinpath-ubuntu:latest Backend\

if %ERRORLEVEL% EQU 0 (
    echo Ubuntu image built successfully
) else (
    echo Failed to build Ubuntu image, will use ubuntu:22.04 as fallback
)

REM Instructions
echo.
echo Development environment ready!
echo.
echo To start development:
echo.
echo    Terminal 1 (Backend):
echo    cd Backend ^&^& pnpm run start:dev
echo.
echo    Terminal 2 (Frontend):
echo    cd Frontend ^&^& pnpm run dev
echo.
echo    Then open: http://localhost:5173
echo.
echo Or use Docker Compose:
echo    docker-compose up -d --build
echo.
pause
