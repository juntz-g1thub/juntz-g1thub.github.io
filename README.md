# Juntz's Blog

基于Eleventy的静态博客系统，托管于GitHub Pages。

## 项目特点

- 🚀 **快速部署**：GitHub Actions自动部署
- 📱 **响应式设计**：适配桌面和移动设备
- 🎨 **现代化界面**：CSS自定义属性，暗色模式支持
- ⚡ **高性能**：静态HTML生成
- 🔧 **易于维护**：模块化模板结构

## 技术栈

- [Eleventy](https://www.11ty.dev/) - 静态站点生成器
- Nunjucks - 模板引擎
- Markdown - 内容编写
- GitHub Pages - 托管
- GitHub Actions - 自动化部署

## 项目结构

```
blog-juntz/
├── .eleventy.js              # Eleventy配置
├── package.json              # 项目依赖
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions工作流
├── src/
│   ├── _data/                # 全局数据
│   ├── _includes/
│   │   ├── layouts/          # 页面布局
│   │   └── components/       # 可复用组件
│   ├── posts/                # 博客文章
│   ├── pages/                # 静态页面
│   └── assets/               # CSS、JS、图片
└── _site/                    # 构建输出（自动生成）
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发预览

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## 写作指南

### 添加新文章

在 `src/posts/` 目录下创建新的Markdown文件：

```yaml
---
layout: layouts/post.njk
title: 你的文章标题
date: 2026-03-06
tags:
  - posts
  - 标签
description: 文章描述
---
```

## 部署

推送到 `main` 分支后，GitHub Actions会自动构建并部署到 https://juntz-g1thub.github.io

## 自定义

- 修改 `src/assets/css/style.css` 调整样式
- 修改 `src/_data/site.json` 更新站点信息

## 许可证

MIT
