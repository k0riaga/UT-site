// js/countdown.js
const preset = document.getElementById('preset-dates');
const cdBig = document.getElementById('countdown-big');
const cdDays = document.getElementById('cd-days');
const cdHmsms = document.getElementById('cd-hmsms');

function parsePreset(value) {
  // value is "MM-DD"
  const [MM, DD] = value.split('-').map(s => parseInt(s,10));
  return {MM, DD};
}

function computeTargetFromPreset(value) {
  const now = new Date();
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    // custom full date: YYYY-MM-DD
    const t = new Date(value + 'T00:00:00');
    // if in past, add a year
    if (t.getTime() <= now.getTime()) t.setFullYear(t.getFullYear() + 1);
    return t;
  } else {
    const {MM, DD} = parsePreset(value);
    let candidate = new Date(now.getFullYear(), MM-1, DD, 0, 0, 0, 0);
    if (candidate.getTime() <= now.getTime()) candidate.setFullYear(candidate.getFullYear() + 1);
    return candidate;
  }
}

// interval
setInterval(update, 50);

document.getElementById('add-custom').addEventListener('click', () => {
  const d = document.getElementById('custom-date').value;
  const desc = document.getElementById('custom-desc').value || d;
  if (!d) return;
  const opt = document.createElement('option');
  opt.value = d; // store full date YYYY-MM-DD
  opt.textContent = `${desc} — ${d}`;
  preset.appendChild(opt);
  preset.value = d;
});
