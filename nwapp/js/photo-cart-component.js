function PhotoCartModel(params, componentInfo) {
    this.images = ko.observableArray();
    this.moneyPayed = ko.pureComputed(function() {
      return App.model.moneyPayed();
    }, this);
    this.moneyNeeded = ko.pureComputed(function() {
      return App.model.cartCost();
    }, this);
    this.photosCount = ko.pureComputed(function() {
      return App.model.cartSize();
    }, this);


    var self = this;
    var modal = $('#photo-cart-modal');
    this.element = modal;

    this.rebuildCart = function() {
      App.model.spawnSession();

      var cart = App.model.cart();
      var cartRowSize = App.config.cartRowSize;
      var images = [];
      var group = [];
      for (var key in cart) {
        if (cart[key] && cart[key].count > 0) {
          var variants = cart[key].variants;
          for (var i = 0; i < variants.length; i++) {
            group.push(variants[i]);
            if (group.length >= cartRowSize) {
              images.push(group);
              group = [];
            }
          }
        }
      }
      if (group.length > 0) {
        images.push(group);
      }
      self.images.removeAll();
      self.images.push.apply(self.images, images);
    }

    this.removeCartItem = function(item) {
      var cart = App.model.cart();
      var inTheCart = cart[item.id];
      inTheCart.variants.remove(item);
      inTheCart.count = inTheCart.variants.length;
      if (isNaN(inTheCart.currentVariant) || inTheCart.currentVariant > inTheCart.variants.length - 1) {
        inTheCart.currentVariant = 0;
      }
      App.model.cart(cart);

      self.rebuildCart();
    };

    this.initModal = function() {
      self.rebuildCart();

      App.initSsp();

      modal.addClass('photo-cart-modal');
    };
    this.clearModal = function() {
      var modal = $(this);
      modal.removeClass('photo-cart-modal');

      self.images.removeAll();

      App.disableSsp();
    }
    this.element.on('show.bs.modal', this.initModal);
    this.element.on('hidden.bs.modal', this.clearModal);
}

PhotoCartModel.prototype.dispose = function() {
  this.element.off('show.bs.modal', this.initModal);
  this.element.off('hidden.bs.modal', this.clearModal);
};

PhotoCartModel.prototype.close = function(data, event) {
  data.element.modal('hide');
};

PhotoCartModel.prototype.cancel = function(data, event) {
  data.element.modal('hide');
  App.model.cart({});
};

PhotoCartModel.prototype.navPrint = function(data, event) {
  if (App.model.moneyPayed() >= App.model.cartCost()) {
    data.element.modal('hide');
    App.model.printing(true);
  }
};


ko.components.register('photo-cart', {
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
            return new PhotoCartModel(params, componentInfo);
        }
    },
    template: { element: 'photo-cart-component' }
});


