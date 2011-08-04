var ultimateList = {};

ultimateList.clickPostInit = function() {
  $('.clickPost').click(function() {
    var url = $(this).attr('data-url'),
        form = $(this).attr('data-form'),
        resultsTag = $(this).attr('data-results-tag');
    $.post(url, $('#' + form).serialize(), function(data, status) {
      $('#' + resultsTag).html(data);
      ultimateList.clickPostInit();
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
  ultimateList.clickPostInit();
  ultimateList.enterClickInit();
});
