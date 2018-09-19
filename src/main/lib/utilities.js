/*
 * Some helpful utility functions.
 */

const isDev = require('electron-is-dev');
const path = require('path');
const {app, BrowserWindow} = require('electron');

let ChildWindows = [];

function isMacOS() {
  return process.platform === 'darwin'
}

function dumpObject(obj) {
  var total = ''
  for(var key in obj) {
    var val = obj[key]
    if (typeof(val) === 'object') {
      total += `${key}= { ${val} }, `
    } else if (typeof(val) === 'function') {
      total += `${key}= FUNC, `
    } else {
      total += `${key}= ${val}, `
    }
  }
  return total
}

function openDeveloperToolsInDev(newWindow) {
  if(isDev) {
    newWindow.webContents.openDevTools();
  }
}

function internalCreateWindow(parentWindow, htmlPath, options) {
  let backgroundColor = !! options ? options.backgroundColor : null;

  let windowOpts = {};
  if (options && options.width && options.height) {
    windowOpts.width = options.width;
    windowOpts.height = options.height;
  }

  if (! backgroundColor) {
    backgroundColor = '#888';
  }
  windowOpts.backgroundColor = backgroundColor;
  if (parentWindow) {
    windowOpts.parent = parentWindow;
  }

  var newWindow = new BrowserWindow( windowOpts );
  newWindow.loadFile( htmlPath );

  openDeveloperToolsInDev(newWindow);
  return newWindow;
}

function createChildWindow(parentWindow, htmlPath, options) {
  const funcName = 'createChildWindow';

  let closeHandler = !!options ? options.closeHandler : null;

  let childWindowIndex = ChildWindows.length;
  
  if (!parentWindow) {
    console.error(funcName + ": the parameter 'parentWindow' must be valid window.")
    return -1;
  }

  var newWindow = internalCreateWindow(parentWindow, htmlPath, options);

  ChildWindows[childWindowIndex] = newWindow;

  whenWindowClosed(newWindow, function() {
    ChildWindows[childWindowIndex] = null;
    console.log(`child window ID = ${childWindowIndex} closed`)
    if (!! closeHandler) {
      closeHandler();
    }
  })

  newWindow.show();
  return childWindowIndex;
}

function createBrowserWindow(htmlPath, options) {
  var newWindow = internalCreateWindow(undefined, htmlPath, options);
  // var newWindow = new BrowserWindow(
  //   {
  //     width: StartWindowSize.width,
  //     height: StartWindowSize.height,
  //     backgroundColor: backgroundColor
  //   }
  // );

  newWindow.show();
  return newWindow;
}

function whenElectronInitialised(func) {
  app.on('ready', func);
}

function whenAllWindowsClosed(func) {
  app.on('window-all-closed', func);
}

function whenWindowClosed(win, func) {
  win.on('closed', func);
}

function whenApplicationActivated(func) {
  app.on('activate', func);
}

function quitElectron() {
  app.quit();
}

function makePath(universalPath) {
  return universalPath.replace(/\//g, path.sep)
}

function pathToFile(filePath) {
  let currentDir = process.cwd();
  var val = path.join( currentDir , filePath );
  return val;
}

module.exports = {
  makePath: makePath,
  pathToFile: pathToFile,
  isMacOS: isMacOS,
  dumpObject: dumpObject,
  createBrowserWindow: createBrowserWindow,
  createChildWindow: createChildWindow,
  whenApplicationActivated: whenApplicationActivated,
  whenElectronInitialised: whenElectronInitialised,
  whenAllWindowsClosed: whenAllWindowsClosed,
  whenWindowClosed: whenWindowClosed,
  quitElectron: quitElectron
}