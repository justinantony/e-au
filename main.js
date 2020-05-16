const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    show: false,
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });
  mainWindow.loadFile('index.html');
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
  mainWindow.once('ready-to-show', () => {
    console.log('Checking for updates');
    const update = autoUpdater.checkForUpdatesAndNotify();
    console.log('Checking for updates', update);
    mainWindow.show();
  });
  // mainWindow.webContents.openDevTools();
}

app.on('ready', () => {
  createWindow();
});

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function() {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('app_version', event => {
  event.sender.send('app_version', { version: app.getVersion() });
});

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});

autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('update_available');
});
autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update_downloaded');
});
