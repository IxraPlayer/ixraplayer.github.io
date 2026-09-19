/* =========================================================
   Ixra portfolio - i18n.js
   English / Türkçe dil sözlüğü + değiştirici
   ========================================================= */
(() => {
    'use strict';

    const DICT = {
        tab_projects: { en: 'Projects', tr: 'Projeler' },
        tab_links: { en: 'Links', tr: 'Bağlantılar' },
        tab_about: { en: 'About', tr: 'Hakkımda' },

        header_subtitle: { en: '@IxraPlayer (Ixranium) · Forge &amp; NeoForge Modder', tr: '@IxraPlayer (Ixranium) · Forge ve NeoForge Modu Geliştiricisi' },
        total_label: { en: 'total', tr: 'toplam' },

        search_placeholder: { en: 'Search projects…', tr: 'Proje ara…' },
        search_no_results: { en: 'No projects match your search.', tr: 'Aramanızla eşleşen proje bulunamadı.' },

        link_gh_repos_title: { en: 'Public repositories', tr: 'Herkese açık depolar' },
        link_gh_stars_title: { en: 'Total stars earned', tr: 'Kazanılan toplam yıldız' },
        link_gh_followers_title: { en: 'Followers', tr: 'Takipçiler' },
        link_mr_projects_title: { en: 'Published projects', tr: 'Yayınlanan projeler' },
        link_mr_downloads_title: { en: 'Total downloads', tr: 'Toplam indirme' },
        link_cf_followers_title: { en: 'CurseForge followers', tr: 'CurseForge takipçileri' },

        about_p1: {
            en: `My most popular project is <strong><a href="https://modrinth.com/mod/ardas-sculks" target="_blank" rel="noopener">Arda's Sculks</a></strong>, a deep dark expansion that adds new blocks, mechanics, and a boss. But I've released over 10 mods for Forge and NeoForge, ranging from ores and tools to golems and psychological horror.`,
            tr: `En popüler projem, yeni bloklar, mekanikler ve bir boss ekleyen bir Deep Dark genişletmesi olan <strong><a href="https://modrinth.com/mod/ardas-sculks" target="_blank" rel="noopener">Arda's Sculks</a></strong>. Ama Forge ve NeoForge için cevherlerden ve aletlerden golemlere ve psikolojik korkuya kadar uzanan 10'dan fazla mod yayınladım.`
        },
        about_p2: {
            en: `If you enjoy my work, check out my Projects tab or find me on the links — I'm always working on something new.`,
            tr: `Çalışmalarımı beğendiysen Projeler sekmesine göz at ya da bağlantılardan bana ulaş — her zaman yeni bir şeyler üzerinde çalışıyorum.`
        },
        about_p3: { en: `— Ixra (Minecraft Modder)`, tr: `— Ixra (Minecraft Mod Geliştiricisi)` },

        faq1_title: { en: '❓ General FAQ', tr: '❓ Genel SSS' },
        faq2_title: { en: "❓ Arda's Sculks – Developer Q&amp;A", tr: "❓ Arda's Sculks – Geliştirici S&amp;C" },

        q1_q: { en: 'Can I use your mods in my modpack?', tr: 'Modlarınızı modpack’imde kullanabilir miyim?' },
        q1_a: { en: 'Yes! All of my mods are modpack-friendly. You can include them in any modpack, public or private.', tr: 'Evet! Tüm modlarım modpack uyumludur. Herkese açık veya özel herhangi bir modpack’e dahil edebilirsin.' },
        q2_q: { en: 'Can I use your mods on my server?', tr: 'Modlarınızı sunucumda kullanabilir miyim?' },
        q2_a: { en: 'Absolutely. All mods are multiplayer-compatible and work on servers.', tr: 'Kesinlikle. Tüm modlar çok oyunculu uyumludur ve sunucularda çalışır.' },
        q3_q: { en: "What's the difference between Forge and NeoForge?", tr: 'Forge ile NeoForge arasındaki fark nedir?' },
        q3_a: { en: 'NeoForge is the modern fork of Forge and is the primary loader I develop for. I also release Forge versions for older Minecraft versions (like 1.20.1).', tr: 'NeoForge, Forge’un modern bir çatalıdır ve geliştirme yaptığım ana yükleyicidir. Ayrıca eski Minecraft sürümleri için (1.20.1 gibi) Forge sürümleri de yayınlıyorum.' },
        q4_q: { en: 'Do you take mod requests?', tr: 'Mod isteği alıyor musunuz?' },
        q4_a: { en: 'Not directly — I work alone and prefer creative freedom. But you can always leave suggestions on CurseForge or GitHub.', tr: 'Doğrudan almıyorum — tek başıma çalışıyorum ve yaratıcı özgürlüğü tercih ediyorum. Ama her zaman CurseForge veya GitHub üzerinden öneri bırakabilirsin.' },
        q5_q: { en: 'How do I report a bug?', tr: 'Bir hatayı nasıl bildiririm?' },
        q5_a: { en: 'The best way is through GitHub Issues. Go to the repository on my profile, click "Issues", and describe the problem in detail.', tr: 'En iyi yol GitHub Issues üzerinden. Profilimdeki depoya git, "Issues" sekmesine tıkla ve sorunu ayrıntılı şekilde açıkla.' },
        q6_q: { en: "Why are some mods only on Modrinth and not CurseForge?", tr: 'Neden bazı modlar sadece Modrinth’te var, CurseForge’da yok?' },
        q6_a: { en: "I release on both platforms whenever possible. If a mod isn't on CurseForge, it's either pending approval or was only released on Modrinth.", tr: 'Mümkün olduğunda her iki platformda da yayınlıyorum. Bir mod CurseForge’da yoksa, ya onay bekliyordur ya da sadece Modrinth’te yayınlanmıştır.' },
        q7_q: { en: 'Will you update old mods to newer Minecraft versions?', tr: 'Eski modları yeni Minecraft sürümlerine güncelleyecek misiniz?' },
        q7_a: { en: 'I try to keep my most popular mods updated. Older or smaller mods may not get updates, as I focus on new projects.', tr: 'En popüler modlarımı güncel tutmaya çalışıyorum. Daha eski veya küçük modlar, yeni projelere odaklandığım için güncelleme alamayabilir.' },
        q8_q: { en: 'Can I translate your mods into my language?', tr: 'Modlarınızı kendi dilime çevirebilir miyim?' },
        q8_a: { en: "Yes! I welcome translations. Contact me on CurseForge or GitHub and I'll add your translation.", tr: 'Evet! Çevirilere açığım. CurseForge veya GitHub üzerinden bana ulaş, çevirini ekleyeyim.' },
        q9_q: { en: 'Are your mods open source?', tr: 'Modlarınız açık kaynak mı?' },
        q9_a: { en: 'Most of them are. Check the GitHub repository for the source code and license information.', tr: 'Çoğu açık kaynak. Kaynak kod ve lisans bilgisi için GitHub deposuna bakabilirsin.' },

        s1_q: { en: 'How did the idea for this mod come about?', tr: 'Bu modun fikri nasıl ortaya çıktı?' },
        s1_a: { en: `It actually started with a friend suggesting I add powerful arms to the game. I combined that idea with the sculk theme, kept developing it further, and eventually decided to release it as Arda's Sculks.`, tr: `Aslında her şey bir arkadaşımın oyuna güçlü kollar ekleme fikrini önermesiyle başladı. Ben de bu fikri sculk temasıyla birleştirdim, sonra modu daha da geliştirmeye devam ettim ve sonunda Arda's Sculks olarak yayınlamaya karar verdim.` },
        s2_q: { en: 'What tools did you use?', tr: 'Hangi araçları kullandınız?' },
        s2_a: { en: 'I used <strong>MCreator</strong> throughout development. It allowed me to prototype quickly and still shape the codebase exactly how I needed it.', tr: 'Geliştirme boyunca <strong>MCreator</strong> kullandım. Hızlıca prototip oluşturmamı sağlarken kod tabanını tam istediğim gibi şekillendirmeme de izin verdi.' },
        s3_q: { en: 'What was the biggest technical challenge?', tr: 'En büyük teknik zorluk neydi?' },
        s3_a: { en: "Without a doubt, coding the <strong>Shadow Hunter</strong>'s mechanics. Writing abilities like teleportation and fast kicks took weeks. On top of that, it was my first time designing a dedicated boss arena, so solving the <strong>lag issues</strong> that appeared was another huge hurdle.", tr: "Hiç şüphesiz <strong>Shadow Hunter</strong>'ın mekaniklerini kodlamaktı. Işınlanma ve hızlı tekme gibi yetenekleri yazmak haftalar sürdü. Üstüne üstlük, ilk kez özel bir boss arenası tasarlıyordum, bu yüzden ortaya çıkan <strong>lag sorunlarını</strong> çözmek de büyük bir engeldi." },
        s4_q: { en: 'Which loader does the mod work best with?', tr: 'Mod hangi yükleyiciyle en iyi çalışıyor?' },
        s4_a: { en: "The most stable and compatible version is <strong>NeoForge</strong>. It also runs on Forge, but I developed and tested primarily on NeoForge, so that's where the best experience is.", tr: 'En stabil ve uyumlu sürüm <strong>NeoForge</strong>. Forge üzerinde de çalışır, ama geliştirmeyi ve testleri esas olarak NeoForge üzerinde yaptım, en iyi deneyim orada.' },
        s5_q: { en: 'What does the mod actually add to the game?', tr: 'Mod oyuna gerçekte ne ekliyor?' },
        s5_a: { en: "Arda's Sculks expands the <strong>sculk and Deep Dark theme in almost every direction</strong>. New mechanics, armor, weapons, boss fights, decoration blocks, and even farming areas – my goal was to deepen this theme as much as possible.", tr: "Arda's Sculks, <strong>sculk ve Deep Dark temasını neredeyse her yönden genişletiyor</strong>. Yeni mekanikler, zırhlar, silahlar, boss savaşları, dekorasyon blokları ve hatta çiftlik alanları – amacım bu temayı olabildiğince derinleştirmekti." },
        s6_q: { en: 'Who is the most notable boss in the mod?', tr: 'Moddaki en dikkat çekici boss kim?' },
        s6_a: { en: '<strong>Shadow Hunter</strong>. A fast‑kicking, teleporting boss that keeps you on edge the entire fight. It forces you to think strategically instead of just clicking mindlessly.', tr: '<strong>Shadow Hunter</strong>. Hızlı tekmeleri ve ışınlanmasıyla savaş boyunca seni tetikte tutan bir boss. Düşünmeden tıklamak yerine stratejik düşünmeni zorunlu kılıyor.' },
        s7_q: { en: 'What kind of player is this mod for?', tr: 'Bu mod ne tür oyuncular için?' },
        s7_a: { en: "Adventure seekers, hands down. If you're looking for an end‑game challenge, enjoy intense boss encounters, and want to dive deeper into the mystery of the Deep Dark, this mod is definitely for you.", tr: "Kesinlikle macera arayanlar için. Oyun sonu zorluğu arıyorsan, yoğun boss savaşlarından hoşlanıyorsan ve Deep Dark'ın gizemine daha derin dalmak istiyorsan, bu mod tam sana göre." },
        s8_q: { en: 'Can I play it with friends?', tr: 'Arkadaşlarımla oynayabilir miyim?' },
        s8_a: { en: 'Yes, the mod has <strong>multiplayer support</strong>. You can play it on your own server or just together with your friends.', tr: 'Evet, modun <strong>çok oyunculu desteği</strong> var. Kendi sunucunda ya da sadece arkadaşlarınla birlikte oynayabilirsin.' },
        s9_q: { en: 'Will there be future updates?', tr: 'Gelecekte güncelleme olacak mı?' },
        s9_a: { en: 'I really want to continue developing the mod, but right now my life is pretty busy with <strong>daily life, school, and extremely important exams</strong> that will shape my future. Development is basically paused for now. Once things calm down, I plan to pick it back up.', tr: 'Modu geliştirmeye gerçekten devam etmek istiyorum, ama şu anda hayatım <strong>günlük hayat, okul ve geleceğimi şekillendirecek son derece önemli sınavlarla</strong> oldukça yoğun. Geliştirme şu an için neredeyse durdu. İşler sakinleştiğinde tekrar ele almayı planlıyorum.' },
        s10_q: { en: 'How do I report a bug?', tr: 'Bir hatayı nasıl bildiririm?' },
        s10_a: { en: 'The easiest way is through <strong>GitHub</strong>. Head over to the repository on my profile, go to the "Issues" tab, and write a detailed description. I\'ll check it out as soon as I can.', tr: 'En kolay yol <strong>GitHub</strong> üzerinden. Profilimdeki depoya git, "Issues" sekmesine geç ve ayrıntılı bir açıklama yaz. En kısa sürede kontrol edeceğim.' },
        s11_q: { en: "What license is Arda's Sculks released under?", tr: "Arda's Sculks hangi lisansla yayınlandı?" },
        s11_a: { en: 'The mod is licensed under the <strong>GNU Lesser General Public License Version 2.1 (LGPL-2.1)</strong>.', tr: 'Mod, <strong>GNU Lesser General Public License Version 2.1 (LGPL-2.1)</strong> lisansı altında yayınlandı.' },

        video_title: { en: "🎬 Arda's Sculks – Boss Battle Showcase", tr: "🎬 Arda's Sculks – Boss Savaşı Vitrini" },
        video_caption: { en: 'Shadow Hunter boss fight in action — abilities, arena, and atmosphere.', tr: 'Shadow Hunter boss savaşı aksiyonda — yetenekler, arena ve atmosfer.' },

        extra_toggle_closed: { en: '▸ A bit more about me…', tr: '▸ Hakkımda biraz daha…' },
        extra_toggle_open: { en: '▾ A bit more about me…', tr: '▾ Hakkımda biraz daha…' },

        extra_p1: { en: `My real name is <strong>Arda</strong>, but online everyone calls me Ixra. I'm 18 years old and I live in <strong>Istanbul, Turkey</strong>. I speak <strong>Turkish</strong> natively, and I know a little English and a little Arabic.`, tr: `Gerçek adım <strong>Arda</strong>, ama internette herkes bana Ixra der. 18 yaşındayım ve <strong>İstanbul, Türkiye</strong>'de yaşıyorum. Anadilim <strong>Türkçe</strong> ve biraz İngilizce, biraz da Arapça biliyorum.` },
        extra_p2: { en: `Hey! I've been playing Minecraft since I was <strong>6 years old</strong> — it's more than a game to me, it's the universe where I can turn my imagination into reality. Over the years I haven't just played; I've <strong>built massive structures, drawn textures and pixel art, and developed mods</strong> that change how the game feels. I'm an ordinary high school student who loves creating, expanding, and always adding something new on top of what already exists. When I truly have the passion for an idea, I commit to it and deliver quality — I usually work alone and I'm not open to direct requests, because I believe creative freedom brings the best results.`, tr: `Selam! <strong>6 yaşımdan</strong> beri Minecraft oynuyorum — benim için bir oyundan çok daha fazlası, hayal gücümü gerçeğe dönüştürebildiğim bir evren. Yıllar içinde sadece oynamadım; oyunun hissini değiştiren <strong>devasa yapılar inşa ettim, dokular ve piksel sanatı çizdim ve modlar geliştirdim</strong>. Yaratmayı, genişletmeyi ve var olana her zaman yeni bir şeyler eklemeyi seven sıradan bir lise öğrencisiyim. Bir fikre gerçekten tutkuyla bağlandığımda, ona adanırım ve kalite sunarım — genellikle tek başıma çalışırım ve doğrudan isteklere açık değilim, çünkü en iyi sonuçları yaratıcı özgürlüğün getirdiğine inanıyorum.` },
        extra_p3: { en: `Honestly? I don't like playing games that much. What I truly love is <strong>developing, drawing, designing, and dreaming up new ideas</strong>.`, tr: `Dürüst olmak gerekirse? Oyun oynamayı pek sevmiyorum. Gerçekten sevdiğim şey <strong>geliştirmek, çizmek, tasarlamak ve yeni fikirler hayal etmek</strong>.` },
        extra_p4: { en: `<strong>Why I make mods:</strong> Every time I play a game, my mind starts creating new possibilities — different stories, mechanics, and twists that could have been there. It's purely for fun — and to see people download my mods and have a great time playing with them. That's what keeps me going.`, tr: `<strong>Neden mod yapıyorum:</strong> Ne zaman bir oyun oynasam, zihnim yeni olasılıklar yaratmaya başlıyor — orada olabilecek farklı hikayeler, mekanikler ve dönüşler. Bu tamamen eğlence için — ve insanların modlarımı indirip onlarla eğlenceli vakit geçirdiğini görmek için. Beni ayakta tutan bu.` },
        extra_p5: { en: `<strong>Contact:</strong> You cannot reach me directly. If you have requests or bug reports, please leave a comment on <a href="https://www.curseforge.com/members/ixra/projects" target="_blank" rel="noopener">CurseForge</a> or open an issue on <a href="https://github.com/IxraPlayer" target="_blank" rel="noopener">GitHub</a>.`, tr: `<strong>İletişim:</strong> Bana doğrudan ulaşamazsın. İsteklerin veya hata bildirimlerin varsa lütfen <a href="https://www.curseforge.com/members/ixra/projects" target="_blank" rel="noopener">CurseForge</a> üzerinden yorum bırak ya da <a href="https://github.com/IxraPlayer" target="_blank" rel="noopener">GitHub</a>'da bir issue aç.` },

        footer_text: { en: 'Ixra · Minecraft Mod Developer', tr: 'Ixra · Minecraft Mod Geliştiricisi' },

        sculks_modal_title: { en: "📦 Arda's Sculks – Full Details", tr: "📦 Arda's Sculks – Tüm Detaylar" },
        generic_modal_title_default: { en: '📦 Mod Details', tr: '📦 Mod Detayları' },
        progress_modal_title: { en: "📊 Arda's Sculks – Development Progress", tr: "📊 Arda's Sculks – Geliştirme İlerlemesi" },

        progress_language: { en: 'Language', tr: 'Dil' },
        progress_gameplay: { en: 'Gameplay', tr: 'Oynanış' },
        progress_bugfix: { en: 'Bug Fixing', tr: 'Hata Düzeltme' },
        progress_quality: { en: 'Quality', tr: 'Kalite' },
        progress_overall: { en: '📈 Overall Average', tr: '📈 Genel Ortalama' },

        badge_popular: { en: 'MOST POPULAR', tr: 'EN POPÜLER' },
        badge_trending: { en: 'TRENDING', tr: 'YÜKSELİŞTE' },
        details_btn: { en: 'Details', tr: 'Detaylar' },
        details_title: { en: 'View details', tr: 'Detayları görüntüle' },
        sculks_details_title: { en: 'View full details', tr: 'Tüm detayları görüntüle' },
        progress_btn: { en: 'Progress', tr: 'İlerleme' },
        progress_title: { en: 'Development progress', tr: 'Geliştirme ilerlemesi' },
        downloads_title: { en: 'Total downloads', tr: 'Toplam indirme' },
        updated_label: { en: 'Updated', tr: 'Güncellendi' },
        updated_title: { en: 'Last updated', tr: 'Son güncelleme' },
        sculks_loading: { en: 'Loading…', tr: 'Yükleniyor…' },
        sculks_load_error: { en: 'Could not load details. See the full page on <a href="https://www.curseforge.com/minecraft/mc-mods/ardas-sculks" target="_blank" rel="noopener">CurseForge</a>.', tr: 'Detaylar yüklenemedi. Tam sayfayı <a href="https://www.curseforge.com/minecraft/mc-mods/ardas-sculks" target="_blank" rel="noopener">CurseForge</a> üzerinde görebilirsin.' },
        load_error: { en: 'Could not load projects. See them on <a href="https://modrinth.com/user/Ixra" target="_blank" rel="noopener">Modrinth</a> or <a href="https://www.curseforge.com/members/ixra/projects" target="_blank" rel="noopener">CurseForge</a>.', tr: 'Projeler yüklenemedi. Onları <a href="https://modrinth.com/user/Ixra" target="_blank" rel="noopener">Modrinth</a> veya <a href="https://www.curseforge.com/members/ixra/projects" target="_blank" rel="noopener">CurseForge</a> üzerinde görebilirsin.' },
        retry_btn: { en: 'Retry', tr: 'Tekrar dene' }
    };

    const LANG_KEY = 'ixra_lang';
    function getLang() {
        try {
            const saved = localStorage.getItem(LANG_KEY);
            if (saved === 'en' || saved === 'tr') return saved;
        } catch { /* yoksay */ }
        return 'en'; // sayfa varsayılan olarak İngilizce açılır
    }

    let currentLang = getLang();

    function t(key) {
        const entry = DICT[key];
        if (!entry) return key;
        return entry[currentLang] || entry.en || key;
    }

    function applyStatic(root = document) {
        root.querySelectorAll('[data-i18n]').forEach((el) => {
            el.innerHTML = t(el.getAttribute('data-i18n'));
        });
        root.querySelectorAll('[data-i18n-title]').forEach((el) => {
            el.setAttribute('title', t(el.getAttribute('data-i18n-title')));
        });
        root.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
            el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
        });
        root.querySelectorAll('[data-i18n-aria-label]').forEach((el) => {
            el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria-label')));
        });
    }

    const listeners = [];
    function onLanguageChange(fn) { listeners.push(fn); }

    function setLang(lang) {
        if (lang !== 'en' && lang !== 'tr') return;
        currentLang = lang;
        try { localStorage.setItem(LANG_KEY, lang); } catch { /* yoksay */ }
        document.documentElement.lang = lang;
        applyStatic();
        updateToggleBtn();
        listeners.forEach((fn) => { try { fn(lang); } catch { /* yoksay */ } });
    }

    function updateToggleBtn() {
        const btn = document.getElementById('lang-toggle');
        if (!btn) return;
        btn.textContent = currentLang === 'tr' ? 'EN' : 'TR';
        btn.title = currentLang === 'tr' ? 'Switch to English' : "Türkçe'ye geç";
        btn.setAttribute('aria-label', btn.title);
    }

    function initToggleBtn() {
        const btn = document.getElementById('lang-toggle');
        if (!btn) return;
        updateToggleBtn();
        btn.addEventListener('click', () => setLang(currentLang === 'tr' ? 'en' : 'tr'));
    }

    document.documentElement.lang = currentLang;

    window.I18N = { t, getLang: () => currentLang, setLang, applyStatic, onLanguageChange };

    document.addEventListener('DOMContentLoaded', () => {
        initToggleBtn();
        applyStatic();
    });
})();
