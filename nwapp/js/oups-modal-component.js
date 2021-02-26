function OupsModel(params, componentInfo) {
    var self = this;
    var modal = $('#oups-modal');
    this.element = modal;
    this.title = ko.observable();
    this.message = ko.observable();
    this.subtext = ko.observable();
    this.showButton = ko.observable(false);
    this.buttonFunc = undefined;

    this.initModal = function() {
        self.title(modal.data('title'));
        self.message(modal.data('message'));
        self.subtext(modal.data('subtext'));
        self.buttonFunc = modal.data('button');
        self.showButton(self.buttonFunc && _.has(App.model, self.buttonFunc))

        modal.addClass('oups-modal');
    };
    this.clearModal = function() {
        modal.removeClass('oups-modal');
        clearTimeout(modal.data('timeout'));
    }
    this.element.on('show.bs.modal', this.initModal);
    this.element.on('hidden.bs.modal', this.clearModal);
}

OupsModel.prototype.dispose = function() {
  this.element.off('show.bs.modal', this.initModal);
  this.element.off('hidden.bs.modal', this.clearModal);
};

OupsModel.prototype.close = function(data, event) {
    data.element.modal('hide');
};

OupsModel.prototype.yes = function(data, event) {
    if (data.buttonFunc) {
        App.model[data.buttonFunc]();
    }
    data.element.modal('hide');
};


ko.components.register('oups-modal', {
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
            return new OupsModel(params, componentInfo);
        }
    },
    template: { element: 'oups-template' }
});
