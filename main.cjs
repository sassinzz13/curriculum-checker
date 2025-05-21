const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

function createWindow() {
  const win = new BrowserWindow({
    fullscreen: true,
    fullscreenable: true,
    autoHideMenuBar: false,
    titleBarStyle: 'default',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const appURL = isDev
    ? 'http://localhost:5173'
    : `file://${path.join(__dirname, 'dist', 'index.html')}`;

  win.loadURL(appURL);

  win.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'Escape') {
      app.quit(); 
    }
  });

  win.on('leave-full-screen', () => {
    win.setBounds({ width: 1200, height: 800 });
    win.center();
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
