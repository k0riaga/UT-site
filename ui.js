// ui.js — UI логика (для index.html). (() => { 'use strict'; const doc = document; const root = doc.documentElement; // Elements const themeBtn = doc.getElementById('themeBtn'); const settingsBtn = doc.getElementById('settingsBtn'); const authBtn = doc.getElementById('authBtn'); const settingsModal = doc.getElementById('settingsModal'); const settingsClose = doc.getElementById('settingsClose'); const authModal = doc.getElementById('authModal'); const authClose = doc.getElementById('authClose'); const yearEl = doc.getElementById('year'); // Controls inside settings const tabButtons = Array.from(doc.querySelectorAll('.tab')); const tabPanes = Array.from(doc.querySelectorAll('.tab-pane')); // quick controls const fontSizeSelect = doc.getElementById('fontSize'); const particlesBtn = doc.getElementById('toggleParticles'); const soundsBtn = doc.getElementById('toggleSounds'); // panel controls const themeLightBtn = doc.getElementById('themeLight'); const themeDarkBtn = doc.getElementById('themeDark'); const fontSizePanel = doc.getElementById('fontSizePanel'); const particlesPanelToggle = doc.getElementById('particlesPanelToggle'); const reducedMotionToggle = doc.getElementById('reducedMotionToggle'); const saveAccountBtn = doc.getElementById('saveAccount'); const resetAccountBtn = doc.getElementById('resetAccount'); const accName = doc.getElementById('accName'); const accEmail = doc.getElementById('accEmail'); const exportBtn = doc.getElementById('exportBtn'); const importBtn = doc.getElementById('importBtn'); const importArea = doc.getElementById('importArea'); // security elements const twoFAToggle = doc.getElementById('twoFA'); const sessionLockToggle = doc.getElementById('sessionLock'); const resetPwdBtn = doc.getElementById('resetPwd'); // notify const pushToggle = doc.getElementById('pushToggle'); const mailToggle = doc.getElementById('mailToggle'); const soundOn = doc.getElementById('soundOn'); const soundOff = doc.getElementById('soundOff'); // auth const authLogin = doc.getElementById('authLogin'); const authRegister = doc.getElementById('authRegister'); const authLog = doc.getElementById('authLog'); // Particles canvas const canvas = doc.getElementById('particle-canvas'); const ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null; let particles = []; let particleEnabled = localStorage.getItem('ut_particles') !== 'false'; let raf = null; // Year if (yearEl) yearEl.textContent = new Date().getFullYear(); // Helpers: save/load settings function getDefaultSettings(){ return { theme: localStorage.getItem('ut_theme') || 'dark', fontSize: localStorage.getItem('ut_font') || '16', particles: localStorage.getItem('ut_particles') !== 'false', sounds: localStorage.getItem('ut_sounds') === 'true', reducedMotion: localStorage.getItem('ut_reduced') === 'true', uiDensity: localStorage.getItem('ut_density') || 'normal', account: JSON.parse(localStorage.getItem('ut_account') || '{}'), security: { twoFA: localStorage.getItem('ut_2fa') === 'true', sessionLock: localStorage.getItem('ut_lock') === 'true' }, notify: { push: localStorage.getItem('ut_push') === 'true', mail: localStorage.getItem('ut_mail') === 'true' } }; } let settings = getDefaultSettings(); // Apply theme function applyTheme(theme){ if(theme === 'light') root.classList.add('light'); else root.classList.remove('light'); localStorage.setItem('ut_theme', theme); // visual feedback on button if(themeBtn) themeBtn.textContent = theme === 'light' ? '☀️' : '🌙'; settings.theme = theme; } applyTheme(settings.theme); // Apply font size function applyFontSize(px){ root.style.setProperty('--font-size-base', px + 'px'); localStorage.setItem('ut_font', px); if (fontSizeSelect) fontSizeSelect.value = px; if (fontSizePanel) fontSizePanel.value = px; settings.fontSize = px; } applyFontSize(settings.fontSize); // Reduced motion function applyReducedMotion(on){ if(on) root.classList.add('reduced-motion'); else root.classList.remove('reduced-motion'); localStorage.setItem('ut_reduced', on ? 'true' : 'false'); settings.reducedMotion = on; } applyReducedMotion(settings.reducedMotion); // UI density function applyDensity(value){ document.body.dataset.density = value; localStorage.setItem('ut_density', value); settings.uiDensity = value; } applyDensity(localStorage.getItem('ut_density') || 'normal'); // Particles implementation (optimized) function resizeCanvas(){ if(!canvas || !ctx) return; const dpr = Math.max(1, window.devicePixelRatio || 1); canvas.width = Math.floor(innerWidth * dpr); canvas.height = Math.floor(innerHeight * dpr); canvas.style.width = innerWidth + 'px'; canvas.style.height = innerHeight + 'px'; ctx.setTransform(dpr,0,0,dpr,0,0); } window.addEventListener('resize', resizeCanvas); resizeCanvas(); function createParticles(count = 88){ particles = []; for(let i=0;i<count;i++){ particles.push({ x: Math.random()*innerWidth, y: Math.random()*innerHeight, r: 0.6 + Math.random()*4.4, vx: (Math.random()-0.5)*0.6, vy: (Math.random()-0.5)*0.6, hue: 170 + Math.random()*150, a: 0.03 + Math.random()*0.08 }); } } createParticles(88); function drawParticles(){ if(!canvas || !ctx) return; ctx.clearRect(0,0,canvas.width,canvas.height); if(!particleEnabled) return; for(const p of particles){ p.x += p.vx; p.y += p.vy; if(p.x < -40) p.x = innerWidth + 40; if(p.x > innerWidth + 40) p.x = -40; if(p.y < -40) p.y = innerHeight + 40; if(p.y > innerHeight + 40) p.y = -40; const g = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*8); g.addColorStop(0, hsla(${p.hue},85%,64%,${p.a})); g.addColorStop(0.6, hsla(${p.hue},70%,50%,${p.a*0.4})); g.addColorStop(1, hsla(${p.hue},60%,40%,0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x,p.y,p.r*8,0,Math.PI*2); ctx.fill(); } raf = requestAnimationFrame(drawParticles); } function startParticles(){ particleEnabled = true; localStorage.setItem('ut_particles','true'); settings.particles = true; if(!raf) drawParticles(); } function stopParticles(){ particleEnabled = false; localStorage.setItem('ut_particles','false'); settings.particles = false; if(raf) { cancelAnimationFrame(raf); raf = null; ctx && ctx.clearRect(0,0,canvas.width,canvas.height); } } if(settings.particles) drawParticles(); // Toggle handlers themeBtn?.addEventListener('click', ()=> applyTheme(root.classList.contains('light') ? 'dark' : 'light')); themeLightBtn?.addEventListener('click', ()=> applyTheme('light')); themeDarkBtn?.addEventListener('click', ()=> applyTheme('dark')); fontSizeSelect?.addEventListener('change', e => applyFontSize(e.target.value)); fontSizePanel?.addEventListener('change', e => applyFontSize(e.target.value)); particlesBtn?.addEventListener('click', ()=> { particleEnabled = !particleEnabled; if(particleEnabled) startParticles(); else stopParticles(); if(particlesBtn) particlesBtn.classList.toggle('active', particleEnabled); }); particlesPanelToggle?.addEventListener('click', ()=> { particleEnabled = !particleEnabled; if(particleEnabled) startParticles(); else stopParticles(); particlesPanelToggle.classList.toggle('active', particleEnabled); }); soundsBtn?.addEventListener('click', ()=> { settings.sounds = !settings.sounds; localStorage.setItem('ut_sounds', settings.sounds ? 'true' : 'false'); soundsBtn.classList.toggle('active', settings.sounds); // demo tiny click if(settings.sounds){ try{ const click = new Audio(); click.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA='; click.play().catch(()=>{}); }catch(e){} } }); reducedMotionToggle?.addEventListener('click', ()=> { settings.reducedMotion = !settings.reducedMotion; applyReducedMotion(settings.reducedMotion); }); function applyReducedMotion(on){ if(on) root.classList.add('reduced-motion'); else root.classList.remove('reduced-motion'); localStorage.setItem('ut_reduced', on ? 'true' : 'false'); } // Tabs logic (settings) tabButtons.forEach(btn => { btn.addEventListener('click', ()=> { tabButtons.forEach(b => b.classList.toggle('active', b === btn)); const target = btn.dataset.tab; tabPanes.forEach(p => p.classList.toggle('hidden', p.dataset.pane !== target)); }); }); // Modals: open only by buttons (not visible by default) function openModal(modal){ if(!modal) return; modal.classList.add('show'); modal.classList.remove('hidden'); modal.style.display = 'flex'; modal.setAttribute('aria-hidden','false'); document.body.style.overflow = 'hidden'; // focus first input const f = modal.querySelector('input,button,select,textarea'); if(f) setTimeout(()=> f.focus(), 120); } function closeModal(modal){ if(!modal) return; modal.classList.remove('show'); modal.classList.add('hidden'); modal.style.display = 'none'; modal.setAttribute('aria-hidden','true'); document.body.style.overflow = ''; } // Wire buttons (open only by click) settingsBtn?.addEventListener('click', ()=> openModal(settingsModal)); settingsClose?.addEventListener('click', ()=> closeModal(settingsModal)); authBtn?.addEventListener('click', ()=> openModal(authModal)); authClose?.addEventListener('click', ()=> closeModal(authModal)); doc.querySelectorAll('[data-close="true"]').forEach(el => el.addEventListener('click', ()=> { closeModal(settingsModal); closeModal(authModal); })); // Close on escape window.addEventListener('keydown', e => { if(e.key === 'Escape'){ closeModal(settingsModal); closeModal(authModal); } }); // Account save/reset saveAccountBtn?.addEventListener('click', ()=> { const a = accName.value || ''; const e = accEmail.value || ''; settings.account = {name: a, email: e}; localStorage.setItem('ut_account', JSON.stringify(settings.account)); alert('Данные профиля сохранены (локально).'); }); resetAccountBtn?.addEventListener('click', ()=> { accName.value = ''; accEmail.value = ''; settings.account = {}; localStorage.removeItem('ut_account'); alert('Профиль сброшен.'); }); // Security toggles twoFAToggle?.addEventListener('click', ()=> { settings.security.twoFA = !settings.security.twoFA; localStorage.setItem('ut_2fa', settings.security.twoFA ? 'true' : 'false'); twoFAToggle.checked = settings.security.twoFA; }); sessionLockToggle?.addEventListener('click', ()=> { settings.security.sessionLock = !settings.security.sessionLock; localStorage.setItem('ut_lock', settings.security.sessionLock ? 'true' : 'false'); sessionLockToggle.checked = settings.security.sessionLock; }); resetPwdBtn?.addEventListener('click', ()=> { alert('Сброс пароля (демо) - добавь backend для реальной работы.'); }); // Push/mail toggles pushToggle?.addEventListener('click', ()=> { settings.notify = settings.notify || {}; settings.notify.push = !settings.notify.push; localStorage.setItem('ut_push', settings.notify.push ? 'true' : 'false'); pushToggle.checked = settings.notify.push; }); mailToggle?.addEventListener('click', ()=> { settings.notify = settings.notify || {}; settings.notify.mail = !settings.notify.mail; localStorage.setItem('ut_mail', settings.notify.mail ? 'true' : 'false'); mailToggle.checked = settings.notify.mail; }); // Sound on/off soundOn?.addEventListener('click', ()=> { settings.sounds = true; localStorage.setItem('ut_sounds','true'); alert('Звуки включены (демо).'); }); soundOff?.addEventListener('click', ()=> { settings.sounds = false; localStorage.setItem('ut_sounds','false'); alert('Звуки отключены.'); }); // Export / Import exportBtn?.addEventListener('click', ()=> { const toExport = { theme: settings.theme, fontSize: settings.fontSize, particles: settings.particles, sounds: settings.sounds, reducedMotion: settings.reducedMotion, uiDensity: settings.uiDensity, account: settings.account, security: settings.security, notify: settings.notify }; const blob = new Blob([JSON.stringify(toExport, null, 2)], {type:'application/json'}); const url = URL.createObjectURL(blob); const a = doc.createElement('a'); a.href = url; a.download = 'ut_settings.json'; a.click(); URL.revokeObjectURL(url); }); importBtn?.addEventListener('click', ()=> { try { const data = JSON.parse(importArea.value); if(!data) throw new Error('Пустой JSON'); // apply values defensively if(data.theme) applyTheme(data.theme); if(data.fontSize) applyFontSize(data.fontSize); if(typeof data.particles !== 'undefined'){ data.particles ? startParticles() : stopParticles(); } if(typeof data.sounds !== 'undefined'){ settings.sounds = !!data.sounds; localStorage.setItem('ut_sounds', settings.sounds ? 'true' : 'false'); } if(typeof data.reducedMotion !== 'undefined'){ applyReducedMotion(!!data.reducedMotion); } if(data.uiDensity) applyDensity(data.uiDensity); if(data.account) { settings.account = data.account; localStorage.setItem('ut_account', JSON.stringify(data.account)); accName.value = data.account.name || ''; accEmail.value = data.account.email || ''; } if(data.security){ settings.security = data.security; localStorage.setItem('ut_2fa', data.security.twoFA ? 'true':'false'); twoFAToggle.checked = !!data.security.twoFA; } if(data.notify){ settings.notify = data.notify; localStorage.setItem('ut_push', data.notify.push ? 'true':'false'); pushToggle.checked = !!data.notify.push; } alert('Настройки импортированы и применены.'); } catch(err){ alert('Ошибка импорта: ' + err.message); } }); // AUTH demo authLogin?.addEventListener('click', ()=> { const email = doc.getElementById('authEmail').value.trim(); const pass = doc.getElementById('authPass').value.trim(); if(!email || !pass) { authLog.textContent = 'Введите email и пароль'; return; } localStorage.setItem('ut_user', JSON.stringify({email})); authLog.textContent = 'Вход выполнен (демо)'; setTimeout(()=> closeModal(authModal), 700); }); authRegister?.addEventListener('click', ()=> { authLog.textContent = 'Регистрация (демо) завершена'; setTimeout(()=> closeModal(authModal), 700); }); // Fill UI from settings on load function hydrateUI(){ // theme already applied if(fontSizeSelect) fontSizeSelect.value = settings.fontSize; if(fontSizePanel) fontSizePanel.value = settings.fontSize; if(particlesBtn) particlesBtn.classList.toggle('active', settings.particles); if(soundsBtn) soundsBtn.classList.toggle('active', settings.sounds); if(particlesPanelToggle) particlesPanelToggle.classList.toggle('active', settings.particles); if(twoFAToggle) twoFAToggle.checked = settings.security.twoFA; if(sessionLockToggle) sessionLockToggle.checked = settings.security.sessionLock; if(pushToggle) pushToggle.checked = settings.notify && settings.notify.push; if(mailToggle) mailToggle.checked = settings.notify && settings.notify.mail; if(settings.account){ accName.value = settings.account.name || ''; accEmail.value = settings.account.email || ''; } } hydrateUI(); // Ensure modals are hidden initially closeModal(settingsModal); closeModal(authModal); // micro-interaction: press animation doc.addEventListener('pointerdown', e => { const el = e.target.closest('button, a'); if(!el) return; el.animate([{ transform: 'scale(.995)' }, { transform: 'scale(1)' }], { duration: 140, easing: 'cubic-bezier(.2,.9,.2,1)' }); }); // convenience: save settings on unload window.addEventListener('beforeunload', ()=> { localStorage.setItem('ut_settings_snapshot', JSON.stringify({ theme: settings.theme, fontSize: settings.fontSize, particles: settings.particles, sounds: settings.sounds, reducedMotion: settings.reducedMotion, uiDensity: settings.uiDensity, account: settings.account, security: settings.security, notify: settings.notify })); }); })(); document.addEventListener("DOMContentLoaded", () => { /* ========================= 🌙 СМЕНА ТЕМЫ ========================== */ const themeBtn = document.getElementById("themeToggle"); let theme = localStorage.getItem("theme") || "dark"; applyTheme(theme); themeBtn?.addEventListener("click", () => { theme = theme === "dark" ? "light" : "dark"; localStorage.setItem("theme", theme); applyTheme(theme); }); function applyTheme(mode) { document.documentElement.setAttribute("data-theme", mode); if (themeBtn) { themeBtn.textContent = mode === "dark" ? "🌙" : "☀"; } } /* ========================= ⚙️ SETTINGS MODAL ========================== */ const settingsBtn = document.getElementById("settingsBtn"); const settingsModal = document.getElementById("settingsModal"); const settingsClose = document.getElementById("settingsClose"); settingsBtn?.addEventListener("click", () => { openModal(settingsModal); }); settingsClose?.addEventListener("click", () => { closeModal(settingsModal); }); /* ========================= 📑 Tabs (в настройках) ========================== */ const tabs = document.querySelectorAll(".tab"); const panes = document.querySelectorAll(".tab-pane"); tabs.forEach(tab => { tab.addEventListener("click", () => { const target = tab.dataset.tab; tabs.forEach(t => t.classList.remove("active")); tab.classList.add("active"); panes.forEach(pane => { const id = pane.dataset.pane; pane.classList.toggle("hidden", id !== target); }); }); }); /* ========================= 🔐 AUTH MODAL ========================== */ const authBtn = document.getElementById("authBtn"); const authModal = document.getElementById("authModalWrap"); const authClose = document.getElementById("authClose"); const authCancel = document.getElementById("authCancel"); authBtn?.addEventListener("click", () => { openModal(authModal); }); authClose?.addEventListener("click", () => { closeModal(authModal); }); authCancel?.addEventListener("click", () => { closeModal(authModal); }); /* ========================= 🧩 UNIVERSAL MODAL HANDLER ========================== */ function openModal(modal) { if (!modal) return; modal.classList.add("active"); modal.style.display = "flex"; document.body.classList.add("modal-open"); } function closeModal(modal) { if (!modal) return; modal.classList.remove("active"); modal.style.display = "none"; document.body.classList.remove("modal-open"); } /* ========================= 🖱 Клик по фону — закрытие ========================== */ document.querySelectorAll(".modal-backdrop").forEach(bg => { bg.addEventListener("click", (e) => { if (e.target.dataset.close) { const modal = bg.closest("#authModalWrap, #settingsModal"); closeModal(modal); } }); }); /* ========================= ⌨ ESC — закрыть все модалки ========================== */ document.addEventListener("keydown", (e) => { if (e.key !== "Escape") return; document .querySelectorAll("#authModalWrap, #settingsModal") .forEach(modal => closeModal(modal)); }); });
function setupFavicon() {
  // Создаём элемент link
  const link = document.createElement('link');
  link.rel = 'icon';
  
  // Порядок проверки: сначала корень, потом assets
  const candidates = [
    { path: '/favicon.ico', type: 'image/vnd.microsoft.icon' },
    { path: '/assets/logo/favicon.ico', type: 'image/vnd.microsoft.icon' },
    { path: '/favicon.png', type: 'image/png' },
    { path: '/assets/logo/favicon.png', type: 'image/png' }
  ];

  // Проверяем каждый вариант
  for (const candidate of candidates) {
    // Временная проверка доступности файла
    const testImg = new Image();
    testImg.onload = () => {
      // Если файл найден — применяем и выходим
      link.type = candidate.type;
      link.href = candidate.path;
      document.head.appendChild(link);
      console.log('Favicon загружен:', candidate.path);
      return; // Останавливаем цикл
    };
    testImg.onerror = () => {
      console.debug('Favicon не найден:', candidate.path);
    };
    testImg.src = candidate.path;
  }
}

