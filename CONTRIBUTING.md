# 贡献指南 · Contributing

本站点 WXG.math and computer science 是一个协作讲义集。任何想参与的人都欢迎。

## 仓库结构

```
lecture-notes/
├── index.html              首页
├── about.html              关于
├── math/                   数学讲义(每篇一个 .html)
│   ├── index.html
│   └── *.html
├── cs/                     计算机讲义
│   ├── index.html
│   └── *.html
├── assets/                 唯一 CSS 源
│   └── style.css
├── sitemap.xml             给搜索引擎
├── robots.txt              爬虫策略
└── README.md               项目总览
```

## 协作流程(摘要)

```bash
# 1. 拉最新
git checkout main
git pull

# 2. 新建分支(每篇讲义 / 每个修改一个分支)
git checkout -b feat/real-analysis
# 或 fix:fix: typo in algorithms.html

# 3. 改文件、写讲义
#    - 每篇讲义 = 一个 .html, 拷贝已有讲义做模板
#    - 数学用 $...$ 与 $$...$$ 包裹
#    - 代码块里的 < > 必须写 &lt; &gt;
#    - 改完在对应 section/index.html 与首页加链接

# 4. 提交(用 Conventional Commits 风格)
git add .
git commit -m "feat(math): add measure theory lecture 1"
git push origin feat/real-analysis

# 5. 在 GitHub 开 PR, 等 review
```

## 冲突避让

- **每篇讲义 = 一个文件** — 天然降低冲突
- `index.html` 与 `assets/style.css` 是公共文件,改前在群里吼一声
- 详见 `CODEOWNERS` 与 `README.md` 的协作约定

## 排版规范

- 章节标题:用 `<h2>` `<h3>`,不要用大字号段落
- 定理/定义/练习:分别用 `.def-box` `.thm-box` `.ex-box`
- 数学公式:行内用 `$...$`,行间用 `$$...$$`
- 引用别人教材:用 `<a href="..."><em>书名</em></a>`

## 许可

正文(讲义内容)采用 **CC BY 4.0**,代码块采用 **MIT**。详细见 `LICENSE`。
