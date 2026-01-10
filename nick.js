// js/nick.js
// Runtime wordlist generator: combines prefixes/suffixes to build >2000 single-word nicknames.
// Ensures no digits, length 3..18, capitalizes first letter when requested.

const PREFIX = [
  'alpha','crimson','silver','golden','dark','light','quick','silent','frost','ember','storm','shadow','solar','lunar','wind','iron','stone','crystal','neon','vivid','wild','myst','aero','hyper','ultra','nano','prime','omega','nova','astro','cosmo','terra','hydro','pyro','glow','dusk','dawn','bloom','velvet','sharp','bright','bold','swift','steel','leaf','oak','pine','rose','lilac','moss','clear','deep','river','sky','star','moon','sun','cloud','rain','snow','mist','fire','ice','thorn','brook','rift','echo','gale','flare','pulse','warden','keeper','hunter','forged'
];
const SUFFIX = [
  'wolf','tiger','eagle','dragon','phoenix','griffin','rider','walker','hunter','blade','spear','arrow','forge','seeker','whisper','guardian','wanderer','keeper','prowler','shade','flare','pulse','stream','stone','leaf','crest','vale','bloom','brook','ember','frost','gale','rift','spark','veil','lance','helm','shore','tide','breaker','sentry','beacon','voyager','nomad','warden','ranger','sentinel','marshal','vanguard','strider','shade','wing','heart','song','bloom','song'
];

function buildWordPool() {
  const set = new Set();
  // combine various patterns to reach >2000 unique words
  const patterns = [
    (a,b)=> a + b,
    (a,b)=> b + a,
    (a,b)=> a.slice(0, Math.max(2, Math.floor(a.length/2))) + b,
    (a,b)=> a + b.slice(0, Math.max(2, Math.floor(b.length/2))),
    (a,b)=> (a + b).slice(0, 14) // enforce max length
  ];
  let i = 0;
  while (set.size < 2200 && i < 200000) {
    const a = PREFIX[Math.floor(Math.random()*PREFIX.length)];
    const b = SUFFIX[Math.floor(Math.random()*SUFFIX.length)];
    const p = patterns[Math.floor(Math.random()*patterns.length)];
    let w = p(a,b);
    // cleanup and ensure alphabetic
    w = w.replace(/[^A-Za-zА-Яа-я]/g,'');
    if (w.length < 3 || w.length > 18) {
      // try shorter slicing
      w = w.slice(0, Math.min(18, Math.max(3, w.length)));
    }
    // Capitalize first letter for nicer visual
    w = w.charAt(0).toUpperCase() + w.slice(1);
    if (/^[A-Za-zА-Яа-я]+$/.test(w)) set.add(w);
    i++;
  }
  return Array.from(set);
}

const WORDS = buildWordPool(); // >2000 words

// Exported generator
function generateNick({first='', len=8, theme='any'} = {}) {
  // pick candidate that fits length and optionally first letter
  let candidates = WORDS.filter(w => w.length >= Math.min(3,len-2) && w.length <= Math.max(3,len+4));
  if (first) {
    const up = first.charAt(0).toUpperCase();
    const withFirst = candidates.filter(w => w.charAt(0) === up);
    if (withFirst.length) candidates = withFirst;
  }
  if (candidates.length === 0) candidates = WORDS;
  let pick = candidates[Math.floor(Math.random()*candidates.length)];
  // enforce exact length when possible by truncation or padding
  if (pick.length > len) pick = pick.slice(0,len);
  if (pick.length < len) {
    // try to append part of another word
    const extra = WORDS[Math.floor(Math.random()*WORDS.length)].slice(0, Math.max(0, len - pick.length));
    pick = (pick + extra).slice(0,len);
  }
  pick = pick.replace(/[^A-Za-zА-Яа-я]/g,'');
  return pick;
}

// DOM hookup
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('nickname-gen');
  const out = document.getElementById('nickname-out');
  btn.addEventListener('click', () => {
    const first = document.getElementById('nick-first').value.trim();
    const len = parseInt(document.getElementById('nick-length').value) || 8;
    const theme = document.getElementById('nick-theme').value;
    const nick = generateNick({first, len, theme});
    btn.style.transform = 'rotate(360deg)';
    setTimeout(()=> btn.style.transform = 'rotate(0deg)', 420);
    out.textContent = nick;
  });
});
// --- FIX 2 + FIX 3: корректная работа темы (header + настройки) ---
function setTheme(theme) {
  if (theme === 'light') {
    document.documentElement.classList.add('light');
    document.body.classList.add('light');
    themeBtn.textContent = '☀️';
  } else {
    document.documentElement.classList.remove('light');
    document.body.classList.remove('light');
    themeBtn.textContent = '🌙';
  }
  localStorage.setItem('ut_theme', theme);
}

function getSavedTheme() {
  return localStorage.getItem('ut_theme') || 'dark';
}

setTheme(getSavedTheme());

themeBtn.addEventListener('click', () => {
  const cur = getSavedTheme();
  setTheme(cur === 'light' ? 'dark' : 'light');
});

// КНОПКИ В НАСТРОЙКАХ — теперь работают
document.getElementById('themeLight')?.addEventListener('click', () => setTheme('light'));
document.getElementById('themeDark')?.addEventListener('click', () => setTheme('dark'));

