// ========================= KODE ASLI KAMU (TIDAK DIUBAH) =========================
document.addEventListener("DOMContentLoaded", () => {
    const audio = document.getElementById("birthdayAudio");
    const visualizer = document.getElementById("musicVisualizer");
    const body = document.body;

    // Pastikan visualizer aktif
    visualizer.classList.add("active");

    // Fungsi untuk mulai musik
    function startMusic() {
        audio.play().then(() => {
            console.log("Musik autoplay berhasil diputar 🎶");
            showVisualizer();
        }).catch(() => {
            console.warn("Autoplay diblokir oleh browser 😢");
            showPlayOverlay(); // tampilkan tombol manual
        });
    }

    // Fungsi visualizer
    function showVisualizer() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const analyser = audioContext.createAnalyser();
            const source = audioContext.createMediaElementSource(audio);
            source.connect(analyser);
            analyser.connect(audioContext.destination);
            analyser.fftSize = 256;
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            const canvasCtx = visualizer.getContext("2d");

            function draw() {
                requestAnimationFrame(draw);
                analyser.getByteFrequencyData(dataArray);
                canvasCtx.clearRect(0, 0, visualizer.width, visualizer.height);

                const barWidth = (visualizer.width / bufferLength) * 2.5;
                let x = 0;
                for (let i = 0; i < bufferLength; i++) {
                    const barHeight = dataArray[i] / 2;
                    canvasCtx.fillStyle = `rgb(${barHeight + 100}, 50, 150)`;
                    canvasCtx.fillRect(x, visualizer.height - barHeight, barWidth, barHeight);
                    x += barWidth + 1;
                }
            }
            draw();
        } catch (e) {
            console.error("Visualizer error:", e);
        }
    }

    // Efek hearts 💕
    const floatingHearts = document.getElementById("floatingHearts");
    function createHeart() {
        const heart = document.createElement("div");
        heart.classList.add("heart");
        heart.textContent = "💖";
        heart.style.left = `${Math.random() * 100}vw`;
        heart.style.animationDuration = `${3 + Math.random() * 2}s`;
        floatingHearts.appendChild(heart);
        setTimeout(() => heart.remove(), 5000);
    }
    setInterval(createHeart, 700);

    // Efek balon 🎈
    const balloonContainer = document.getElementById("balloonContainer");
    function createBalloon() {
        const balloon = document.createElement("div");
        balloon.classList.add("balloon");
        balloon.textContent = ["🎈", "🎉", "🎊"][Math.floor(Math.random() * 3)];
        balloon.style.left = `${Math.random() * 100}vw`;
        balloon.style.animationDuration = `${4 + Math.random() * 3}s`;
        balloonContainer.appendChild(balloon);
        setTimeout(() => balloon.remove(), 7000);
    }
    setInterval(createBalloon, 1200);

    // Efek ketik untuk subtitle
    const romanticMessage = "Selamat ulang tahun sayang 💕 Semoga harimu penuh kebahagiaan dan cinta!";
    const subtitle = document.querySelector(".subtitle");
    let i = 0;
    function typeWriter() {
        if (i < romanticMessage.length) {
            subtitle.textContent += romanticMessage.charAt(i);
            i++;
            setTimeout(typeWriter, 80);
        }
    }
    typeWriter();

    // Jalankan musik saat halaman dimuat
    startMusic();
});
/* ===== Smooth Scroll untuk anchor navbar ===== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const id = a.getAttribute('href');
        if (id.length > 1) {
            e.preventDefault();
            document.querySelector(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

/* ===== Scroll ke konten dari tombol indikator ===== */
window.scrollToContent = () => {
    document.querySelector('#video')?.scrollIntoView({ behavior: 'smooth' });
};

/* ===== Music Toggle ===== */
const musicBtn = document.getElementById('toggleMusic');
const audioEl = document.getElementById('birthdayAudio');
if (musicBtn && audioEl) {
    const setLabel = () => { musicBtn.textContent = audioEl.paused ? '🔇 Musik' : '🔈 Musik'; };
    setLabel();
    musicBtn.addEventListener('click', async () => {
        try {
            if (audioEl.paused) { await audioEl.play(); } else { audioEl.pause(); }
            setLabel();
        } catch (_) { }
    });
}

/* === NORMALISASI TANGGAL DMY -> ISO (agar 03-11-2025 dibaca benar) ===
   Ditempatkan SEBELUM countdown asli, TANPA mengubah countdown aslimu. */
