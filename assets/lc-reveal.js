/* LC Starter - scroll reveal.
   Sectionlar gorus sahesine girende yumsaq sekilde acilir.
   Qeyd: transform position:fixed ucun yeni containing block yaradir,
   ona gore animasiya bitdikden sonra siniflar tamam silinir ve
   icinde fixed element olan bolmelere umumiyyetle toxunulmur. */
(function () {
  var html = document.documentElement;
  if (!html.classList.contains('lc-reveal-on')) return;
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Icinde sabit (fixed) element olan bolmeler animasiya olunmur
  var SKIP = '[id^="lc-sticky-"], cart-drawer-component, [data-lc-no-reveal]';

  // Bolme ekranin bu qederini dolduranda animasiya baslayir (boyuk = gec)
  var trigger = parseInt(html.getAttribute('data-lc-rev-trigger'), 10);
  if (isNaN(trigger) || trigger < 0 || trigger > 45) trigger = 18;

  function done(el) {
    el.classList.remove('lc-rev', 'lc-in');
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var el = en.target;
      io.unobserve(el);
      el.classList.add('lc-in');
      var t = setTimeout(function () { done(el); }, 2600);
      el.addEventListener('transitionend', function h(ev) {
        if (ev.propertyName !== 'transform') return;
        clearTimeout(t);
        el.removeEventListener('transitionend', h);
        done(el);
      });
    });
  }, { rootMargin: '0px 0px -' + trigger + '% 0px', threshold: 0.02 });

  function prep(scope, skipFirst) {
    var list = (scope || document).querySelectorAll('main .shopify-section');
    for (var i = 0; i < list.length; i++) {
      var el = list[i];
      if (el.hasAttribute('data-lc-rev')) continue;
      el.setAttribute('data-lc-rev', '');
      if (skipFirst && i === 0) continue;      // ilk ekran olduğu kimi qalsın
      if (el.querySelector(SKIP)) continue;
      el.classList.add('lc-rev');
      io.observe(el);
    }
  }

  prep(null, true);

  document.addEventListener('shopify:section:load', function (e) {
    var sec = e.target.closest ? e.target.closest('.shopify-section') : null;
    if (sec) sec.removeAttribute('data-lc-rev');
    prep(document, false);
  });
})();
