# 博客开发实施计划

## 项目概述

- **项目名称**: juntz.github.io
- **项目类型**: GitHub Pages静态博客
- **技术栈**: Eleventy + Nunjucks + Markdown + CSS
- **部署方式**: GitHub Actions自动化部署
- **目标**: 创建一个高性能、可自定义、易于维护的个人博客

---

## 技术架构

### 核心技术
| 技术 | 版本 | 用途 |
|------|------|------|
| Eleventy | ^2.0.0 | 静态站点生成器 |
| Node.js | ^18.x | 运行时环境 |
| Nunjucks | - | 模板引擎 |
| Markdown | - | 内容编写格式 |

### 项目结构
```
blog-juntz/
├── .eleventy.js                 # Eleventy配置文件
├── .github/
│   └── workflows/
│       └── deploy.yml           # GitHub Actions部署配置
├── package.json                 # 项目依赖和脚本
├── .gitignore                   # Git忽略配置
├── src/
│   ├── _data/
│   │   └── site.json            # 站点全局数据
│   ├── _includes/
│   │   ├── layouts/
│   │   │   ├── base.njk         # 基础布局模板
│   │   │   └── post.njk         # 文章布局模板
│   │   └── components/
│   │       ├── header.njk       # 头部组件
│   │       ├── footer.njk       # 底部组件
│   │       └── nav.njk          # 导航组件
│   ├── posts/
│   │   ├── hello-world.md       # 示例文章
│   │   └── template-guide.md    # 模板使用指南
│   ├── pages/
│   │   ├── index.njk            # 首页
│   │   ├── about.md             # 关于页面
│   │   └── archive.njk          # 文章归档页
│   └── assets/
│       ├── css/
│       │   └── style.css        # 主样式文件
│       ├── js/
│       │   └── main.js         # 主JavaScript文件
│       └── images/             # 图片资源目录
├── _site/                      # 构建输出目录（自动生成）
└── README.md                   # 项目说明
```

---

## 实施阶段

### 阶段1：项目初始化

#### 1.1 初始化Node.js项目
```bash
npm init -y
```

#### 1.2 安装Eleventy及依赖
```bash
npm install --save-dev @11ty/eleventy
```

#### 1.3 配置package.json脚本
```json
{
  "scripts": {
    "start": "eleventy --serve",
    "dev": "eleventy --serve",
    "build": "eleventy",
    "clean": "rm -rf _site"
  }
}
```

#### 1.4 创建Eleventy配置文件 (.eleventy.js)
- 设置输入输出目录
- 配置模板引擎（Passthrough复制、过滤器等）
- 设置数据处理规则

---

### 阶段2：模板系统搭建

#### 2.1 创建布局模板
- **base.njk**: 基础HTML骨架，包含head、body结构
- **post.njk**: 文章详情页布局，继承base.njk

#### 2.2 创建可复用组件
- **header.njk**: 网站头部，包含logo、导航
- **footer.njk**: 网站底部，版权信息、社交链接
- **nav.njk**: 导航菜单组件

#### 2.3 创建数据文件
- **site.json**: 站点元数据（标题、描述、作者等）

---

### 阶段3：样式系统设计

#### 3.1 CSS架构
采用现代CSS架构：
- CSS自定义属性（变量）系统
- 响应式设计（移动优先）
- 模块化组织结构

#### 3.2 样式变量
```css
:root {
  /* 颜色系统 */
  --color-primary: #3498db;
  --color-secondary: #2ecc71;
  --color-text: #333333;
  --color-bg: #ffffff;
  --color-bg-secondary: #f8f9fa;
  
  /* 字体系统 */
  --font-primary: 'Inter', -apple-system, sans-serif;
  --font-mono: 'Fira Code', monospace;
  
  /* 间距系统 */
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 2rem;
  --spacing-xl: 4rem;
  
  /* 布局 */
  --max-width: 800px;
  --border-radius: 8px;
}
```

#### 3.3 暗色模式支持
```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-text: #e0e0e0;
    --color-bg: #1a1a1a;
    --color-bg-secondary: #2d2d2d;
  }
}
```

---

### 阶段4：内容创建

#### 4.1 创建示例文章
- 在 `src/posts/` 目录创建Markdown文件
- 使用Front Matter定义文章元数据
  - title: 文章标题
  - date: 发布日期
  - tags: 文章标签
  - description: 文章描述

#### 4.2 创建页面
- **首页** (index.njk): 展示最新文章列表
- **关于页面** (about.md): 个人简介
- **归档页面** (archive.njk): 所有文章列表

---

### 阶段5：GitHub Actions部署

#### 5.1 创建工作流文件
创建 `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build site
        run: npm run build
        
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./_site
          publish_branch: gh-pages
```

#### 5.2 部署步骤
1. 推送代码到main分支
2. GitHub Actions自动触发构建
3. 构建成功后自动部署到gh-pages分支
4. 访问 https://juntz-g1thub.github.io 查看网站

---

## 开发工作流

### 本地开发
```bash
# 启动开发服务器（热重载）
npm run dev

# 构建生产版本
npm run build

# 清理构建目录
npm run clean
```

### 发布流程
```bash
# 1. 创建开发分支
git checkout -b feature/new-post

# 2. 创建新文章
# 编辑 src/posts/your-post.md

# 3. 本地测试
npm run dev

# 4. 提交更改
git add .
git commit -m "Add new post: Your Post Title"

# 5. 推送到远程
git push origin feature/new-post

# 6. 合并到main分支后自动部署
```

---

## 后续功能扩展

### 短期扩展
- [ ] RSS订阅生成
- [ ] 网站地图(sitemap.xml)自动生成
- [ ] 代码高亮显示
- [ ] 评论系统集成(Giscus/Utterances)

### 长期扩展
- [ ] 搜索功能实现
- [ ] 标签和分类系统完善
- [ ] SEO深度优化
- [ ] 性能优化（图片压缩、资源缓存）
- [ ] 可访问性增强

---

## 关键配置说明

### Eleventy配置要点
1. **Passthrough复制**: 将CSS、JS、图片等静态资源复制到输出目录
2. **过滤器**: 添加日期格式化、摘要截取等实用过滤器
3. **集合**: 定义文章集合，自动按日期排序

### GitHub Pages配置
1. 进入仓库设置 → Pages
2. Source选择 "Deploy from a branch"
3. Branch选择 "gh-pages"，目录选择 "/ (root)"
4. 保存设置

---

## 注意事项

1. **仓库命名**: GitHub Pages用户站点必须使用 `<username>.github.io` 格式
2. **分支策略**: 代码在main分支，构建输出推送到gh-pages分支
3. **首次部署**: 首次推送后可能需要几分钟才能看到网站
4. **自定义域名**: 如需自定义域名，可在GitHub Pages设置中配置

---

## 参考资源

- [Eleventy官方文档](https://www.11ty.dev/docs/)
- [GitHub Actions文档](https://docs.github.com/en/actions)
- [GitHub Pages配置](https://docs.github.com/en/pages)
- [peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages)
