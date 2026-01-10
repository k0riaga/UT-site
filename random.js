// js/random.js
document.getElementById('rand-num-gen').addEventListener('click', () => {
  const min = parseInt(document.getElementById('rand-min').value);
  const max = parseInt(document.getElementById('rand-max').value);
  const out = document.getElementById('random-number');
  if (isNaN(min) || isNaN(max) || min > max) {
    out.textContent = 'Ошибка';
    return;
  }
  const v = Math.floor(Math.random() * (max - min + 1)) + min;
  out.textContent = v;
});
<script>
(() => {

  const tabs = document.querySelectorAll('.header-tab');
  const panels = {
    profile: document.getElementById('topPanel-profile'),
    settings: document.getElementById('topPanel-settings'),
    themes: document.getElementById('topPanel-themes')
  };

  // Hide all
  function closeAllPanels(){
    Object.values(panels).forEach(p => p.classList.add('hidden'));
    tabs.forEach(t => t.classList.remove('active'));
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const name = tab.dataset.topTab;

      // toggle
      if(panels[name].classList.contains('hidden')){
        closeAllPanels();
        panels[name].classList.remove('hidden');
        tab.classList.add('active');
      } else {
        closeAllPanels();
      }
    });
  });

  // click outside closes
  document.addEventListener('click', e => {
    if(!e.target.closest('.top-panel') && !e.target.closest('.header-tab')){
      closeAllPanels();
    }
  });

  /* === Theme from these tabs === */
  const tabLight = document.getElementById('tabThemeLight');
  const tabDark  = document.getElementById('tabThemeDark');

  function setTheme(t){
    if(t === 'light') document.documentElement.classList.add('light');
    else document.documentElement.classList.remove('light');
    localStorage.setItem('ut_theme', t);
  }

  tabLight.onclick = () => setTheme('light');
  tabDark.onclick  = () => setTheme('dark');

})();
</script>