(function () {
    const sec = document.getElementById('countdown');
    if (!sec) return;
    const raw = (sec.getAttribute('data-bday') || '').trim();
    const m = raw.match(/^(\d{2})-(\d{2})-(\d{4})$/); // DD-MM-YYYY
    if (m) {
        const [, dd, mm, yyyy] = m;
        sec.setAttribute('data-bday', `${yyyy}-${mm}-${dd}`); // jadi YYYY-MM-DD
    }
})();

/* ===== Countdown to next birthday (pakai data-bday) ===== */
(function () {
    const sec = document.getElementById('countdown');
    if (!sec) return;
    const base = sec.getAttribute('data-bday'); // "YYYY-MM-DD"
    if (!base) return;
    const [y, m, d] = base.split('-').map(n => parseInt(n, 10));
    const targetForYear = (year) => new Date(year, m - 1, d, 0, 0, 0);

    const daysEl = document.getElementById('cdDays');
    const hoursEl = document.getElementById('cdHours');
    const minsEl = document.getElementById('cdMinutes');
    const secsEl = document.getElementById('cdSeconds');

    function nextTarget() {
        const now = new Date();
        let t = targetForYear(now.getFullYear());
        if (t < now) { t = targetForYear(now.getFullYear() + 1); }
        return t;
    }
    let target = nextTarget();

    function tick() {
        const now = new Date();
        if (now > target) { target = nextTarget(); }
        const diff = Math.max(0, target - now);
        const s = Math.floor(diff / 1000);
        const d = Math.floor(s / 86400);
        const h = Math.floor((s % 86400) / 3600);
        const m = Math.floor((s % 3600) / 60);
        const sc = s % 60;
        if (daysEl) { daysEl.textContent = String(d).padStart(2, '0'); }
        if (hoursEl) { hoursEl.textContent = String(h).padStart(2, '0'); }
        if (minsEl) { minsEl.textContent = String(m).padStart(2, '0'); }
        if (secsEl) { secsEl.textContent = String(sc).padStart(2, '0'); }
    }
    tick();
    setInterval(tick, 1000);
})();

/* ===== Lightbox untuk Memory Images ===== */
(function () {
    const cards = document.querySelectorAll('.memory-card img');
    const lb = document.getElementById('lightbox');
    const lbImg = document.getElementById('lbImage');
    const lbCap = document.getElementById('lbCaption');
    const lbClose = document.getElementById('lbClose');
    const close = () => lb.setAttribute('aria-hidden', 'true');

    if (!lb) return;
    cards.forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', () => {
            lbImg.src = img.src;
            const card = img.closest('.memory-card');
            lbCap.textContent = card?.querySelector('h3')?.textContent || img.alt || 'Preview';
            lb.setAttribute('aria-hidden', 'false');
        });
    });
    lbClose?.addEventListener('click', close);
    lb.addEventListener('click', (e) => { if (e.target.classList.contains('lb-backdrop')) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();

/* ===== Guestbook / Kartu Ucapan (localStorage) ===== */
(function () {
    const modal = document.getElementById('wishModal');
    const openBtns = [document.getElementById('openWishModal'), document.getElementById('openWishModal2')].filter(Boolean);
    const closeBtn = document.getElementById('closeWishModal');
    const cancelBtn = document.getElementById('cancelWish');
    const form = document.getElementById('wishForm');
    const list = document.getElementById('wishList');

    const LS_KEY = 'birthday_wishes_v1';

    const open = () => modal?.setAttribute('aria-hidden', 'false');
    const close = () => modal?.setAttribute('aria-hidden', 'true');

    openBtns.forEach(b => b.addEventListener('click', open));
    closeBtn?.addEventListener('click', close);
    cancelBtn?.addEventListener('click', close);
    modal?.addEventListener('click', e => { if (e.target.classList.contains('modal-backdrop')) close(); });

    function render() {
        if (!list) return;
        const data = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
        if (!data.length) {
            list.classList.add('empty'); list.innerHTML = '<p class="muted">Belum ada ucapan. Jadilah yang pertama! ✨</p>'; return;
        }
        list.classList.remove('empty');
        list.innerHTML = data.map(w => `
      <article class="wish-card">
        <div class="from">💖 ${escapeHtml(w.name)}</div>
        <div class="text">${escapeHtml(w.text)}</div>
      </article>
    `).join('');
    }

    function escapeHtml(s) {
        return String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
    }

    form?.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('wishName').value.trim();
        const text = document.getElementById('wishText').value.trim();
        if (!name || !text) return;
        const data = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
        data.unshift({ name, text, ts: Date.now() });
        localStorage.setItem(LS_KEY, JSON.stringify(data));
        render();
        confettiEmoji(); // 🎉 efek
        form.reset();
        modal.setAttribute('aria-hidden', 'true');
    });

    render();
})();

