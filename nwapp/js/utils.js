
var

  // Load native UI library
  gui = require('nw.gui'),

  // browser window object
  win = gui.Window.get();


// Developer Shortcuts
Mousetrap.bind(['shift+f12', 'f12', 'command+0'], function (e) {
  win.showDevTools();
});
Mousetrap.bind('f11', function (e) {
  var spawn = require('child_process').spawn,
  argv = gui.App.fullArgv,
  CWD = process.cwd();

  argv.push(CWD);
  spawn(process.execPath, argv, {
    cwd: CWD,
    detached: true,
    stdio: ['ignore', 'ignore', 'ignore']
  }).unref();
  gui.App.quit();
});
Mousetrap.bind(['f10'], function (e) {
  if (win.isKioskMode) {
    win.leaveKioskMode();
  } else {
    win.enterKioskMode();
  }
});
Mousetrap.bind(['f5'], function (e) {
  if (location) location.reload();
});


window.onerror = function winErrorHandler(errorMsg, url, lineNumber) {
  require('winston').error('Unexpected error', {errorMsg: errorMsg, url: url, lineNumber: lineNumber});
  return false;
};


if (!global.listenersInstalled) {

  var logDir = global.konfig.logDir;
  require('nw.gui').App.setCrashDumpDir(logDir);

  var winston = require('winston');
  winston.exitOnError = false;
  winston.add(new (winston.transports.DailyRotateFile)({
    filename: logDir + 'all-logs.log',
    handleExceptions: true,
    json: false,
    level: 'debug'
  }), null, true);
  winston.remove(winston.transports.Console);

  process.on('exit', function () {
    global.App.disableSsp();
  });

  win.on('close', function() {
    require('winston').warn('Prevented close operation');
  });

  global.listenersInstalled = true;
}
