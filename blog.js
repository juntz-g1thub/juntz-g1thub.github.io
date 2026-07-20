/**
 * 极简零构建博客引擎 v2.0
 * 核心目标：简单、快速、无需构建
 * 支持中英双语
 */

// ============ i18n 配置 ============
const I18N = {
  zh: {
    nav: { home: '首页', about: '关于', posts: '全部文章' },
    home: {
      title: '欢迎访问我的博客',
      subtitle: '这里是我的技术思考空间，记录编程学习和项目经验。',
      features: '特点',
      feature_list: ['简单直接的Markdown写作', '自定义HTML/CSS界面', '零构建，直接部署', '自动暗色模式支持'],
      recent: '最近文章',
      seeMore: '查看更多文章 →'
    },
    about: {
      title: '关于我',
      intro: '你好，我是Juntz！',
      intro2: '一个热爱技术的开发者，享受用代码创造价值的过程。',
      blogTitle: '关于这个博客',
      blogDesc: '这个博客使用了零构建技术：',
      blogFeatures: ['纯HTML + CSS + JavaScript', '直接在浏览器中渲染Markdown', '无需任何构建工具，直接部署', '托管在GitHub Pages']
    },
    posts: { title: '全部文章', empty: '暂无文章' },
    post: {
      published: '发表时间',
      back: '← 返回文章列表',
      loadFailed: '文章加载失败',
      loadFailedMsg: '抱歉，无法加载文章'
    },
    sidebar: { latest: '最新文章', noArticles: '暂无文章', viewAll: '查看全部', postCount: '篇文章' },
    theme: { dark: '暗色', light: '亮色', toggleDark: '切换暗色', toggleLight: '切换亮色' },
    article: { readMore: '点击阅读全文' },
    profile: { bio: '热爱技术与编程，分享开发心得' },
    footer: { copyright: '保留所有权利' }
  },
  en: {
    nav: { home: 'Home', about: 'About', posts: 'All Posts' },
    home: {
      title: 'Welcome to My Blog',
      subtitle: 'This is my space for technical thinking, recording programming learning and project experiences.',
      features: 'Features',
      feature_list: ['Simple and direct Markdown writing', 'Custom HTML/CSS interface', 'Zero build, direct deployment', 'Automatic dark mode support'],
      recent: 'Recent Posts',
      seeMore: 'View More Posts →'
    },
    about: {
      title: 'About Me',
      intro: 'Hi, I\'m Juntz!',
      intro2: 'A developer passionate about technology, enjoying the process of creating value with code.',
      blogTitle: 'About This Blog',
      blogDesc: 'This blog uses zero-build technology:',
      blogFeatures: ['Pure HTML + CSS + JavaScript', 'Render Markdown directly in browser', 'No build tools required, deploy directly', 'Hosted on GitHub Pages']
    },
    posts: { title: 'All Posts', empty: 'No posts yet' },
    post: {
      published: 'Published',
      back: '← Back to Posts',
      loadFailed: 'Failed to Load Post',
      loadFailedMsg: 'Sorry, unable to load post'
    },
    sidebar: { latest: 'Latest Posts', noArticles: 'No articles yet', viewAll: 'View All', postCount: 'posts' },
    theme: { dark: 'Dark', light: 'Light', toggleDark: 'Switch to Dark', toggleLight: 'Switch to Light' },
    article: { readMore: 'Click to read more' },
    profile: { bio: 'Passionate about technology and programming' },
    footer: { copyright: 'All rights reserved' }
  }
};

// ============ 博客配置 ============
const BLOG_CONFIG = {
  title: "Juntz",
  description: { zh: '技术博客', en: 'Tech Blog' },
  author: {
    name: "Juntz",
    bio: { zh: '热爱技术与编程，分享开发心得', en: 'Passionate about technology and programming' },
    github: "juntz-g1thub"
  },
  githubUrl: "https://github.com/juntz-g1thub"
};

