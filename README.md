# 讲义集 · Lecture Notes on Math & CS

A static, dependency-light website for hosting and publishing math and computer
science lecture notes. Hosted on GitHub Pages.

**线上地址**: https://silverwolf57.github.io/lecture-notes-website/  
**GitHub 仓库**: https://github.com/silverwolf57/lecture-notes (Private)

## 维护者

- **Owner**: [@silverwolf57](https://github.com/silverwolf57)
- **Collaborator**: [@laiyihe44-creator](https://github.com/laiyihe44-creator)

新合作者请走 PR 流程,详细见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 结构

```
lecture-notes/
├── index.html              # 首页 - 主题索引
├── about.html              # 项目说明、许可
├── math/                   # 数学讲义
│   ├── index.html
│   ├── linear-algebra.html
│   └── probability.html
├── cs/                     # 计算机讲义
│   ├── index.html
│   ├── algorithms.html
│   └── ml-foundations.html
├── assets/
│   └── style.css           # 唯一 CSS 源
├── sitemap.xml             # 搜索引擎索引
├── robots.txt              # 爬虫策略
├── LICENSE                 # CC BY 4.0 + MIT 双重许可
├── CONTRIBUTING.md         # 贡献指南
└── README.md               # 本文件
```

## 技术栈

- 纯 HTML5 + CSS3, 无框架, 无构建步骤
- [KaTeX](https://katex.org/) via CDN 做数学公式渲染
- 系统字体栈(中英文混排无需下载)
- GitHub Pages 自动部署
- sitemap.xml + robots.txt 给搜索引擎

## 本地预览

直接用浏览器打开 `index.html`。KaTeX CDN 首次需要网络,之后离线也可。

或起一个本地 server(可选):

```bash
# Python 3
python -m http.server 8000
# 访问 http://localhost:8000
```

## 加新讲义

1. 从已有 `*.html` 拷贝做模板
2. 改 `<title>`、`<h1>`、`front-matter` 课程编号
3. 写正文(用 def-box / thm-box / ex-box 框)
4. 在对应 section 的 `index.html` 加链接
5. 在首页 `index.html` 加/改卡片
6. 同步更新 `sitemap.xml`(加一行 url)
7. commit + push,自动部署

## 协作流程

```bash
git checkout main && git pull
git checkout -b feat/your-feature
# 改文件
git add . && git commit -m "feat(scope): description"
git push origin feat/your-feature
# 在 GitHub 开 PR
```

详细见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 部署

`main` 分支 push 后 GitHub Actions / GitHub Pages 自动部署。
任何 commit 触发自动构建,1-2 分钟后公网更新。

## 许可

正文 **CC BY 4.0**,代码块 **MIT**。见 [LICENSE](LICENSE)。
