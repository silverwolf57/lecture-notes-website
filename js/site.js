/* WXG.math — site interactions
   Reading progress, back-to-top, code copy buttons, prev/next nav.
   No third-party trackers. */

(function () {
  'use strict';

  // 1. Reading progress bar
  const bar = document.querySelector('.reading-progress');
  if (bar) {
    const update = () => {
      const doc = document.documentElement;
      const scrolled = doc.scrollTop || document.body.scrollTop;
      const max = (doc.scrollHeight || document.body.scrollHeight) - doc.clientHeight;
      const pct = max > 0 ? Math.min(100, (scrolled / max) * 100) : 0;
      bar.style.width = pct + '%';
    };
    document.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  // 2. Back to top
  const btt = document.querySelector('.back-to-top');
  if (btt) {
    const onScroll = () => {
      if (window.scrollY > 400) btt.classList.add('visible');
      else btt.classList.remove('visible');
    };
    document.addEventListener('scroll', onScroll, { passive: true });
    btt.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    onScroll();
  }

  // 3. Code copy buttons
  document.querySelectorAll('pre').forEach((pre) => {
    if (pre.querySelector('.code-copy-btn')) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'code-copy-btn';
    btn.textContent = '复制';
    btn.setAttribute('aria-label', '复制代码');
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const code = pre.querySelector('code');
      const text = code ? code.innerText : pre.innerText;
      try {
        await navigator.clipboard.writeText(text);
        btn.textContent = '已复制!';
        btn.classList.add('copied');
      } catch (_) {
        btn.textContent = '失败';
      }
      setTimeout(() => {
        btn.textContent = '复制';
        btn.classList.remove('copied');
      }, 1600);
    });
    pre.appendChild(btn);
  });

  // 4. Theme toggle (if the inline button has class theme-toggle)
  document.querySelectorAll('.theme-toggle').forEach((btn) => {
    if (btn.dataset.bound === '1') return;
    btn.dataset.bound = '1';
    btn.addEventListener('click', () => {
      const html = document.documentElement;
      const next = html.dataset.theme === 'dark' ? 'light' : 'dark';
      html.dataset.theme = next;
      try { localStorage.setItem('wxg-theme', next); } catch (_) {}
    });
  });

  // 5. Smooth-scroll for in-page anchors
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    if (a.dataset.bound === '1') return;
    const href = a.getAttribute('href');
    if (!href || href.length < 2) return;
    a.addEventListener('click', (e) => {
      const id = href.slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', '#' + id);
      }
    });
  });
})();
