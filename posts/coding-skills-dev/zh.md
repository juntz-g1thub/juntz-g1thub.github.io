# Coding Skill开发简报

发表时间：2026-07-19
标签：技术, 工具, MCP

## 背景

最近在玩vibe coding，我使用了opencode作为开发工具，在开发一些TUI程序的时候，AI修改代码极其困难，每次一个小功能的bug，修改之后需要反复手动测试，并且将测试的结果反馈到agent，尤其是TUI层面的反馈，则更麻烦，要么手动截图，再输入提示词，一度想要放弃AI开发。在这个背景，开始搜索一些MCP工具，为了方便agent更好的使用这些MCP工具，我为它们当中的一个或者多种的组合开发了如下skills，skills已经打包到npm上发布了。

# 命名的问题

为了方便标记和使用，所有的skills名称前面都有agc字样，大体上是agent-coding的简写，避免和其他skills有所混淆。

# 已发布的Skills

## 1. agc-debug — TUI程序调试工作流

### 解决什么问题

在开发TUI（终端用户界面）程序时，AI修改代码后需要反复手动测试，尤其是TUI层面的反馈极其麻烦——要么手动截图，要么输入提示词，效率极低。

### 核心能力

使用`tui-mcp` MCP服务器，实现：
- **launch** - 启动TUI程序
- **screenshot** - 捕获PNG快照
- **snapshot** - 捕获文本快照
- **send_keys/send_text** - 发送键盘/文本输入
- **wait_for_text/wait_for_idle** - 等待特定模式或终端空闲
- **resize** - 调整终端尺寸测试响应式布局

### 工作流程

```
Phase 1: Launch & Observe     → 启动程序，捕获基线状态
Phase 2: Reproduce Issue      → 复现bug，捕获错误状态
Phase 3: Analyze & Fix        → 分析原因，修复代码
Phase 4: Verify Fix           → 重启程序，验证修复
Phase 5: Cleanup              → 关闭会话
```

### 支持框架

支持所有PTY兼容的TUI框架：
- **Go**: bubbletea, ratatui, tview
- **Rust**: cursive, ratatui
- **Python**: textual, curses, npyscreen
- **JavaScript/TypeScript**: ink, blessed
- **C/C++**: ncurses

---

## 2. agc-explore — CodeGraph优先探索

### 解决什么问题

子agent在进行代码探索时，经常用grep/read层层嵌套，效率低下。CodeGraph可以一次调用返回grep+read数十次才能获取的信息。

### 核心原则

**子agent在探索代码前必须检查`.codegraph/`目录是否存在：**
- 存在 → 使用`codegraph_explore`（强制）
- 不存在 → 回退到grep/read

### 工具选择顺序

| 优先级 | 工具 | 用途 |
|--------|------|------|
| 1 | `codegraph_explore` | 理解代码工作原理、查找符号位置、追踪调用链 |
| 2 | `codegraph_node` | 获取单个符号的完整源码 |
| 3 | `codegraph_callers/callees` | 查找调用者/被调用者 |
| 4 | grep/read | 仅当CodeGraph不可用时 |

### CodeGraph vs grep

| 能力 | grep | CodeGraph |
|------|------|-----------|
| 查找含符号的文件 | ✅ | ✅ |
| 显示源码 | ❌ | ✅ |
| 追踪调用路径 | ❌ | ✅ |
| 动态分派 | ❌ | ✅ |
| 影响范围分析 | ❌ | ✅ |

---

## 3. agc-refactor — 复杂重构工作流

### 解决什么问题

复杂设计重构需要多分支推理、迭代验证和视觉快照对比。普通重构容易陷入"改完不知道对不对"的困境。

### 架构

```
CodeGraph → Yggdrasil MCP（多分支推理 + 会话持久化） → TUIdbug（视觉验证）
                     ↓
             Shell Scripts（状态管理）
                     ↓
             Git Worktree（按需隔离）
```

### 核心脚本

| 脚本 | 用途 |
|------|------|
| `check-mcp-config.sh` | 检查并安装所需MCP配置 |
| `refactor-state.sh` | 管理重构会话状态 |
| `screenshot-manager.sh` | 截图捕获、对比、归档 |
| `yggdrasil-helper.sh` | Yggdrasil会话管理 |

### 工作流程

```
Phase -1: MCP配置检查（必须）
Phase 0:  初始化会话
Phase 1:  探索（CodeGraph构建代码地图）
Phase 2:  多分支推理（Yggdrasil MCP）
Phase 3:  重构执行（可选worktree隔离）
Phase 4:  验证（TUIdbug截图对比）
迭代循环直到验证通过
```

### 依赖

- **MCP服务器**: yggdrasil-mcp, tui-mcp, codegraph
- **子技能**: using-git-worktrees, systematic-debugging

---

## 4. agc-docs — 项目文档规范

### 解决什么问题

通用文档规范与项目实际需求不匹配，每次写文档都要纠结格式、命名、内容要求。

### 核心思路

不是应用通用规则，而是：
1. 通过问卷访谈了解项目背景
2. 生成项目专属的`docs/DOC-SPEC.md`
3. 在整个开发周期中强制执行项目规范

### 初始化问卷

| 问题 | 选项 |
|------|------|
| 项目类型 | 应用 / 库&SDK / 基础设施 / 混合 |
| 团队规模 | 个人 / 小团队(2-10) / 中大团队(10+) |
| 文档类型 | README, CHANGELOG, API, ADR, 用户指南... |
| 特殊要求 | 命名约定、格式偏好、工具要求... |

### 触发规则

以下操作会自动检查DOC-SPEC：
- 创建/修改`docs/`下的`.md`文件
- 创建/修改项目根目录的`.md`文件
- 版本发布
- PR创建

### 模板库

提供多种文档模板：README、CHANGELOG、CONTRIBUTING、API、ARCHITECTURE、ADR、RUNBOOK等。

---

## 安装使用

```bash
# 安装
npm install @juntz/coding-skills

# 交互式选择激活skills
npx @juntz/coding-skills
```

激活后AI工具从`.skills/`目录读取已激活的skills。


