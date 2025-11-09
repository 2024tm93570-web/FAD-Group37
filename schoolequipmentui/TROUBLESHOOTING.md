# Troubleshooting Frontend Startup Issues

## Common Issues and Solutions

### Issue: `npm start` gets stuck or hangs

#### Solution 1: Clear cache and reinstall
```bash
cd schoolequipmentui
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
npm start
```

On Windows PowerShell:
```powershell
cd schoolequipmentui
Remove-Item -Recurse -Force node_modules, package-lock.json
npm cache clean --force
npm install
npm start
```

#### Solution 2: Check for port conflicts
```bash
# Check what's using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

#### Solution 3: Use a different port
```bash
# Set PORT environment variable
set PORT=3001
npm start
```

Or create a `.env` file in `schoolequipmentui` folder:
```
PORT=3001
```

#### Solution 4: Check Node.js version compatibility
React 19 requires Node.js 18.17 or higher. If you're using Node.js 20.x, that should work fine.

Check your Node version:
```bash
node --version
```

If you need to downgrade React (not recommended, but can help):
```bash
npm install react@^18.2.0 react-dom@^18.2.0
```

#### Solution 5: Check for syntax errors
Look for any console errors. Common issues:
- Missing imports
- Circular dependencies
- Syntax errors in JavaScript files

Check the browser console and terminal for error messages.

#### Solution 6: Delete .cache folder
```bash
cd schoolequipmentui
Remove-Item -Recurse -Force .cache
npm start
```

### Issue: Module not found errors

If you see errors like "Cannot find module", try:
```bash
npm install
```

### Issue: React Scripts issues

If react-scripts is causing problems:
```bash
npm install react-scripts@latest --save
```

### Issue: Memory issues

If the build process runs out of memory:
```bash
# Increase Node memory limit
set NODE_OPTIONS=--max_old_space_size=4096
npm start
```

### Issue: Antivirus blocking

Sometimes antivirus software can block Node.js processes. Try:
1. Temporarily disable antivirus
2. Add the project folder to antivirus exclusions
3. Run as administrator

### Issue: OneDrive sync conflicts

Since your project is in OneDrive, sync conflicts might cause issues:
1. Pause OneDrive sync temporarily
2. Try running npm start
3. Resume sync after testing

### Debugging Steps

1. **Check the terminal output** - Look for specific error messages
2. **Check browser console** - Open DevTools (F12) and check for errors
3. **Try building instead of starting** - `npm run build` can reveal different errors
4. **Check package.json** - Ensure all dependencies are listed
5. **Verify file paths** - Make sure all imports use correct paths

### Getting More Information

Run with verbose logging:
```bash
npm start -- --verbose
```

Or check what's happening:
```bash
npm start 2>&1 | tee startup.log
```

Then check `startup.log` for detailed error messages.

### Still Not Working?

1. Create a fresh React app to test:
   ```bash
   npx create-react-app test-app
   cd test-app
   npm start
   ```
   
   If this works, the issue is specific to your project.

2. Check if it's a Windows-specific issue - try running in WSL (Windows Subsystem for Linux) if available

3. Check Windows Event Viewer for system-level errors

4. Try running in a different terminal (PowerShell vs CMD vs Git Bash)

