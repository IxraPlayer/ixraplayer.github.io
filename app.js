/* =========================================================
   Ixra portfolio - app.js
   Bağımlılık yok. index.html içinde <script src="app.js" defer>
   ========================================================= */
(() => {
    'use strict';

    /* ---------- Ayarlar ---------- */
    const CONFIG = {
        githubUser: 'IxraPlayer',
        modrinthUser: 'Ixra',
        cfFollowers: 0,                 // CurseForge takipçi sayını buradan elle güncelle (0 = gizle)
        cacheTtl: 6 * 60 * 60 * 1000,   // 6 saat
        defaultTab: 'projects'
    };

    const ICON_PLACEHOLDER =
        "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 76 76'>" +
        "<rect width='76' height='76' fill='%230f1620'/>" +
        "<path d='M38 16l18 10v24L38 60 20 50V26z' fill='none' stroke='%235db8d4' stroke-width='3' stroke-linejoin='round'/>" +
        "<path d='M20 26l18 10 18-10M38 36v24' fill='none' stroke='%235db8d4' stroke-width='3' stroke-linejoin='round'/></svg>";

    /* ---------- Yardımcılar ---------- */
    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

    const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
        ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    function fmtNum(n) {
        if (n === null || n === undefined || isNaN(n)) return '?';
        if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
        if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
        return String(n);
    }

    function cacheRead(key) {
        try {
            const raw = localStorage.getItem(key);
            if (!raw) return null;
            const p = JSON.parse(raw);
            if (!p || !p.d) return null;
            return { fresh: Date.now() - p.t < CONFIG.cacheTtl, data: p.d };
        } catch { return null; }
    }
    function cacheWrite(key, data) {
        try { localStorage.setItem(key, JSON.stringify({ t: Date.now(), d: data })); } catch { /* dolu / kapalı */ }
    }

    /* =========================================================
       SEKMELER  (#projects, #links, #about ile doğrudan link)
       ========================================================= */
    const tabBtns = $$('.tab-btn');
    const panes = Object.fromEntries($$('.tab-pane').map((p) => [p.id, p]));

    function loadIframesIn(pane) {
        if (!pane) return;
        $$('iframe[data-src]', pane).forEach((f) => {
            if (!f.getAttribute('src')) f.src = f.dataset.src;
        });
    }

    function switchTab(tabId, updateHash = true) {
        if (!panes[tabId]) tabId = CONFIG.defaultTab;
        tabBtns.forEach((btn) => {
            const on = btn.dataset.tab === tabId;
            btn.classList.toggle('active', on);
            btn.setAttribute('aria-selected', on ? 'true' : 'false');
        });
        Object.entries(panes).forEach(([id, pane]) => pane.classList.toggle('active', id === tabId));
        loadIframesIn(panes[tabId]); // YouTube sadece About açılınca yüklenir
        if (updateHash) {
            try { history.replaceState(null, '', tabId === CONFIG.defaultTab ? location.pathname + location.search : '#' + tabId); } catch { /* yoksay */ }
        }
    }

    tabBtns.forEach((btn) => btn.addEventListener('click', () => switchTab(btn.dataset.tab)));
    window.addEventListener('hashchange', () => switchTab(location.hash.slice(1), false));
    switchTab(location.hash.slice(1) || CONFIG.defaultTab, false);

    /* ---------- "A bit more about me" ---------- */
    (() => {
        const tg = $('#extra-toggle');
        const c = $('#extra-content');
        if (!tg || !c) return;
        const label = () => (window.I18N ? window.I18N.t(c.hidden ? 'extra_toggle_closed' : 'extra_toggle_open') : (c.hidden ? '▸ A bit more about me…' : '▾ A bit more about me…'));
        tg.addEventListener('click', () => {
            const open = c.hidden;
            c.hidden = !open;
            tg.setAttribute('aria-expanded', String(open));
            $('span', tg).textContent = label();
        });
        if (window.I18N) window.I18N.onLanguageChange(() => { $('span', tg).textContent = label(); });
    })();

    /* =========================================================
       MODALLER
       ========================================================= */
    const openModals = [];

    function createModal(id) {
        const overlay = $('#' + id);
        const closeBtn = $('.modal-close-btn', overlay);
        const body = $('.modal-body', overlay);
        let lastFocus = null;

        const modal = {
            overlay, body, onClose: null,
            open() {
                lastFocus = document.activeElement;
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
                openModals.push(modal);
                closeBtn.focus();
            },
            close() {
                overlay.classList.remove('active');
                const i = openModals.indexOf(modal);
                if (i > -1) openModals.splice(i, 1);
                if (!openModals.length) document.body.style.overflow = '';
                if (modal.onClose) modal.onClose();
                if (lastFocus && lastFocus.focus) lastFocus.focus();
            }
        };
        closeBtn.addEventListener('click', modal.close);
        overlay.addEventListener('click', (e) => { if (e.target === overlay) modal.close(); });
        return modal;
    }

    const sculksModal = createModal('sculks-modal');
    const genericModal = createModal('generic-modal');
    const progressModal = createModal('progress-modal');

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && openModals.length) openModals[openModals.length - 1].close();
    });

    /* ---------- Sculks detay penceresi (sculks-details.html'den yüklenir) ---------- */
    let sculksHtmlPromise = null;
    function loadSculksHtml() {
        if (!sculksHtmlPromise) {
            sculksHtmlPromise = fetch('sculks-details.html')
                .then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); })
                .then((html) => html.replace(/<img /g, '<img loading="lazy" decoding="async" '))
                .catch((err) => { sculksHtmlPromise = null; throw err; });
        }
        return sculksHtmlPromise;
    }

    async function openSculksDetails() {
        const t = (key) => (window.I18N ? window.I18N.t(key) : key);
        sculksModal.body.innerHTML = `<p>${t('sculks_loading')}</p>`;
        sculksModal.open();
        try {
            const html = await loadSculksHtml();
            if (!sculksModal.overlay.classList.contains('active')) return;
            sculksModal.body.innerHTML = html;
            $$('iframe[data-src]', sculksModal.body).forEach((f) => { f.src = f.dataset.src; });
        } catch {
            sculksModal.body.innerHTML = `<p>${t('sculks_load_error')}</p>`;
        }
    }
    // Kapanınca içeriği temizle: YouTube videosu durur, bellek boşalır
    sculksModal.onClose = () => { sculksModal.body.innerHTML = ''; };

    /* ---------- Progress penceresi ---------- */
    function openProgress() {
        progressModal.open();
        $$('.progress-bar-fill', progressModal.overlay).forEach((bar) => {
            bar.style.transition = 'none';
            bar.style.width = '0%';
            void bar.offsetWidth; // reflow: animasyon her açılışta baştan başlasın
            bar.style.transition = '';
            bar.style.width = (bar.dataset.w || 0) + '%';
        });
    }

    /* =========================================================
       GITHUB İSTATİSTİKLERİ
       ========================================================= */
    (async () => {
        const KEY = 'ixra_github_stats_v2';
        const reposEl = $('#gh-repos'), starsEl = $('#gh-stars'), followersEl = $('#gh-followers');
        if (!reposEl || !starsEl || !followersEl) return;

        const show = (d) => {
            reposEl.textContent = fmtNum(d.repos);
            starsEl.textContent = fmtNum(d.stars);
            followersEl.textContent = fmtNum(d.followers);
        };

        const cached = cacheRead(KEY);
        if (cached) { show(cached.data); if (cached.fresh) return; }

        try {
            const [uRes, rRes] = await Promise.all([
                fetch(`https://api.github.com/users/${CONFIG.githubUser}`),
                fetch(`https://api.github.com/users/${CONFIG.githubUser}/repos?per_page=100&sort=updated`)
            ]);
            if (!uRes.ok || !rRes.ok) throw new Error('github');
            const u = await uRes.json();
            const r = await rRes.json();
            const stars = Array.isArray(r) ? r.reduce((s, x) => s + (x.stargazers_count || 0), 0) : 0;
            const data = { repos: u.public_repos || 0, followers: u.followers || 0, stars };
            show(data);
            cacheWrite(KEY, data);
        } catch {
            if (!cached) show({ repos: NaN, stars: NaN, followers: NaN });
        }
    })();

    /* =========================================================
       MODRINTH: tek istekle tüm projeler (paylaşımlı)
       ========================================================= */
    let mrUserPromise = null;
    function getModrinthUserProjects() {
        if (!mrUserPromise) {
            mrUserPromise = fetch(`https://api.modrinth.com/v2/user/${CONFIG.modrinthUser}/projects`)
                .then((r) => { if (!r.ok) throw new Error('modrinth'); return r.json(); })
                .then((list) => (Array.isArray(list) ? list : null))
                .catch(() => null);
        }
        return mrUserPromise;
    }

    (async () => {
        const KEY = 'ixra_modrinth_stats_v2';
        const pEl = $('#mr-projects'), dEl = $('#mr-downloads');
        if (!pEl || !dEl) return;

        const show = (d) => { pEl.textContent = fmtNum(d.projects); dEl.textContent = fmtNum(d.downloads); };

        const cached = cacheRead(KEY);
        if (cached) { show(cached.data); if (cached.fresh) return; }

        const list = await getModrinthUserProjects();
        if (list) {
            const data = { projects: list.length, downloads: list.reduce((s, x) => s + (x.downloads || 0), 0) };
            show(data);
            cacheWrite(KEY, data);
        } else if (!cached) {
            show({ projects: NaN, downloads: NaN });
        }
    })();

    /* ---------- CurseForge takipçi (elle) ---------- */
    (() => {
        const el = $('#cf-follower-count');
        if (!el) return;
        if (CONFIG.cfFollowers > 0) el.textContent = CONFIG.cfFollowers.toLocaleString('en-US');
        else el.parentElement.hidden = true;
    })();

    /* =========================================================
       İKONDAN ORTALAMA RENK
       ========================================================= */
    function getAverageColor(url) {
        return new Promise((resolve) => {
            if (!url || url.startsWith('data:')) return resolve(null);
            const img = new Image();
            img.crossOrigin = 'anonymous';
            let done = false;
            const finish = (v) => { if (!done) { done = true; clearTimeout(timer); resolve(v); } };
            const timer = setTimeout(() => finish(null), 4000);
            img.onload = () => {
                try {
                    const size = 24;
                    const canvas = document.createElement('canvas');
                    canvas.width = canvas.height = size;
                    const ctx = canvas.getContext('2d', { willReadFrequently: true });
                    ctx.drawImage(img, 0, 0, size, size);
                    const px = ctx.getImageData(0, 0, size, size).data;
                    let r = 0, g = 0, b = 0, n = 0;
                    for (let i = 0; i < px.length; i += 4) {
                        if (px[i + 3] < 128) continue;
                        const br = (px[i] + px[i + 1] + px[i + 2]) / 3;
                        if (br < 25 || br > 230) continue;
                        r += px[i]; g += px[i + 1]; b += px[i + 2]; n++;
                    }
                    finish(n ? [Math.round(r / n), Math.round(g / n), Math.round(b / n)] : null);
                } catch { finish(null); }
            };
            img.onerror = () => finish(null);
            img.src = url;
        });
    }

    const colorCache = new Map();
    async function applyProjectColor(item, url) {
        if (!item || !url) return;
        if (!colorCache.has(url)) colorCache.set(url, getAverageColor(url).then((c) => (c ? c.join(', ') : null)));
        const color = await colorCache.get(url);
        if (color) item.style.setProperty('--project-color', color);
    }

    /* =========================================================
       PROJELER  (projects.json)
       ========================================================= */
    const STATS_KEY = 'ixra_stats_v15';
    let projects = [];

    const isPack = (p) => p.type === 'resourcepack';
    const modrinthUrl = (p) => `https://modrinth.com/${isPack(p) ? 'resourcepack' : 'mod'}/${p.modrinthSlug}`;
    const curseforgeUrl = (p) => `https://www.curseforge.com/minecraft/${isPack(p) ? 'texture-packs' : 'mc-mods'}/${p.curseforgeSlug}`;
    const projectKey = (p) => p.modrinthSlug || p.curseforgeSlug;

    const t = (key) => (window.I18N ? window.I18N.t(key) : key);
    const curLang = () => (window.I18N ? window.I18N.getLang() : 'en');
    const projectDesc = (p) => (curLang() === 'tr' && p.descTr ? p.descTr : p.desc);

    const tagsHtml = (p) =>
        (p.versions || []).map((v) => `<span class="version-tag">${esc(v)}</span>`).join('') +
        (p.loaders || []).map((l) => `<span class="loader-tag ${l.toLowerCase() === 'forge' ? 'forge' : ''}">${esc(l)}</span>`).join('');

    function fmtDate(iso) {
        if (!iso) return null;
        try {
            const d = new Date(iso);
            if (isNaN(d.getTime())) return null;
            return d.toLocaleDateString(curLang() === 'tr' ? 'tr-TR' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        } catch { return null; }
    }

    // Sculks kartında hover'da arkada dönen ekran görüntüleri
    const SCULKS_SHOWCASE = [
        { src: 'assets/sculks-showcase/01-sculk-blocks.webp', alt: "Arda's Sculks — glowing sculk blocks in a deep dark cave" },
        { src: 'assets/sculks-showcase/02-shadow-hunter.webp', alt: "Arda's Sculks — Shadow Hunter boss in the ancient arena" },
        { src: 'assets/sculks-showcase/03-radioactive-warden.webp', alt: "Arda's Sculks — Radioactive Warden boss arena" },
        { src: 'assets/sculks-showcase/04-sculk-golem.webp', alt: "Arda's Sculks — Sculk Golem with glowing chest core" },
        { src: 'assets/sculks-showcase/05-sculk-flowers.webp', alt: "Arda's Sculks — decorative sculk flowers and light sources" },
        { src: 'assets/sculks-showcase/06-yellow-glow-forest.webp', alt: "Arda's Sculks — glowing yellow sculk forest at night" },
        { src: 'assets/sculks-showcase/07-sculk-plains.webp', alt: "Arda's Sculks — glowing Sculk Plains biome landscape" },
        { src: 'assets/sculks-showcase/08-dangerous-biome.webp', alt: "Arda's Sculks — dangerous biome with tall sculk plants" },
        { src: 'assets/sculks-showcase/09-crystal-cave.webp', alt: "Arda's Sculks — colorful crystal cave chamber" },
        { src: 'assets/sculks-showcase/10-pillar-forest.webp', alt: "Arda's Sculks — eerie glowing pillar forest at night" },
        { src: 'assets/sculks-showcase/11-golem-shrine.webp', alt: "Arda's Sculks — glowing golem shrine chamber" },
        { src: 'assets/sculks-showcase/12-purple-biome.webp', alt: "Arda's Sculks — purple glowing biome at night" },
        { src: 'assets/sculks-showcase/13-ancient-vault.webp', alt: "Arda's Sculks — symmetrical ancient vault chamber from above" },
        { src: 'assets/sculks-showcase/14-symmetric-chamber.webp', alt: "Arda's Sculks — symmetrical green ancient chamber from above" },
        { src: 'assets/sculks-showcase/15-circular-structure.webp', alt: "Arda's Sculks — symmetrical ancient city structure from above" },
        { src: 'assets/sculks-showcase/16-mushroom-forest.webp', alt: "Arda's Sculks — glowing giant mushroom forest" },
        { src: 'assets/sculks-showcase/17-glowing-forest.webp', alt: "Arda's Sculks — glowing forest biome at dusk" },
        { src: 'assets/sculks-showcase/18-glowing-build.webp', alt: "Arda's Sculks — glowing sculk house build at sunset" }
    ];
    const SCULKS_SLOT_SECONDS = 1; // her görsel ~1 saniye görünür kalır
    function sculksShowcaseHtml() {
        const imgsHtml = SCULKS_SHOWCASE.map((img) =>
            `<img src="${esc(img.src)}" alt="${esc(img.alt)}" decoding="async">`
        ).join('');
        return `<div class="sculks-permanent-bg"><img src="assets/sculks-showcase/bg-warden-shrine.webp" alt="Arda's Sculks — ancient warden shrine artwork" decoding="async"></div><div class="sculks-showcase" aria-hidden="true"><div class="sculks-gradient"></div>${imgsHtml}</div>`;
    }

    // Sculks showcase: tamamen JS kontrollü, requestAnimationFrame ile kare kare opacity
    // (CSS transition / prefers-reduced-motion gibi tarayıcıya bağlı garipliklere güvenmemek için)
    function fadeEl(el, from, to, duration, onDone) {
        if (!el) return;
        cancelAnimationFrame(el._fadeRaf);
        const start = performance.now();
        function step(now) {
            const t = Math.min(1, (now - start) / duration);
            const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; // ease-in-out
            el.style.opacity = String(from + (to - from) * eased);
            if (t < 1) {
                el._fadeRaf = requestAnimationFrame(step);
            } else {
                el.style.opacity = String(to);
                if (onDone) onDone();
            }
        }
        el._fadeRaf = requestAnimationFrame(step);
    }

    function startSculksShowcase(card) {
        const showcase = $('.sculks-showcase', card);
        if (!showcase || showcase.dataset.running === '1') return;
        const gradient = $('.sculks-gradient', showcase);
        const imgs = $$('img', showcase);
        if (!imgs.length) return;
        showcase.dataset.running = '1';
        imgs.forEach((im) => { im.style.opacity = '0'; });
        let idx = 0;
        fadeEl(gradient, 0, 1, 400);
        fadeEl(imgs[0], 0, 1, 400);
        showcase._sculksTimer = setInterval(() => {
            const prev = imgs[idx];
            idx = (idx + 1) % imgs.length;
            const next = imgs[idx];
            fadeEl(prev, 1, 0, 450);
            fadeEl(next, 0, 1, 450);
        }, SCULKS_SLOT_SECONDS * 1000);
    }
    function stopSculksShowcase(card) {
        const showcase = $('.sculks-showcase', card);
        if (!showcase) return;
        clearInterval(showcase._sculksTimer);
        showcase._sculksTimer = null;
        showcase.dataset.running = '0';
        const gradient = $('.sculks-gradient', showcase);
        fadeEl(gradient, parseFloat(gradient.style.opacity) || 0, 0, 400);
        $$('img', showcase).forEach((im) => fadeEl(im, parseFloat(im.style.opacity) || 0, 0, 400));
    }
    function wireSculksShowcase(container) {
        const card = $('.project-item-showcase', container);
        if (!card) return;
        card.addEventListener('mouseenter', () => startSculksShowcase(card));
        card.addEventListener('mouseleave', () => stopSculksShowcase(card));
        card.addEventListener('click', (e) => {
            if (e.target.closest('[data-action]') || e.target.closest('a')) return;
            if (!window.matchMedia('(hover: none)').matches) return; // sadece dokunmatikte
            const showcase = $('.sculks-showcase', card);
            if (showcase && showcase.dataset.running === '1') { stopSculksShowcase(card); return; }
            startSculksShowcase(card);
            clearTimeout(card._touchHideTimer);
            card._touchHideTimer = setTimeout(() => stopSculksShowcase(card), 6000);
        });
    }

    function projectCardHtml(p, i) {
        const badge = p.badge === 'popular' ? `<span class="project-badge badge-popular">${t('badge_popular')}</span>`
                    : p.badge === 'trending' ? `<span class="project-badge badge-trending">${t('badge_trending')}</span>` : '';

        const links = [];
        if (p.modrinthSlug) links.push(`<a href="${modrinthUrl(p)}" class="project-link" target="_blank" rel="noopener">Modrinth</a>`);
        if (p.curseforgeSlug) links.push(`<a href="${curseforgeUrl(p)}" class="project-link" target="_blank" rel="noopener">CurseForge</a>`);

        let actions = `
            <button class="detail-popup-btn" data-action="details" data-index="${i}" title="${t('details_title')}">
                <i class="fas fa-info-circle"></i> ${t('details_btn')}
            </button>`;
        if (p.detail === 'sculks') {
            actions = `
            <button class="detail-popup-btn" data-action="sculks" title="${t('sculks_details_title')}">
                <i class="fas fa-info-circle"></i> ${t('details_btn')}
            </button>
            <button class="progress-btn" data-action="progress" title="${t('progress_title')}">
                <i class="fas fa-tasks"></i> ${t('progress_btn')}
                <div class="progress-bar-mini"><div class="progress-bar-mini-fill"></div></div>
                <span style="font-size:10px;">55%</span>
            </button>`;
        }

        const updatedText = fmtDate(p.updatedAt);

        // İkon HER ZAMAN görünür: fallback yoksa placeholder, asla gizlenmez
        // NOT: p.iconUrl varsa (canlı API'den gelmiş gerçek ikon) o kullanılır, dil değişince kaybolmaz
        const iconSrc = p.iconUrl || p.icon || ICON_PLACEHOLDER;
        return `
        <article class="project-item${p.detail === 'sculks' ? ' project-item-showcase' : ''}" data-key="${esc(projectKey(p))}">
            ${p.detail === 'sculks' ? sculksShowcaseHtml() : ''}
            <div class="project-info">
                <img class="project-icon" src="${esc(iconSrc)}" alt="${esc(p.name)} icon" width="76" height="76" decoding="async" data-fallback="${esc(iconSrc)}" onerror="if(this.src!==this.dataset.fallback){this.src=this.dataset.fallback;}else if(!this.dataset.gaveUp){this.dataset.gaveUp='1';this.src='${ICON_PLACEHOLDER}';}">
                <h2 class="project-name">${esc(p.name)}${badge}</h2>
            </div>
            <span class="project-downloads" title="${t('downloads_title')}">...</span>
            <span class="project-updated" title="${t('updated_title')}"${updatedText ? '' : ' hidden'}>
                <i class="fas fa-clock"></i> ${t('updated_label')}: <span class="project-updated-date">${updatedText ? esc(updatedText) : ''}</span>
            </span>
            <div class="project-links">${links.join('')}</div>
            <div class="project-extra-actions">${actions}</div>
            <div class="project-tags">${tagsHtml(p)}</div>
            <div class="project-desc">${esc(projectDesc(p))}</div>
        </article>`;
    }

    function openGenericDetails(p) {
        const links = [];
        if (p.modrinthSlug) links.push(`<a href="${modrinthUrl(p)}" class="mod-detail-link" target="_blank" rel="noopener"><img class="brand-icon" src="https://cdn.simpleicons.org/modrinth/white" alt=""> Modrinth</a>`);
        if (p.curseforgeSlug) links.push(`<a href="${curseforgeUrl(p)}" class="mod-detail-link" target="_blank" rel="noopener"><img class="brand-icon" src="https://cdn.simpleicons.org/curseforge/white" alt=""> CurseForge</a>`);

        const updatedText = fmtDate(p.updatedAt);

        $('#generic-modal-title').textContent = `📦 ${p.name}`;
        genericModal.body.innerHTML = `
            <div class="mod-detail-header">
                <img class="mod-detail-icon" alt="${esc(p.name)}">
                <div>
                    <div class="mod-detail-title">${esc(p.name)}</div>
                    <div class="mod-detail-tags">${tagsHtml(p)}</div>
                    ${updatedText ? `<div class="mod-detail-updated"><i class="fas fa-clock"></i> ${t('updated_label')}: ${esc(updatedText)}</div>` : ''}
                </div>
            </div>
            <div class="mod-detail-desc">${esc(projectDesc(p))}</div>
            <div class="mod-detail-actions">${links.join('')}</div>`;

        const icon = $('.mod-detail-icon', genericModal.body);
        icon.addEventListener('error', () => { icon.src = ICON_PLACEHOLDER; }, { once: true });
        icon.src = p.iconUrl || p.icon || ICON_PLACEHOLDER; // kartta yüklenmiş gerçek ikon
        genericModal.open();
    }

    async function fetchModrinthProject(slug) {
        if (!slug) return null;
        try {
            const res = await fetch(`https://api.modrinth.com/v2/project/${slug}`);
            if (!res.ok) return null;
            const d = await res.json();
            return { downloads: d.downloads || 0, icon_url: d.icon_url || null, updated: d.updated || null };
        } catch { return null; }
    }

    async function fetchCurseForgeDownloads(slug, category = 'mc-mods', attempt = 0) {
        if (!slug) return null;
        try {
            // NOT: resourcepack'ler cfwidget'ta "texture-packs" altında, mod'lar "mc-mods" altında.
            // Kategori yanlış verilirse (örn. her zaman mc-mods) var olan projeler bile 404 döner.
            const res = await fetch(`https://api.cfwidget.com/minecraft/${category}/${slug}`);
            if (!res.ok) {
                if (res.status === 404) return null;
                throw new Error('cf');
            }
            const d = await res.json();
            const total = d.downloads?.total ?? d.downloadCount ?? 0;
            if (total === 0 && attempt < 1) {
                await new Promise((r) => setTimeout(r, 700));
                return fetchCurseForgeDownloads(slug, category, attempt + 1);
            }
            return total;
        } catch {
            if (attempt < 1) {
                await new Promise((r) => setTimeout(r, 700));
                return fetchCurseForgeDownloads(slug, category, attempt + 1);
            }
            return null;
        }
    }

    async function initProjects() {
        const container = $('#projects-container');
        const totalEl = $('#total-downloads');

        /* --- projects.json yükle --- */
        try {
            const res = await fetch('projects.json');
            if (!res.ok) throw new Error('HTTP ' + res.status);
            projects = await res.json();
            if (!Array.isArray(projects) || !projects.length) throw new Error('empty');
        } catch {
            container.innerHTML =
                `<div class="load-error">${t('load_error')} ` +
                `<button type="button" id="retry-projects">${t('retry_btn')}</button></div>`;
            $('#retry-projects').addEventListener('click', () => {
                container.innerHTML = '<div class="project-skeleton"></div><div class="project-skeleton"></div><div class="project-skeleton"></div>';
                initProjects();
            });
            totalEl.textContent = '—';
            totalEl.classList.remove('loading-val');
            return;
        }

        container.innerHTML = projects.map(projectCardHtml).join('');
        let items = $$('.project-item', container);

        // Buton tıklamaları (event delegation)
        container.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-action]');
            if (!btn) return;
            const action = btn.dataset.action;
            if (action === 'sculks') openSculksDetails();
            else if (action === 'progress') openProgress();
            else if (action === 'details') openGenericDetails(projects[Number(btn.dataset.index)]);
        });

        wireSculksShowcase(container);

        // Dil değişince kartları (rozet, buton, açıklama metinleri) yeniden çiz
        if (window.I18N) {
            window.I18N.onLanguageChange(() => {
                container.innerHTML = projects.map(projectCardHtml).join('');
                items = $$('.project-item', container); // eskiyi (DOM'dan kopmuş) değil, yeni kartları referansla
                wireSculksShowcase(container);
                projects.forEach((p, i) => { if (p.icon || p.iconUrl) applyProjectColor(items[i], p.iconUrl || p.icon); });
                const dlEls = $$('.project-downloads', container);
                projects.forEach((p, i) => {
                    const key = projectKey(p);
                    const cached2 = cacheRead(STATS_KEY);
                    const d = cached2 && cached2.data && cached2.data.perProject ? cached2.data.perProject[key] : null;
                    if (d) dlEls[i].textContent = fmtNum((d.mr || 0) + (d.cf || 0));
                });
            });
        }

        // Elle verilmiş ikonların rengini hemen uygula
        projects.forEach((p, i) => { if (p.icon) applyProjectColor(items[i], p.icon); });

        // İkonu güvenli değiştir: yeni URL yüklenirse değişir, yüklenmezse eskisi kalır (kaybolma yok)
        function setIcon(item, p, url) {
            if (!url) return;
            const img = $('.project-icon', item);
            if (img.dataset.current === url) return;
            const test = new Image();
            test.onload = () => {
                img.src = url;
                img.dataset.current = url;
                img.dataset.fallback = url; // ileride resim geçici olarak yüklenemezse buraya geri dönülür
                delete img.dataset.gaveUp;
                p.iconUrl = url;
                applyProjectColor(item, url);
            };
            test.src = url;
        }

        function applyData(perProject) {
            projects.forEach((p, i) => {
                const item = items[i];
                const dl = $('.project-downloads', item);
                const d = perProject[projectKey(p)];
                if (!d) { if (dl.textContent === '...') dl.textContent = '?'; return; }
                dl.textContent = fmtNum((d.mr || 0) + (d.cf || 0));
                setIcon(item, p, d.icon || p.icon);
                if (d.updated) {
                    p.updatedAt = d.updated;
                    const updEl = $('.project-updated', item);
                    const dateEl = $('.project-updated-date', item);
                    const text = fmtDate(d.updated);
                    if (updEl && dateEl && text) {
                        dateEl.textContent = text;
                        updEl.hidden = false;
                    }
                }
            });
        }

        function applyTotal(total) {
            totalEl.textContent = total > 0 ? fmtNum(total) + '+' : '—';
            totalEl.classList.remove('loading-val');
        }

        /* --- Cache'den hemen göster --- */
        const cached = cacheRead(STATS_KEY);
        const old = cached ? cached.data : null;
        if (old && old.perProject) {
            applyData(old.perProject);
            applyTotal(old.total || 0);
            if (cached.fresh) return;
        }

        /* --- Canlı veri: Modrinth tek istek + CurseForge --- */
        const list = await getModrinthUserProjects();
        const bySlug = new Map((list || []).map((x) => [x.slug, x]));

        const results = await Promise.all(projects.map(async (p) => {
            let mr = null, icon = null, updated = null;
            const info = bySlug.get(p.modrinthSlug);
            // Modrinth toplu listede yoksa tekil istek at; bunu CurseForge isteğiyle PARALEL çalıştır
            // (öncesinde sırayla bekleniyordu, bu da her kart için gecikmeyi ikiye katlıyordu)
            const cfPromise = fetchCurseForgeDownloads(p.curseforgeSlug, isPack(p) ? 'texture-packs' : 'mc-mods');
            if (info) {
                mr = info.downloads || 0;
                icon = info.icon_url || null;
                updated = info.updated || null;
            } else if (p.modrinthSlug) {
                const one = await fetchModrinthProject(p.modrinthSlug);
                if (one) { mr = one.downloads; icon = one.icon_url; updated = one.updated; }
            }
            const cf = await cfPromise;
            return { key: projectKey(p), mr, cf, icon, updated };
        }));

        // Başarısız/0 gelenlerin üstüne yazma: son bilinen iyi değeri koru
        const prev = (old && old.perProject) || {};
        const perProject = {};
        let sum = 0, anyOk = false;
        results.forEach((r) => {
            const o = prev[r.key] || {};
            const mr = r.mr > 0 ? r.mr : (o.mr || 0);
            const cf = r.cf > 0 ? r.cf : (o.cf || 0);
            if (r.mr > 0 || r.cf > 0) anyOk = true;
            perProject[r.key] = { mr, cf, icon: r.icon || o.icon || null, updated: r.updated || o.updated || null };
            sum += mr + cf;
        });

        applyData(perProject);
        applyTotal(sum);
        if (anyOk) cacheWrite(STATS_KEY, { perProject, total: sum }); // tamamen başarısızsa cache'leme
    }

    initProjects();
})();
