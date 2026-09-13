# AGENTS.md — Repository Guide for AI Agents

This is a static lecture-notes site (WXG.math and computer science) deployed
via GitHub Pages.

- **Public URL**: https://silverwolf57.github.io/lecture-notes-website/
- **Repository**: https://github.com/silverwolf57/lecture-notes-website (public)
- **Owner**: silverwolf57 (`Hilbert.Gauss@outlook.com`)
- **Collaborator**: laiyihe44-creator (Write)

## Tech Stack

- **Pure HTML5 + CSS3** — no build, no framework
- **KaTeX via CDN** (jsdelivr) — math formulas
- **Vanilla JS** — only `assets/site.js` (~9KB, no libraries)
- **GitHub Pages** — auto-deploy from `main` branch
- **No package.json / node_modules / build artifacts**

## File Structure

```
E:\lecture-notes\
├── index.html                Homepage (lecture list)
├── usage.html                使用须知(如何阅读 / 引用 / 报告错误)
├── AGENTS.md                 This file
├── math/
│   ├── index.html            (removed, inline on index.html)
│   ├── abstract-algebra.html 群/环/域/同构
│   └── matrix-analysis.html  向量/矩阵范数
├── cs/                       (removed, will be reused if CS lectures added)
├── assets/
│   ├── style.css             All styles (16KB, ~30 CSS variables)
│   ├── site.js               All client-side JS (8KB)
│   ├── og-image.svg          Open Graph share card
│   └── favicon-*.png / .ico  Hilbert curve favicon
├── favicon.ico               Multi-size (16/32/48/64/128/256)
├── feed.xml                  RSS 2.0
├── sitemap.xml               SEO sitemap
├── robots.txt                Crawler policy
├── README.md                 Project overview
├── CONTRIBUTING.md           Contribution guide
├── LICENSE                   CC BY 4.0 + MIT
├── CODEOWNERS                Auto-assign reviewers
├── .gitignore
└── .github/
    └── workflows/
        └── indexnow.yml      Bing/Yandex IndexNow submit on push
```

## Site Features (don't break these!)

### Client-side (`assets/site.js`)
1. Reading progress bar (top of viewport)
2. Code copy buttons (`<pre><code>`)
3. Reading time estimate
4. Auto TOC sidebar (only on pages with ≥4 headings)
5. Back-to-top floating button
6. Dark mode (system pref + manual toggle + localStorage persist)
7. Giscus theme sync via postMessage

### Page layout
- `index.html` — homepage with lecture list
- `math/*.html` — each has: front-matter (course tag) → H1 title → TOC (if long) → content → page-actions (Edit on GitHub + Cite BibTeX) → lecture-nav (prev/next) → Giscus comments
- All have SEO meta in `<head>`: canonical, OG, Twitter Card, JSON-LD

### External services
- **GoatCounter**: `orion666.goatcounter.com` (no cookies, GDPR-compliant)
- **Giscus**: GitHub Discussions, repo `silverwolf57/lecture-notes-website`
  - repo-id: `R_kgDOUXzRgw`
  - category-id: `DIC_kwDOUXzRg84DFcwu`
  - data-mapping: `title` (each page's `<title>` = discussion title)
  - data-theme: `preferred_color_scheme` (auto)
- **KaTeX**: 0.16.11 via `cdn.jsdelivr.net`

## Conventions

### Adding a New Lecture

1. **Copy template** `math/abstract-algebra.html` to `math/<topic>.html`
2. **Update front-matter**: course tag, chapter, title in `<h1>`
3. **Update SEO meta**: title, description, canonical, OG, Twitter, JSON-LD
4. **Write content** with KaTeX:
   - `$...$` inline, `$$...$$` display
   - `\tag{1.1}` for display equation numbering
   - `.def-box` / `.thm-box` / `.ex-box` for definitions / theorems / examples
   - Proofs end with `$\square$`
5. **Update index**:
   - `index.html` — add lecture card
   - `sitemap.xml` — add URL
   - `feed.xml` — add item
6. **Update prev/next** in `add_ui_v2.py` LECTURES dict, re-run
7. **Commit + push** to `main`

### CSS Variables (at top of `style.css`)

- `--fg`, `--fg-soft`, `--fg-mute` — text
- `--bg`, `--bg-card` — backgrounds
- `--rule`, `--rule-strong` — borders
- `--accent`, `--link`, `--link-hover` — colors
- `--code-bg`, `--code-fg` — code blocks
- `--font-serif`, `--font-sans`, `--font-mono` — typography
- `--max-w`, `--max-w-wide` — widths

Dark mode redefines all of these under `:root[data-theme="dark"]`.

### Math Notation

- Inline: `$x$`
- Display: `$$x = y$$`
- Numbered: `$$E = mc^2 \tag{1.1}$$` (KaTeX `\tag{}`)
- Greek: `\alpha \beta \gamma \dots`
- Sets: `\mathbb{R}`, `\mathbb{Z}_{>0}`, `\mathcal{F}`
- Common: `\mathrm{Hom}`, `\operatorname{ord}`, `\langle \rangle`, `\to`, `\mapsto`
- Cross-references: text "由式 (1.1) 知" or use auto-generated H2/H3 anchors

## Hard Rules

1. **NEVER** introduce Cloudflare Analytics (user explicitly rejected)
2. **NEVER** add a build step, `package.json`, or `node_modules/`
3. **NEVER** use `<` `>` in `<pre><code>` blocks — use `&lt;` `&gt;`
4. **NEVER** edit `index.html` lecture list without updating `sitemap.xml` + `feed.xml`
5. **ALWAYS** add a link to `<head>` RSS via `<link rel="alternate" type="application/rss+xml">`
6. **ALWAYS** update JSON-LD `dateModified` when modifying a lecture
7. **ALWAYS** keep both light and dark mode in mind when adding CSS

## Common Pitfalls

| Problem | Solution |
|---|---|
| Math not rendering | Check `$$ ... $$` not `$$ ... $$` (typo, brackets matter) |
| Code `<` shows as HTML | Escape: `&lt;` `&gt;` |
| Site not updating | GitHub Pages rebuild takes 1-2 min, then CDN cache can take 5+ min |
| Sitemap out of date | Update manually when adding/removing lectures |
| Giscus 404 | Check repo has Discussions enabled, repo-id correct |
| Dark mode KaTeX wrong color | Add to `style.css` `:root[data-theme="dark"] .katex` overrides |

## Deploy Workflow

```bash
cd E:\lecture-notes
git add .
git commit -m "feat: ..."
git push origin main
# GitHub Pages auto-deploys in ~30-60 seconds
# IndexNow GitHub Action submits to Bing/Yandex within 1 min
```

## Verify Local Changes

```bash
# Open in browser
start E:\lecture-notes\index.html

# Or quick local server
python -m http.server 8000
# Then open http://localhost:8000
```

## License

- **Content** (lectures, text): CC BY 4.0
- **Code** (HTML/CSS/JS): MIT
- See `LICENSE` for full text

## Conventions for AI Agents

- When asked to "add a new feature", check the section above first
- When asked to "fix X", reproduce the issue locally first, then propose a fix
- When asked to "improve Y", think about cost/benefit and the user's stated preferences
- Don't add dependencies unless absolutely necessary
- Prefer self-contained solutions over external services
- Respect the privacy-first design (no trackers, no cookies)
- Match the existing tone: minimal, academic, no fluff
- Use commit messages in English, concise (`feat: ...`, `fix: ...`, `chore: ...`)
