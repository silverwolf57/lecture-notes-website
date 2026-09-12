# 贡献指南 · Contributing

WXG.math and computer science 是协作讲义集。任何想参与的人都欢迎。

## 协作流程

```bash
git checkout main
git pull
git checkout -b feat/your-lecture

# 改 / 加讲义(每篇 .html 是独立的)
# 同步更新 sitemap.xml 加 url

git add .
git commit -m "feat(math): add abstract algebra chapter 2"
git push origin feat/your-lecture
# 在 GitHub 开 PR
```

## 排版规范

- 章节标题用 `<h2>` `<h3>`
- 定义 / 定理 / 练习用 `.def-box` `.thm-box` `.ex-box`
- 行内公式 `$...$`,行间公式 `$$...$$`
- 代码块里的 `<` `>` 必须写 `&lt;` `&gt;`
- 引用文献用 `<a href="..."><em>书名</em></a>`

## 许可

正文 CC BY 4.0,代码块 MIT。详细见 [LICENSE](LICENSE)。

向本仓库提交 Pull Request 即视为同意按上述双重许可发布。
