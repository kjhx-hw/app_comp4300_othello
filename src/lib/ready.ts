import { BrowserWindow, Menu } from 'electron';
import { appMenu, centerWindow, debugInfo, enforceMacOSAppLocation, is, openNewGitHubIssue } from 'electron-util';
import * as debugTools from 'electron-debug';

interface ApplicationIsReadyProps {
  window: BrowserWindow;
}

export function applicationIsReady(options: ApplicationIsReadyProps) {
  if (is.development) debugTools();
  enforceMacOSAppLocation();
  centerWindow({window: options.window});
  menuBuilder();
}

function menuBuilder() {
  const menuTemplate = Menu.buildFromTemplate([
    appMenu(),
    {
      label: 'Debug',
      submenu: [
        {
          label: 'Open an Issue on GitHub',
          click() {
            openNewGitHubIssue({
              user: 'kjhx',
              repo: 'app_comp4300_spades',
              body: debugInfo()
            });
          }
        },
        {
          label: 'Open Log Directory'
        },
        {
          label: 'Reload'
        }
      ]
    }
  ]);

  Menu.setApplicationMenu(menuTemplate);
}