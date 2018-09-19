

const Utils = require('./lib/utilities');
const ChildWindowManager = require('./lib/child-window-manager');

const Other = require('./service');


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

let applicationHTML = `${__dirname}/../window/index.html`;

const StartWindowSize = {
  width: 1024,
  height: 800
}

Other.showMessage()

function createWindow () {
  mainWindow = Utils.createBrowserWindow(applicationHTML, {
    backgroundColor: '#111111',
    width: StartWindowSize.width,
    height: StartWindowSize.height
  });
  ChildWindowManager.startChildWindowManager(mainWindow);
  Utils.whenWindowClosed(mainWindow, function(){
    mainWindow = null;
  })
}

Utils.whenAllWindowsClosed( function() {
  if (! Utils.isMacOS() ) {
    Utils.quitElectron()
  }
})
  
Utils.whenApplicationActivated(function() {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null ) {
    createWindow()
  }
})

Utils.whenElectronInitialised(createWindow)