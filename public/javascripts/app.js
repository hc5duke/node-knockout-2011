var ultimateList = {};

var initRemove = function() {
  $('.remove-product').click(function() {
    var id = $(this).attr('data-id'),
        data = $('#remove-product-form-' + id).serialize();
    $.post('/list/remove', data, function(data, status) {
      $('#products').html(data);
      initRemove();
    });
  });
};

$(document).ready(function() {

  $('.enterSubmit').keypress(function(event) {
    if ( event.which == 13 ) {
      event.preventDefault();
      $('#add-product').click();
    }
  });

  $('#add-product').click(function() {
    $.post('/list/add', $('#add-product-form').serialize(), function(data, status) {
      $('#products').html(data);
      initRemove();
    });
  });

  initRemove();

});
