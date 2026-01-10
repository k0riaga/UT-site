// app.js — весь функционал. Чистый JS, без зависимостей.

(() => {
  // ---- utils ----
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));
  const saveSettings = (k,v) => localStorage.setItem(k, JSON.stringify(v));
  const loadSettings = (k, fallback) => {
    try { const t = JSON.parse(localStorage.getItem(k)); return t === null ? fallback : (t ?? fallback); }
    catch(e){ return fallback; }
  };
  const downloadFile = (name, blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(url), 2000);
  };
  const copyText = async (text) => {
    try { await navigator.clipboard.writeText(text); return true; }
    catch(e){ return false; }
  };
  const formatBytes = (n) => {
    if (!n && n !== 0) return '—';
    if (n < 1024) return n + ' B';
    if (n < 1024*1024) return (n/1024).toFixed(1) + ' KB';
    if (n < 1024*1024*1024) return (n/(1024*1024)).toFixed(2) + ' MB';
    return (n/(1024*1024*1024)).toFixed(2) + ' GB';
  };

  // ---- navigation ----
  const navButtons = $$('.nav-btn');
  function showPage(id){
    $$('.page').forEach(p=>p.classList.add('hidden'));
    const el = $('#page-'+id);
    if (el) el.classList.remove('hidden');
    navButtons.forEach(b=>b.classList.toggle('active', b.dataset.page === id));
  }
  navButtons.forEach(b=> b.addEventListener('click', ()=> showPage(b.dataset.page)));
  // default
  showPage('password');

  // ---- AUTO COPY setting ----
  const autoCopy = $('#auto-copy');
  autoCopy.checked = loadSettings('tool_auto_copy', true);
  autoCopy.addEventListener('change', ()=> saveSettings('tool_auto_copy', autoCopy.checked));

  // ---- PASSWORD GENERATOR ----
  const pwLength = $('#pw-length');
  const pwUpper = $('#pw-uppercase');
  const pwLower = $('#pw-lowercase');
  const pwDigits = $('#pw-digits');
  const pwSymbols = $('#pw-symbols');
  const pwAmb = $('#pw-ambiguous');
  const pwPron = $('#pw-pronounceable');
  const pwGenBtn = $('#pw-gen');
  const pwResult = $('#pw-result');
  const pwCopy = $('#pw-copy');
  const pwSave = $('#pw-save');

  function generatePassword(opts){
    const ambig = 'Il1O0';
    const U = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const L = 'abcdefghijklmnopqrstuvwxyz';
    const D = '0123456789';
    const S = '!@#$%^&*()-_=+[]{};:,.<>?';
    let pool = '';
    if (opts.upper) pool += U;
    if (opts.lower) pool += L;
    if (opts.digits) pool += D;
    if (opts.symbols) pool += S;
    if (opts.excludeAmb) pool = pool.split('').filter(c=>!ambig.includes(c)).join('');
    if (!pool) return '';
    if (opts.pronounceable) {
      // simple pronounceable generator using consonant-vowel pairs
      const vowels = 'aeiou';
      const consonants = 'bcdfghjklmnpqrstvwxyz';
      let res = '';
      let useCons = true;
      while (res.length < opts.length) {
        if (useCons) res += consonants[Math.floor(Math.random()*consonants.length)];
        else res += vowels[Math.floor(Math.random()*vowels.length)];
        useCons = !useCons;
      }
      return res.slice(0, opts.length);
    }
    let out = '';
    for (let i=0;i<opts.length;i++){
      out += pool[Math.floor(Math.random()*pool.length)];
    }
    return out;
  }

  pwGenBtn.addEventListener('click', async ()=>{
    const opts = {
      length: Math.max(4, Math.min(128, Number(pwLength.value) || 16)),
      upper: pwUpper.checked,
      lower: pwLower.checked,
      digits: pwDigits.checked,
      symbols: pwSymbols.checked,
      excludeAmb: pwAmb.checked,
      pronounceable: pwPron.checked
    };
    const pwd = generatePassword(opts);
    pwResult.value = pwd;
    if (autoCopy.checked) { await copyText(pwd); log('Пароль скопирован'); }
  });
  pwCopy.addEventListener('click', async ()=> {
    const ok = await copyText(pwResult.value || '');
    log(ok? 'Скопировано' : 'Не удалось копировать');
  });
  pwSave.addEventListener('click', ()=> {
    const txt = pwResult.value || '';
    downloadFile('password.txt', new Blob([txt], {type:'text/plain'}));
  });

  // ---- NICK GENERATOR ----
  const nickCategory = $('#nick-category');
  const nickCount = $('#nick-count');
  const nickNumber = $('#nick-number');
  const nickSymbol = $('#nick-symbol');
  const nickGen = $('#nick-gen');
  const nickList = $('#nick-list');
  const nickCopy = $('#nick-copy');
  const nickSave = $('#nick-save');

  const nickPools = {
    gamer: ['Shadow','Blade','Viper','Zero','Nova','Rogue','Ghost','King','Dragon','Rift','Storm','Frost'],
    cute: ['Puff','Kitty','Bunny','Mochi','Sunny','Sugar','Bubbles','Mimi','Coco'],
    tech: ['Byte','Root','Kernel','Node','Pixel','Cache','Crypto','Loop','Pulse'],
    random: ['Echo','Nimbus','Orbit','Quark','Zephyr','Astra','Lumen','Glyph'],
    cool: ['Xeno','Valk','Argo','Titan','Rex','Onyx','Blaze','Strix']
  };
  const suffix = ['','_','-','x','99','007','III','_01','_x'];

  function genNick(cat){
    const pool = nickPools[cat] || nickPools.random;
    const a = pool[Math.floor(Math.random()*pool.length)];
    const b = pool[Math.floor(Math.random()*pool.length)];
    const s = suffix[Math.floor(Math.random()*suffix.length)];
    if (Math.random() < 0.4) return a + s + (nickNumber.checked ? String(Math.floor(Math.random()*900)+100) : '');
    return (Math.random()<0.5 ? a + b : a + '_' + b) + (nickSymbol.checked? (Math.random()<0.5?'.':'_') : '') + (nickNumber.checked?String(Math.floor(Math.random()*900)+100):'');
  }

  nickGen.addEventListener('click', ()=>{
    const n = Math.min(20, Math.max(1, Number(nickCount.value)||6));
    nickList.innerHTML = '';
    const arr = [];
    for (let i=0;i<n;i++){
      const t = genNick(nickCategory.value);
      arr.push(t);
      const el = document.createElement('div'); el.className='item'; el.textContent = t;
      nickList.appendChild(el);
    }
    if (autoCopy.checked) { copyText(arr.join('\n')); log('Ники в буфере'); }
  });
  nickCopy.addEventListener('click', ()=> copyText(Array.from(nickList.children).map(x=>x.textContent).join('\n')));
  nickSave.addEventListener('click', ()=> downloadFile('nicks.txt', new Blob([Array.from(nickList.children).map(x=>x.textContent).join('\n')], {type:'text/plain'})));

  // ---- RANDOM NUMBER ----
  const randMin = $('#rand-min'), randMax = $('#rand-max'), randCount = $('#rand-count'), randUnique = $('#rand-unique');
  const randGen = $('#rand-gen'), randRes = $('#rand-result'), randCopy = $('#rand-copy'), randSave = $('#rand-save');

  randGen.addEventListener('click', ()=>{
    let a = Number(randMin.value), b = Number(randMax.value);
    if (isNaN(a) || isNaN(b)) { alert('Введите корректные числа'); return; }
    if (a > b) [a,b] = [b,a];
    let count = Math.max(1, Math.min(1000, Number(randCount.value) || 1));
    const unique = randUnique.checked;
    const out = [];
    const range = b - a + 1;
    if (unique && count > range) { alert('Нельзя получить больше уникальных чисел, чем размер диапазона'); return; }
    while (out.length < count) {
      const r = Math.floor(Math.random() * range) + a;
      if (unique) {
        if (!out.includes(r)) out.push(r);
      } else out.push(r);
    }
    randRes.value = out.join(', ');
    if (autoCopy.checked) { copyText(randRes.value); log('Результат скопирован'); }
  });
  randCopy.addEventListener('click', ()=> copyText(randRes.value));
  randSave.addEventListener('click', ()=> downloadFile('random.txt', new Blob([randRes.value], {type:'text/plain'})));

  // ---- COUNTDOWN ----
  const countDate = $('#count-date'), countTitle = $('#count-title'), countStart = $('#count-start'), countStop = $('#count-stop');
  const countDisplay = $('#count-display'), countHeading = $('#count-heading'), countCopy = $('#count-copy');
  let countTimer = null;

  function updateCountdown(target, title) {
    const now = new Date();
    const diff = target - now;
    if (diff <= 0) {
      countDisplay.textContent = 'Событие наступило!';
      clearInterval(countTimer); countTimer = null;
      return;
    }
    const sec = Math.floor(diff/1000)%60;
    const min = Math.floor(diff/1000/60)%60;
    const hr = Math.floor(diff/1000/3600)%24;
    const days = Math.floor(diff/1000/3600/24);
    countDisplay.textContent = `${days}д ${hr}ч ${min}м ${sec}с`;
  }

  countStart.addEventListener('click', ()=>{
    const v = countDate.value;
    if (!v) { alert('Выберите дату'); return; }
    const target = new Date(v);
    if (isNaN(target)) { alert('Неверная дата'); return; }
    const title = countTitle.value || 'Событие';
    countHeading.textContent = title;
    if (countTimer) clearInterval(countTimer);
    updateCountdown(target, title);
    countTimer = setInterval(()=> updateCountdown(target, title), 400);
  });
  countStop.addEventListener('click', ()=> { if (countTimer) clearInterval(countTimer); countTimer = null; countDisplay.textContent = '—'; countHeading.textContent = 'Остановлено'; });
  countCopy.addEventListener('click', ()=> copyText(countDisplay.textContent));

  // ---- CLOCK & STOPWATCH ----
  const clockNowBtn = $('#clock-now'), clockIntervalEl = $('#clock-interval'), clockDisplay = $('#clock-display');
  const swStart = $('#sw-start'), swStop = $('#sw-stop'), swReset = $('#sw-reset'), swLap = $('#sw-lap'), lapsList = $('#laps');

  let swRunning = false, swStartTime = 0, swAcc = 0, swTimer = null;

  function formatTimeMs(ms) {
    const total = Math.floor(ms/1000);
    const sec = total % 60;
    const min = Math.floor(total/60) % 60;
    const hr = Math.floor(total/3600);
    const msRem = Math.floor((ms%1000)/10);
    return `${String(hr).padStart(2,'0')}:${String(min).padStart(2,'0')}:${String(sec).padStart(2,'0')}.${String(msRem).padStart(2,'0')}`;
  }

  function updateClockNow(){
    const d = new Date();
    clockDisplay.textContent = d.toLocaleTimeString();
  }
  clockNowBtn.addEventListener('click', ()=> updateClockNow());

  swStart.addEventListener('click', ()=> {
    if (swRunning) return;
    swRunning = true;
    swStartTime = Date.now();
    swTimer = setInterval(()=>{
      const now = Date.now();
      const elapsed = swAcc + (now - swStartTime);
      clockDisplay.textContent = formatTimeMs(elapsed);
    }, Math.max(50, Number(clockIntervalEl.value) || 200));
  });
  swStop.addEventListener('click', ()=> {
    if (!swRunning) return;
    swRunning = false;
    clearInterval(swTimer);
    swTimer = null;
    swAcc += Date.now() - swStartTime;
  });
  swReset.addEventListener('click', ()=> {
    swRunning = false; clearInterval(swTimer); swTimer=null; swAcc=0; swStartTime=0; clockDisplay.textContent = '00:00:00.00'; lapsList.innerHTML='';
  });
  swLap.addEventListener('click', ()=> {
    const now = swAcc + (swRunning ? (Date.now()-swStartTime) : 0);
    const li = document.createElement('li'); li.textContent = formatTimeMs(now); lapsList.prepend(li);
  });

  // ---- TOOLS ----
  $('#clear-local').addEventListener('click', ()=> { if (confirm('Очистить настройки?')) { localStorage.clear(); log('LocalStorage очищен'); } });

  // ---- LOG helper ----
  const logArea = $('#log');
  function log(msg){
    const t = `[${new Date().toLocaleTimeString()}] ${msg}`;
    logArea.textContent += '\n' + t;
    logArea.scrollTop = logArea.scrollHeight;
  }
  window.log = log;

  // init some defaults
  pwResult.value = '';
  randRes.value = '';
  clockDisplay.textContent = new Date().toLocaleTimeString();
})();
