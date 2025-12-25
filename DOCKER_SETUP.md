# PostgreSQL Docker Setup Guide

This guide will help you set up PostgreSQL using Docker for the Spur AI Chat assignment.

## Prerequisites

1. **Install Docker Desktop**
   - Download from: https://www.docker.com/products/docker-desktop/
   - Install and start Docker Desktop
   - Make sure Docker is running (you'll see the Docker icon in your system tray)

## Quick Start (One Command)

### Windows PowerShell:
```powershell
docker run --name spur-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=spur_chat -p 5432:5432 -d postgres:15
```

### Linux/macOS:
```bash
docker run --name spur-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=spur_chat \
  -p 5432:5432 \
  -d postgres:15
```

This command:
- Creates a container named `spur-postgres`
- Sets the PostgreSQL password to `postgres`
- Creates a database named `spur_chat`
- Maps port 5432 (PostgreSQL default) to your local machine
- Runs in detached mode (`-d`)
- Uses PostgreSQL version 15

## Step-by-Step Setup

### 1. Check Docker is Running

```powershell
docker --version
docker ps
```

You should see Docker version info and a list of running containers (may be empty).

### 2. Pull PostgreSQL Image (Optional - Docker will pull automatically)

```powershell
docker pull postgres:15
```

### 3. Run PostgreSQL Container

```powershell
docker run --name spur-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=spur_chat -p 5432:5432 -d postgres:15
```

**What each flag means:**
- `--name spur-postgres`: Names the container (easier to manage)
- `-e POSTGRES_PASSWORD=postgres`: Sets the database password
- `-e POSTGRES_DB=spur_chat`: Creates the database automatically
- `-p 5432:5432`: Maps container port 5432 to host port 5432
- `-d`: Runs in detached mode (background)
- `postgres:15`: Uses PostgreSQL version 15

### 4. Verify Container is Running

```powershell
docker ps
```

You should see `spur-postgres` in the list with status "Up".

### 5. Test Connection (Optional)

You can test the connection using Docker:

```powershell
docker exec -it spur-postgres psql -U postgres -d spur_chat
```

Then type `\q` to exit.

## Useful Docker Commands

### View Running Containers
```powershell
docker ps
```

### View All Containers (including stopped)
```powershell
docker ps -a
```

### Stop Container
```powershell
docker stop spur-postgres
```

### Start Container (if stopped)
```powershell
docker start spur-postgres
```

### Restart Container
```powershell
docker restart spur-postgres
```

### View Container Logs
```powershell
docker logs spur-postgres
```

### Remove Container (⚠️ This deletes the container and all data)
```powershell
docker stop spur-postgres
docker rm spur-postgres
```

### Remove Container with Data Volume (⚠️ Deletes everything)
```powershell
docker stop spur-postgres
docker rm -v spur-postgres
```

## Persistent Data Storage

By default, Docker containers are ephemeral. If you want to persist data even after removing the container, use a volume:

```powershell
docker run --name spur-postgres `
  -e POSTGRES_PASSWORD=postgres `
  -e POSTGRES_DB=spur_chat `
  -p 5432:5432 `
  -v spur-postgres-data:/var/lib/postgresql/data `
  -d postgres:15
```

This creates a named volume `spur-postgres-data` that persists even if you remove the container.

## Environment Variables for Backend

Once PostgreSQL is running, update your `backend/.env` file:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/spur_chat
```

**Connection String Breakdown:**
- `postgresql://` - Protocol
- `postgres` - Username (default)
- `postgres` - Password (what we set)
- `localhost:5432` - Host and port
- `spur_chat` - Database name

## Troubleshooting

### Port Already in Use

**Error:** `port is already allocated` or `bind: address already in use`

**Solution:** Either:
1. Stop the existing PostgreSQL container/service
2. Use a different port: `-p 5433:5432` (then update DATABASE_URL to use port 5433)

### Container Won't Start

**Check logs:**
```powershell
docker logs spur-postgres
```

**Common issues:**
- Port conflict: Another service is using port 5432
- Insufficient resources: Docker needs enough memory/CPU
- Image not found: Run `docker pull postgres:15` first

### Can't Connect from Application

**Verify container is running:**
```powershell
docker ps | Select-String "spur-postgres"
```

**Check if PostgreSQL is listening:**
```powershell
docker exec spur-postgres pg_isready -U postgres
```

**Test connection from container:**
```powershell
docker exec -it spur-postgres psql -U postgres -d spur_chat -c "SELECT version();"
```

### Container Keeps Stopping

**Check logs for errors:**
```powershell
docker logs spur-postgres
```

**Common causes:**
- Out of memory
- Configuration errors
- Port conflicts

### Reset Everything

If you want to start fresh:

```powershell
# Stop and remove container
docker stop spur-postgres
docker rm spur-postgres

# Remove volume (if you used one)
docker volume rm spur-postgres-data

# Run again
docker run --name spur-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=spur_chat -p 5432:5432 -d postgres:15
```

## Using Docker Compose (Alternative)

For a more production-like setup, you can use Docker Compose. Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    container_name: spur-postgres
    environment:
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: spur_chat
    ports:
      - "5432:5432"
    volumes:
      - spur-postgres-data:/var/lib/postgresql/data

volumes:
  spur-postgres-data:
```

Then run:
```powershell
docker-compose up -d
```

Stop with:
```powershell
docker-compose down
```

## Next Steps

Once PostgreSQL is running:

1. ✅ Verify container is running: `docker ps`
2. ✅ Create `backend/.env` with the DATABASE_URL
3. ✅ Start your backend: `cd backend; npm run dev`
4. ✅ The database tables will be created automatically on first run

## Security Note

⚠️ **For Production:** The default password `postgres` is only for development. In production:
- Use a strong password
- Don't expose port 5432 publicly
- Use Docker secrets or environment variables
- Consider using a managed database service

For this assignment, the default setup is fine for local development.

