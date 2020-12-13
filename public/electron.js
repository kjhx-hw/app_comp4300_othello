const electron = require('electron');
const { appMenu, is, openNewGitHubIssue, debugInfo } = require('electron-util');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;

const path = require('path');
const url = require('url');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000, height: 650, resizable: false, center: true,
    webPreferences: {
      nodeIntegration: true,
      devTools: false
    }
  });

  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '/../build/index.html'),
    protocol: 'file:',
    slashes: true
  });

  mainWindow.loadURL(startUrl);
  if (is.development) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', createWindow);
app.on('window-all-closed', function () {
  app.quit();
});

const menuTemplate = Menu.buildFromTemplate([
  appMenu(),
  {
    role: 'fileMenu'
  },
  {
    label: 'Game',
    submenu: [
      {
        label: 'Restart',
        role: 'reload'
      }
    ]
  },
  {
    label: 'View',
    submenu: [
      {
        role: 'resetZoom'
      },
      {
        role: 'zoomIn'
      },
      {
        role: 'zoomOut'
      }
    ]
  },
  {
    label: 'Debug',
    submenu: [
      {
        label: 'Open an Issue on GitHub',
        click() {
          openNewGitHubIssue({
            user: 'kjhx',
            repo: 'app_comp4300_othello',
            body: debugInfo()
          });
        }
      },
      {
        type: 'separator'
      },
      {
        role: 'reload'
      },
      {
        role: 'forceReload'
      },
      {
        role: 'toggleDevTools'
      }
    ]
  }
]);

Menu.setApplicationMenu(menuTemplate);