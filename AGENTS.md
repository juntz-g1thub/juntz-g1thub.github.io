# AGENTS.md - Developer Guidelines for Juntz's Blog

This document provides coding guidelines for agents working on this Eleventy-based static blog project.

---

## 1. Build and Development Commands

### Available npm Scripts

```bash
# Install dependencies
npm install

# Start development server with hot reload
npm run dev
# or: npm start

# Build production static site
npm run build

# Clean build output directory
npm run clean
```

### Manual Testing

- **Preview built site**: Serve `_site/` directory locally
- **Test links**: Verify all internal links work after build
- **Validate HTML**: Check for valid HTML5 structure

### GitHub Actions

The project uses GitHub Actions for automatic deployment:
- Push to `main` branch triggers automatic build and deploy
- Output is published to `gh-pages` branch
- Live site: https://juntz-g1thub.github.io

---

## 2. Project Structure

```
blog-juntz/
├── .eleventy.js              # Eleventy configuration
├── package.json              # Node dependencies
├── .github/workflows/        # CI/CD pipelines
├── src/
│   ├── index.njk             # Homepage template
│   ├── _data/                # Global data files
│   │   └── site.json         # Site metadata
│   ├── _includes/
│   │   ├── layouts/          # Page layouts
│   │   │   ├── base.njk      # Base HTML template
│   │   │   └── post.njk      # Blog post layout
│   │   └── components/       # Reusable components
│   │       ├── header.njk
│   │       └── footer.njk
│   ├── posts/                # Blog posts (Markdown)
│   ├── pages/                # Static pages
│   └── assets/
│       ├── css/style.css     # Main stylesheet
│       └── images/           # Image assets
└── _site/                    # Build output (generated)
```

---

## 3. Code Style Guidelines

### 3.1 General Principles

- Keep templates simple and readable
- Use semantic HTML5 elements
- Maintain consistent indentation (2 spaces)
- No trailing whitespace
- Use lowercase for file names (kebab-case)

### 3.2 Nunjucks Templates (.njk)

**File Naming**: Use lowercase with dashes (e.g., `base.njk`, `post-layout.njk`)

**Indentation**: 2 spaces for nested structures

**Variables**:
```njk
{{ variable_name }}
{{ object.property }}
{{ array[0] }}
```

**Conditionals**:
```njk
{% if condition %}
  ...
{% elif other_condition %}
  ...
{% else %}
  ...
{% endif %}
```

**Loops**:
```njk
{% for item in items %}
  {{ item.name }}
{% endfor %}
```

**Includes** (use quotes):
```njk
{% include "components/header.njk" %}
{% include "layouts/base.njk" %}
```

**Filters** (pipe syntax):
```njk
{{ content | safe }}
{{ date | readableDate }}
{{ date | htmlDateString }}
```

**Front Matter** (YAML format):
```yaml
---
layout: layouts/post.njk
title: Post Title
date: 2026-03-06
tags:
  - posts
  - tag-name
description: Brief description
---
```

### 3.3 Markdown Content (.md)

**Front Matter**: Required for all content files

```yaml
---
layout: layouts/post.njk
title: Your Post Title
date: 2026-03-06
tags:
  - posts
  - category
description: SEO description (150-160 chars)
---
```

