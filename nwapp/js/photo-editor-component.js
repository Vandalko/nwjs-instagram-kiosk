var winston = require('winston');

function PhotoEditorModel(params, componentInfo) {
    this.current = ko.observable({});
    this.variants = ko.observableArray();
    this.inTheCart = undefined;
    this.editCaption = ko.observableArray(false);

    this.buttonDate = ko.observable("./img/ico_date.png");
    this.buttonLocation = ko.observable("./img/ico_location.png");
    this.buttonComments = ko.observable("./img/ico_comments.png");
    this.buttonPeople = ko.observable("./img/ico_people.png");
    this.buttonResize = ko.observable("./img/ico_resize.png");


    var self = this;
    var modal = $('#photo-editor-modal');
    this.element = modal;

    this.currentSubscription = this.current.subscribe(function() {
      App.model.spawnSession();

      var variant = self.current();
      var data = self;

      if (isNaN(variant.rotation)) {
        modal.find('#editor-media').velocity("stop");
      } else {
        modal.find('#editor-media').velocity({
          properties: { rotateZ: variant.rotation + 'deg' },
          options: { duration: 500 }
        });
      }

      if (variant.showDate) {
        data.buttonDate("./img/ico_date_active.png");
      } else {
        data.buttonDate("./img/ico_date.png");
      }
      if (variant.showLocation) {
        data.buttonLocation("./img/ico_location_active.png");
      } else {
        data.buttonLocation("./img/ico_location.png");
      }
      if (variant.showComments) {
        data.buttonComments("./img/ico_comments_active.png");
      } else {
        data.buttonComments("./img/ico_comments.png");
      }
      if (variant.showPeople) {
        data.buttonPeople("./img/ico_people_active.png");
      } else {
        data.buttonPeople("./img/ico_people.png");
      }
      if (variant.resize) {
        data.buttonResize("./img/ico_resize_active.png");
      } else {
        data.buttonResize("./img/ico_resize.png");
      }

      if (self.kb) {
        self.kb.destroy();
        delete self.kb;
      }

      modal.find('textarea.photo-editor-text').blur();

      setTimeout(function() {
        modal.find('div.photo-editor-text').trigger('update.dot');
      }, 100);
    });

    this.caption = ko.pureComputed({
      read: function () {
        return this.current().caption;
      },
      write: function (value) {
        this.current().caption = value;
      },
      owner: this
    });

    this.initModal = function() {
      
      var id = modal.data('cart');
      var inTheCart = App.model.cart()[id];
      self.inTheCart = inTheCart;

      modal.find('#editor-media').velocity({
        properties: { rotateZ: '0deg' }
      });
      modal.find('#editor-media').velocity("finish");

      modal.find('div.photo-editor-text').dotdotdot({wrap: 'letter', watch: true});

      modal.addClass('photo-editor-modal');

      self.variants(_.clone(inTheCart.variants));
      self.current(inTheCart.variants[inTheCart.currentVariant]);
    };
    this.clearModal = function() {
      console.log('Clear modal');

      var modal = $(this);

      modal.removeClass('photo-editor-modal');

      modal.find('#editor-media').velocity("finish");

      modal.find('div.photo-editor-text').trigger('destroy.dot');

      self.current({});
      self.variants.removeAll();
      self.inTheCart = undefined;
    }
    this.element.on('show.bs.modal', this.initModal);
    this.element.on('hidden.bs.modal', this.clearModal);

    this.close = function(data, event) {
      modal.modal('hide');
    };
    this.left = function(data, event) {
      var content = modal.find('.photo-editor-modal-content');
      content.velocity("finish", true);
      content
      .velocity({opacity: 0.5})
      .velocity(
        {
          opacity: 1
        }, {
          complete: function() {
            if (!self.inTheCart) {
              winston.info('inTheCart disposed');
              return;
            }

            var next = self.inTheCart.currentVariant - 1;
            if (next < 0) {
              var cart = App.model.cart();
              var leftMost = self.inTheCart;
              var rightMost = self.inTheCart;
              for (var key in cart) {
                var current = cart[key];
                if (current && current.count > 0) {
                  if ((leftMost == self.inTheCart || current.index > leftMost.index)
                    && current.index < self.inTheCart.index) {
                    leftMost = current;
                  }
                  if (current.index > rightMost.index) {
                    rightMost = current;
                  }
                }
              }
              if (leftMost == self.inTheCart && leftMost != rightMost) {
                leftMost = rightMost;
              }
              if (leftMost != self.inTheCart) {
                self.inTheCart = leftMost;
                self.variants(_.clone(self.inTheCart.variants));
                self.inTheCart.currentVariant = self.inTheCart.variants.length - 1;
                self.current(self.inTheCart.variants[self.inTheCart.currentVariant]);
              }
            } else {
              self.inTheCart.currentVariant = next;
              self.current(self.variants()[next]);
            }
          }
        }
        );
    };
    this.right = function(data, event) {
      var content = modal.find('.photo-editor-modal-content');
      content.velocity("finish", true);
      content
      .velocity({opacity: 0.5})
      .velocity(
        {
          opacity: 1
        }, {
          complete: function() {
            if (!self.inTheCart) {
              winston.info('inTheCart disposed');
              return;
            }

            var next = self.inTheCart.currentVariant + 1;
            if (next >= self.variants().length) {
              var cart = App.model.cart();
              var leftMost = self.inTheCart;
              var rightMost = self.inTheCart;
              for (var key in cart) {
                var current = cart[key];
                if (current && current.count > 0) {
                  if (current.index < leftMost.index) {
                    leftMost = current;
                  }
                  if ((rightMost == self.inTheCart || current.index < rightMost.index)
                    && current.index > self.inTheCart.index) {
                    rightMost = current;
                  }
                }
              }
              if (rightMost == self.inTheCart && leftMost != rightMost) {
                rightMost = leftMost;
              }
              if (rightMost != self.inTheCart) {
                self.inTheCart = rightMost;
                self.variants(_.clone(self.inTheCart.variants));
                self.inTheCart.currentVariant = 0;
                self.current(self.inTheCart.variants[0]);
              }
            } else {
              self.inTheCart.currentVariant = next;
              self.current(self.variants()[next]);
            }
          }
        }
        );
    };
}

