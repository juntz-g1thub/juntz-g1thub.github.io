# AGENTS.md - Developer Guidelines for Juntz's Zero-Build Blog

This document provides coding guidelines for agents working on this zero-build blog project using pure HTML/CSS/JavaScript.

---

## 1. Project Overview

A completely static, zero-build blog system. All pages render Markdown directly in the browser using marked.js. No build tools, no Node.js dependencies for development.

---

## 2. Build and Development Commands

### No Build Required

This is a zero-build project. Development workflow:

```bash
# No npm install needed (no dependencies)
# No npm run dev needed

# Simply:
# 1. Open index.html directly in browser
# 2. Edit files
# 3. Refresh browser to see changes
```

### Optional Local Server (for CORS)

If you need to test with a local server (e.g., for CORS with fetch):

```bash
# Using Python
python -m http.server 8000

# Using Node.js (npx)
npx serve .

# Then open http://localhost:8000
```

### Deployment

1. Push changes to GitHub repository
2. Go to Settings → Pages
3. Select "Deploy from a branch" → `main` branch → `/(root)`
4. Site will be live at `https://yourusername.github.io`

---

## 3. Project Structure

```
blog-juntz/
├── index.html          # Main SPA - all routing handled here
├── blog.js             # Core JavaScript logic (~200 lines)
├── style.css           # All styles with CSS variables
├── posts/              # Markdown articles
│   ├── hello-world.md
│   └── how-this-blog-was-built.md
├── 404.html            # GitHub Pages SPA fallback
├── .nojekyll           # Disable GitHub Pages Jekyll
├── package.json        # Project metadata (no deps)
├── .github/workflows/  # CI/CD (optional)
└── AGENTS.md           # This file
```

---

## 4. Code Style Guidelines

### 4.1 General Principles

- Keep it simple - no build step means no complexity
- Use semantic HTML5 elements
- Maintain consistent indentation (2 spaces)
- No trailing whitespace
- Use lowercase for file names (kebab-case)

### 4.2 HTML Structure

**File Naming**: lowercase with dashes

**Basic Template**:
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Title</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header>...</header>
  <main id="app">...</main>
  <footer>...</footer>
  <script src="blog.js"></script>
</body>
</html>
```

### 4.3 CSS Styles

**File Naming**: Use lowercase with dashes (e.g., `style.css`)

**Variables** (CSS Custom Properties):
```css
:root {
  --color-primary: #3498db;
  --color-secondary: #2ecc71;
  --color-bg: #ffffff;
  --color-text: #333333;
  --spacing-md: 1rem;
  --font-primary: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
```

**Dark Mode Support**:
```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #1a1a1a;
    --color-text: #e0e0e0;
  }
}
```

**Organization**:
1. CSS Custom Properties (variables)
2. Reset/base styles
3. Typography
4. Layout components
5. Page-specific styles
6. Utilities

### 4.4 JavaScript

**File**: `blog.js`

**Core Pattern** - Single global object:
```javascript
const BlogApp = {
  // State
  articles: [],

  // Initialize
  async init() {
    await this.loadArticles();
    this.bindEvents();
    this.handleHashChange();
  },

  // Event binding
  bindEvents() {
    window.addEventListener('hashchange', () => this.handleHashChange());
  },

  // Routing
  handleHashChange() {
    const hash = window.location.hash || '#';
    // Route handling logic
  },

  // Load markdown files
  async loadArticles() {
    // Fetch and parse posts
  }
};

document.addEventListener('DOMContentLoaded', () => BlogApp.init());
```

**Naming**:
- Variables: camelCase (`currentRoute`, `articles`)
- Functions: camelCase (`loadArticles`, `renderPost`)
- Constants: UPPER_SNAKE_CASE if needed

---

## 5. Routing System

### Hash-Based Routing

| Hash | Page |
|------|------|
| `#` or `#/` | Home |
| `#about` | About page |
| `#posts` | All posts list |
| `#post=slug` | Single post |

### Route Handling Pattern

```javascript
handleHashChange() {
  const hash = window.location.hash;

  if (hash === '#' || hash === '') {
    this.renderHome();
  } else if (hash === '#about') {
    this.renderAbout();
  } else if (hash === '#posts') {
    this.renderPostsList();
  } else if (hash.startsWith('#post=')) {
    const slug = hash.replace('#post=', '');
    this.renderPost(slug);
  } else {
    this.render404();
  }
}
```

---

## 6. Markdown Posts

### File Naming

Use lowercase with dashes: `my-post-title.md`

### Front Matter Pattern

```markdown
# Post Title

发表时间：2026-03-07  
标签：技术, 教程

正文内容...
```

Note: Current implementation parses date/tags from body text. Future versions may use YAML front matter.

### Loading Posts

```javascript
async loadPost(slug) {
  const response = await fetch(`posts/${slug}.md`);
  const markdown = await response.text();
  const html = marked.parse(markdown);
  return { html, slug };
}
```

---

## 7. Adding New Content

### New Blog Post

1. Create file: `posts/my-post-title.md`
2. Add title at top with `# Title`
3. Add date line: `发表时间：YYYY-MM-DD`
4. Add tags line: `标签：tag1, tag2`
5. Write content in Markdown
6. Open in browser and test

### Modifying Styles

Edit `style.css` - all styles use CSS variables for easy theming.

### Adding Features

Edit `blog.js` - all logic in `BlogApp` object.

---

## 8. Error Handling

### Common Issues

- **404 on posts**: Check file is in `posts/` directory and slug matches filename
- **Markdown not rendering**: Ensure marked.js CDN is loaded
- **Styles not applied**: Check CSS file path in HTML
- **Hash routing broken**: Check `window.location.hash` usage

### Debugging

- Open browser DevTools (F12)
- Check Console for errors
- Use `console.log()` to debug JavaScript
- Network tab to verify file loads

---

## 9. Best Practices

1. **Version Control**: Commit frequently with descriptive messages
2. **Test Locally**: Always test in browser before deploying
3. **SEO**: Use semantic HTML, include descriptive content
4. **Accessibility**: Use proper alt text, semantic elements
5. **Performance**: Keep JS/CSS minimal
6. **Responsiveness**: Test on mobile and desktop

---

## 10. File Reference

### index.html (~8KB)
- Main SPA shell
- Contains header, main content area, footer
- Loads blog.js and style.css

### blog.js (~13KB)
- `BlogApp` object with all logic
- Hash routing
- Markdown loading via fetch
- marked.js integration

### style.css (~3KB)
- CSS variables for theming
- Dark mode support
- Responsive layout

### posts/*.md
- Markdown content files
- Parsed client-side

---

Last updated: March 2026