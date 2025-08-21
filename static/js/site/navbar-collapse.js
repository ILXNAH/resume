/* Collapse mobile navbar after clicking a link */
$(function () {
  $('.navbar-collapse .nav-link').on('click', function () {
    $('.navbar-collapse').collapse('hide');
  });
});
