var

  // Load native UI library
  gui = require('nw.gui'),

  // browser window object
  win = gui.Window.get();

var winston = require('winston');

var spawn = require('child_process').spawn;

var printFolder = global.konfig.printDir;


window.onerror = function winErrorHandler(errorMsg, url, lineNumber) {
  require('winston').error('Unexpected error', {errorMsg: errorMsg, url: url, lineNumber: lineNumber});
  return false;
};

function initPrinter() {

  var model = initPrinter.model;

  model.tryPrint = function() {
    winston.debug('tryPrint ' + model.renderCounter);
    model.renderCounter += 1;

    setTimeout(function() {
      $('div.photo-editor-text').dotdotdot({wrap: 'letter', watch: true});
    }, 0);

    if (model.renderCounter > 3) {
      model.renderCounter = 0;

      setTimeout(function() {
        win.capturePage(function(img) {
          var base64Data = img.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
          var fileName = printFolder + 'out-' + Date.now() + '.png';
          require("fs").writeFile(fileName, base64Data, 'base64', function(err) {
            if (err) {
              winston.error('Print error', {error: err});
            }
            var iPrint = spawn('C:\\Program Files (x86)\\IrfanView\\i_view32.exe', [fileName, '/print']);
            iPrint.on('close', function(code) {
              winston.info('IrfanView exit code: ' + code);
              var maxWaiting = global.konfig.printTime;
              var timeout = maxWaiting - (Date.now() - model.startTime);
              setTimeout(function() {
                global.printDone();
              }, Math.min(Math.max(timeout, 0), maxWaiting));
            });
          });
        }, 'png');
      }, 1000);
    }
  }

  global.silentPrint = function(left, right) {
    model.startTime = Date.now();
    model.renderCounter = 0;
    model.left(left);
    model.right(right);
  }

  ko.applyBindings(model);
}

initPrinter.model = {
    left: ko.observable(),
    right: ko.observable(),
    renderCounter: 0,
    startTime: 0
  };

//win.showDevTools();
