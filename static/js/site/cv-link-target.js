(function () {
  // Desktop when navbar is expanded (Bootstrap lg breakpoint = 992px)
  var m = matchMedia('(min-width: 992px)');
  var links = document.querySelectorAll('.js-cv-link'); // NodeList
  if (!links.length) return;

  function apply() {
    links.forEach(function (a) {
      if (m.matches) { a.target = '_blank'; a.rel = 'noopener'; }
      else { a.removeAttribute('target'); a.removeAttribute('rel'); }
    });
  }

  apply();
  (m.addEventListener ? m.addEventListener('change', apply) : m.addListener(apply));
})();
