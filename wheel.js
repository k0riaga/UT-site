// js/wheel.js
const canvas = document.getElementById('wheel-canvas');
const ctx = canvas.getContext('2d');
let options = ['Да','Нет','Может быть','Конечно'];
const body = document.getElementById('wheel-body');
const resultEl = document.getElementById('wheel-result');

function renderTable(){
  body.innerHTML = '';
  options.forEach((opt, i) => {
    const tr = document.createElement('tr');
    tr.className = 'text-slate-200';
    const tdN = document.createElement('td'); tdN.textContent = (i+1)+'.'; tdN.className='pr-2';
    const tdOpt = document.createElement('td');
    const inp = document.createElement('input'); inp.value = opt; inp.className='w-full bg-transparent border-0 outline-none';
    inp.addEventListener('input', ()=>{ options[i] = inp.value || `Вариант ${i+1}`; draw(currentRotation); });
    tdOpt.appendChild(inp);
    const tdDel = document.createElement('td');
    const del = document.createElement('button'); del.textContent = '✕'; del.className = 'px-2';
    del.addEventListener('click', ()=> { options.splice(i,1); renderTable(); draw(currentRotation); });
    tdDel.appendChild(del);
    tr.appendChild(tdN); tr.appendChild(tdOpt); tr.appendChild(tdDel);
    body.appendChild(tr);
  });
}

function draw(rotation=0){
  const cx = canvas.width/2, cy = canvas.height/2, r = Math.min(cx,cy)-8;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  if (options.length === 0) { ctx.fillStyle='rgba(255,255,255,0.02)'; ctx.fillRect(0,0,canvas.width,canvas.height); return; }
  const angle = (Math.PI*2)/options.length;
  for (let i=0;i<options.length;i++){
    const start = i*angle + rotation;
    const end = start + angle;
    ctx.beginPath(); ctx.moveTo(cx,cy); ctx.arc(cx,cy,r,start,end); ctx.closePath();
    ctx.fillStyle = `hsl(${(i*360/options.length)+20},65%,55%)`;
    ctx.fill();
    ctx.strokeStyle='rgba(0,0,0,0.2)'; ctx.stroke();
    ctx.save(); ctx.translate(cx,cy); ctx.rotate(start + angle/2);
    ctx.textAlign = 'right'; ctx.fillStyle = '#071426'; ctx.font = 'bold 16px sans-serif';
    ctx.fillText(String(options[i]), r-12, 6);
    ctx.restore();
  }
  // center circle
  ctx.beginPath(); ctx.arc(cx,cy,40,0,Math.PI*2); ctx.fillStyle='rgba(0,0,0,0.3)'; ctx.fill();
}

// determine winner under fixed arrow (arrow at top)
function indexAtTop(rotation){
  const sectorAngle = (Math.PI*2)/options.length;
  let angleAtTop = ((3*Math.PI/2) - rotation) % (2*Math.PI);
  if (angleAtTop < 0) angleAtTop += 2*Math.PI;
  return Math.floor(angleAtTop / sectorAngle) % options.length;
}

let spinning = false;
let currentRotation = 0;
document.getElementById('wheel-spin').addEventListener('click', () => {
  if (spinning || options.length === 0) return;
  spinning = true;
  resultEl.textContent = '';
  const rounds = Math.random()*6 + 6;
  const final = Math.random()*Math.PI*2;
  const total = rounds * Math.PI*2 + final;
  const duration = 4200 + Math.random()*2000;
  const start = performance.now();
  function anim(t){
    const elapsed = t - start;
    const p = Math.min(1, elapsed / duration);
    const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
    currentRotation = total * eased;
    draw(currentRotation);
    if (p < 1) requestAnimationFrame(anim);
    else {
      const idx = indexAtTop(currentRotation);
      resultEl.textContent = `Победитель: ${options[idx] || '—'}`;
      flashSector(idx);
      spinning = false;
    }
  }
  requestAnimationFrame(anim);
});

function flashSector(idx){
  let flashes = 0;
  const interval = setInterval(() => {
    draw(currentRotation);
    if (options.length === 0) { clearInterval(interval); return; }
    const cx = canvas.width/2, cy = canvas.height/2, r = Math.min(cx,cy)-8;
    const angle = (Math.PI*2)/options.length;
    ctx.beginPath(); ctx.moveTo(cx,cy); ctx.arc(cx,cy, r, idx*angle + currentRotation, (idx+1)*angle + currentRotation); ctx.closePath();
    ctx.fillStyle = 'rgba(255,255,255,0.12)'; ctx.fill();
    flashes++;
    if (flashes > 6) { clearInterval(interval); draw(currentRotation); }
  }, 120);
}

document.getElementById('wheel-add').addEventListener('click', () => {
  const v = document.getElementById('new-variant').value.trim();
  options.push(v || `Вариант ${options.length + 1}`);
  document.getElementById('new-variant').value = '';
  renderTable(); draw(currentRotation);
});

document.getElementById('wheel-reset').addEventListener('click', () => {
  options = [];
  renderTable(); draw(0); currentRotation = 0; resultEl.textContent = '';
});

document.getElementById('wheel-randcolor').addEventListener('click', () => {
  draw(currentRotation);
});

// init
renderTable();
draw(0);
