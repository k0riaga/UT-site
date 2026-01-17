// ui.js — премиум UI логика (для index.html). (() => { 'use strict'; const doc = document; const root = doc.documentElement; // Elements const themeBtn = doc.getElementById('themeBtn'); const settingsBtn = doc.getElementById('settingsBtn'); const authBtn = doc.getElementById('authBtn'); const settingsModal = doc.getElementById('settingsModal'); const settingsClose = doc.getElementById('settingsClose'); const authModal = doc.getElementById('authModal'); const authClose = doc.getElementById('authClose'); const yearEl = doc.getElementById('year'); // Controls inside settings const tabButtons = Array.from(doc.querySelectorAll('.tab')); const tabPanes = Array.from(doc.querySelectorAll('.tab-pane')); // quick controls const fontSizeSelect = doc.getElementById('fontSize'); const particlesBtn = doc.getElementById('toggleParticles'); const soundsBtn = doc.getElementById('toggleSounds'); // panel controls const themeLightBtn = doc.getElementById('themeLight'); const themeDarkBtn = doc.getElementById('themeDark'); const fontSizePanel = doc.getElementById('fontSizePanel'); const particlesPanelToggle = doc.getElementById('particlesPanelToggle'); const reducedMotionToggle = doc.getElementById('reducedMotionToggle'); const saveAccountBtn = doc.getElementById('saveAccount'); const resetAccountBtn = doc.getElementById('resetAccount'); const accName = doc.getElementById('accName'); const accEmail = doc.getElementById('accEmail'); const exportBtn = doc.getElementById('exportBtn'); const importBtn = doc.getElementById('importBtn'); const importArea = doc.getElementById('importArea'); // security elements const twoFAToggle = doc.getElementById('twoFA'); const sessionLockToggle = doc.getElementById('sessionLock'); const resetPwdBtn = doc.getElementById('resetPwd'); // notify const pushToggle = doc.getElementById('pushToggle'); const mailToggle = doc.getElementById('mailToggle'); const soundOn = doc.getElementById('soundOn'); const soundOff = doc.getElementById('soundOff'); // auth const authLogin = doc.getElementById('authLogin'); const authRegister = doc.getElementById('authRegister'); const authLog = doc.getElementById('authLog'); // Particles canvas const canvas = doc.getElementById('particle-canvas'); const ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null; let particles = []; let particleEnabled = localStorage.getItem('ut_particles') !== 'false'; let raf = null; // Year if (yearEl) yearEl.textContent = new Date().getFullYear(); // Helpers: save/load settings function getDefaultSettings(){ return { theme: localStorage.getItem('ut_theme') || 'dark', fontSize: localStorage.getItem('ut_font') || '16', particles: localStorage.getItem('ut_particles') !== 'false', sounds: localStorage.getItem('ut_sounds') === 'true', reducedMotion: localStorage.getItem('ut_reduced') === 'true', uiDensity: localStorage.getItem('ut_density') || 'normal', account: JSON.parse(localStorage.getItem('ut_account') || '{}'), security: { twoFA: localStorage.getItem('ut_2fa') === 'true', sessionLock: localStorage.getItem('ut_lock') === 'true' }, notify: { push: localStorage.getItem('ut_push') === 'true', mail: localStorage.getItem('ut_mail') === 'true' } }; } let settings = getDefaultSettings(); // Apply theme function applyTheme(theme){ if(theme === 'light') root.classList.add('light'); else root.classList.remove('light'); localStorage.setItem('ut_theme', theme); // visual feedback on button if(themeBtn) themeBtn.textContent = theme === 'light' ? '☀️' : '🌙'; settings.theme = theme; } applyTheme(settings.theme); // Apply font size function applyFontSize(px){ root.style.setProperty('--font-size-base', px + 'px'); localStorage.setItem('ut_font', px); if (fontSizeSelect) fontSizeSelect.value = px; if (fontSizePanel) fontSizePanel.value = px; settings.fontSize = px; } applyFontSize(settings.fontSize); // Reduced motion function applyReducedMotion(on){ if(on) root.classList.add('reduced-motion'); else root.classList.remove('reduced-motion'); localStorage.setItem('ut_reduced', on ? 'true' : 'false'); settings.reducedMotion = on; } applyReducedMotion(settings.reducedMotion); // UI density function applyDensity(value){ document.body.dataset.density = value; localStorage.setItem('ut_density', value); settings.uiDensity = value; } applyDensity(localStorage.getItem('ut_density') || 'normal'); // Particles implementation (optimized) function resizeCanvas(){ if(!canvas || !ctx) return; const dpr = Math.max(1, window.devicePixelRatio || 1); canvas.width = Math.floor(innerWidth * dpr); canvas.height = Math.floor(innerHeight * dpr); canvas.style.width = innerWidth + 'px'; canvas.style.height = innerHeight + 'px'; ctx.setTransform(dpr,0,0,dpr,0,0); } window.addEventListener('resize', resizeCanvas); resizeCanvas(); function createParticles(count = 88){ particles = []; for(let i=0;i<count;i++){ particles.push({ x: Math.random()*innerWidth, y: Math.random()*innerHeight, r: 0.6 + Math.random()*4.4, vx: (Math.random()-0.5)*0.6, vy: (Math.random()-0.5)*0.6, hue: 170 + Math.random()*150, a: 0.03 + Math.random()*0.08 }); } } createParticles(88); function drawParticles(){ if(!canvas || !ctx) return; ctx.clearRect(0,0,canvas.width,canvas.height); if(!particleEnabled) return; for(const p of particles){ p.x += p.vx; p.y += p.vy; if(p.x < -40) p.x = innerWidth + 40; if(p.x > innerWidth + 40) p.x = -40; if(p.y < -40) p.y = innerHeight + 40; if(p.y > innerHeight + 40) p.y = -40; const g = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*8); g.addColorStop(0, hsla(${p.hue},85%,64%,${p.a})); g.addColorStop(0.6, hsla(${p.hue},70%,50%,${p.a*0.4})); g.addColorStop(1, hsla(${p.hue},60%,40%,0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x,p.y,p.r*8,0,Math.PI*2); ctx.fill(); } raf = requestAnimationFrame(drawParticles); } function startParticles(){ particleEnabled = true; localStorage.setItem('ut_particles','true'); settings.particles = true; if(!raf) drawParticles(); } function stopParticles(){ particleEnabled = false; localStorage.setItem('ut_particles','false'); settings.particles = false; if(raf) { cancelAnimationFrame(raf); raf = null; ctx && ctx.clearRect(0,0,canvas.width,canvas.height); } } if(settings.particles) drawParticles(); // Toggle handlers themeBtn?.addEventListener('click', ()=> applyTheme(root.classList.contains('light') ? 'dark' : 'light')); themeLightBtn?.addEventListener('click', ()=> applyTheme('light')); themeDarkBtn?.addEventListener('click', ()=> applyTheme('dark')); fontSizeSelect?.addEventListener('change', e => applyFontSize(e.target.value)); fontSizePanel?.addEventListener('change', e => applyFontSize(e.target.value)); particlesBtn?.addEventListener('click', ()=> { particleEnabled = !particleEnabled; if(particleEnabled) startParticles(); else stopParticles(); if(particlesBtn) particlesBtn.classList.toggle('active', particleEnabled); }); particlesPanelToggle?.addEventListener('click', ()=> { particleEnabled = !particleEnabled; if(particleEnabled) startParticles(); else stopParticles(); particlesPanelToggle.classList.toggle('active', particleEnabled); }); soundsBtn?.addEventListener('click', ()=> { settings.sounds = !settings.sounds; localStorage.setItem('ut_sounds', settings.sounds ? 'true' : 'false'); soundsBtn.classList.toggle('active', settings.sounds); // demo tiny click if(settings.sounds){ try{ const click = new Audio(); click.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA='; click.play().catch(()=>{}); }catch(e){} } }); reducedMotionToggle?.addEventListener('click', ()=> { settings.reducedMotion = !settings.reducedMotion; applyReducedMotion(settings.reducedMotion); }); function applyReducedMotion(on){ if(on) root.classList.add('reduced-motion'); else root.classList.remove('reduced-motion'); localStorage.setItem('ut_reduced', on ? 'true' : 'false'); } // Tabs logic (settings) tabButtons.forEach(btn => { btn.addEventListener('click', ()=> { tabButtons.forEach(b => b.classList.toggle('active', b === btn)); const target = btn.dataset.tab; tabPanes.forEach(p => p.classList.toggle('hidden', p.dataset.pane !== target)); }); }); // Modals: open only by buttons (not visible by default) function openModal(modal){ if(!modal) return; modal.classList.add('show'); modal.classList.remove('hidden'); modal.style.display = 'flex'; modal.setAttribute('aria-hidden','false'); document.body.style.overflow = 'hidden'; // focus first input const f = modal.querySelector('input,button,select,textarea'); if(f) setTimeout(()=> f.focus(), 120); } function closeModal(modal){ if(!modal) return; modal.classList.remove('show'); modal.classList.add('hidden'); modal.style.display = 'none'; modal.setAttribute('aria-hidden','true'); document.body.style.overflow = ''; } // Wire buttons (open only by click) settingsBtn?.addEventListener('click', ()=> openModal(settingsModal)); settingsClose?.addEventListener('click', ()=> closeModal(settingsModal)); authBtn?.addEventListener('click', ()=> openModal(authModal)); authClose?.addEventListener('click', ()=> closeModal(authModal)); doc.querySelectorAll('[data-close="true"]').forEach(el => el.addEventListener('click', ()=> { closeModal(settingsModal); closeModal(authModal); })); // Close on escape window.addEventListener('keydown', e => { if(e.key === 'Escape'){ closeModal(settingsModal); closeModal(authModal); } }); // Account save/reset saveAccountBtn?.addEventListener('click', ()=> { const a = accName.value || ''; const e = accEmail.value || ''; settings.account = {name: a, email: e}; localStorage.setItem('ut_account', JSON.stringify(settings.account)); alert('Данные профиля сохранены (локально).'); }); resetAccountBtn?.addEventListener('click', ()=> { accName.value = ''; accEmail.value = ''; settings.account = {}; localStorage.removeItem('ut_account'); alert('Профиль сброшен.'); }); // Security toggles twoFAToggle?.addEventListener('click', ()=> { settings.security.twoFA = !settings.security.twoFA; localStorage.setItem('ut_2fa', settings.security.twoFA ? 'true' : 'false'); twoFAToggle.checked = settings.security.twoFA; }); sessionLockToggle?.addEventListener('click', ()=> { settings.security.sessionLock = !settings.security.sessionLock; localStorage.setItem('ut_lock', settings.security.sessionLock ? 'true' : 'false'); sessionLockToggle.checked = settings.security.sessionLock; }); resetPwdBtn?.addEventListener('click', ()=> { alert('Сброс пароля (демо) - добавь backend для реальной работы.'); }); // Push/mail toggles pushToggle?.addEventListener('click', ()=> { settings.notify = settings.notify || {}; settings.notify.push = !settings.notify.push; localStorage.setItem('ut_push', settings.notify.push ? 'true' : 'false'); pushToggle.checked = settings.notify.push; }); mailToggle?.addEventListener('click', ()=> { settings.notify = settings.notify || {}; settings.notify.mail = !settings.notify.mail; localStorage.setItem('ut_mail', settings.notify.mail ? 'true' : 'false'); mailToggle.checked = settings.notify.mail; }); // Sound on/off soundOn?.addEventListener('click', ()=> { settings.sounds = true; localStorage.setItem('ut_sounds','true'); alert('Звуки включены (демо).'); }); soundOff?.addEventListener('click', ()=> { settings.sounds = false; localStorage.setItem('ut_sounds','false'); alert('Звуки отключены.'); }); // Export / Import exportBtn?.addEventListener('click', ()=> { const toExport = { theme: settings.theme, fontSize: settings.fontSize, particles: settings.particles, sounds: settings.sounds, reducedMotion: settings.reducedMotion, uiDensity: settings.uiDensity, account: settings.account, security: settings.security, notify: settings.notify }; const blob = new Blob([JSON.stringify(toExport, null, 2)], {type:'application/json'}); const url = URL.createObjectURL(blob); const a = doc.createElement('a'); a.href = url; a.download = 'ut_settings.json'; a.click(); URL.revokeObjectURL(url); }); importBtn?.addEventListener('click', ()=> { try { const data = JSON.parse(importArea.value); if(!data) throw new Error('Пустой JSON'); // apply values defensively if(data.theme) applyTheme(data.theme); if(data.fontSize) applyFontSize(data.fontSize); if(typeof data.particles !== 'undefined'){ data.particles ? startParticles() : stopParticles(); } if(typeof data.sounds !== 'undefined'){ settings.sounds = !!data.sounds; localStorage.setItem('ut_sounds', settings.sounds ? 'true' : 'false'); } if(typeof data.reducedMotion !== 'undefined'){ applyReducedMotion(!!data.reducedMotion); } if(data.uiDensity) applyDensity(data.uiDensity); if(data.account) { settings.account = data.account; localStorage.setItem('ut_account', JSON.stringify(data.account)); accName.value = data.account.name || ''; accEmail.value = data.account.email || ''; } if(data.security){ settings.security = data.security; localStorage.setItem('ut_2fa', data.security.twoFA ? 'true':'false'); twoFAToggle.checked = !!data.security.twoFA; } if(data.notify){ settings.notify = data.notify; localStorage.setItem('ut_push', data.notify.push ? 'true':'false'); pushToggle.checked = !!data.notify.push; } alert('Настройки импортированы и применены.'); } catch(err){ alert('Ошибка импорта: ' + err.message); } }); // AUTH demo authLogin?.addEventListener('click', ()=> { const email = doc.getElementById('authEmail').value.trim(); const pass = doc.getElementById('authPass').value.trim(); if(!email || !pass) { authLog.textContent = 'Введите email и пароль'; return; } localStorage.setItem('ut_user', JSON.stringify({email})); authLog.textContent = 'Вход выполнен (демо)'; setTimeout(()=> closeModal(authModal), 700); }); authRegister?.addEventListener('click', ()=> { authLog.textContent = 'Регистрация (демо) завершена'; setTimeout(()=> closeModal(authModal), 700); }); // Fill UI from settings on load function hydrateUI(){ // theme already applied if(fontSizeSelect) fontSizeSelect.value = settings.fontSize; if(fontSizePanel) fontSizePanel.value = settings.fontSize; if(particlesBtn) particlesBtn.classList.toggle('active', settings.particles); if(soundsBtn) soundsBtn.classList.toggle('active', settings.sounds); if(particlesPanelToggle) particlesPanelToggle.classList.toggle('active', settings.particles); if(twoFAToggle) twoFAToggle.checked = settings.security.twoFA; if(sessionLockToggle) sessionLockToggle.checked = settings.security.sessionLock; if(pushToggle) pushToggle.checked = settings.notify && settings.notify.push; if(mailToggle) mailToggle.checked = settings.notify && settings.notify.mail; if(settings.account){ accName.value = settings.account.name || ''; accEmail.value = settings.account.email || ''; } } hydrateUI(); // Ensure modals are hidden initially closeModal(settingsModal); closeModal(authModal); // micro-interaction: press animation doc.addEventListener('pointerdown', e => { const el = e.target.closest('button, a'); if(!el) return; el.animate([{ transform: 'scale(.995)' }, { transform: 'scale(1)' }], { duration: 140, easing: 'cubic-bezier(.2,.9,.2,1)' }); }); // convenience: save settings on unload window.addEventListener('beforeunload', ()=> { localStorage.setItem('ut_settings_snapshot', JSON.stringify({ theme: settings.theme, fontSize: settings.fontSize, particles: settings.particles, sounds: settings.sounds, reducedMotion: settings.reducedMotion, uiDensity: settings.uiDensity, account: settings.account, security: settings.security, notify: settings.notify })); }); })(); document.addEventListener("DOMContentLoaded", () => { /* ========================= 🌙 СМЕНА ТЕМЫ ========================== */ const themeBtn = document.getElementById("themeToggle"); let theme = localStorage.getItem("theme") || "dark"; applyTheme(theme); themeBtn?.addEventListener("click", () => { theme = theme === "dark" ? "light" : "dark"; localStorage.setItem("theme", theme); applyTheme(theme); }); function applyTheme(mode) { document.documentElement.setAttribute("data-theme", mode); if (themeBtn) { themeBtn.textContent = mode === "dark" ? "🌙" : "☀"; } } /* ========================= ⚙️ SETTINGS MODAL ========================== */ const settingsBtn = document.getElementById("settingsBtn"); const settingsModal = document.getElementById("settingsModal"); const settingsClose = document.getElementById("settingsClose"); settingsBtn?.addEventListener("click", () => { openModal(settingsModal); }); settingsClose?.addEventListener("click", () => { closeModal(settingsModal); }); /* ========================= 📑 Tabs (в настройках) ========================== */ const tabs = document.querySelectorAll(".tab"); const panes = document.querySelectorAll(".tab-pane"); tabs.forEach(tab => { tab.addEventListener("click", () => { const target = tab.dataset.tab; tabs.forEach(t => t.classList.remove("active")); tab.classList.add("active"); panes.forEach(pane => { const id = pane.dataset.pane; pane.classList.toggle("hidden", id !== target); }); }); }); /* ========================= 🔐 AUTH MODAL ========================== */ const authBtn = document.getElementById("authBtn"); const authModal = document.getElementById("authModalWrap"); const authClose = document.getElementById("authClose"); const authCancel = document.getElementById("authCancel"); authBtn?.addEventListener("click", () => { openModal(authModal); }); authClose?.addEventListener("click", () => { closeModal(authModal); }); authCancel?.addEventListener("click", () => { closeModal(authModal); }); /* ========================= 🧩 UNIVERSAL MODAL HANDLER ========================== */ function openModal(modal) { if (!modal) return; modal.classList.add("active"); modal.style.display = "flex"; document.body.classList.add("modal-open"); } function closeModal(modal) { if (!modal) return; modal.classList.remove("active"); modal.style.display = "none"; document.body.classList.remove("modal-open"); } /* ========================= 🖱 Клик по фону — закрытие ========================== */ document.querySelectorAll(".modal-backdrop").forEach(bg => { bg.addEventListener("click", (e) => { if (e.target.dataset.close) { const modal = bg.closest("#authModalWrap, #settingsModal"); closeModal(modal); } }); }); /* ========================= ⌨ ESC — закрыть все модалки ========================== */ document.addEventListener("keydown", (e) => { if (e.key !== "Escape") return; document .querySelectorAll("#authModalWrap, #settingsModal") .forEach(modal => closeModal(modal)); }); });
(() => {
  const BASE = "https://ultimatetoolkit.ru";
  const path = location.pathname.replace(/\/$/, "") || "/";

  /* =========================
     1. СЛУЖЕБНЫЕ ФУНКЦИИ
  ========================= */

  const setTitle = (text) => {
    document.title = text;
    setOG("og:title", text);
  };

  const setDescription = (text) => {
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = text;
    setOG("og:description", text);
  };

  const setCanonical = (url) => {
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = url;
  };

  const setOG = (property, content) => {
    let meta = document.querySelector(`meta[property="${property}"]`);
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("property", property);
      document.head.appendChild(meta);
    }
    meta.content = content;
  };

  const ensureH1 = (text) => {
    if (document.querySelector("h1")) return;
    const h1 = document.createElement("h1");
    h1.textContent = text;
    h1.style.position = "absolute";
    h1.style.left = "-9999px";
    document.body.prepend(h1);
  };

  /* =========================
     2. СТАТИЧЕСКИЕ СТРАНИЦЫ
  ========================= */

  const STATIC_PAGES = {
    "/": {
      title: "Ultimate Toolkit — онлайн инструменты",
      description:
        "Ultimate Toolkit — набор онлайн-инструментов: генератор паролей, никнеймов, таймеры, рандомайзер, колесо фортуны и отсчёт до даты.",
      h1: "Ultimate Toolkit — онлайн инструменты"
    },

    "/random": {
      title: "Рандомайзер онлайн — числа и слова",
      description:
        "Онлайн рандомайзер чисел, слов и списков. Бесплатно, быстро и без регистрации.",
      h1: "Рандомайзер онлайн"
    },

    "/wheel": {
      title: "Колесо фортуны онлайн",
      description:
        "Колесо фортуны для розыгрышей и случайного выбора. Подходит для конкурсов и игр.",
      h1: "Колесо фортуны"
    },

    "/password": {
      title: "Генератор паролей онлайн",
      description:
        "Генератор надёжных паролей онлайн. Создание сложных и безопасных паролей.",
      h1: "Генератор паролей"
    },

    "/nickname": {
      title: "Генератор никнеймов онлайн",
      description:
        "Онлайн генератор никнеймов для игр, соцсетей и аккаунтов.",
      h1: "Генератор никнеймов"
    },

    "/timer": {
      title: "Онлайн таймер",
      description:
        "Онлайн таймер для учёбы, работы и спорта. Запуск без регистрации.",
      h1: "Онлайн таймер"
    }
  };

  /* =========================
     3. COUNTDOWN (АВТОМАТ)
  ========================= */

  const countdownMatch = path.match(/^\/countdown-(\d+)$/);

  if (countdownMatch) {
    const days = countdownMatch[1];

    const title = `Отсчёт до даты — ${days} дней`;
    const description =
      `Онлайн отсчёт времени до даты на ${days} дней. Таймер обратного отсчёта без регистрации.`;
    const h1 = `Отсчёт до даты: ${days} дней`;

    setTitle(title);
    setDescription(description);
    setCanonical(`${BASE}${path}`);
    ensureH1(h1);

    return;
  }

  /* =========================
     4. ПРИМЕНЕНИЕ СТАТИКИ
  ========================= */

  const page = STATIC_PAGES[path];
  if (!page) return;

  setTitle(page.title);
  setDescription(page.description);
  setCanonical(`${BASE}${path}`);
  ensureH1(page.h1);

})();
