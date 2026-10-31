/* Taalschakelaar EN/NL. Zonder JS blijft de site Engels. */
(function () {
  var KEY = 'stealr-lang';
  var root = document.documentElement;

  function set(lang) {
    lang = lang === 'nl' ? 'nl' : 'en';
    root.lang = lang;
    root.classList.toggle('nl', lang === 'nl');
    try { localStorage.setItem(KEY, lang); } catch (e) { /* privémodus */ }
    var buttons = document.querySelectorAll('[data-lang]');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute('aria-pressed', buttons[i].getAttribute('data-lang') === lang ? 'true' : 'false');
    }
  }

  var fromUrl = null;
  try { fromUrl = new URLSearchParams(location.search).get('lang'); } catch (e) {}
  var stored = null;
  try { stored = localStorage.getItem(KEY); } catch (e) {}
  var browser = ((navigator.language || '').slice(0, 2) === 'nl') ? 'nl' : 'en';
  var initial = fromUrl || stored || browser;
  set(initial); /* vóór de eerste render, tegen flikkeren */
  document.addEventListener('DOMContentLoaded', function () {
    set(root.lang); /* knoppen bijwerken */
    /* Anker (bv. #delete-account uit de stores) opnieuw aanspringen:
       de taalkeuze kan de volgorde van de blokken veranderd hebben. */
    if (location.hash) {
      var target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      var jump = function () { if (target) target.scrollIntoView(); };
      jump();
      window.addEventListener('load', jump); /* nog eens als fonts de hoogte veranderd hebben */
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(jump);
    }
  });

  document.addEventListener('click', function (ev) {
    var b = ev.target.closest ? ev.target.closest('[data-lang]') : null;
    if (b) set(b.getAttribute('data-lang'));
  });
})();
