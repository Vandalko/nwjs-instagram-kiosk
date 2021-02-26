function InfoModel(params, componentInfo) {
    var modal = $('#info-modal');
    this.element = modal;

    this.initModal = function() {
      modal.addClass('info-modal');
    };
    this.clearModal = function() {
      modal.removeClass('info-modal');
    }
    this.element.on('show.bs.modal', this.initModal);
    this.element.on('hidden.bs.modal', this.clearModal);
}

InfoModel.prototype.dispose = function() {
  this.element.off('show.bs.modal', this.initModal);
  this.element.off('hidden.bs.modal', this.clearModal);
};

InfoModel.prototype.close = function(data, event) {
  data.element.modal('hide');
};


ko.components.register('info-modal', {
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
            return new InfoModel(params, componentInfo);
        }
    },
    template: { element: 'info-template' }
});


