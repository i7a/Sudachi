
"use strict";

// Electronのモジュールをロードする
const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
let mainWindow;

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
    height
    // webPreferences: {
    //   nodeIntegration: false
    // }
  });
  mainWindow.loadURL(
    'file://' + __dirname + '/../../html/index.html'
    // 'file://' + __dirname + '/../../html/index0.html'
  );
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});