// ============ 核心博客应用 ============
const BlogApp = {
  // DOM元素缓存
  elements: {},

  // 当前状态
  currentPage: 'home',
  currentPost: null,
  articles: [],
  currentLang: 'zh',  // 当前语言

  // ============ 初始化 ============
  async init() {
    console.log('🔧 初始化博客应用...');

    // 初始化语言
    this.initLanguage();

    // 缓存DOM元素
    this.cacheElements();

    // 加载文章列表
    await this.loadArticles();

    // 初始化路由
    this.initRouting();

    // 初始化侧边栏
    this.initSidebar();

    // 初始化导航事件
    this.initNavigation();

    // 设置marked.js配置
    marked.setOptions({
      breaks: true,
      gfm: true,
      highlight: function(code, lang) {
        return `<pre><code class="language-${lang}">${code}</code></pre>`;
      }
    });

    // 监听hash变化
    window.addEventListener('hashchange', () => this.handleHashChange());

    // 处理初始hash
    this.handleHashChange();

    // 更新UI文字
    this.updateUIText();
  },

  // ============ 语言初始化 ============
  initLanguage() {
    // 从localStorage读取语言偏好
    const savedLang = localStorage.getItem('blogLang');
    if (savedLang && (savedLang === 'zh' || savedLang === 'en')) {
      this.currentLang = savedLang;
    } else {
      // 检测浏览器语言
      const browserLang = navigator.language.toLowerCase();
      this.currentLang = browserLang.startsWith('zh') ? 'zh' : 'en';
    }
  },

  // 获取当前语言
  getLang() {
    return this.currentLang;
  },

  // 设置语言
  async setLang(lang) {
    console.log('setLang called with:', lang);
    if (lang !== 'zh' && lang !== 'en') return;
    this.currentLang = lang;
    localStorage.setItem('blogLang', lang);
    console.log('currentLang set to:', this.currentLang);

    // 重新加载文章（使用新语言）
    await this.loadArticles();
    console.log('loadArticles done, articles:', this.articles.map(a => a.title));

    // 重新渲染侧边栏文章列表
    this.renderArticleList();

    // 重新渲染当前页面
    this.handleHashChange();
    this.updateUIText();
    console.log('setLang complete');
  },

  // 获取翻译文本
  t(key) {
    const keys = key.split('.');
    let value = I18N[this.currentLang];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  },

  // 更新UI文字
  updateUIText() {
    // 更新导航
    const navLinks = document.querySelectorAll('[data-i18n-nav]');
    navLinks.forEach(el => {
      const key = el.getAttribute('data-i18n-nav');
      el.textContent = this.t(`nav.${key}`);
    });

    // 更新所有 data-i18n 属性元素
    const i18nElements = document.querySelectorAll('[data-i18n]');
    i18nElements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = this.t(key);
    });

    // 更新首页
    const homeTitle = document.querySelector('.home-title');
    if (homeTitle) homeTitle.textContent = this.t('home.title');

    const homeSubtitle = document.querySelector('.home-subtitle');
    if (homeSubtitle) homeSubtitle.textContent = this.t('home.subtitle');

    // 更新关于页面
    const aboutTitle = document.querySelector('#about-content h1');
    if (aboutTitle) aboutTitle.textContent = this.t('about.title');

    // 更新语言切换器
    this.updateLangSwitcher();
  },

  // 更新语言切换器状态
  updateLangSwitcher() {
    const switcher = document.getElementById('lang-switcher');
    if (!switcher) return;

    const zhBtn = switcher.querySelector('.lang-zh');
    const enBtn = switcher.querySelector('.lang-en');

    if (this.currentLang === 'zh') {
      zhBtn?.classList.add('active');
      enBtn?.classList.remove('active');
    } else {
      enBtn?.classList.add('active');
      zhBtn?.classList.remove('active');
    }
  },

  // ============ DOM缓存 ============
  cacheElements() {
    this.elements = {
      loading: document.getElementById('loading'),
      homeContent: document.getElementById('home-content'),
      aboutContent: document.getElementById('about-content'),
      postsContent: document.getElementById('posts-content'),
      postContent: document.getElementById('post-content'),
      articleList: document.getElementById('article-list'),
      allArticles: document.getElementById('all-articles'),
      recentArticles: document.getElementById('recent-articles')
    };
  },

  // ============ 文章解析 ============
  parseArticleInfo(content, lang = 'zh') {
    const lines = content.split('\n');
    let title = lang === 'zh' ? '未命名文章' : 'Untitled';
    let date = new Date().toISOString().split('T')[0];

    // 从第一行提取标题
    if (lines[0].startsWith('# ')) {
      title = lines[0].substring(2).trim();
    }

    // 查找日期行 - 中英双语支持
    const datePatterns = {
      zh: ['发表时间：', '发表时间:'],
      en: ['Published: ', 'Published:']
    };

    for (let i = 0; i < Math.min(lines.length, 5); i++) {
      for (const pattern of datePatterns[lang]) {
        if (lines[i].includes(pattern)) {
          const match = lines[i].match(new RegExp(pattern + '(.*)'));
          if (match && match[1]) {
            date = match[1].trim();
          }
          break;
        }
      }
    }

    // 提取描述（跳过标题和元信息行）
    let description = '';
    const skipPatterns = ['发表时间', 'Published', '标签：', 'Tags:', '#'];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line && !skipPatterns.some(p => line.includes(p))) {
        description = line.replace(/^#+\s+/, '').trim();
        if (description.length > 100) {
          description = description.substring(0, 100) + '...';
        }
        break;
      }
    }

    return { title, date, description };
  },

  // ============ 加载文章列表 ============
  async loadArticles() {
    try {
      const articles = [
        { slug: 'hello-world' },
        { slug: 'how-this-blog-was-built' },
        { slug: 'coding-skills-dev' }
      ];

      // 并行获取所有文章的信息（当前语言版本）
      const articlePromises = articles.map(async (article) => {
        try {
          console.log(`Fetching ${article.slug}/${this.currentLang}.md`);
          const content = await this.fetchPostContent(article.slug, this.currentLang);
          const info = this.parseArticleInfo(content, this.currentLang);
          console.log(`Parsed ${article.slug}: "${info.title}"`);
          return {
            slug: article.slug,
            ...info,
            content: null
          };
        } catch (error) {
          console.error(`❌ 加载文章 ${article.slug} 信息失败:`, error);
          return null;
        }
      });

      const results = await Promise.all(articlePromises);
      this.articles = results.filter(article => article !== null);

      // 按日期排序
      this.articles.sort((a, b) => new Date(b.date) - new Date(a.date));

      console.log(`📚 加载了 ${this.articles.length} 篇文章 (${this.currentLang})`);
    } catch (error) {
      console.error('❌ 加载文章失败:', error);
      this.articles = [];
    }
  },

  // ============ 路由 ============
  initRouting() {
    console.log('🛣️ 初始化Hash路由...');
  },

  handleHashChange() {
    const hash = window.location.hash.substring(1);

    // 隐藏所有内容
    this.hideAllContent();

    // 隐藏加载状态
    const loading = document.getElementById('loading');
    if (loading) loading.classList.add('hidden');

    if (!hash || hash === 'home') {
      this.showHome();
    } else if (hash === 'about') {
      this.showAbout();
    } else if (hash === 'posts') {
      this.showAllPosts();
    } else if (hash.startsWith('post=')) {
      const slug = hash.split('=')[1].split('&')[0];
      this.loadPost(slug);
    } else {
      this.showHome();
    }
  },

  hideAllContent() {
    this.elements.homeContent.classList.add('hidden');
    this.elements.aboutContent.classList.add('hidden');
    this.elements.postsContent.classList.add('hidden');
    this.elements.postContent.classList.add('hidden');
  },

  // ============ 页面渲染 ============
  showHome() {
    this.currentPage = 'home';
    document.title = `${this.t('nav.home')} - ${BLOG_CONFIG.title}`;
    this.elements.homeContent.classList.remove('hidden');
    this.renderHomeContent();
    this.renderRecentArticles();
    history.replaceState(null, '', '#home');
  },

  renderHomeContent() {
    const container = this.elements.homeContent;
    if (!container) return;

    const t = this.t.bind(this);
    const features = t('home.feature_list');

    container.innerHTML = `
      <h1 class="home-title">${t('home.title')}</h1>
      <p class="home-subtitle">${t('home.subtitle')}</p>
      <p><strong>${t('home.features')}：</strong></p>
      <ul class="feature-list">
        <li>📝 <span>${features[0]}</span></li>
        <li>🎨 <span>${features[1]}</span></li>
        <li>🚀 <span>${features[2]}</span></li>
        <li>🌙 <span>${features[3]}</span></li>
      </ul>

      <section class="recent-posts">
        <h2>📚 ${t('home.recent')}</h2>
        <div id="recent-articles" class="post-list"></div>
      </section>
    `;

    // Re-cache the recent-articles element after innerHTML update
    this.elements.recentArticles = document.getElementById('recent-articles');
  },

  showAbout() {
    this.currentPage = 'about';
    document.title = `${this.t('about.title')} - ${BLOG_CONFIG.title}`;
    this.elements.aboutContent.classList.remove('hidden');
    this.renderAboutContent();
  },

  renderAboutContent() {
    const container = this.elements.aboutContent;
    if (!container) return;

    const t = this.t.bind(this);
    container.innerHTML = `
      <h1>${t('about.title')}</h1>
      <p>${t('about.intro')}</p>
      <p>${t('about.intro2')}</p>

      <h2>${t('about.blogTitle')}</h2>
      <p>${t('about.blogDesc')}</p>
      <ul>
        ${t('about.blogFeatures').map(f => `<li>${f}</li>`).join('')}
      </ul>
    `;
  },

  renderRecentArticles() {
    const container = document.getElementById('recent-articles');
    if (!container || this.articles.length === 0) return;

    const t = this.t.bind(this);
    const recentArticles = this.articles.slice(0, 2);
    let html = '';

    recentArticles.forEach(article => {
      const date = this.formatDate(article.date);
      html += `
        <div class="post-item">
          <h2 class="post-title">
            <a href="#post=${article.slug}" class="post-link">${article.title}</a>
          </h2>
          <div class="post-meta">
            <span>${date}</span>
          </div>
          <p>${article.description || t('article.readMore')}</p>
        </div>
      `;
    });

    if (this.articles.length >= 2) {
      html += `
        <div class="more-posts-link">
          <a href="#posts">${t('home.seeMore')}</a>
        </div>
      `;
    }

    container.innerHTML = html;
  },

  showAllPosts() {
    this.currentPage = 'posts';
    document.title = `${this.t('posts.title')} - ${BLOG_CONFIG.title}`;
    this.elements.postsContent.classList.remove('hidden');
    this.renderPostsContent();
  },

  renderPostsContent() {
    const headerContainer = document.getElementById('posts-header');
    const container = this.elements.allArticles;
    if (!headerContainer || !container) return;

    const t = this.t.bind(this);

    headerContainer.innerHTML = `<h1>${t('posts.title')}</h1>`;

    if (this.articles.length === 0) {
      container.innerHTML = `<p>${t('posts.empty')}</p>`;
      return;
    }

    let html = '';
    this.articles.forEach(article => {
      const date = this.formatDate(article.date);
      html += `
        <div class="post-item">
          <h2 class="post-title">
            <a href="#post=${article.slug}" class="post-link">${article.title}</a>
          </h2>
          <div class="post-meta">
            <span>${date}</span>
          </div>
          <p>${article.description}</p>
        </div>
      `;
    });

    container.innerHTML = html;
  },

  async loadPost(slug) {
    this.currentPage = 'post';
    this.currentPost = slug;
    this.elements.loading.classList.remove('hidden');

    try {
      // 1. 加载当前语言的Markdown文件
      const markdown = await this.fetchPostContent(slug, this.currentLang);

      // 2. 转换为HTML
      const html = marked.parse(markdown);

      // 3. 找到文章信息
      const article = this.articles.find(a => a.slug === slug) || {
        title: slug,
        date: new Date().toISOString().split('T')[0]
      };

      // 4. 更新页面标题
      document.title = `${article.title} - ${BLOG_CONFIG.title}`;

      // 5. 渲染内容
      const t = this.t.bind(this);
      this.elements.postContent.innerHTML = `
        <article class="post-article">
          <h1>${article.title}</h1>
          <div class="post-meta">
            <span class="post-date">${t('post.published')}: ${this.formatDate(article.date)}</span>
          </div>
          <div class="post-body">${html}</div>
          <div class="post-navigation">
            <a href="#posts" class="nav-back">${t('post.back')}</a>
          </div>
        </article>
      `;

      // 6. 显示内容
      this.elements.loading.classList.add('hidden');
      this.elements.postContent.classList.remove('hidden');

    } catch (error) {
      console.error('❌ 加载文章失败:', error);
      const t = this.t.bind(this);
      this.elements.postContent.innerHTML = `
        <h1>${t('post.loadFailed')}</h1>
        <p>${t('post.loadFailedMsg')} "${slug}"。</p>
        <div class="post-navigation">
          <a href="#posts" class="nav-back">${t('post.back')}</a>
        </div>
      `;
      this.elements.loading.classList.add('hidden');
      this.elements.postContent.classList.remove('hidden');
    }
  },

  // 获取文章内容
  async fetchPostContent(slug, lang = 'zh') {
    const url = `posts/${slug}/${lang}.md`;
    console.log(`fetchPostContent: fetching ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`fetchPostContent: 404 at ${url}`);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.text();
  },

  // ============ 侧边栏 ============
  initSidebar() {
    this.renderArticleList();
    this.initThemeToggle();
  },

  renderArticleList() {
    const container = document.getElementById('article-list');
    if (!container) {
      console.log('renderArticleList: container not found');
      return;
    }

    const t = this.t.bind(this);

    if (this.articles.length === 0) {
      container.innerHTML = `<p class="no-articles">${t('sidebar.noArticles')}</p>`;
      return;
    }

    let html = '<div class="scrollable-list">';
    const recentArticles = this.articles.slice(0, 5);

    recentArticles.forEach((article, index) => {
      const date = this.formatDate(article.date);
      html += `
        <div class="article-item ${index === 0 ? 'first' : ''}">
          <a href="#post=${article.slug}" class="article-link">
            <span class="article-index">${index + 1}.</span>
            <div class="article-content">
              <div class="article-title">${article.title}</div>
              <div class="article-date">${date}</div>
            </div>
          </a>
        </div>
      `;
    });

    if (this.articles.length > 5) {
      html += `
        <div class="article-item more-link">
          <a href="#posts" class="article-link">
            <i class="fas fa-ellipsis-h"></i> ${t('sidebar.viewAll')} ${this.articles.length} ${t('sidebar.postCount')}
          </a>
        </div>
      `;
    }

    html += '</div>';
    container.innerHTML = html;
    console.log(`renderArticleList: rendered ${this.articles.length} articles in ${this.currentLang}`);
  },

  // ============ 主题切换 ============
  initThemeToggle() {
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.setAttribute('aria-label', 'Toggle theme');

    const t = this.t.bind(this);

    const updateThemeButton = () => {
      const isDark = document.documentElement.classList.contains('dark-theme');
      themeToggle.innerHTML = isDark
        ? `<i class="fas fa-sun"></i> ${t('theme.toggleLight')}`
        : `<i class="fas fa-moon"></i> ${t('theme.toggleDark')}`;
    };

    themeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark-theme');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      updateThemeButton();
    });

    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      sidebar.appendChild(themeToggle);
    }

    // 恢复保存的主题
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark-theme');
    }
    updateThemeButton();
  },

  // ============ 导航 ============
  initNavigation() {
    document.addEventListener('click', (e) => {
      const navLink = e.target.closest('[data-nav]');
      if (navLink) {
        e.preventDefault();
        const target = navLink.getAttribute('data-nav');
        this.navigateTo(target);
      }
    });
  },

  navigateTo(page) {
    window.location.hash = page;
  },

  // ============ 工具方法 ============
  formatDate(dateString) {
    const date = new Date(dateString);
    const locale = this.currentLang === 'zh' ? 'zh-CN' : 'en-US';
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },

  addArticle(articleData) {
    this.articles.unshift(articleData);
    this.renderArticleList();
    console.log(`📝 添加了新文章: ${articleData.title}`);
  }
};

// 应用初始化
document.addEventListener('DOMContentLoaded', () => {
  BlogApp.init();
});

// 暴露到 window 以便调试和语言切换器使用
window.BlogApp = BlogApp;

// 开发工具
window.dev = {
  addTestArticle: () => {
    BlogApp.addArticle({
      slug: 'test-article',
      title: '测试文章',
      date: new Date().toISOString().split('T')[0],
      description: '这是一篇测试文章',
      content: '# 测试标题\n\n这是测试文章的内容。'
    });
  }
};
