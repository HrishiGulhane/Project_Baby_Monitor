const {ipcMain} = require('electron');
const Utils = require('./utilities');

const CREATE_WINDOW_REQ = 'create-window-req';
const WINDOW_MESSAGE = 'window-to-window';
const CREATE_WINDOW_RESP = 'create-window-resp';
//-- request values ---
const PAGE_PATH = 'page_path';
const PAGE_NAME = 'page_name';
//-- result values ---
const PAGE_ID = 'page_id';
const RESULT = 'result';
const STATUS_SUCCESS = 'SUCCESS';
const STATUS_FAIL = 'FAIL';
//-- event values ---
const EVENT_MESSAGE = 'event_message';
const EVENT_ARGUMENT = 'event_argument';
const EVENT_CLOSE_WINDOW = 'onclose';


function makeResult(isOk) {
  var result = {}
  result[RESULT] = isOk ? STATUS_SUCCESS : STATUS_FAIL;
  return result;
}

function windowCloseHandler(windowName, sender) {
  var channel = `${WINDOW_MESSAGE}:${windowName}`;
  console.log("Window closed - telling creator = " + channel);
  var eventObj = {};
  eventObj[EVENT_MESSAGE] = EVENT_CLOSE_WINDOW;
  eventObj[EVENT_ARGUMENT] = {};
  sender.send(channel, eventObj);
}

function createChildWindow(mainWindow, sender, parameters) {
  pagePath = parameters[PAGE_PATH];
  pageName = parameters[PAGE_NAME];

  var winId = -1;

  if (!!pagePath && !!pageName) {
    pathToHtml = Utils.pathToFile(pagePath);
    var createOptions = {
      closeHandler: function(){
        windowCloseHandler(pageName, sender);
      }
    };

    winId = Utils.createChildWindow(mainWindow, pathToHtml, createOptions);
    if (winId <0) {
      console.warn(`Failed to create window with HTML path of ${pagePath}`);
    }
  } else {
    if (! pagePath) {
      console.warn(`Attempted to create window without path to HTML!`);
    }
    if (! pageName) {
      console.warn(`Attempted to create child window without a window name.`);
    }
  }
  var result = makeResult( winId >= 0);
  result[PAGE_ID] = winId;
  return result;
}

function handleCreateWindowRequest(mainWindow) {
  ipcMain.on(CREATE_WINDOW_REQ, function(event, parameters){
    var result = makeResult(false);
    try {
      if (!! parameters) {
        result = createChildWindow(mainWindow, event.sender, parameters)
      }
    } catch(e) {
      console.error(`
        Failed to create child window!
          Parameters should have been an object but were:
          "${dump(parameters)}"
      `);
    }
    event.returnValue = result;
  });
}

function startChildWindowManager(mainWindow) {
  handleCreateWindowRequest(mainWindow);
}

module.exports = {
  startChildWindowManager: startChildWindowManager
}