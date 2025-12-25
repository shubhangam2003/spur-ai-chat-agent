# Docker Troubleshooting - Windows

## Error: "failed to connect to the docker API"

This error means Docker Desktop is not running on your Windows machine.

## Solution

### Step 1: Check if Docker Desktop is Installed

1. Press `Windows Key` and search for "Docker Desktop"
2. If you see it, proceed to Step 2
3. If you don't see it, you need to install it first (see below)

### Step 2: Start Docker Desktop

**Option A: From Start Menu**
1. Press `Windows Key`
2. Type "Docker Desktop"
3. Click on "Docker Desktop" to launch it
4. Wait for Docker to start (you'll see a Docker icon in your system tray)

**Option B: From Command Line**
```powershell
Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"
```

**Option C: Check System Tray**
- Look for the Docker whale icon in your system tray (bottom right)
- If it's there but grayed out, click it and select "Start Docker Desktop"

### Step 3: Wait for Docker to Start

- Docker Desktop takes 30-60 seconds to start
- You'll see a notification: "Docker Desktop is starting..."
- Wait until you see "Docker Desktop is running" or the whale icon is solid (not animated)

### Step 4: Verify Docker is Running

Open PowerShell and run:
```powershell
docker --version
docker ps
```

If both commands work without errors, Docker is ready!

## Installing Docker Desktop (If Not Installed)

1. **Download Docker Desktop:**
   - Go to: https://www.docker.com/products/docker-desktop/
   - Click "Download for Windows"
   - Download the installer

2. **Install Docker Desktop:**
   - Run the installer (Docker Desktop Installer.exe)
   - Follow the installation wizard
   - You may need to enable WSL 2 (Windows Subsystem for Linux 2)
   - Restart your computer if prompted

3. **Start Docker Desktop:**
   - After installation, Docker Desktop should start automatically
   - If not, launch it from the Start Menu

4. **Verify Installation:**
   ```powershell
   docker --version
   docker ps
   ```

## Common Issues

### Issue: "WSL 2 installation is incomplete"

**Solution:**
1. Install WSL 2:
   ```powershell
   wsl --install
   ```
2. Restart your computer
3. Start Docker Desktop again

### Issue: Docker Desktop won't start

**Try these steps:**
1. **Restart Docker Desktop:**
   - Right-click the Docker icon in system tray
   - Select "Quit Docker Desktop"
   - Wait 10 seconds
   - Start it again from Start Menu

2. **Run as Administrator:**
   - Right-click Docker Desktop
   - Select "Run as administrator"

3. **Check Windows Features:**
   - Press `Windows Key + R`
   - Type `optionalfeatures` and press Enter
   - Make sure "Virtual Machine Platform" and "Windows Subsystem for Linux" are checked
   - Restart if you made changes

4. **Check Hyper-V:**
   - Open PowerShell as Administrator
   ```powershell
   Get-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V
   ```
   - If it's disabled, enable it:
   ```powershell
   Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All
   ```
   - Restart your computer

### Issue: Port 5432 already in use

If you get an error about port 5432 being in use:

**Check what's using it:**
```powershell
netstat -ano | findstr :5432
```

**Solutions:**
1. Stop any existing PostgreSQL services
2. Use a different port for Docker:
   ```powershell
   docker run --name spur-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=spur_chat -p 5433:5432 -d postgres:15
   ```
   Then update `DATABASE_URL` in `backend/.env` to use port 5433

## Quick Checklist

- [ ] Docker Desktop is installed
- [ ] Docker Desktop is running (check system tray)
- [ ] Docker icon is solid (not animated/grayed out)
- [ ] `docker --version` works in PowerShell
- [ ] `docker ps` works without errors

Once all checkboxes are ✅, you can run the PostgreSQL container command!