/* ===== Confetti Emoji sederhana ===== */
function confettiEmoji() {
    const COUNT = 30;
    for (let i = 0; i < COUNT; i++) {
        const s = document.createElement('div');
        s.textContent = ['🎉', '✨', '💖', '🎊'][Math.floor(Math.random() * 4)];
        Object.assign(s.style, {
            position: 'fixed', left: (Math.random() * 100) + 'vw', top: '-10px',
            fontSize: (18 + Math.random() * 14) + 'px', transform: `rotate(${Math.random() * 360}deg)`,
            zIndex: 9999, pointerEvents: 'none'
        });
        document.body.appendChild(s);
        const duration = 2500 + Math.random() * 1200;
        s.animate([
            { transform: s.style.transform, top: '-10px', opacity: 1 },
            { transform: `translateY(80vh) rotate(${Math.random() * 360}deg)`, top: '80vh', opacity: 0.1 }
        ], { duration, easing: 'cubic-bezier(.2,.6,.2,1)' }).onfinish = () => s.remove();
    }
}

/* ===== Back to top ===== */
(function () {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    const onScroll = () => {
        if (window.scrollY > 600) { btn.classList.add('show'); } else { btn.classList.remove('show'); }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    onScroll();
})();


// ========================= PENINGKATAN / FITUR TAMBAHAN (BARU) =========================
// CATATAN: Semua penambahan di bawah ini berdiri sendiri & tidak mengubah fungsi asli di atas.

/* 1) Audio Autoplay Unlock + Remember Preference */
(function () {
    const audio = document.getElementById('birthdayAudio');
    if (!audio) return;
    const KEY = 'music_pref_play_v1';

    // terapkan preferensi terakhir
    try {
        const pref = localStorage.getItem(KEY);
        if (pref === 'pause') { audio.pause?.(); }
    } catch (_) { }

    const ensurePlay = async () => {
        try { await audio.play(); } catch (_) { }
    };

    // butuh gesture user untuk beberapa browser
    const unlock = async () => {
        await ensurePlay();
        document.removeEventListener('click', unlock);
        document.removeEventListener('touchstart', unlock);
        document.removeEventListener('keydown', unlock);
    };
    document.addEventListener('click', unlock, { once: true });
    document.addEventListener('touchstart', unlock, { once: true });
    document.addEventListener('keydown', unlock, { once: true });

    // simpan preferensi saat user pause/play via tombol
    const btn = document.getElementById('toggleMusic');
    if (btn) {
        btn.addEventListener('click', () => {
            try {
                localStorage.setItem(KEY, audio.paused ? 'pause' : 'play');
            } catch (_) { }
        });
    }
})();

/* 2) Hemat baterai: hentikan animasi saat tab tidak aktif (CSS bisa pakai [data-paused]) */
(function () {
    const root = document.documentElement;
    function pauseAnims() { root.setAttribute('data-paused', '1'); }
    function resumeAnims() { root.removeAttribute('data-paused'); }
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) { pauseAnims(); } else { resumeAnims(); }
    });
})();

/* 3) Visualizer guard: jika elemennya bukan <canvas>, jangan error & tetap aktif */
(function () {
    const vis = document.getElementById('musicVisualizer');
    if (!vis) return;
    if (vis.tagName !== 'CANVAS') {
        const fit = () => { vis.classList.add('active'); };
        window.addEventListener('resize', fit);
        fit();
    }
})();

/* 4) Cleanup intervals custom ketika unload (prevent leak) */
(function () {
    const intervals = [];
    const _setInterval = window.setInterval;
    window.setInterval = function (handler, timeout) {
        const id = _setInterval(handler, timeout);
        intervals.push(id);
        return id;
    };
    window.addEventListener('beforeunload', () => intervals.forEach(clearInterval));
})();

/* 5) Auto-lift visualizer saat footer terlihat (biar tidak ketutupan) */
(function () {
    const vis = document.getElementById('musicVisualizer');
    const footer = document.querySelector('.footer-credit');
    if (!vis || !footer) return;

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) { vis.classList.add('lifted'); }
            else { vis.classList.remove('lifted'); }
        });
    }, { root: null, threshold: 0.05 });
    io.observe(footer);

    const onResize = () => {
        if (window.innerHeight < 600) {
            vis.style.bottom = `calc(env(safe-area-inset-bottom) + 72px)`;
        } else {
            vis.style.bottom = '';
        }
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    onResize();
})();

