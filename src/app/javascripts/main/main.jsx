
"use strict";

// for auto update.
const log = require('electron-log');
const {autoUpdater} = require("electron-updater");
autoUpdater.autoDownload = false

// electron modules.
const electron = require("electron");
const {app, BrowserWindow, ipcMain, Menu, dialog} = require("electron");

// initialData and storage for json file.
const initialData = require("../../data/initial.json")
const storage = require('electron-storage');

// logging.
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

// for ipc.
ipcMain.on('getTaskList', (event, date) => {
  let path = 'taskList/' + date + '.json'
  storage.isPathExists(path, (itDoes) => {
    if (itDoes) {
      storage.get(path, (err, data) => {
        if (err) {
          console.error(err)
        } else {
          // success.
          event.returnValue = data;
        }
      })
    } else {
      storage.set(path, initialData, (err) => {
        if (err) {
          console.error(err)
        } else {
          // success.
          event.returnValue = initialData;
        }
      })
    }
  })
})

ipcMain.on('getTaskListAsync', (event, date) => {
  let path = 'taskList/' + date + '.json'
  storage.isPathExists(path, (itDoes) => {
    if (itDoes) {
      storage.get(path, (err, data) => {
        if (err) {
          console.error(err)
        } else {
          // success.
          event.sender.send('getTaskListAsync', {date: date, value: data})
        }
      })
    } else {
      storage.set(path, initialData, (err) => {
        if (err) {
          console.error(err)
        } else {
          // success.
          event.sender.send('getTaskListAsync', {date: date, value: initialData})
        }
      })
    }
  })
})

app.on('ready', () => {
  const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize
  let mainWindow = new BrowserWindow({
    width,
    height,
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  });
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
  mainWindow.loadURL(
    'file://' + __dirname + '/../../html/index.html'
  );
  installMenu()
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});

function installMenu() {
  const template = [
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'delete' },
        { role: 'selectall' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forcereload' },
        { role: 'toggledevtools' },
        { type: 'separator' },
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      role: 'window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' }
      ]
    }
  ]
  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    })
  }
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

app.on('window-all-closed', () => {
  if (process.platform != 'darwin'){
    app.quit();
  }
});

// auto update.
autoUpdater.on('update-available', (info) => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Found Updates',
    message: 'Found updates, do you want latest version ' + info.version + ' download now? The download takes place in background.',
    buttons: ['Sure', 'No']
  }, (buttonIndex) => {
    if (buttonIndex === 0) {
      autoUpdater.downloadUpdate()
    }
  })
})

autoUpdater.on('error', (ev, err) => {
  dialog.showErrorBox('Error: ', err == null ? "unknown" : (err.stack || err).toString())
})

autoUpdater.on('download-progress', (progressObj) => {
  log.info("percent: " + progressObj.percent + " %")
})

autoUpdater.on('update-downloaded', (ev, info) => {
  dialog.showMessageBox({
    title: 'Install Updates',
    message: 'Updates downloaded, application will be quit for update...'
  }, () => {
    autoUpdater.quitAndInstall()
  })
})

app.on('ready', function()  {
  autoUpdater.checkForUpdates();
});
