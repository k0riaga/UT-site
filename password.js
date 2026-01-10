// js/password.js
function generatePassword(len, useUpper, useDigits, useSymbols) {
  let pool = 'abcdefghijklmnopqrstuvwxyz';
  if (useUpper) pool += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (useDigits) pool += '0123456789';
  if (useSymbols) pool += '!@#$%^&*()-_=+[]{};:,.<>/?|~';
  const arr = new Uint32Array(len);
  window.crypto.getRandomValues(arr);
  let out = '';
  for (let i = 0; i < len; i++) out += pool[arr[i] % pool.length];
  return out;
}

function pwdStrength(pwd) {
  let score = 0;
  if (/[a-z]/.test(pwd)) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^a-zA-Z0-9]/.test(pwd)) score++;
  const len = pwd.length;
  if (len >= 14 && score >= 3) return 'Очень сложный';
  if (len >= 10 && score >= 2) return 'Сложный';
  if (len >= 8) return 'Средний';
  return 'Лёгкий';
}

document.addEventListener('DOMContentLoaded', () => {
  const out = document.getElementById('password-output');
  const strengthEl = document.getElementById('pwd-strength');
  document.getElementById('pwd-gen').addEventListener('click', () => {
    const len = parseInt(document.getElementById('pwd-len').value) || 12;
    const up = document.getElementById('pwd-upper').checked;
    const dig = document.getElementById('pwd-digits').checked;
    const sym = document.getElementById('pwd-symbols').checked;
    const pwd = generatePassword(len, up, dig, sym);
    out.textContent = pwd;
    strengthEl.textContent = 'Сложность: ' + pwdStrength(pwd);
  });
});