/* 6) ADDON: Tombol Hapus Ucapan (tanpa mengubah kode asli render) */
(function () {
    const LS_KEY = 'birthday_wishes_v1';
    const list = document.getElementById('wishList');
    if (!list) return;

    // inject CSS tombol hapus
    (function injectDeleteCss() {
        const id = 'wish-delete-css';
        if (document.getElementById(id)) return;
        const css = `
      .wish-card{ position:relative; padding-bottom:48px; }
      .wish-card .delete-btn{
        position:absolute; right:14px; bottom:10px;
        background:linear-gradient(135deg,#ff7a7a,#ff3c3c);
        color:#fff; border:none; border-radius:12px;
        padding:6px 12px; font-size:.8rem; cursor:pointer;
        box-shadow:0 2px 6px rgba(0,0,0,.2);
        transition:transform .2s ease, background .3s ease;
      }
      .wish-card .delete-btn:hover{
        transform:scale(1.05);
        background:linear-gradient(135deg,#ff4b4b,#e52d2d);
      }
    `;
        const el = document.createElement('style');
        el.id = id; el.textContent = css;
        document.head.appendChild(el);
    })();

    // render versi bayangan (kalau perlu) dari localStorage
    function renderShadow() {
        const data = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
        if (!data.length) {
            list.classList.add('empty');
            list.innerHTML = '<p class="muted">Belum ada ucapan. Jadilah yang pertama! ✨</p>';
            return;
        }
        list.classList.remove('empty');
        list.innerHTML = data.map((w, i) => `
      <article class="wish-card">
        <div class="from">💖 ${escapeHtml(w.name)}</div>
        <div class="text">${escapeHtml(w.text)}</div>
        <button class="delete-btn" data-index="${i}">Hapus</button>
      </article>
    `).join('');
    }
    function escapeHtml(s) {
        return String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
    }

    // sisipkan tombol hapus ke DOM yang sudah ada
    function ensureDeleteButtons() {
        const cards = list.querySelectorAll('.wish-card');
        if (!cards.length) return;
        const data = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
        cards.forEach((card, i) => {
            if (card.querySelector('.delete-btn')) return;
            const btn = document.createElement('button');
            btn.className = 'delete-btn';
            btn.textContent = 'Hapus';
            btn.dataset.index = String(i);
            card.appendChild(btn);
        });
        if (list.querySelectorAll('.delete-btn').length !== data.length) {
            renderShadow();
        }
    }

    // event delegation hapus
    list.addEventListener('click', (e) => {
        const btn = e.target.closest('.delete-btn');
        if (!btn) return;
        const idx = parseInt(btn.dataset.index, 10);
        if (isNaN(idx)) return;

        if (!confirm('Yakin ingin menghapus ucapan ini? 💬')) return;

        const data = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
        if (idx < 0 || idx >= data.length) return;
        data.splice(idx, 1);
        localStorage.setItem(LS_KEY, JSON.stringify(data));

        const card = btn.closest('.wish-card');
        if (card) {
            card.animate(
                [{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(0.95)' }],
                { duration: 220, easing: 'ease-out' }
            ).onfinish = () => { renderShadow(); };
        } else {
            renderShadow();
        }
    });

    // perhatikan perubahan DOM (render asli) -> sisipkan tombol lagi
    const mo = new MutationObserver(() => ensureDeleteButtons());
    mo.observe(list, { childList: true, subtree: true });

    // sync setelah submit form asli
    const form = document.getElementById('wishForm');
    if (form) {
        form.addEventListener('submit', () => {
            setTimeout(() => ensureDeleteButtons(), 0);
        }, true);
    }

    // sync antar tab
    window.addEventListener('storage', (e) => {
        if (e.key === LS_KEY) {
            renderShadow();
            ensureDeleteButtons();
        }
    });

    // inisialisasi
    const dataNow = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
    if (dataNow.length) { renderShadow(); }
    ensureDeleteButtons();
})();

/* =================== UI/UX ADDONS – TANPA MENGUBAH KODE ASLI =================== */

/* A) Nav active underline (bagian link aktif mengikuti scroll) */
(function () {
    const links = Array.from(document.querySelectorAll('.nav-inner nav a[href^="#"]'));
    if (!links.length) return;
    const map = links
        .map(a => ({ a, sec: document.querySelector(a.getAttribute('href')) }))
        .filter(x => x.sec);

    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const id = '#' + e.target.id;
                links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === id));
            }
        });
    }, { root: null, rootMargin: '-40% 0px -55% 0px', threshold: 0 });
    map.forEach(m => io.observe(m.sec));
})();

