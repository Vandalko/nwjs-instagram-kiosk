var winston = require('winston');

App.disableSsp = function() {
  winston.debug('Disable SSP');

  var ssp = global.ssp;
  global.ssp = undefined;
  if (ssp && ssp.port && ssp.port.isOpened) {
    ssp.disable(function() {
      if (ssp && ssp.port) { ssp && ssp.port.close(); }
    });
  }
}


App.initSsp = function() {
  winston.debug('Init SSP');

  var ssp = require('ssp');
  var notes = {
    1: 1,
    2: 2,
    3: 5,
    4: 10,
    5: 20,
    6: 50,
    7: 100,
    8: 200,
    9: 500
  };
  ssp = new ssp({
    device: 'COM5', //device address
    type: "nv10usb", //device type
    currencies: [1, 1, 1, 1, 1, 1, 1, 1, 1] //currencies types acceptable
  });

  ssp.init(function(){
    ssp.on('ready', function(){
      winston.info("SSP device is ready");
      ssp.enable();
    });
    ssp.on('read_note', function(note){
      if(note > 0) {
        winston.info("GOT note: " + notes[note]);
      }
    });
    ssp.on('disable', function(){
      winston.info("SSP disabled");
    });
    ssp.on('note_cleared_from_front', function(note) {
      winston.info("note_cleared_from_front");
    });
    ssp.on('note_cleared_to_cashbox', function(note) {
      winston.info("note_cleared_to_cashbox");
    });
    ssp.on('credit_note', function(note) {
      var value = notes[note];
      winston.log('info', "CREDIT: " + value, { note: note, value: value });
      var payed = App.model.moneyPayed();
      App.model.moneyPayed(payed + value);
    });
    ssp.on("safe_note_jam", function(note) {
      winston.error("Jammed: " + note);
      //TODO: some notifiaction, recording, etc.
    });
    ssp.on("unsafe_note_jam", function(note) {
      winston.error("Jammed inside: " + note);
      //TODO: some notifiaction, recording, etc.
    });
    ssp.on("fraud_attempt", function(note) {
      winston.error("Fraud!");
      //TODO: some notifiaction, recording, etc.
    });
    ssp.on("stacker_full", function(note) {
      winston.error("I'm full, do something!");
    });
    ssp.on("note_rejected", function(reason) {
      winston.log('error', "Rejected!", { reason: reason });
    });
    ssp.on("error", function(err) {
      winston.log('error', 'SSP error', { code: err.code, message: err.message });
    });
  });

  global.ssp = ssp;
}

App.disableSsp();
