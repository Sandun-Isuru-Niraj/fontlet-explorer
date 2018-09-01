const electron = require('electron');
const openAboutWindow = require('about-window').default;
const path = require('path');
const isDev = require('electron-is-dev');
const notifier = require('node-notifier');
const { autoUpdater } = require('electron-updater');

require('update-electron-app')();

const { app, BrowserWindow, Menu } = electron;

let mainWindow;

autoUpdater.logger = require('electron-log');

autoUpdater.logger.transports.file.level = 'info';

autoUpdater.on('checking-for-update', () => {
  console.log('Checking for update...');
});
autoUpdater.on('update-available', info => {
  console.log('Update available.', info);
});
autoUpdater.on('update-not-available', info => {
  console.log('Update not available.', info);
});
autoUpdater.on('error', err => {
  console.log(`Error in auto-updater. ${err}`);
});
autoUpdater.on('download-progress', progressObj => {
  console.log('downloading....................');
});
autoUpdater.on('update-downloaded', info => {
  console.log('Update downloaded', info);
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    resizable: false,
    icon: path.join(__dirname, 'assets/icon.png')
  });
  mainWindow.loadURL(
    isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`
  );
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  // initAutoUpdate();
  autoUpdater.checkForUpdatesAndNotify();
  autoUpdater.checkForUpdates();
  // Open the DevTools.
  mainWindow.webContents.openDevTools();
}

function initAutoUpdate() {
  if (isDev) {
    return;
  }

  if (process.platform === 'linux') {
    return;
  }

  autoUpdater.checkForUpdates();
  autoUpdater.signals.updateDownloaded(showUpdateNotification);
}

function showUpdateNotification(update) {
  const updateInfo = update || {};
  const restartNowAction = 'Restart now';

  const versionLabel = updateInfo.label ? `Version ${updateInfo.version}` : 'The latest version';

  notifier.notify(
    {
      title: 'A new update is ready to install.',
      message:
        `${versionLabel}` +
        'has been downloaded and will be automatically installed after restart.',
      closeLabel: 'Okay',
      actions: restartNowAction
    },
    (err, response, metadata) => {
      if (err) throw err;
      if (metadata.activationValue !== restartNowAction) {
        return;
      }
      autoUpdater.quitAndInstall();
    }
  );
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

app.once('ready', () => {
  const menu = Menu.buildFromTemplate([
    {
      label: 'About',
      submenu: [
        {
          label: 'FontLet',
          click: () =>
            openAboutWindow({
              icon_path: path.join(__dirname, '../src/assets/images/fontCase_round_background.svg'),
              css_path: path.join(__dirname, 'src/about.css'),
              use_version_info: false,
              description:
                'Fontlet is a free software project led by a community who loves Free/Libre and Open source fonts. Initial development is supported by Mooniak, LeafyCode and HostGrid. Credits Kasun Indi, Kosala Senevirathne, Malith Widanapathirana, Pathum Egodawatta, Pubudu Kodikara, Rajitha Manamperi, Sachintha Kodagoda',
              copyright: 'Copyright (c) 2018',
              homepage: 'http://mooniak.com/'
            })
        }
      ]
    }
  ]);
  Menu.setApplicationMenu(menu);
});