**Headings**: Use ATX-style (# ## ###)

```markdown
## Heading Level 2
### Heading Level 3
```

**Lists**: Use - or * for unordered, 1. 2. 3. for ordered

**Code Blocks**: Use triple backticks with language identifier

```markdown
```javascript
const greeting = "Hello";
```
```

**Links**: Use descriptive link text

```markdown
[Eleventy Documentation](https://www.11ty.dev)
```

**Images**: Include alt text

```markdown
![Alt text](/assets/images/image-name.png)
```

### 3.4 CSS (.css)

**File Naming**: Use lowercase with dashes (e.g., `style.css`, `components.css`)

**Variables** (CSS Custom Properties):
```css
:root {
  --color-primary: #3498db;
  --color-secondary: #2ecc71;
  --spacing-md: 1rem;
  --font-primary: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
```

**Dark Mode Support**:
```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-text: #e0e0e0;
    --color-bg: #1a1a1a;
  }
}
```

**BEM-style classes** (recommended):
```css
.block {}
.block__element {}
.block--modifier {}
```

**Organization**:
1. CSS Custom Properties (variables)
2. Reset/normalize
3. Base styles (typography)
4. Layout components
5. Page-specific styles
6. Utilities

### 3.5 JavaScript (.js) Configuration

**File**: `.eleventy.js` (CommonJS module)

**Naming**:
- Variables: camelCase (`eleventyConfig`, `dateObj`)
- Functions: camelCase (`readableDate`, `htmlDateString`)
- Constants: UPPER_SNAKE_CASE if needed

**Module Export**:
```javascript
module.exports = function(eleventyConfig) {
  // Configuration code
  return { /* options object */ };
};
```

**Filters**:
```javascript
eleventyConfig.addFilter("filterName", (input) => {
  if (!input) return "";
  // Processing logic
  return output;
});
```

**Collections**:
```javascript
eleventyConfig.addCollection("collectionName", function(collectionApi) {
  return collectionApi.getFilteredByGlob("src/**/*.md");
});
```

### 3.6 JSON Data Files (.json)

**Naming**: Use lowercase with underscores (e.g., `site.json`, `helpers.json`)

**Structure**:
```json
{
  "key": "value",
  "nested": {
    "key": "value"
  }
}
```

---

## 4. Error Handling

### Template Errors
- Check for missing front matter in Markdown files
- Verify file paths in includes are correct
- Ensure filter names are spelled correctly

### Build Errors
- Run `npm run build` to see detailed error messages
- Check for syntax errors in Nunjucks templates
- Verify all referenced files exist

### Common Issues
- **404 on assets**: Check `addPassthroughCopy` in `.eleventy.js`
- **Missing posts**: Verify posts are in `src/posts/*.md`
- **Wrong dates**: Use ISO format `YYYY-MM-DD` in front matter

---

## 5. Adding New Content

### New Blog Post
1. Create file: `src/posts/post-title.md`
2. Add required front matter
3. Write content in Markdown
4. Run `npm run build` to test

### New Static Page
1. Create file: `src/pages/pagename.njk` or `.md`
2. Add front matter with `layout` and `title`
3. Link from navigation if needed

### New Component
1. Create file: `src/_includes/components/name.njk`
2. Include in templates: `{% include "components/name.njk" %}`

---

## 6. Testing Checklist

Before pushing changes:

- [ ] Run `npm run build` successfully
- [ ] Verify all pages render correctly in `_site/`
- [ ] Check that CSS is properly linked
- [ ] Ensure all internal links work
- [ ] Test responsive design at different widths
- [ ] Verify dark mode works (if applicable)

---

## 7. Deployment

### Automatic Deployment (GitHub Actions)
1. Push changes to `main` branch
2. GitHub Actions builds automatically
3. Check Actions tab for build status
4. Site deploys to `gh-pages` branch

### Manual Deployment
```bash
npm run build
# Manually upload _site/ contents to gh-pages
```

---

## 8. Best Practices

1. **Version Control**: Commit frequently with descriptive messages
2. **Testing**: Always build locally before pushing
3. **Performance**: Optimize images before adding to `src/assets/images/`
4. **SEO**: Always include description in front matter
5. **Accessibility**: Use semantic HTML and proper alt text
6. **Responsiveness**: Test on mobile, tablet, and desktop

---

## 9. Useful Resources

- [Eleventy Documentation](https://www.11ty.dev/docs/)
- [Nunjucks Templating](https://mozilla.github.io/nunjucks/)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Markdown Guide](https://www.markdownguide.org/)

---

Last updated: March 2026
