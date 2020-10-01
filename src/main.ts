import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import { centerWindow, is } from 'electron-util';
import { applicationIsReady } from './lib/ready';

let mainWindow: BrowserWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      devTools: is.development
    },
  });

  mainWindow.loadFile(path.join(__dirname, '../views/index.html'));
  if (is.development) mainWindow.webContents.openDevTools();
}

app.on('ready', () => {
  createWindow();
  applicationIsReady({window: mainWindow});
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  if (is.development) {
    const elemon = require('elemon')
    elemon({
      app: app,
      mainFile: 'main.js',
      bws: [
        { bw: mainWindow, res: ['index.html', 'main.js', 'style.css'] }
      ]
    })
  }
});

app.on('window-all-closed', () => {
  app.quit();
});