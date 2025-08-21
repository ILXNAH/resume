/* Enable Bootstrap tooltips if present */
$(function () {
  if ($.fn && $.fn.tooltip) {
    // Support both Bootstrap 4 (data-toggle) and 5 (data-bs-toggle) attributes
    var $els = $('[data-toggle="tooltip"], [data-bs-toggle="tooltip"]');
    if ($els.length) $els.tooltip();
  }
});
