var ultimateList = {};

ultimateList.initHtmlChangeEvent = function() {
  var htmlFn = $.fn.html;
  $.fn.html = function() {
    htmlFn.apply(this, arguments);
    $(this).trigger('html-changed');
  };
};

ultimateList.clickPostInit = function() {
  $('.clickPost').live('click', function() {
    var url = $(this).attr('data-url'),
        form = $(this).attr('data-form'),
        resultsTag = $(this).attr('data-results-tag');
    $.post(url, $('#' + form).serialize(), function(data, status) {
      $('#' + resultsTag).html(data);
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

ultimateList.registerEventListeners = function() {
  $('[data-on-event]').each(function() {
    var eventType = $(this).attr('data-on-event'),
        actionName = $(this).attr('data-action');
    $(this).bind(eventType, function() {
      ultimateList[actionName]();
    });
  });
};

$(document).ready(function() {
  ultimateList.initHtmlChangeEvent();
  ultimateList.clickPostInit();
  ultimateList.enterClickInit();
  ultimateList.registerEventListeners();
});