/* B) Toast util */
function showToast(title, body, type = '') {
    const host = document.getElementById('toastStack');
    if (!host) return;
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.innerHTML = `<div class="t-title">${title}</div><div class="t-body">${body || ''}</div>`;
    host.appendChild(el);
    setTimeout(() => el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 280 }).onfinish = () => el.remove(), 2800);
}

/* C) Theme toggle (menyimpan preferensi) */
(function () {
    const btn = document.getElementById('toggleTheme');
    const KEY = 'hb_theme_v1';
    try {
        const saved = localStorage.getItem(KEY);
        if (saved === 'dark') document.body.classList.add('theme-dark');
    } catch (_) { }
    if (btn) {
        btn.addEventListener('click', () => {
            document.body.classList.toggle('theme-dark');
            try {
                localStorage.setItem(KEY, document.body.classList.contains('theme-dark') ? 'dark' : 'light');
            } catch (_) { }
        });
    }
})();

/* D) Web Share API (bagikan halaman) */
(function () {
    const btn = document.getElementById('sharePage');
    if (!btn || !navigator.share) return;
    btn.addEventListener('click', async () => {
        try {
            await navigator.share({
                title: document.title,
                text: 'Lihat halaman ulang tahun spesial ini 💖',
                url: location.href
            });
            showToast('Terkirim', 'Tautan berhasil dibagikan!', 'success');
        } catch (_) { }
    });
})();

/* E) Progress ring: % kemajuan menuju target (03 Nov 2025 dari data-bday) */
(function () {
    const sec = document.getElementById('countdown');
    const fg = document.querySelector('.progress-ring .pr-fg');
    const percentEl = document.getElementById('prPercent');
    const dateBadge = document.getElementById('targetDateBadge');
    if (!sec || !fg) return;

    // Ambil tanggal ISO dari atribut (sudah dinormalisasi oleh skrip kamu)
    const base = (sec.getAttribute('data-bday') || '').trim(); // YYYY-MM-DD
    const [yy, mm, dd] = base.split('-').map(n => parseInt(n, 10));
    if (!yy || !mm || !dd) return;

    // Tampilkan badge yang rapi (03 Nov 2025)
    if (dateBadge) {
        const namaBulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        dateBadge.textContent = `🎯 ${String(dd).padStart(2, '0')} ${namaBulan[mm - 1]} ${yy}`;
    }

    const CIRC = 2 * Math.PI * 52; // r=52 (lihat CSS)
    const dash = v => fg.style.strokeDashoffset = String(CIRC - (CIRC * v));

    function prevTarget(date) { return new Date(date.getFullYear() - 1, mm - 1, dd, 0, 0, 0); }
    function nextTarget(date) {
        const t = new Date(date.getFullYear(), mm - 1, dd, 0, 0, 0);
        return (t < date) ? new Date(date.getFullYear() + 1, mm - 1, dd, 0, 0, 0) : t;
    }

    function update() {
        const now = new Date();
        const nxt = nextTarget(now);
        const prv = prevTarget(nxt);
        const total = nxt - prv;
        const gone = now - prv;
        const ratio = Math.min(1, Math.max(0, gone / total));
        dash(ratio);
        if (percentEl) percentEl.textContent = Math.round(ratio * 100) + '%';
    }

    // inisialisasi stroke length
    fg.setAttribute('stroke-dasharray', String(CIRC));
    fg.setAttribute('stroke-dashoffset', String(CIRC));
    update();
    setInterval(update, 1000);
})();

/* F) Section reveal (tanpa library) */
(function () {
    const targets = document.querySelectorAll('.section-card, .memories, .hero-section');
    targets.forEach(t => t.classList.add('reveal'));
    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
    }, { root: null, threshold: .08 });
    targets.forEach(t => io.observe(t));
})();

/* G) Personalisasi nama penerima via query param ?to=Nama (opsional) */
(function () {
    const params = new URLSearchParams(location.search);
    const to = (params.get('to') || '').trim();
    if (!to) return;
    const title = document.querySelector('.main-title');
    if (title) {
        const base = '🎂 Happy Birthday';
        title.textContent = `${base} ${to} 💕`;
    }
})();

/* H) Notifikasi kecil saat menyimpan ucapan */
(function () {
    const form = document.getElementById('wishForm');
    if (!form) return;
    form.addEventListener('submit', () => {
        setTimeout(() => showToast('Tersimpan', 'Ucapanmu telah ditambahkan 💖', 'success'), 50);
    }, true);
})();

/* ====== Fix 100vh di Mobile (set --vh) ====== */
(function(){
  function setVH(){
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
  setVH();
  window.addEventListener('resize', setVH);
  window.addEventListener('orientationchange', setVH);
})();

