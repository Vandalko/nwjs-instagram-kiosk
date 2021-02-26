var winston = require('winston');

function PhotoPrinterComponent(params, componentInfo) {  
  this.left = ko.observable({});
  this.right = ko.observable({});
  this.progress = ko.observable(0);

  App.model.stripCart();
  var cart = App.model.cart();
  var variants = [];
  for (var key in cart) {
    if (cart[key] && cart[key].count > 0) {
      variants.push.apply(variants, cart[key].variants);
    }
  }
  if (variants.length % 2 == 1) {
    variants.push(variants[variants.length - 1]);
  }

  winston.info('Printing', {cartSize: variants.length, moneyPayed: App.model.moneyPayed()});

  var self = this;
  var originalCount = variants.length;

  var currentProgress = function(count) {
    return 100 * (originalCount - count) / originalCount;
  };
  var step = currentProgress(variants.length - 2) / (global.konfig.printTime / 1000);

  this.doStep = function() {
    var progress = currentProgress(variants.length);
    self.progress(Math.min(self.progress() + step, progress).ceil());
    clearTimeout(this.stepTimeout);
    self.stepTimeout = setTimeout(self.doStep, 1000);
  };

  this.left(variants.pop());
  this.right(variants.pop());

  global.printDone = function() {
    winston.info('printDone');
    self.progress(currentProgress(variants.length).ceil());

    if (variants.length > 0) {
      self.left(variants.pop());
      self.right(variants.pop());
      global.silentPrint(self.left(), self.right());
    } else {
      winston.info('print done 100%');
      App.model.goHome();
    }
  };
  global.silentPrint(this.left(), this.right());
  this.doStep();
}

PhotoPrinterComponent.prototype.partRendered = function() {
  setTimeout(function() {
    $('#print-container').find('div.photo-editor-text').dotdotdot({wrap: 'letter', watch: true});
  }, 0);
}

PhotoPrinterComponent.prototype.dispose = function() {
  global.printDone = undefined;
  clearTimeout(this.stepTimeout);
}


ko.components.register('photo-printer', {
    viewModel: {
        createViewModel: function(params, componentInfo) {
            // - 'params' is an object whose key/value pairs are the parameters
            //   passed from the component binding or custom element
            // - 'componentInfo.element' is the element the component is being
            //   injected into. When createViewModel is called, the template has
            //   already been injected into this element, but isn't yet bound.
            // - 'componentInfo.templateNodes' is an array containing any DOM
            //   nodes that have been supplied to the component. See below.
 
            // Return the desired view model instance, e.g.:
            return new PhotoPrinterComponent(params, componentInfo);
        }
    },
    template: { element: 'printer-component-template' }
});

