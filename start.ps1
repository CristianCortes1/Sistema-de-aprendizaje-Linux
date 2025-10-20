# Script de inicio rápido para desarrollo

Write-Host "🐧 PenguinPath - Quick Start" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan
Write-Host ""

# Verificar que Docker está corriendo
Write-Host "🔍 Checking Docker..." -ForegroundColor Yellow
docker info > $null 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker is not running! Please start Docker Desktop." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Docker is running" -ForegroundColor Green

# Construir imagen personalizada de Ubuntu
Write-Host ""
Write-Host "🏗️  Building custom Ubuntu image for users..." -ForegroundColor Yellow
docker build -f Backend/Dockerfile.ubuntu-user -t penguinpath-ubuntu:latest Backend/
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to build Ubuntu image" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Ubuntu image built successfully" -ForegroundColor Green

# Actualizar docker.service.ts para usar la imagen personalizada
Write-Host ""
Write-Host "⚙️  Configuring services..." -ForegroundColor Yellow
$dockerServicePath = "Backend/src/terminal/docker.service.ts"
if (Test-Path $dockerServicePath) {
    (Get-Content $dockerServicePath) -replace "ubuntu:22.04", "penguinpath-ubuntu:latest" | Set-Content $dockerServicePath
    Write-Host "✅ Docker service configured" -ForegroundColor Green
}

# Iniciar servicios con Docker Compose
Write-Host ""
Write-Host "🚀 Starting services with Docker Compose..." -ForegroundColor Yellow
docker-compose up -d --build

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ All services are running!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📍 Access points:" -ForegroundColor Cyan
    Write-Host "   Frontend: http://localhost:5173" -ForegroundColor White
    Write-Host "   Backend:  http://localhost:3000" -ForegroundColor White
    Write-Host "   Database: localhost:5432 (postgres/postgres)" -ForegroundColor White
    Write-Host ""
    Write-Host "📋 Useful commands:" -ForegroundColor Cyan
    Write-Host "   View logs:        docker-compose logs -f" -ForegroundColor White
    Write-Host "   Stop services:    docker-compose down" -ForegroundColor White
    Write-Host "   Restart:          docker-compose restart" -ForegroundColor White
    Write-Host "   View containers:  docker ps" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Failed to start services" -ForegroundColor Red
    Write-Host "Check logs with: docker-compose logs" -ForegroundColor Yellow
    exit 1
}
