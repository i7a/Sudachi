
"use strict";

// Electronのモジュールをロードする
const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
let mainWindow;

// rennderer process との通信を行う
const {ipcMain} = require('electron');
const storage = require('electron-storage');

ipcMain.on('getTaskList', (event, date) => {
  storage.get('taskList/' + date, (err, data) => {
    if (err) {
      console.error(err)
    } else {
      // success.
      event.returnValue = data;
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
    webPreferences: {
      nodeIntegration: true
    }
  });
  mainWindow.loadURL(
    'file://' + __dirname + '/../../html/index.html'
  );
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});
