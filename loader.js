/* =========================================================
   Ixra portfolio - loader.js
   Sayfadaki TÜM resim/GIF/logolar (sonradan eklenenler dahil), proje
   kartları, arka plan görseli ve fontlar yüklenene kadar perdeyi tutar.
   %100 olunca HOLD_AFTER_100 kadar daha bekler, sonra kapanır.
   ========================================================= */
(function () {
    'use strict';

    var root = document.documentElement;
    var loader = document.getElementById('site-loader');
    if (!loader) { root.classList.remove('is-loading'); return; }

    var bar = loader.querySelector('.loader-bar-fill');
    var pct = loader.querySelector('.loader-percent');

    var HOLD_AFTER_100 = 2000;  // ms - %100 olduktan sonra perdenin açık kalma süresi
    var STABLE_FOR = 400;       // ms - hiçbir şey beklemiyorsa bu süre boyunca sabit kalmalı
    var MAX_WAIT = 12000;       // ms - takılırsa yüklemeyi zorla bitir
    var BG_URL = 'assets/sculks-showcase/04-sculk-golem.webp';

    var bgDone = false, fontsDone = false;
    var lastPercent = 0, readySince = 0, completing = false, hidden = false;

    function setPercent(p) {
        if (p < lastPercent) p = lastPercent;      // geri gitmesin
        lastPercent = p;
        if (bar) bar.style.width = p + '%';
        if (pct) pct.textContent = p + '%';
    }

    function hide() {
        if (hidden) return;
        hidden = true;
        loader.classList.add('is-done');
        root.classList.remove('is-loading');
        setTimeout(function () {
            if (loader.parentNode) loader.parentNode.removeChild(loader);
        }, 600);
    }

    function complete() {
        if (completing) return;
        completing = true;
        clearInterval(timer);
        setPercent(100);
        setTimeout(hide, HOLD_AFTER_100);
    }

    // Arka plan görseli (CSS'te olduğu için elle)
    var bg = new Image();
    bg.onload = bg.onerror = function () { bgDone = true; };
    bg.src = BG_URL;
    if (bg.complete) bgDone = true;

    // Fontlar
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function () { fontsDone = true; }, function () { fontsDone = true; });
    } else {
        fontsDone = true;
    }

    function check() {
        // Tüm resimler: lazy olanları da hemen yüklemeye zorla (gizli sekmedekiler dahil)
        var imgs = document.querySelectorAll('img');
        var seen = 0, loaded = 0;
        for (var i = 0; i < imgs.length; i++) {
            var img = imgs[i];
            if (loader.contains(img)) continue;
            if (img.loading === 'lazy') img.loading = 'eager';
            if (!img.getAttribute('src')) continue;      // src'si henüz atanmamış
            seen++;
            if (img.complete) loaded++;                  // hata verenler de "bitti" sayılır
        }

        // Proje kartları gelmiş mi? (iskelet kutular gidip kartlar veya hata mesajı gelmeli)
        var box = document.getElementById('projects-container');
        var cardsDone = !box || (!box.querySelector('.project-skeleton') &&
            (box.querySelector('.project-item') || box.querySelector('.load-error')));

        // İlerleme: resimler + arka plan + font + kartlar
        var total = seen + 3;
        var done = loaded + (bgDone ? 1 : 0) + (fontsDone ? 1 : 0) + (cardsDone ? 1 : 0);
        var p = Math.floor((done / total) * 100);

        var ready = bgDone && fontsDone && cardsDone && loaded === seen;
        if (ready) {
            if (!readySince) readySince = Date.now();
            // Bir an sakin kalsın ki sonradan eklenen resimler de yakalansın
            if (Date.now() - readySince >= STABLE_FOR) { complete(); return; }
            p = Math.min(p, 99);
        } else {
            readySince = 0;
            p = Math.min(p, 99);
        }
        setPercent(p);
    }

    var timer = setInterval(check, 100);
    check();

    // Güvenlik ağı
    setTimeout(complete, MAX_WAIT);
})();
