
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
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});
