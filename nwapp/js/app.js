  var

  // Load native UI library
  gui = require('nw.gui'),

  // browser window object
  win = gui.Window.get();

function App() {
  App.ig.use({ client_id: '<redacted>', client_secret: '<redacted>' });

  App.queryKeyboard('input#query');

  ko.applyBindings(App.model);

  var sessionTimeout = null;
  $('body').on('click touchstart touchmove spawnSession', function() {
    clearTimeout(sessionTimeout);
    sessionTimeout = setTimeout(App.model.sessionEnd, App.config.sessionTime);
  });
}

App.config = global.konfig;

App.model = {
  query: ko.observable(null),

  userSearchResult: ko.observableArray().extend({ rateLimit: 100 }),
  tagSearchResult: ko.observableArray().extend({ rateLimit: 100 }),

  photos: ko.observableArray([]).extend({ rateLimit: 100, infinitescroll: {} }),

  showUser: ko.observable(),
  showTag: ko.observable(),
  showPhotos: function() {
    return this.showUser() || this.showTag();
  },
  currentPhotosModel: function() {
    if (this.showUser()) { return this.showUser(); }
    return this.showTag();
  },

  cart: ko.observable({}).extend({ notify: 'always' }),
  cartSize: function() {
    var cart = this.cart();
    var count = 0;
    for (var key in cart) {
      if (cart[key] && cart[key].count > 0) {
        count += cart[key].count;
      }
    }
    return count;
  },
  cartCost: function() {
    var count = this.cartSize();
    return Math.round(count / 2) * App.config.cost;
  },

  moneyPayed: ko.observable(0),

  printing: ko.observable(false),

  infoModal: function(data, event) {
    App.modals.info();
  },

  yesHere: _.noop,

  sessionEnd: function() {
    if (App.model.moneyPayed() <= 0 && !global.ssp && !App.model.printing()) {
      if (App.model.query()) {
        App.model.goHome();
        // App.modals.oups.sessionTimeOutError();
      } else {
        //App.model.goHome();
      }
    }
    App.model.spawnSession();
  },
  spawnSession: function() {
    $('body').trigger('spawnSession');
  }
};

App.model.searchResultsCount = ko.pureComputed(function() {
  return this.userSearchResult().length + this.tagSearchResult().length;
}, App.model),


App.model.goHome = function(data, event) {
  // App.model.clearSearchResults();
  // App.model.showPhotos(false);
  // App.model.clearPhotos();
  win.reload();
};

App.model.query.subscribe(function(newQuery) {
  App.model.spawnSession();
});
App.model.cart.subscribe(function(newQuery) {
  App.model.spawnSession();
});
App.model.photos.subscribe(function(newQuery) {
  App.model.spawnSession();
});
App.model.moneyPayed.subscribe(function(newQuery) {
  App.model.spawnSession();
});
App.model.printing.subscribe(function(newQuery) {
  App.model.spawnSession();
});


App.ig = require('instagram-node').instagram();

global.App = App;

if (global.printer) {
  global.printer.close(true);
}

global.printer = gui.Window.open('printer.html', {
    position: 'center',
    show: false,
    frame: false,
    toolbar: false,
    width: 1080,
    height: 720,
  });

//win.showDevTools();
