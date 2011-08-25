var ultimateList = {};

$.fn.clearForm = function() {
  return this.each(function() {
    var type = this.type, tag = this.tagName.toLowerCase();
    if (tag == 'form') {
      return $(':input',this).clearForm();
    }
    if (type == 'text' || type == 'password' || tag == 'textarea') {
      this.value = '';
    }
    else if (type == 'checkbox' || type == 'radio') {
      this.checked = false;
    }
    else if (tag == 'select') {
      this.selectedIndex = -1;
    }
  });
};

ultimateList.initHtmlChangeEvent = function() {
  var htmlFn = $.fn.html, returnValue;
  $.fn.html = function() {
    returnValue = htmlFn.apply(this, arguments);
    $(this).trigger('html-changed');
    return returnValue;
  };
};

ultimateList.clickPostInit = function() {
  $('.clickPost').live('click', function() {
    var url = $(this).attr('data-url'),
        form = $(this).attr('data-form'),
        resultsTag = $(this).attr('data-results-tag'),
        resultsFunc = $(this).attr('data-results-func');
    $.post(url, $('#' + form).serialize(), function(data, status) {
      if (resultsTag) {
        $('#' + resultsTag).html(data);
      }
      if (resultsFunc) {
        ultimateList[resultsFunc](JSON.parse(data));
      }
      $('#' + form).clearForm();
    });
  });
};

ultimateList.enterClickInit = function() {
  $('.enterClick').live('keypress', function(event) {
    if ( event.which == 13 ) {
      event.preventDefault();
      $('#' + $(this).attr('data-button')).click();
    }
  });
};

ultimateList.removeProduct = function(product) {
  $('#' + product._id).remove();
};

ultimateList.addProduct = function(product) {
  // clone product-template
  var template = $('#product-template').clone(), formId;
  // fill product-template
  $('#product-name', template).html(product.name);
  $('[name="product[name]"]', template).val(product.name);
  $('[name="product[_id]"]', template).val(product._id);
  // change product-template id 
  template.attr('id', product._id);
  formId = $('form', template).attr('id') + product._id;
  $('form', template).attr('id', formId);
  $('.clickPost', template).attr('data-form', formId);
  // add product to products div
  $('#products').append(template);
  template.show();
  // hide no-products notification
  $('#no-products').hide();
};

ultimateList.registerEventListeners = function() {
  $('[data-on-event]').each(function() {
    var eventType = $(this).attr('data-on-event'),
        actionName = $(this).attr('data-action');
    $(this).bind(eventType, function() {
      ultimateList[actionName]();
    });
  });
};

ultimateList.debug = function(msg) {
  $('#debug').append(msg).append('<br/>');
};

$(document).ready(function() {
  ultimateList.initHtmlChangeEvent();
  ultimateList.clickPostInit();
  ultimateList.enterClickInit();
  ultimateList.registerEventListeners();
});
