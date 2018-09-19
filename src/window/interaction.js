

const BTN_FLASH = "btn-flash";
const BTN_STOP = "btn-stop";

const five = require('johnny-five');
const childWindow = require('./lib/child-window-client')

var board = undefined;
var led = undefined;

function startFlash() {
  if (!! led) {
    led.blink(500);
  } else {
    console.warn("STOP: led not initialised");
  }
}

function stopFlash() {
  if (!! led) {
    led.stop().off();
  } else {
    console.warn("STOP: led not initialised");
  }
}

function getObject(id) {
  return document.getElementById(id);
}

function setupBoard() {
  board = new five.Board({ repl: false });

  board.on("ready", function() {
    led = new five.Led(12);
    console.log("led initialised.")
  })
}

function setupInteractionButtons() {
  childWindow.initialize();
  setupBoard();

  getObject(BTN_FLASH).onclick = function() {
    console.log("Start flashing");
    startFlash();
  }

  getObject(BTN_STOP).onclick = function() {
    console.log("Stop flashing");
    stopFlash();
  }

  getObject('btn-fred').onclick = function() {
    console.log("Sending request for child win");
    var handlers = {
      onclose: function() {
        console.log("Fred just got closed");
      },
      onmessage: function() {
        console.log("Fred just got a message");
      }
    }
    var info = childWindow.createChildWindow('src/window/child-fred.html', "fred", handlers);
    console.log(JSON.stringify(info));
  }

  getObject('btn-barney').onclick = function() {
    console.log("Sending request for child win");
    var handlers = {
      onclose: function() {
        console.log("Barney just got close!");
      },
      onmessage: function() {
        console.log("Barney just got a message");
      }
    }
    var info = childWindow.createChildWindow('src/window/child-barney.html', "barney", handlers);
    console.log(JSON.stringify(info));
  }

}
