# 这个博客是如何构建的

发表时间：2026-03-06  
标签：技术, 教程, 前端

在这篇文章中，我将详细解释这个零构建博客的技术实现细节。

## 架构概述

```
blog-juntz/
├── index.html     # 唯一页面（SPA入口）
├── style.css     # 所有样式
├── blog.js       # 核心逻辑（约200行）
├── posts/        # Markdown文件目录
└── .nojekyll     # 禁用Jekyll处理
```

## 核心组件

### 1. 极简Hash路由

```javascript
// 处理URL hash变化
window.addEventListener('hashchange', () => {
  const hash = window.location.hash.substring(1);
  // 根据hash加载不同内容
});
```

支持的路由：
- `#` - 首页
- `#about` - 关于页面
- `#posts` - 全部文章
- `#post=文章slug` - 文章详情

### 2. Markdown渲染

使用[marked.js](https://marked.js.org/)库，直接从CDN加载：

```html
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
```

```javascript
// 渲染Markdown
const markdown = await fetch(`posts/${slug}.md`);
const html = marked.parse(markdown);
```

### 3. 响应式CSS设计

基于CSS变量系统，原生支持暗色模式：

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

## 性能特点

### ✅ 优点
1. **加载速度快** - 单个页面，无需跳转
2. **维护简单** - 纯文本文件，无需构建
3. **开发快速** - 直接编辑，即时生效
4. **部署简单** - 推送到GitHub即可

### ⚠️ 限刷
1. **SEO影响** - 客户端渲染，搜索引擎可能不友好
2. **首次加载** - 需要下载所有资源
3. **兼容性** - 需要JS支持

## 文件大小统计

- `style.css`: ~10KB
- `blog.js`: ~7KB
- marked.js: ~24KB (CDN)
- 每篇文章: 平均1-3KB

总计：约40KB，非常轻量！

## 总结

这个博客证明了**简单即是美**。不需要复杂的构建工具和配置，也能创建一个完全功能、美观的博客。

如果你也想建立一个类似的博客，只需：
1. 写几行HTML/CSS/JS
2. 用Markdown写文章
3. 推送到GitHub Pages
4. 完成！