var winston = require('winston');

var infinitescroll = App.model.photos.infinitescroll;

var paginateFun = _.noop;

var spinnerOpts = {
  lines: 13 // The number of lines to draw
  , length: 40 // The length of each line
  , width: 10 // The line thickness
  , radius: 50 // The radius of the inner circle
  , scale: 1 // Scales overall size of the spinner
};

var spinner = new Spinner(spinnerOpts);

App.model.photos.subscribe(function() {
  $('.photos-spinner').empty();
  if (App.model.photos().length > 0) {
    spinner.stop();
  } else {
    spinner.spin();
    $('.photos-spinner').append(spinner.el);
  }
});

// update dimensions of infinite-scroll viewport and item
var updateViewportDimensions = _.once(function() {
  var itemsRef = $('.photos'),
  itemRef = $('.photos-row').first(),
  itemsWidth = itemsRef.width(),
  itemsHeight = itemsRef.height(),
  itemWidth = itemRef.width(),
  itemHeight = itemRef.height();

  infinitescroll.viewportWidth(itemsWidth);
  infinitescroll.viewportHeight(itemsHeight);
  infinitescroll.itemWidth(itemWidth);
  infinitescroll.itemHeight(itemHeight);
});

App.model.photosScroll = _.debounce(function() {
  updateViewportDimensions();

  infinitescroll.scrollY($('.photos').scrollTop());

  if (App.model.photos.peek().length - infinitescroll.lastVisibleIndex.peek() <= 6) {
    paginateFun(callbackFactory(App.model.currentPhotosModel(), paginateCallback));
  }
}, 250);


var grouper = function(group, medias) {
  var groupSize = App.config.photosRowSize;
  var photos = App.model.photos;
  var cart = App.model.cart();
  var result = [];

  for (var i = 0; i < medias.length; i++) {
    var media = medias[i];
    if (!media.images || !media.images.standard_resolution) {
      winston.log('error', "Bad media", { media: medias[i] });
      continue;
    }

    group.push(media);
    if (group.length == groupSize) {
      result.push(group);
      group = [];
    }
  }
  if (group.length > 0) {
    result.push(group);
  }
  
  if (photos().length > 0) {
    photos.push.apply(photos, result);
  } else {
    photos(result);
  }
}

var callbackFactory = function(model, callback) {
  var called = false;
  return function(err, medias, pagination, remaining, limit) {
    if (called) {
      winston.warn("Skip photos for " + model + " because it was allready called");
      return;
    }

    called = true;
    var current = App.model.currentPhotosModel();
    if (current && model == current) {
      callback(err, medias, pagination, remaining, limit);
    } else {
      winston.warn("Skip photos for " + model + " because current is " + current);
    }
  };
}


var paginateCallback = function(err, medias, pagination, remaining, limit) {
  if (err) {
    winston.log('error', 'Got error: ' + err, { error: err });
    return;
  }

  winston.debug("Has next: " + pagination.next);
  if (pagination.next) {
    paginateFun = _.once(pagination.next);
  } else {
    paginateFun = _.noop;
  }

  if (medias) {
    var groupSize = App.config.photosRowSize;
    var photos = App.model.photos;
    var group = photos()[photos().length - 1];
    if (group.length == groupSize) {
      group = [];
    } else {
      group = photos.pop();
    }
    grouper(group, medias);
  }
}

var photosCallback = function(err, medias, pagination, remaining, limit) {
  spinner.stop();

  if (err) {
    winston.log('error', 'Got error: ' + err, { error: err });
    App.model.navPhotosBack();
    if (err.error_type == 'APINotAllowedError') {
      App.modals.oups.profileAccessError();
    } else {
      App.modals.oups.photosGenericError();
    }
    return;
  }

  if (medias) {
    var group = [];
    grouper(group, medias);

    winston.debug("Has next: " + pagination.next);
    if (pagination.next && paginateFun == _.noop) {
      paginateFun = _.once(pagination.next);
      paginateFun(callbackFactory(App.model.currentPhotosModel(), paginateCallback));
    }
  }
}


App.model.clearPhotos = function() {
  paginateFun = _.noop;

  App.model.showUser(null);
  App.model.showTag(null);

  App.model.photos.removeAll();

  App.model.cart({});
}

App.model.userMedia = function(data, event) {
  App.model.clearPhotos();

  App.model.showUser(data);

  /* OPTIONS: { [count], [min_timestamp], [max_timestamp], [min_id], [max_id] }; */
  App.ig.user_media_recent(data.id, callbackFactory(data, photosCallback));
};
App.model.tagMedia = function(data, event) {
  App.model.clearPhotos();

  App.model.showTag(data);

  /* OPTIONS: { [min_tag_id], [max_tag_id] }; */
  App.ig.tag_media_recent(data.name, callbackFactory(data, photosCallback));
};

App.model.stripCart = function() {
  var cart = App.model.cart();
  for (var key in cart) {
    if (cart[key] && cart[key].count <= 0) {
      delete cart[key];
    }
  }
}

App.model.navPhotosBack = function() {
  App.model.clearPhotos();
};

App.model.navPhotosMain = function() {
  if (App.model.moneyPayed() > 0) {
    App.model.query(null);
    App.model.clearPhotos();
  } else {
    App.model.goHome();
  }
};

App.model.navPhotosPay = function() {
  App.modals.cart.list();
};

