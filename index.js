const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

const appVersion = require(__dirname + "/package.json").version;

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false, // is default value after Electron v5
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // if (DEBUG) {
  //   const devtools = new BrowserWindow();
    
  //   win.webContents.setDevToolsWebContents(devtools.webContents);
  //   win.webContents.openDevTools({ mode: 'detach' });
  // }

  win.loadFile('index.html');
  win.setTitle(`Udeler | Udemy Course Downloader - v${appVersion}`);
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

ipcMain.on('quit-app', () => app.quit());