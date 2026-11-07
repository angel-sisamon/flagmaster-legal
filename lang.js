/* Selector de idioma: ?lang=xx → anclas #…-xx → preferencia guardada → idioma del navegador → en */
(function () {
  var LANGS = ['en', 'es', 'fr', 'pt'];
  var NAV = {
    en: { privacy: 'Privacy', support: 'Support' },
    es: { privacy: 'Privacidad', support: 'Soporte' },
    fr: { privacy: 'Confidentialité', support: 'Assistance' },
    pt: { privacy: 'Privacidade', support: 'Suporte' }
  };
  function pick() {
    var q = (location.search.match(/[?&]lang=([a-z]{2})/) || [])[1];
    if (LANGS.indexOf(q) !== -1) return q;
    var h = (location.hash.match(/-([a-z]{2})$/) || [])[1];
    if (LANGS.indexOf(h) !== -1) return h;
    try { var s = localStorage.getItem('fm-legal-lang'); if (LANGS.indexOf(s) !== -1) return s; } catch (e) {}
    var langs = navigator.languages || [navigator.language || 'en'];
    for (var i = 0; i < langs.length; i++) {
      var l = String(langs[i]).slice(0, 2).toLowerCase();
      if (LANGS.indexOf(l) !== -1) return l;
    }
    return 'en';
  }
  function apply(lang, save) {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-lang-content]').forEach(function (el) {
      el.hidden = el.getAttribute('data-lang-content') !== lang;
    });
    document.querySelectorAll('.langs button').forEach(function (b) {
      b.setAttribute('aria-selected', b.getAttribute('data-lang') === lang ? 'true' : 'false');
    });
    document.querySelectorAll('[data-i18n-nav]').forEach(function (a) {
      a.textContent = NAV[lang][a.getAttribute('data-i18n-nav')];
    });
    if (save) { try { localStorage.setItem('fm-legal-lang', lang); } catch (e) {} }
  }
  document.querySelectorAll('.langs button').forEach(function (b) {
    b.addEventListener('click', function () { apply(b.getAttribute('data-lang'), true); });
  });
  apply(pick(), false);
  if (location.hash) {
    var t = document.getElementById(location.hash.slice(1));
    if (t) t.scrollIntoView();
  }
})();
