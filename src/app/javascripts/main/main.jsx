
"use strict";

// Electronのモジュールをロードする
const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const initialData = require("../../data/initial.json")
let mainWindow;

// rennderer process との通信を行う
const {ipcMain} = require('electron');
const storage = require('electron-storage');

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

// ウィンドウが全て閉じた時の挙動を定義
app.on('window-all-closed', () => {
  if (process.platform != 'darwin'){
    app.quit();
  }
});

app.on('ready', () => {
  const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize
  mainWindow = new BrowserWindow({
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
  const { Menu } = require('electron')
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
