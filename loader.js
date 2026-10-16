/* =========================================================
   Ixra portfolio - loader.js
   Yükleme ekranı: logo, avatar GIF, arka plan görseli, fontlar ve
   ilk ekranda görünen resimler hazır olunca perdeyi kaldırır.
   ========================================================= */
(function () {
    'use strict';

    var root = document.documentElement;
    var loader = document.getElementById('site-loader');
    if (!loader) { root.classList.remove('is-loading'); return; }

    var bar = loader.querySelector('.loader-bar-fill');
    var pct = loader.querySelector('.loader-percent');

    var HOLD_AFTER_100 = 2000; // ms - %100 olduktan sonra perdenin açık kalma süresi
    var MAX_WAIT = 8000;     // ms - yavaş/bozuk bağlantıda yüklemeyi zorla bitir
    var startedAt = Date.now();
    var total = 0, done = 0, finished = false, completing = false;

    function paint() {
        var p = total ? Math.round((done / total) * 100) : 100;
        if (bar) bar.style.width = p + '%';
        if (pct) pct.textContent = p + '%';
    }

    function hide() {
        if (finished) return;
        finished = true;
        if (bar) bar.style.width = '100%';
        if (pct) pct.textContent = '100%';
        loader.classList.add('is-done');
        root.classList.remove('is-loading');
        setTimeout(function () {
            if (loader.parentNode) loader.parentNode.removeChild(loader);
        }, 600);
    }

    // %100'e ulaşınca 2 saniye bekleyip perdeyi kaldırır
    function complete() {
        if (completing) return;
        completing = true;
        if (bar) bar.style.width = '100%';
        if (pct) pct.textContent = '100%';
        setTimeout(hide, HOLD_AFTER_100);
    }

    function maybeHide() {
        if (done >= total) complete();
    }

    function track(promise) {
        total++;
        var once = false;
        function tick() {
            if (once) return;
            once = true;
            done++;
            paint();
            maybeHide();
        }
        promise.then(tick, tick);   // hata olsa da bekleme (resim kırıksa sayfayı kilitleme)
    }

    function loadImage(src) {
        return new Promise(function (resolve) {
            var img = new Image();
            img.onload = img.onerror = function () { resolve(); };
            img.src = src;
            if (img.complete) resolve();
        });
    }

    function trackElementImage(img) {
        if (img.complete && img.naturalWidth > 0) return;
        track(new Promise(function (resolve) {
            img.addEventListener('load', resolve, { once: true });
            img.addEventListener('error', resolve, { once: true });
        }));
    }

    function inViewport(el) {
        var r = el.getBoundingClientRect();
        return r.top < (window.innerHeight || 800) * 1.2 && r.bottom > 0;
    }

    function init() {
        // 1) CSS'teki arka plan görseli (img etiketi olmadığı için elle)
        track(loadImage('assets/sculks-showcase/04-sculk-golem.webp'));

        // 2) Sayfadaki resimler/GIF'ler (lazy olanlardan sadece ilk ekrandakiler)
        var imgs = document.querySelectorAll('img');
        for (var i = 0; i < imgs.length; i++) {
            var img = imgs[i];
            if (loader.contains(img)) continue;
            if (img.loading === 'lazy' && !inViewport(img)) continue;
            trackElementImage(img);
        }

        // 3) Fontlar
        if (document.fonts && document.fonts.ready) track(document.fonts.ready);

        // Takip edilecek bir şey yoksa
        if (total === 0) complete(); else { paint(); maybeHide(); }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Güvenlik ağı: ne olursa olsun MAX_WAIT sonunda perdeyi kaldır
    setTimeout(complete, MAX_WAIT);
})();
