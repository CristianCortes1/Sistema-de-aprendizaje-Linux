@echo off
REM Script para construir la imagen de Ubuntu personalizada para usuarios en Windows

echo Building custom Ubuntu image for PenguinPath users...

docker build -f Backend/Dockerfile.ubuntu-user -t penguinpath-ubuntu:latest .

if %ERRORLEVEL% EQU 0 (
    echo.
    echo Image built successfully!
    echo.
    echo Image: penguinpath-ubuntu:latest
    echo.
    echo To use this image, update docker.service.ts:
    echo   private readonly IMAGE_NAME = 'penguinpath-ubuntu:latest';
    echo.
) else (
    echo.
    echo Build failed!
    exit /b 1
)
