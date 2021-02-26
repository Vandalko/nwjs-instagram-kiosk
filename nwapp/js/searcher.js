var

  // Load native UI library
  gui = require('nw.gui'),

  // browser window object
  win = gui.Window.get();

var winston = require('winston');

var searchResultProcessor = function(err, newQuery, data, destination) {
   var realQuery = ko.unwrap(App.model.query);
   if (realQuery != newQuery) {
    winston.debug("Skip: " + newQuery + " vs " + realQuery);
    return;
  }

  if (err) {
    winston.log('error', 'Got error: ' + err, { error: err });
  }

  var result = [];
  var realCount = data ? Math.min(data.length, App.config.maxSearchResult) : 0;
  for(var i = 0; i < realCount; i++) {
    result.push(data[i]);
  }
  destination(result);
}

var spinnerOpts = {
  lines: 13 // The number of lines to draw
  , length: 40 // The length of each line
  , width: 10 // The line thickness
  , radius: 50 // The radius of the inner circle
  , scale: 1 // Scales overall size of the spinner
};

var spinner = new Spinner(spinnerOpts);

App.model.query.subscribe(function(newQuery) {
  if (!newQuery) {
    App.model.userSearchResult.removeAll();
    App.model.tagSearchResult.removeAll();

    spinner.stop();
    $('.search-spinner').empty();
    return;
  }

  if (newQuery == '.followthewhiterabbit.') {
    win.showDevTools();
  }

  $('.search-spinner').empty();
  if (App.model.searchResultsCount() > 0) {
    spinner.stop();
  } else {
    spinner.spin();
    $('.search-spinner').append(spinner.el);
  }

  winston.debug('newQuery: ' + newQuery);

  // Available when the error comes from Instagram API
  // err.code;                // code from Instagram
  // err.error_type;          // error type from Instagram
  // err.error_message;       // error message from Instagram

  // If the error occurs while requesting the API
  // err.status_code;         // the response status code
  // err.body;                // the received body
  App.ig.user_search(newQuery, function(err, users, remaining, limit) {
    searchResultProcessor(err, newQuery, users, App.model.userSearchResult);
  });
  App.ig.tag_search(newQuery, function(err, result, remaining, limit) {
    searchResultProcessor(err, newQuery, result, App.model.tagSearchResult);
  });
});

App.model.clearSearchResults = function() {
  App.model.query(null);
};
