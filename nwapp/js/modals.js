var modals = {};

var currentModal = undefined;


function modalShown(event) {
  currentModal = this;
  $(this).off('shown.bs.modal', modalShown);

  App.model.spawnSession();
}
function modalHidden(event) {
  if (currentModal == this) {
    currentModal = undefined;
  }
  $(this).off('hidden.bs.modal', modalHidden);

  App.model.spawnSession();
}

function showModal(modal) {
  if (currentModal) {
    $(currentModal).modal('hide');
  }

  modal.on('shown.bs.modal', modalShown);
  modal.on('hidden.bs.modal', modalHidden);
  
  modal.modal('show');
}


modals.oups = {
    profileAccessError: function() {
      var modal = $('#oups-modal');
      modal.data('title', 'Ой!');
      modal.data('message', 'Ваш профіль <br>повинен бути<br> <b>відкритим</b> для<br> подальшої роботи');
      modal.data('subtext', 'Буд ласка, відкрийте його,<br>щоб надрукувати фото,<br/>і можете одразу закрити ;)')
      showModal(modal);
    },
    photosGenericError: function() {
      var modal = $('#oups-modal');
      modal.data('title', 'Ой!');
      modal.data('message', 'Сталася непередбачувана помилка');
      showModal(modal);
    },
    sessionTimeOutError: function() {
      var timeout = setTimeout(function() {
        App.model.goHome();
      }, 1 * 60 * 1000);

      var modal = $('#oups-modal');
      modal.data('title', 'Ви тут?');
      modal.data('message', 'Натисніть так,<br/>щоб продовжити<br/>друк');
      modal.data('button', 'yesHere');
      modal.data('timeout', timeout)
      showModal(modal);
    }
};

modals.info = function() {
  showModal($('#info-modal'));
};

modals.cart = {
  edit: function(id) {
    var modal = $('#photo-editor-modal');
    modal.data('cart', id);
    showModal(modal);
  },
  list: function() {
    showModal($('#photo-cart-modal'));
  }
};

App.modals = modals;
