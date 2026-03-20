# Juntz的零构建博客

一个完全静态、零构建的博客系统，使用纯HTML/CSS/JavaScript构建，直接在浏览器中渲染Markdown。

## 特色

- **零构建依赖**：不需要Webpack、NPM、Node.js等构建工具
- **极简架构**：一个HTML文件 + 一个CSS文件 + 一个JS文件 + Markdown文件
- **即时渲染**：使用marked.js在浏览器中即时渲染Markdown
- **完全自定义**：可随意修改HTML和CSS样式
- **响应式设计**：适配桌面和移动设备
- **暗色模式**：自动检测并支持手动切换
- **Hash路由**：简单的URL路由系统

## 快速开始

### 本地预览

直接双击 `index.html` 文件即可在浏览器中打开。

### 编辑内容

1. 编辑 `posts/` 目录下的 `.md` 文件
2. 编辑 `blog.js` 修改功能逻辑
3. 编辑 `style.css` 修改样式

### 部署到GitHub Pages

1. 推送到GitHub仓库
2. 在仓库Settings → Pages中：
   - Source选择 "Deploy from a branch"
   - Branch选择 `main`
   - Folder选择 `/(root)`
3. 访问 `https://你username.github.io`

## 写新文章

在 `posts/` 目录下新建 `.md` 文件，例如 `my-post.md`：

```markdown
# 文章标题

发表时间：2026-03-07  
标签：技术, 教程

这篇文章的正文内容...

## 二级标题

- 列表项
- 另一列表项

**加粗文字** 和 *斜体文字*
```

Markdown文件会被自动发现并显示在侧边栏中。

## 项目结构

```
blog-juntz/
├── index.html          # 主页面（SPA，所有路由在这一文件中）
├── blog.js            # 核心JavaScript逻辑
├── style.css          # 所有样式
├── posts/             # Markdown文章目录
│   ├── hello-world.md
│   └── how-this-blog-was-built.md
├── 404.html           # GitHub Pages SPA支持页面
├── .nojekyll          # 禁用GitHub Pages的Jekyll处理
└── package.json       # 项目元数据（无实际依赖）
```

## 技术原理

### 路由系统

极简Hash路由：
- `#` - 首页
- `#about` - 关于页面  
- `#posts` - 全部文章列表
- `#post=文章slug` - 文章详情页

### Markdown渲染

使用 [marked.js](https://marked.js.org/)（CDN加载）：
```javascript
const markdown = await fetch(`posts/${slug}.md`);
const html = marked.parse(markdown);
```

## 自定义样式

编辑 `style.css`，使用CSS变量系统：
```css
:root {
  --color-primary: #3498db;
  --color-bg: #ffffff;
  --color-text: #333333;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #1a1a1a;
    --color-text: #e0e0e0;
  }
}
```

## 性能统计

| 组件 | 大小 | 说明 |
|------|------|------|
| `index.html` | ~8KB | HTML骨架和内容 |
| `blog.js` | ~13KB | 核心逻辑 |
| `style.css` | ~3KB | 完整样式系统 |
| marked.js (CDN) | ~24KB | Markdown渲染库 |
| 每篇文章 | ~1-3KB | Markdown文件 |
| **总计** | **~50KB** | 首次加载 |

## 开发说明

### 修改功能

编辑 `blog.js`，核心逻辑都在 `BlogApp` 对象中：

```javascript
const BlogApp = {
  // 初始化应用
  async init() { /* ... */ },
  
  // 文章管理
  async loadArticles() { /* ... */ },

  // 路由处理
  handleHashChange() { /* ... */ }
};
```

### 修改布局

直接编辑 `index.html`，使用你喜欢的任何HTML结构。

### 添加交互

在 `blog.js` 中添加新的方法，或直接在HTML中添加事件监听。

## 为什么选择零构建？

### 优点

1. **部署简单**：推送到GitHub即可，无构建步骤
2. **开发快捷**：编辑文件，刷新即见效果
3. **完全透明**：无隐藏构建过程
4. **易于调试**：直接在浏览器开发者工具中调试
5. **轻量级**：总大小<100KB
6. **可控性强**：完全掌握每一行代码

### 注意

1. **SEO影响**：客户端渲染可能影响搜索引擎索引
2. **首次加载**：需要下载JS和CSS后才能渲染内容
3. **浏览器依赖**：需要JavaScript支持

## 许可证

MIT License