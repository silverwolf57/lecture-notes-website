/* WXG.math site interactions
 * - reading progress bar
 * - one-click code copy
 * - reading time estimate
 * - auto-generated TOC (long pages only)
 * No tracking, no fingerprinting, all local.
 */
(function () {
  'use strict';

  // ---------- 1. reading progress bar ----------
  function setupProgressBar() {
    var bar = document.createElement('div');
    bar.className = 'reading-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);

    var ticking = false;
    function update() {
      var docEl = document.documentElement;
      var b = document.body;
      var scrollTop = window.scrollY || docEl.scrollTop || b.scrollTop;
      var height = (docEl.scrollHeight || b.scrollHeight) - docEl.clientHeight;
      var pct = height > 0 ? (scrollTop / height) * 100 : 0;
      bar.style.width = Math.min(100, Math.max(0, pct)) + '%';
      ticking = false;
    }
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  }

  // ---------- 2. code copy buttons ----------
  function setupCodeCopy() {
    var blocks = document.querySelectorAll('pre > code');
    blocks.forEach(function (code) {
      var pre = code.parentElement;
      if (pre.querySelector('.code-copy-btn')) return;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'code-copy-btn';
      btn.textContent = '复制';
      btn.setAttribute('aria-label', '复制代码');

      function fallbackCopy(text) {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (e) { /* noop */ }
        document.body.removeChild(ta);
      }

      btn.addEventListener('click', function () {
        var text = code.innerText;
        var done = function () {
          var orig = btn.textContent;
          btn.textContent = '已复制 ✓';
          btn.classList.add('copied');
          setTimeout(function () {
            btn.textContent = orig;
            btn.classList.remove('copied');
          }, 1800);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done, function () {
            fallbackCopy(text); done();
          });
        } else {
          fallbackCopy(text); done();
        }
      });

      pre.appendChild(btn);
    });
  }

  // ---------- 3. reading time estimate ----------
  function setupReadingTime() {
    var main = document.querySelector('main');
    if (!main) return;
    // 用 innerText(已渲染的文本,KaTeX 也会展开)
    var text = (main.innerText || '').trim();
    // 中文字符数 + 英文单词数
    var cn = (text.match(/[\u4e00-\u9fff]/g) || []).length;
    var en = (text.match(/[A-Za-z]+/g) || []).length;
    // 中文 350 字/分钟,英文 200 词/分钟
    var minutes = Math.max(1, Math.round(cn / 350 + en / 200));

    var front = document.querySelector('.front-matter');
    if (!front) return;
    var badge = document.createElement('span');
    badge.className = 'reading-time';
    badge.textContent = '约 ' + minutes + ' 分钟阅读';
    front.appendChild(badge);
  }

  // ---------- 4. auto TOC ----------
  function setupTOC() {
    var main = document.querySelector('main');
    if (!main) return;
    var headings = Array.prototype.slice.call(main.querySelectorAll('h2, h3'));
    // 只在内容够长时启用
    if (headings.length < 4) return;

    // 给每个 heading 赋 id(若没有)
    headings.forEach(function (h, i) {
      if (!h.id) {
        // 用 text 派生一个简单 id
        var t = (h.textContent || '').trim().toLowerCase()
          .replace(/[\s·.,，。!?:;]+/g, '-')
          .replace(/[^\w一-鿿-]/g, '')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '') || ('h-' + i);
        h.id = t;
      }
    });

    var nav = document.createElement('nav');
    nav.className = 'toc-sidebar';
    nav.setAttribute('aria-label', '目录');
    var title = document.createElement('div');
    title.className = 'toc-title';
    title.textContent = '目录';
    var list = document.createElement('ul');

    headings.forEach(function (h) {
      var li = document.createElement('li');
      li.className = 'toc-' + h.tagName.toLowerCase();
      var a = document.createElement('a');
      a.href = '#' + h.id;
      a.textContent = h.textContent;
      li.appendChild(a);
      list.appendChild(li);
    });

    nav.appendChild(title);
    nav.appendChild(list);
    document.body.appendChild(nav);

    // 平滑滚动
    nav.addEventListener('click', function (e) {
      var t = e.target;
      if (t.tagName === 'A' && t.getAttribute('href').charAt(0) === '#') {
        e.preventDefault();
        var target = document.getElementById(t.getAttribute('href').slice(1));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          history.pushState(null, '', '#' + target.id);
        }
      }
    });

    // 当前 section 高亮
    function updateActive() {
      var fromTop = window.scrollY + 100;
      var current = null;
      for (var i = 0; i < headings.length; i++) {
        if (headings[i].offsetTop <= fromTop) current = headings[i];
        else break;
      }
      var links = nav.querySelectorAll('a');
      for (var j = 0; j < links.length; j++) links[j].classList.remove('active');
      if (current) {
        var active = nav.querySelector('a[href="#' + current.id + '"]');
        if (active) active.classList.add('active');
      }
    }
    window.addEventListener('scroll', updateActive, { passive: true });
    updateActive();
  }

  // ---------- 5. back-to-top button ----------
  function setupBackToTop() {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', '回到顶部');
    btn.textContent = '↑';

    var ticking = false;
    function update() {
      if (window.scrollY > 600) btn.classList.add('visible');
      else btn.classList.remove('visible');
      ticking = false;
    }
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.body.appendChild(btn);
    update();
  }

  // ---------- 6. dark mode (system + manual + persist + giscus sync) ----------
  function setupDarkMode() {
    var STORAGE_KEY = 'wxgmath-theme';
    var giscusReady = false;

    function systemPrefersDark() {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    function getStoredTheme() {
      try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
    }

    function setStoredTheme(t) {
      try { localStorage.setItem(STORAGE_KEY, t); } catch (e) { /* noop */ }
    }

    function effectiveTheme() {
      var stored = getStoredTheme();
      if (stored === 'dark' || stored === 'light') return stored;
      return systemPrefersDark() ? 'dark' : 'light';
    }

    function applyTheme(theme) {
      var root = document.documentElement;
      if (theme === 'dark') root.setAttribute('data-theme', 'dark');
      else root.removeAttribute('data-theme');

      // 同步 giscus(它在 iframe 里,需要 postMessage)
      syncGiscusTheme(theme);
      // 更新 toggle 按钮文字
      var btn = document.querySelector('.theme-toggle');
      if (btn) btn.textContent = theme === 'dark' ? '☀' : '☾';
    }

    function syncGiscusTheme(theme) {
      try {
        var iframe = document.querySelector('iframe.giscus-frame');
        if (!iframe || !iframe.contentWindow) return;
        var giscusTheme = theme;  // 'light' | 'dark'
        iframe.contentWindow.postMessage(
          { giscus: { setConfig: { theme: giscusTheme } } },
          'https://giscus.app'
        );
      } catch (e) { /* noop */ }
    }

    // 初始应用(不闪屏:在 <head> 早期就跑)
    applyTheme(effectiveTheme());

    // 监听 toggle
    document.addEventListener('click', function (e) {
      var btn = e.target.closest && e.target.closest('.theme-toggle');
      if (!btn) return;
      var current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      var next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      setStoredTheme(next);
    });

    // 系统主题变化时(仅在用户没显式设过的时候跟随)
    if (window.matchMedia) {
      var mq = window.matchMedia('(prefers-color-scheme: dark)');
      var onSystemChange = function () {
        if (!getStoredTheme()) applyTheme(systemPrefersDark() ? 'dark' : 'light');
      };
      if (mq.addEventListener) mq.addEventListener('change', onSystemChange);
      else if (mq.addListener) mq.addListener(onSystemChange);
    }

    // 监听 giscus iframe 加载,确保之后我们改主题能同步上
    window.addEventListener('message', function (e) {
      if (e.origin !== 'https://giscus.app') return;
      if (e.data && e.data.giscus && e.data.giscus.signIn || e.data.type === 'ready') {
        giscusReady = true;
        // giscus 刚准备好,主动 sync 一次当前主题
        var cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        setTimeout(function () { syncGiscusTheme(cur); }, 100);
      }
    });
  }

  // ---------- 7. PDF download button ----------
  // Reads data-pdf-url from each .pdf-download button. If set, wires it as a
  // download link. If empty, the button stays disabled with a CSS hint
  // ("請於 HTML 設定 data-pdf-url"). The PDF is never bundled with the site;
  // the maintainer provides the URL per-lecture.
  function setupPdfDownload() {
    var btns = document.querySelectorAll('.pdf-download');
    btns.forEach(function (btn) {
      var url = (btn.getAttribute('data-pdf-url') || '').trim();
      if (url) {
        btn.setAttribute('href', url);
        btn.setAttribute('download', '');
        btn.removeAttribute('aria-disabled');
        btn.classList.remove('is-disabled');
      } else {
        btn.setAttribute('aria-disabled', 'true');
        btn.classList.add('is-disabled');
        btn.addEventListener('click', function (e) {
          if (btn.getAttribute('aria-disabled') === 'true') e.preventDefault();
        });
      }
    });
  }

  function init() {
    setupProgressBar();
    setupCodeCopy();
    setupReadingTime();
    setupTOC();
    setupBackToTop();
    setupDarkMode();
    setupPdfDownload();
  }

  // 等 KaTeX auto-render 跑完再执行
  if (document.readyState === 'complete') {
    init();
  } else {
    window.addEventListener('load', init);
  }
})();