// Запускаем после загрузки DOM
document.addEventListener('DOMContentLoaded', setupFavicon);

// Дополнительно: запускаем сразу (если DOM уже загружен)
if (document.readyState === 'complete') {
  setupFavicon();
}

(function () {
  const d = document;
  const w = window;
  const root = d.documentElement;
  const body = d.body;

  // 1. Создание глобальной обёртки для flex-layout
  function ensureLayout() {
    if (d.querySelector('.ut-layout')) return;

    const wrap = d.createElement('div');
    wrap.className = 'ut-layout';
    wrap.style.cssText = `
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      margin: 0;
      padding: 0;
    `;

    while (body.firstChild) wrap.appendChild(body.firstChild);
    body.appendChild(wrap);

    const footer = wrap.querySelector('footer');
    if (footer) footer.style.marginTop = 'auto';
  }
  ensureLayout();

  // 2. Адаптация футера (всегда внизу, независимо от масштаба)
  function stickyFooter() {
    const layout = d.querySelector('.ut-layout');
    const footer = d.querySelector('.ut-footer');

    function adjustFooter() {
      const docHeight = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        root.clientHeight,
        root.scrollHeight
      );
      const contentHeight = layout.offsetHeight - footer.offsetHeight;

      if (contentHeight < docHeight) {
        footer.style.marginTop = `${docHeight - contentHeight}px`;
      } else {
        footer.style.marginTop = 'auto';
      }
    }

    adjustFooter();
    w.addEventListener('resize', adjustFooter);
    w.addEventListener('scroll', adjustFooter);
  }
  stickyFooter();

  // 3. Адаптация хедера и основного контента (отступы, размеры)
  function adaptHeaderAndMain() {
    const header = d.querySelector('.header');
    const main = d.querySelector('main');

    if (!header || !main) return;

    function adjustSpacing() {
      main.style.marginTop = `${header.offsetHeight}px`;
      main.style.marginBottom = '64px'; // отступ под футер
    }

    adjustSpacing();
    w.addEventListener('resize', adjustSpacing);
  }
  adaptHeaderAndMain();

  // 4. Масштабирование элементов (пропорциональность)
  function responsiveScale() {
    const mediaQueries = [
      '(max-width: 1200px)',
      '(max-width: 992px)',
      '(max-width: 768px)',
      '(max-width: 576px)'
    ];

    mediaQueries.forEach(mq => {
      const media = w.matchMedia(mq);
      media.addListener(handleMediaChange);
      handleMediaChange(media);
    });

    function handleMediaChange(media) {
      if (media.matches) {
        root.classList.add(media.media.replace(/\(|\)/g, ''));
      } else {
        root.classList.remove(media.media.replace(/\(|\)/g, ''));
      }
    }
  }
  responsiveScale();

  // 5. Обработка частиц (работают при любом масштабе, включая 25%)
  const canvas = d.getElementById('particle-canvas');
  const ctx = canvas?.getContext('2d');

  function dynamicParticles() {
    if (!canvas || !ctx) return;

    let particles = [];
    let zoomLevel = 1;

    function resizeCanvas() {
      zoomLevel = Math.max(0.25, w.devicePixelRatio * (w.innerWidth / 1440)); // минимум 25%
      const height = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        root.clientHeight,
        root.scrollHeight
      );

      canvas.width = w.innerWidth * zoomLevel;
      canvas.height = height * zoomLevel;
      canvas.style.width = w.innerWidth + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(zoomLevel, 0, 0, zoomLevel, 0, 0);

      // Пересоздание частиц с сохранением плотности
      particles = Array.from({ length: 88 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 0.6 + Math.random() * 4.4,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        hue: 170 + Math.random() * 150,
        a: 0.03 + Math.random() * 0.08
      }));
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -40) p.x = canvas.width + 40;
        if (p.x > canvas.width + 40) p.x = -40;
        if (p.y < -40) p.y = canvas.height + 40;
        if (p.y > canvas.height + 40) p.y = -40;

        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 8);
        g.addColorStop(0, `hsla(${p.hue},85%,64%,${p.a})`);
        g.addColorStop(0.6, `hsla(${p.hue},70%,50%,${p.a * 0.4})`);
        g.addColorStop(1, `hsla(${p.hue},60%,40%,0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 8, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(drawParticles);
    }

    resizeCanvas();
    drawParticles();
    w.addEventListener('resize', resizeCanvas);
    w.addEventListener('zoom', resizeCanvas);
  }
  dynamicParticles();

  // 6. Адаптивные стили (добавляем в <head>)
  if (!d.getElementById('ut-responsive-style')) {
    const style = d.createElement('style');
    style.id = 'ut-responsive-style';
       @media (max-width: 768px) {
        .header, .ut-footer {
          padding: 0.5rem;
        }
        main {
          padding: 0.5rem;
        }
      }

      @media (max-width: 576px) {
        .header nav, .ut-footer {
          flex-direction: column;
          align-items: center;
        }

        .header nav a, .ut-footer a {
          display: block;
          margin: 0.5rem 0;
          padding: 0.3rem 0.5rem;
          text-align: center;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.1);
        }

        .header .header-actions {
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .hero-left {
          padding: 1rem;
          text-align: center;
        }

        .grid {
          gap: 0.5rem;
        }

        @media (max-width: 320px) {
          #random-number {
            font-size: 1.5rem;
          }

          .hero-left h1 {
            font-size: 1.5rem;
          }
        }
    `;
    d.head.appendChild(style);
  }

  // 7. Адаптация интерактивных элементов (кнопки, поля ввода)
  function adaptInteractiveElements() {
    const inputs = d.querySelectorAll('input, button, a');
    inputs.forEach(el => {
      el.style.padding = '0.5rem 1rem';
      el.style.borderRadius = '4px';
      el.style.display = 'inline-block';
      el.style.margin = '0.2rem';
    });
  }
  adaptInteractiveElements();

  // 8. Обработка ориентации экрана (портрет/ландшафт)
  function handleOrientation() {
    w.addEventListener('orientationchange', () => {
      stickyFooter();
      adaptHeaderAndMain();
      dynamicParticles();
    });
  }
  handleOrientation();

  // 9. Инициализация при загрузке и изменении размера окна
  function init() {
    stickyFooter();
    adaptHeaderAndMain();
    responsiveScale();
    dynamicParticles();
    adaptInteractiveElements();
  }

  w.addEventListener('load', init);
  w.addEventListener('resize', init);

  // 10. Дополнительная оптимизация для мобильных устройств
  if (/Mobi|Android/i.test(navigator.userAgent)) {
    d.documentElement.setAttribute('data-mobile', 'true');
    // Увеличиваем тап-область для кнопок на мобильных
    const mobileButtons = d.querySelectorAll('button, a');
    mobileButtons.forEach(btn => {
      btn.style.touchAction = 'manipulation';
      btn.style.minWidth = '60px';
      btn.style.minHeight = '30px';
    });
  }
})();
/* ==================================================
   9. MOBILE HEADER NAV — PREMIUM SELECT (GLOBAL)
   ================================================== */
