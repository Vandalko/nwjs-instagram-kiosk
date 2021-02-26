var winston = require('winston');

function CartItemComponent(params, componentInfo) {
  var media = params.media;
  var inTheCart = App.model.cart()[media.id];
  this.media = ko.observable(media);
  this.count = ko.observable(inTheCart ? inTheCart.count : 0);
  this.index = params.parentIndex * App.config.photosRowSize + params.currentIndex;
  this.img = $('img.photos-img', componentInfo.element);

  var self = this;
  this.cartSubscription = App.model.cart.subscribe(function() {
    var inTheCart = App.model.cart()[media.id];
    self.count(inTheCart ? inTheCart.count : 0);
  });
};

CartItemComponent.prototype.dispose = function() {
  this.cartSubscription.dispose();
};

CartItemComponent.prototype.updateCount = function(data, count) {
  data.count(count);
  var media = data.media();
  var cart = App.model.cart();
  var inTheCart = cart[media.id];

  if (_.isUndefined(inTheCart)) {
    inTheCart = {
      id: media.id,
      count: 0,
      variants: [],
      currentVariant: 0,
      index: data.index,
      variantIndex: 0
    };
    cart[media.id] = inTheCart;

    winston.log('info', 'Adding to the cart: ' + media.id, { inTheCart: inTheCart });
  } else if (count <= 0) {
    inTheCart.variants = [];

    winston.log('info', 'Completely removed from the cart: ' + media.id, { inTheCart: inTheCart });
  }
  if (count > 0) {
    while (inTheCart.variants.length > count) {
      inTheCart.variants.pop();
    }
    while (inTheCart.variants.length < count) {
      inTheCart.variantIndex += 1;
      var variant = {
        _id: inTheCart.variantIndex,
        id: media.id,
        src: media.images.standard_resolution.url,
        tags: media.tags,
        location: media.location ? media.location.name : null,
        user: media.user.username,
        caption: media.caption ? media.caption.text : null,
        resize: false,
        rotation: 0
      };
      variant.showLocation = !!variant.location;
      variant.showComments = !!variant.caption;
      variant.showPeople = !!variant.user;

      var time = parseInt(media.created_time ? media.created_time : (media.caption ? media.caption.created_time : null));
      if (isNaN(time)) {
        variant.time = null;
      } else {
        variant.time = Date.create(time * 1000).format('{d}.{MM}.{yyyy}');
      }
      variant.showDate = !!variant.time;

      inTheCart.variants.push(variant);
    }
  }
  if (isNaN(inTheCart.currentVariant) || inTheCart.currentVariant > inTheCart.variants.length - 1) {
    inTheCart.currentVariant = 0;
  }

  inTheCart.count = count;
  App.model.cart(cart);
}

CartItemComponent.prototype.initCartItem = function(data, event) {
  if (data.count() <= 0 && data.img.data('loaded')) {
    data.updateCount(data, 1);
  }
};
CartItemComponent.prototype.increment = function(data, event) {
  if (data.count() < 100) {
    data.updateCount(data, data.count() + 1);
  }
};
CartItemComponent.prototype.decrement = function(data, event) {
  if (data.count() > 0) {
    data.updateCount(data, data.count() - 1);
  }
};
CartItemComponent.prototype.edit = function(data, event) {
  var id = data.media().id;
  App.modals.cart.edit(id);
};

ko.components.register('cart-item', {
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
            return new CartItemComponent(params, componentInfo);
        }
    },
    template: { element: 'photo-cart-item-template' }
});