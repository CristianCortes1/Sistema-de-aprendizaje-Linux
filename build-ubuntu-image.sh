#!/bin/bash

# Script para construir la imagen de Ubuntu personalizada para usuarios

echo "🏗️  Building custom Ubuntu image for PenguinPath users..."

docker build -f Backend/Dockerfile.ubuntu-user -t penguinpath-ubuntu:latest .

if [ $? -eq 0 ]; then
    echo "✅ Image built successfully!"
    echo ""
    echo "📦 Image: penguinpath-ubuntu:latest"
    echo ""
    echo "To use this image, update docker.service.ts:"
    echo "  private readonly IMAGE_NAME = 'penguinpath-ubuntu:latest';"
    echo ""
else
    echo "❌ Build failed!"
    exit 1
fi
