var ultimateList = {};

ultimateList.initHtmlChangeEvent = function() {
  var htmlFn = $.fn.html;
  $.fn.html = function() {
    htmlFn.apply(this, arguments);
    $(this).trigger('html-changed');
  };
};

ultimateList.clickPostInit = function() {
  $('.clickPost').click(function() {
    var url = $(this).attr('data-url'),
        form = $(this).attr('data-form'),
        resultsTag = $(this).attr('data-results-tag');
    $.post(url, $('#' + form).serialize(), function(data, status) {
      $('#' + resultsTag).html(data);
    });
  });
};

ultimateList.enterClickInit = function() {
  $('.enterClick').keypress(function(event) {
    if ( event.which == 13 ) {
      event.preventDefault();
      $('#' + $(this).attr('data-button')).click();
    }
  });
};

$(document).ready(function() {
  ultimateList.initHtmlChangeEvent();
  ultimateList.clickPostInit();
  ultimateList.enterClickInit();

  $('#products').bind('html-changed', function() {
    ultimateList.clickPostInit();
  });


});
