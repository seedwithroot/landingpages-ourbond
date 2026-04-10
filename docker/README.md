# Docker Build Configuration

This folder contains Docker configurations for building Astro sites.

## Dockerfile.astro

Base image for building any Astro site. Uses Node 20 Alpine for small image size.

## Usage

The manager scripts handle Docker builds automatically. Manual usage:

```bash
cd sites/your-site
docker build -f ../../docker/Dockerfile.astro -t astro-build-your-site .
docker create --name temp-build astro-build-your-site
docker cp temp-build:/app/dist ./dist
docker rm temp-build
```
