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

  function init() {
    setupProgressBar();
    setupCodeCopy();
    setupReadingTime();
    setupTOC();
  }

  // 等 KaTeX auto-render 跑完再执行
  if (document.readyState === 'complete') {
    init();
  } else {
    window.addEventListener('load', init);
  }
})();
