# How This Blog Was Built

Published: 2026-03-06
Tags: Tech, Tutorial, Frontend

In this article, I will explain in detail the technical implementation of this zero-build blog.

## Architecture Overview

```
blog-juntz/
├── index.html     # Single page (SPA entry)
├── style.css     # All styles
├── blog.js       # Core logic (~200 lines)
├── posts/        # Markdown files directory
└── .nojekyll     # Disable Jekyll processing
```

## Core Components

### 1. Minimal Hash Routing

```javascript
// Handle URL hash changes
window.addEventListener('hashchange', () => {
  const hash = window.location.hash.substring(1);
  // Load different content based on hash
});
```

Supported routes:
- `#` - Home
- `#about` - About page
- `#posts` - All posts
- `#post=slug` - Post detail

### 2. Markdown Rendering

Using [marked.js](https://marked.js.org/) library, loaded directly from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
```

```javascript
// Render Markdown
const markdown = await fetch(`posts/${slug}.md`);
const html = marked.parse(markdown);
```

### 3. Responsive CSS Design

Based on CSS custom properties system, with native dark mode support:

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

## Performance Characteristics

### Advantages
1. **Fast loading** - Single page, no navigation
2. **Easy maintenance** - Plain text files, no build required
3. **Rapid development** - Edit directly, instant feedback
4. **Simple deployment** - Push to GitHub

### Limitations
1. **SEO impact** - Client-side rendering may not be search-engine friendly
2. **Initial load** - All resources need to be downloaded
3. **Compatibility** - Requires JavaScript support

## File Size Statistics

- `style.css`: ~10KB
- `blog.js`: ~7KB
- marked.js: ~24KB (CDN)
- Each post: avg 1-3KB

Total: ~40KB, very lightweight!

## Summary

This blog proves that **simplicity is beauty**. You can create a fully functional, beautiful blog without complex build tools and configurations.

If you want to build a similar blog, just:
1. Write some HTML/CSS/JS
2. Write posts in Markdown
3. Push to GitHub Pages
4. Done!
