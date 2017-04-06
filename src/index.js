// this should be placed at top of main.js to handle setup events quickly
if (handleSquirrelEvent()) {
  // squirrel event handled and app will exit in 1000ms, so don't do anything else
  
}

function handleSquirrelEvent() {
  if (process.argv.length === 1) {
    return false;
  }

  const ChildProcess = require('child_process');
  const path = require('path');

  const appFolder = path.resolve(process.execPath, '..');
  const rootAtomFolder = path.resolve(appFolder, '..');
  const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
  const exeName = path.basename(process.execPath);

  const spawn = function(command, args) {
    let spawnedProcess, error;

    try {
      spawnedProcess = ChildProcess.spawn(command, args, {detached: true});
    } catch (error) {}

    return spawnedProcess;
  };

  const spawnUpdate = function(args) {
    return spawn(updateDotExe, args);
  };

  const squirrelEvent = process.argv[1];
  switch (squirrelEvent) {
    case '--squirrel-install':
    case '--squirrel-updated':
      // Optionally do things such as:
      // - Add your .exe to the PATH
      // - Write to the registry for things like file associations and
      //   explorer context menus

      // Install desktop and start menu shortcuts
      spawnUpdate(['--createShortcut', exeName]);

      setTimeout(app.quit, 1000);
      return true;

    case '--squirrel-uninstall':
      // Undo anything you did in the --squirrel-install and
      // --squirrel-updated handlers

      // Remove desktop and start menu shortcuts
      spawnUpdate(['--removeShortcut', exeName]);

      setTimeout(app.quit, 1000);
      return true;

    case '--squirrel-obsolete':
      // This is called on the outgoing version of your app before
      // we update to the new version - it's the opposite of
      // --squirrel-updated

      app.quit();
      return true;
  }
};


//change the value to false when package, true for developing
let isDevelopment = true;

const electron = require('electron')
// Module to control application life.
const app = electron.app
const systemPreferences = electron.systemPreferences
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
var ipc = electron.ipcMain;






const path = require('path')
var iconPath = __dirname + '../../app/img/logo.ico';

global.sharedObject = {
  token: null,
  username:null,
  aboutme:null,
  widget:null,
  id:null,
  layout:null,
  avatar:null,
  data:null,
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

let createWindow = () => {
  // Create the browser window.
  mainWindow  = new BrowserWindow({
    minHeight: 480,
    minWidth: 313,
    width: 213,
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
    mainWindow.webContents.openDevTools({mode: 'attach'})
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

//auto update 
// app.on('ready', function(){
//   console.log('application emitted "ready"');

//   var autoUpdater = require('auto-updater');
//   var releaseUrl ="something";
//   autoUpdater.setFeedURL(releaseUrl);
//   console.log('releaseUrl: ' + releaseUrl);

//   autoUpdater
//     .on('error', function(){
//       console.log(arguments);
//     })
//     .on('checking-for-update', function() {
//       console.log('Checking for update');
//     })
//     .on('update-available', function() {
//       console.log('Update available');
//     })
//     .on('update-not-available', function() {
//       console.log('Update not available');
//       createWindow();
//     })
//     .on('update-downloaded', function() {
//       console.log('Update downloaded');
//     });

//   autoUpdater.checkForUpdates();

// });
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  createWindow();
  ipc.on('disable-x-frame', (event, arg) => {

    session.fromPartition(arg.partition).webRequest.onHeadersReceived({}, (d, c) => {

    if(d.responseHeaders['x-frame-options'] || d.responseHeaders['X-Frame-Options']){
      delete d.responseHeaders['x-frame-options'];
      delete d.responseHeaders['X-Frame-Options'];
    }
    ({cancel: false, responseHeaders: d.responseHeaders, statusLine: d.statusLine});
    });

  });

  ipc.on('getAccentColor', function(event, arg){
    event.returnValue=systemPreferences.getAccentColor();
  });//Return  accent

  ipc.on('quicksize', function(event, arg){
    event.returnValue='';
    var width = mainWindow.getBounds().width;
    var height = mainWindow.getBounds().height;
    var x = mainWindow.getBounds().x;
    var y = mainWindow.getBounds().y;
    var width1 = (width -1);

    if (!mainWindow.isMaximized()) {
      mainWindow.setContentSize(width1, height);
      mainWindow.setContentSize(width, height);
    } else {
      mainWindow.setPosition(x, y);
      mainWindow.setContentSize(width1, height);

      mainWindow.maximize();

      //mainWindow.setContentSize(width1, height);
      //mainWindow.maximize();
    }
  });//Logged in resize

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
