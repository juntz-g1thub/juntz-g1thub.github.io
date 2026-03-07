/**
 * 极简零构建博客引擎
 * 核心目标：简单、快速、无需构建
 */

// 博客配置
const BLOG_CONFIG = {
  title: "Juntz",
  description: "技术博客",
  author: {
    name: "Juntz",
    bio: "热爱技术与编程，分享开发心得",
    github: "juntz-g1thub"
  },
  githubUrl: "https://github.com/juntz-g1thub"
};

// 核心博客应用
const BlogApp = {
  // DOM元素缓存
  elements: {},
  
  // 当前状态
  currentPage: 'home',
  currentPost: null,
  articles: [],
  
  // 初始化应用
  async init() {
    console.log('🔧 初始化博客应用...');
    
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
        // 简单的代码高亮
        return `<pre><code class="language-${lang}">${code}</code></pre>`;
      }
    });
    
    // 监听hash变化
    window.addEventListener('hashchange', () => this.handleHashChange());
    
    // 处理初始hash
    this.handleHashChange();
  },
  
  // 缓存DOM元素
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
  
  // 从文章第一行解析标题和日期
  parseArticleInfo(content) {
    const lines = content.split('\n');
    let title = '未命名文章';
    let date = new Date().toISOString().split('T')[0];
    
    // 从第一行提取标题
    if (lines[0].startsWith('# ')) {
      title = lines[0].substring(2).trim();
    }
    
    // 查找日期行
    for (let i = 0; i < Math.min(lines.length, 5); i++) {
      if (lines[i].includes('发表时间：')) {
        const match = lines[i].match(/发表时间：(.*)/);
        if (match && match[1]) {
          date = match[1].trim();
        }
        break;
      }
    }
    
    // 提取描述（第一段内容）
    let description = '';
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() && !lines[i].includes('发表时间') && !lines[i].includes('标签：')) {
        description = lines[i].replace(/^#+\s+/, '').trim();
        if (description.length > 100) {
          description = description.substring(0, 100) + '...';
        }
        break;
      }
    }
    
    return { title, date, description };
  },
  
  // 加载文章列表
  async loadArticles() {
    try {
      // 文章列表（可考虑未来从JSON文件加载）
      const articles = [
        { slug: 'hello-world' },
        { slug: 'how-this-blog-was-built' }
      ];
      
      // 并行获取所有文章的信息
      const articlePromises = articles.map(async (article) => {
        try {
          const content = await this.fetchPostContent(article.slug);
          const info = this.parseArticleInfo(content);
          return {
            slug: article.slug,
            ...info,
            content: null // 内容延迟加载
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
      
      console.log(`📚 加载了 ${this.articles.length} 篇文章`);
    } catch (error) {
      console.error('❌ 加载文章失败:', error);
      this.articles = [];
    }
  },
  
  // 初始化路由
  initRouting() {
    console.log('🛣️ 初始化Hash路由...');
  },
  
  // 处理hash变化
  handleHashChange() {
    const hash = window.location.hash.substring(1);
    
    // 隐藏所有内容
    this.hideAllContent();
    
    // 隐藏加载状态
    this.elements.loading.classList.add('hidden');
    
    if (!hash) {
      // 首页
      this.showHome();
    } else if (hash === 'about') {
      // 关于页面
      this.showAbout();
    } else if (hash === 'posts') {
      // 文章列表
      this.showAllPosts();
    } else if (hash.startsWith('post=')) {
      // 文章详情
      const slug = hash.split('=')[1];
      this.loadPost(slug);
    } else {
      // 默认显示首页
      this.showHome();
    }
  },
  
  // 隐藏所有内容区域
  hideAllContent() {
    this.elements.homeContent.classList.add('hidden');
    this.elements.aboutContent.classList.add('hidden');
    this.elements.postsContent.classList.add('hidden');
    this.elements.postContent.classList.add('hidden');
  },
  
  // 显示首页
  showHome() {
    this.currentPage = 'home';
    document.title = `首页 - ${BLOG_CONFIG.title}`;
    this.elements.homeContent.classList.remove('hidden');
    
    // 渲染最近文章
    this.renderRecentArticles();
    
    // 更新浏览器历史
    history.replaceState(null, '', '#');
  },
  
  // 显示关于页面
  showAbout() {
    this.currentPage = 'about';
    document.title = `关于 - ${BLOG_CONFIG.title}`;
    this.elements.aboutContent.classList.remove('hidden');
  },
  
  // 渲染最近文章到首页
  renderRecentArticles() {
    console.log('🔄 开始渲染最近文章...');
    console.log('📚 当前文章总数:', this.articles.length);
    console.log('📄 recentArticles元素:', this.elements.recentArticles);
    
    const container = this.elements.recentArticles;
    if (!container || this.articles.length === 0) {
      console.log('⚠️ 没有找到recentArticles容器或没有文章');
      return;
    }
    
    // 显示最新的2篇文章
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
          <p>${article.description || article.title + ' - 点击阅读全文'}</p>
        </div>
      `;
    });
    
    // 如果文章少于2篇，添加更多文章链接
    if (this.articles.length >= 2) {
      html += `
        <div class="more-posts-link">
          <a href="#posts">查看更多文章 →</a>
        </div>
      `;
    }
    
    container.innerHTML = html;
  },
  
  // 显示所有文章
  showAllPosts() {
    this.currentPage = 'posts';
    document.title = `全部文章 - ${BLOG_CONFIG.title}`;
    this.elements.postsContent.classList.remove('hidden');
    
    // 渲染文章列表
    this.renderAllPosts();
  },
  
  // 渲染所有文章列表
  renderAllPosts() {
    const container = this.elements.allArticles;
    if (!container) return;
    
    if (this.articles.length === 0) {
      container.innerHTML = '<p>暂无文章</p>';
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
  
  // 加载并显示文章
  async loadPost(slug) {
    this.currentPage = 'post';
    this.currentPost = slug;
    
    // 显示加载状态
    this.elements.loading.classList.remove('hidden');
    
    try {
      // 1. 加载Markdown文件
      const markdown = await this.fetchPostContent(slug);
      
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
      this.elements.postContent.innerHTML = `
        <h1>${article.title}</h1>
        <div class="post-meta">
          <time datetime="${article.date}">${this.formatDate(article.date)}</time>
        </div>
        <div>${html}</div>
        <div class="post-navigation">
          <a href="#posts" class="nav-back">← 返回文章列表</a>
        </div>
      `;
      
      // 6. 显示内容，隐藏加载状态
      this.elements.loading.classList.add('hidden');
      this.elements.postContent.classList.remove('hidden');
      
    } catch (error) {
      console.error('❌ 加载文章失败:', error);
      this.elements.postContent.innerHTML = `
        <h1>文章加载失败</h1>
        <p>抱歉，无法加载文章 "${slug}"。</p>
        <div class="post-navigation">
          <a href="#posts" class="nav-back">← 返回文章列表</a>
        </div>
      `;
      this.elements.loading.classList.add('hidden');
      this.elements.postContent.classList.remove('hidden');
    }
  },
  
  // 获取文章内容
  async fetchPostContent(slug) {
    const response = await fetch(`posts/${slug}.md`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.text();
  },
  
  // 初始化侧边栏
  initSidebar() {
    this.renderArticleList();
    this.initThemeToggle();
  },
  
  // 渲染侧边栏文章列表
  renderArticleList() {
    const container = this.elements.articleList;
    if (!container || this.articles.length === 0) {
      container.innerHTML = '<p class="no-articles">暂无文章</p>';
      return;
    }
    
    let html = '<div class="scrollable-list">';
    // 只显示最新5篇文章
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
    
    // 如果文章超过5篇，显示查看更多
    if (this.articles.length > 5) {
      html += `
        <div class="article-item more-link">
          <a href="#posts" class="article-link">
            <i class="fas fa-ellipsis-h"></i> 查看全部 ${this.articles.length} 篇文章
          </a>
        </div>
      `;
    }
    
    html += '</div>';
    container.innerHTML = html;
  },
  
  // 初始化主题切换（亮色/暗色）
  initThemeToggle() {
    // 创建主题切换按钮
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '<i class="fas fa-moon"></i> 主题';
    themeToggle.setAttribute('aria-label', '切换亮色/暗色主题');
    
    // 添加到侧边栏底部
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      sidebar.appendChild(themeToggle);
    }
    
    // 点击事件
    themeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark-theme');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i> 切换亮色' : '<i class="fas fa-moon"></i> 切换暗色';
    });
    
    // 检查保存的主题偏好
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark-theme');
      themeToggle.innerHTML = '<i class="fas fa-sun"></i> 切换亮色';
    }
  },
  
  // 初始化导航事件
  initNavigation() {
    // 处理所有data-nav属性的链接
    document.addEventListener('click', (e) => {
      const navLink = e.target.closest('[data-nav]');
      if (navLink) {
        e.preventDefault();
        const target = navLink.getAttribute('data-nav');
        this.navigateTo(target);
      }
    });
  },
  
  // 导航到指定页面
  navigateTo(page) {
    if (page === 'home') {
      window.location.hash = '';
    } else {
      window.location.hash = page;
    }
  },
  
  // 格式化日期
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },
  
  // 添加新文章（开发者工具使用）
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

// 开发工具：通过控制台添加测试文章
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