(function () {

  const header = document.querySelector('.header');
  const nav = header?.querySelector('.nav-pills');
  if (!header || !nav) return;

  // если уже создано — выходим
  if (header.querySelector('.mobile-nav-select')) return;

  /* ===== CSS ===== */
  const style = document.createElement('style');
  style.innerHTML = `
  @media (max-width: 768px) {

    .nav-pills {
      display: none !important;
    }

    .mobile-nav-select {
      position: relative;
      width: 100%;
      margin-top: 14px;
    }

    .mobile-nav-btn {
      width: 100%;
      padding: 16px 18px;
      border-radius: 18px;
      font-weight: 800;
      font-size: 15px;
      text-align: left;
      background: rgba(255,255,255,.08);
      border: 1px solid rgba(255,255,255,.14);
      backdrop-filter: blur(18px);
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: .35s;
    }

    .mobile-nav-btn:hover {
      background: rgba(255,255,255,.12);
    }

    .mobile-nav-list {
      position: absolute;
      top: calc(100% + 12px);
      left: 0;
      right: 0;
      background: rgba(15,15,25,.95);
      backdrop-filter: blur(20px);
      border-radius: 18px;
      padding: 12px;
      display: grid;
      gap: 8px;
      border: 1px solid rgba(255,255,255,.14);
      box-shadow: 0 24px 60px rgba(0,0,0,.6);
      opacity: 0;
      transform: translateY(-10px) scale(.96);
      pointer-events: none;
      transition:
        opacity .35s ease,
        transform .4s cubic-bezier(.2,.8,.2,1);
      z-index: 50;
    }

    .mobile-nav-list.active {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: auto;
    }

    .mobile-nav-list a {
      padding: 14px 16px;
      border-radius: 12px;
      font-weight: 800;
      text-decoration: none;
      color: white;
      background: rgba(255,255,255,.08);
      border: 1px solid rgba(255,255,255,.1);
      transition: .25s;
    }

    .mobile-nav-list a:hover {
      background: linear-gradient(135deg,#8b5cf6,#06b6d4);
      border-color: transparent;
      transform: translateX(4px);
      box-shadow: 0 8px 22px rgba(99,102,241,.4);
    }
  }
  `;
  document.head.appendChild(style);

  /* ===== BUILD SELECT ===== */
  const links = [...nav.querySelectorAll('a')];

  const wrap = document.createElement('div');
  wrap.className = 'mobile-nav-select';

  const activeLink = links.find(a => a.classList.contains('active'));
  const activeText = activeLink ? activeLink.textContent : 'Навигация';

  const btn = document.createElement('button');
  btn.className = 'mobile-nav-btn';
  btn.innerHTML = `
    <span>${activeText}</span>
    <span style="opacity:.6">▼</span>
  `;

  const list = document.createElement('div');
  list.className = 'mobile-nav-list';

  links.forEach(link => {
    const a = document.createElement('a');
    a.href = link.href;
    a.textContent = link.textContent;

    if (link.classList.contains('active')) {
      a.style.background = 'linear-gradient(135deg,#8b5cf6,#06b6d4)';
      a.style.borderColor = 'transparent';
    }

    list.appendChild(a);
  });

  /* ===== INTERACTION ===== */
  btn.addEventListener('click', e => {
    e.stopPropagation();
    list.classList.toggle('active');
  });

  document.addEventListener('click', () => {
    list.classList.remove('active');
  });

  wrap.appendChild(btn);
  wrap.appendChild(list);

  /* ===== INSERT ===== */
  const inner = header.querySelector('.header-inner');
  inner.appendChild(wrap);

})();
