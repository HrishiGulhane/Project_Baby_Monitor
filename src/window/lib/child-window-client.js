
const {ipcRenderer} = require('electron');

const Utils = require('./client-utilities');


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


function initialize() {
  ipcRenderer.on(CREATE_WINDOW_RESP, function(event, arg) {
    console.log(arg);
  });
}

function registerWindowEventHandler(windowName, handlerMap) {
  if (!! windowName && !! handlerMap) {
    var channel = `${WINDOW_MESSAGE}:${windowName}`;
    console.log(`Registering for ${channel} with ${Utils.dumpObject(handlerMap)}`);

    ipcRenderer.on(channel, function(event, eventObj){
      var messageEvent = eventObj[EVENT_MESSAGE];
      var arg = eventObj[EVENT_ARGUMENT];

      console.log(`child-window-client:: Event FIRED: ${channel}.${messageEvent} - event: ${Utils.dumpObject(event)} from: ${Utils.dumpObject(eventObj)}`);
      if (!!messageEvent) {
        var handler = handlerMap[messageEvent];
        if (!! handler) {
          handler(arg);
        }
      }
    });
  }
}

function createChildWindow(pathToHtml, windowName, handlerMap) {
  var params = {};
  params[PAGE_PATH] = pathToHtml;
  params[PAGE_NAME] = windowName;
  console.log(`Creating window with: ${JSON.stringify(params)}`)
  var result = ipcRenderer.sendSync(CREATE_WINDOW_REQ, params);
  if (result[RESULT] == STATUS_SUCCESS) {
    registerWindowEventHandler(windowName, handlerMap);
  }
  return result;
}

function sendToWindow(windowName, eventName, argument) {
  var channel = `${WINDOW_MESSAGE}:${windowName}`;
  // console.log(`Registering for ${channel} with event: ${eventName} ${Utils.dumpObject(argument)}`);
  var eventObj = {};

  eventObj[EVENT_MESSAGE] = eventName;
  eventObj[EVENT_ARGUMENT] = argument;
  ipcRenderer.send(channel, eventObj);
}

module.exports = {
  initialize: initialize,
  createChildWindow: createChildWindow,
  sendToWindow: sendToWindow
}
