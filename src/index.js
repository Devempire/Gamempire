
'use strict'

//change the value to false when package, true for developing
let isDevelopment = true;

const electron = require('electron')
// Module to control application life.
global.electron = electron
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
var ipc = electron.ipcMain;

const path = require('path')
var iconPath = __dirname + '../../app/img/logo.ico';
global.sharedObject = {
  token: 'empty'
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

let createWindow = () => {
  // Create the browser window.
  mainWindow  = new BrowserWindow({
    minHeight: 480,
    minWidth: 276,
    width: 276,
    height: 480,
    frame: false,
    thickFrame: true,
    titleBarStyle: 'hidden',
    backgroundColor: '#0e1519',
    icon: iconPath
  }); //mainWindow

  // and load the index.html of the app.
  mainWindow.loadURL(path.join('file://', __dirname, '/index.html'))

  if (isDevelopment) {
    // Open the DevTools.
    mainWindow.webContents.openDevTools({undocked: true})
  }

  mainWindow.center();


  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  createWindow();

  ipc.on('loggedIn', function(event, arg){
    event.returnValue='';
    mainWindow.setContentSize(1152, 648);
    mainWindow.center();
  });//Logged in resize

  ipc.on('loggedOut', function(event, arg){
    event.returnValue='';
    mainWindow.setContentSize(276, 480);
    mainWindow.center();
  });//Logged out resize

  ipc.on('closeWindow', function(event, arg){
    event.returnValue='';
    app.quit();
  });//exit/close button

  ipc.on('Maximize', function(event, arg){
    event.returnValue='';
      if (!mainWindow.isMaximized()) {
        mainWindow.maximize();
      } else {
        mainWindow.unmaximize();
      }
  });//Maximize button
  mainWindow.on('resize', function(e){

    if (!mainWindow.isMaximized()) {
      var icon = ('document.getElementById("max-btn").style.backgroundImage = "url(../app/img/maximize.png)";');
      var title = ('document.getElementById("max-btn").title = "Maximize";');
      mainWindow.webContents.executeJavaScript(icon);
      mainWindow.webContents.executeJavaScript(title);
    }else{
      var icon = ('document.getElementById("max-btn").style.backgroundImage = "url(../app/img/restore.png)";');
      var title = ('document.getElementById("max-btn").title = "Restore";');
      mainWindow.webContents.executeJavaScript(icon);
      mainWindow.webContents.executeJavaScript(title);
    }
  })//on change; on maximize show restore icon+title, vice-versa

  ipc.on('Minimize', function(event, arg){
    event.returnValue='';
    mainWindow.minimize();
  });//Minimize button


});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})
