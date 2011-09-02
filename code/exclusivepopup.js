type("ExclusivePopup", ["Printable"], {
  open: function() {
    this.draw();
    this.canvas.dialog('open');
  },

  draw: function(content, customStyle, popupStyle) {
    customStyle = customStyle || {};
    if(!content) {
      content = '';
    }
    else if(content.dom) {
      // support indico XElement objects
      content = content.dom;
    }

    if(popupStyle === undefined) {
      popupStyle = customStyle;
    }
    var container = $('<div class="exclusivePopup"/>')
    container.css(popupStyle).append(content);

    this.showCloseButton = !!this.title; // show if there is a title
    this._makeCanvas();
    this.canvas.empty().css(customStyle).append(container);
    this.dialogElement.css(customStyle);
  },

  close: function() {
    if(this.isopen) {
      this.canvas.dialog('close');
    }
  },

  _getDialogOptions: function() {
    // Override to set additional dialog options
    return {};
  },

  _makeCanvas: function() {
    if(!this.canvas) {
      var opts = $.extend(true, {
        autoOpen: false,
        draggable: true,
        modal: true,
        resizable: false,
        closeOnEscape: true,
        title: this.title,
        minWidth: '250px',
        minHeight: 0,
        open: $.proxy(this._onOpen, this),
        close: $.proxy(this._onClose, this),
        beforeClose: $.proxy(this._onBeforeClose, this)
      }, this._getDialogOptions());
      this.canvas = $('<div/>').dialog(opts);
    }
    if(!this.dialogElement) {
      this.dialogElement = this.canvas.dialog('widget');
    }
    this.buttons = this.dialogElement.find('.ui-dialog-buttonset button');
  },

  _onBeforeClose: function(e) {
    // Close button clicked
    if(e.originalEvent && $(e.originalEvent.currentTarget)
       .hasClass('ui-dialog-titlebar-close')) {
      if(isFunction(this.closeHandler) && !this.closeHandler()) {
        return false;
      }
    }
    // Escape key
    else if(e.keyCode && e.keyCode === $.ui.keyCode.ESCAPE) {
      e.stopPropagation(); // otherwise this triggers twice for some reason
      if(this.closeHandler === null || !this.showCloseButton) {
        // Ignore escape if we don't have a close button
        return false;
      }
      if(isFunction(this.closeHandler) && !this.closeHandler()) {
        return false;
      }
    }
  },

  _onOpen: function(e) {
    this.isopen = true;
    if(this.closeHandler === null || !this.showCloseButton) {
      this.dialogElement.find('.ui-dialog-titlebar-close')
        .hide();
      if(!this.title) {
        this.dialogElement.find('.ui-dialog-titlebar')
          .hide();
      }
    }

    if(this.postDraw() === true) {
      // refresh position
      var pos = this.canvas.dialog('option', 'position');
      this.canvas.dialog('option', 'position', pos);
    }
  },

  postDraw: function() {
    // Override if you need to do something after displaying the dialog
  },

  _onClose: function(e, ui) {
    this.isopen = false;
    this.canvas.dialog('destroy');
    this.canvas.remove();
    this.canvas = this.dialogElement = null;
    this.buttons = $();
  }

}, function(title, closeButtonHandler, printable, showPrintButton, noCanvas) {
  this.title = any(title, null);

  // Called when user clicks the close button, if the function
  // returns true the dialog will be closed.
  this.closeHandler = any(closeButtonHandler, positive);
  // the close button will be enabled in draw() so if that method is overridden it will not be drawn
  this.showCloseButton = false;

  // The maximum allowed height, used since it doesn't look
  // very nice it the dialog gets too big.
  this.maxHeight = 600;

  // Decides whether the popup should be printable. That is, when the user
  // clicks print only the content of the dialog will be printed not the
  // whole page. Should be true in general unless the dialog is containing
  // something users normally don't want to print, i.e. the loading dialog.
  this.printable = any(printable, true);

  // Whether to show the print button or not in the title
  // Note: the button will only be shown if the popup dialog has a title.
  // and is printable.
  this.showPrintButton = any(showPrintButton && title && printable, false);

  this.buttons = $();
  if(!noCanvas) {
    this._makeCanvas();
  }
});