PhotoEditorModel.prototype.dispose = function() {
  this.currentSubscription.dispose();
  this.element.off('show.bs.modal', this.initModal);
  this.element.off('hidden.bs.modal', this.clearModal);
}
 
PhotoEditorModel.prototype.toggleDate = function(data, event) {
  var variant = data.current();
  if (variant.time) {
    variant.resize = false;
    variant.showDate = !variant.showDate;
    data.current(variant);
  }
};

PhotoEditorModel.prototype.toggleLocation = function(data, event) {
  var variant = data.current();
  if (variant.location) {
    variant.resize = false;
    variant.showLocation = !variant.showLocation;
    data.current(variant);
  }
};

PhotoEditorModel.prototype.toggleComments = function(data, event) {
  var variant = data.current();
  variant.resize = false;
  variant.showComments = !variant.showComments;
  data.current(variant);
};

PhotoEditorModel.prototype.togglePeople = function(data, event) {
  var variant = data.current();
  if (variant.user) {
    variant.resize = false;
    variant.showPeople = !variant.showPeople;
    data.current(variant);
  }
};

PhotoEditorModel.prototype.toggleResize = function(data, event) {
  var variant = data.current();
  if (!variant.resize) {
    variant.showPeople = false;
    variant.showLocation = false;
    variant.showDate = false;
    variant.showComments = false;
  }
  variant.resize = !variant.resize;
  data.current(variant);
};

PhotoEditorModel.prototype.rotateRight = function(data, event) {
  var variant = data.current();
  variant.rotation = (variant.rotation + 90);// % 360;
  data.current(variant);
};

PhotoEditorModel.prototype.rotateLeft = function(data, event) {
  var variant = data.current();
  variant.rotation = (variant.rotation - 90);// % 360;
  data.current(variant);
};

PhotoEditorModel.prototype.captionBlur = function(data, event) {
  data.editCaption(false);
  data.element.find('div.photo-editor-text').html(data.current().caption).trigger('update.dot');

  if (data.kb) {
    data.kb.destroy();
    delete data.kb;
  }

  App.model.spawnSession();
};

PhotoEditorModel.prototype.captionFocus = function(data, event) {
  data.editCaption(true);

  var editor = data.element.find('textarea.photo-editor-text');
  editor.focus();
  editor.scrollTop(0);

  if (data.kb) {
    data.kb.destroy();
    delete data.kb;
  }
  data.kb = App.editorKeyboard(editor);

  App.model.spawnSession();
};



ko.components.register('photo-editor', {
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
            return new PhotoEditorModel(params, componentInfo);
        }
    },
    template: { element: 'photo-editor-template' }
});

