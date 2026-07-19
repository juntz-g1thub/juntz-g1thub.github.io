# Coding Skills Development Report

发表时间：2026-07-19
标签：技术, 工具, MCP

## Background

Recently I've been experimenting with vibe coding. I'm using OpenCode as my development tool. When developing TUI programs, AI-assisted code modification proved extremely difficult — every small bug fix required repeated manual testing, and feeding those results back to the agent was cumbersome. Especially for TUI-level feedback, I'd either take screenshots manually or type prompts. At one point, I nearly gave up on AI-assisted development.

Motivated by this, I started researching MCP tools. To help agents better utilize these MCP tools, I developed a set of skills combining one or more of them. These skills have been packaged and published to npm.

## Naming

To make them easy to identify and use, all skills are prefixed with "agc", short for agent-coding, to avoid confusion with other skills.

## Released Skills

## 1. agc-debug — TUI Program Debugging Workflow

### Problem Solved

When developing TUI (Terminal User Interface) programs, AI code changes require repeated manual testing. TUI-level feedback is particularly painful — either manual screenshots or typing prompts, resulting in low efficiency.

### Core Capabilities

Using the `tui-mcp` MCP server:
- **launch** - Start TUI program
- **screenshot** - Capture PNG snapshot
- **snapshot** - Capture text snapshot
- **send_keys/send_text** - Send keyboard/text input
- **wait_for_text/wait_for_idle** - Wait for pattern or terminal idle
- **resize** - Resize terminal to test responsive layouts

### Workflow

```
Phase 1: Launch & Observe     → Start program, capture baseline
Phase 2: Reproduce Issue      → Reproduce bug, capture error state
Phase 3: Analyze & Fix        → Analyze root cause, fix code
Phase 4: Verify Fix           → Restart program, verify fix
Phase 5: Cleanup              → Close session
```

### Supported Frameworks

Works with all PTY-compatible TUI frameworks:
- **Go**: bubbletea, ratatui, tview
- **Rust**: cursive, ratatui
- **Python**: textual, curses, npyscreen
- **JavaScript/TypeScript**: ink, blessed
- **C/C++**: ncurses

---

## 2. agc-explore — CodeGraph-First Exploration

### Problem Solved

When subagents explore code, they often nest grep/read calls repeatedly, resulting in low efficiency. CodeGraph can return in one call what would take dozens of grep+read iterations.

### Core Principle

**Subagents MUST check if `.codegraph/` directory exists before any code exploration:**
- Exists → Use `codegraph_explore` (mandatory)
- Doesn't exist → Fall back to grep/read

### Tool Selection Order

| Priority | Tool | Purpose |
|----------|------|---------|
| 1 | `codegraph_explore` | Understand code, find symbol locations, trace call chains |
| 2 | `codegraph_node` | Get complete source for single symbol |
| 3 | `codegraph_callers/callees` | Find callers/callees |
| 4 | grep/read | Only when CodeGraph unavailable |

### CodeGraph vs grep

| Capability | grep | CodeGraph |
|------------|------|-----------|
| Find files with symbol | ✅ | ✅ |
| Show source code | ❌ | ✅ |
| Trace call paths | ❌ | ✅ |
| Dynamic dispatch | ❌ | ✅ |
| Impact analysis | ❌ | ✅ |

---

## 3. agc-refactor — Complex Refactoring Workflow

### Problem Solved

Complex design refactoring requires multi-branch reasoning, iterative verification, and visual snapshot comparison. Regular refactoring often leaves you wondering "did I get this right?"

### Architecture

```
CodeGraph → Yggdrasil MCP (multi-branch reasoning + session persistence) → TUIdbug (visual verification)
                      ↓
             Shell Scripts (state management)
                      ↓
             Git Worktree (on-demand isolation)
```

### Core Scripts

| Script | Purpose |
|--------|---------|
| `check-mcp-config.sh` | Check and install required MCP configurations |
| `refactor-state.sh` | Manage refactor session state |
| `screenshot-manager.sh` | Screenshot capture, comparison, archival |
| `yggdrasil-helper.sh` | Yggdrasil session management |

### Workflow

```
Phase -1: MCP Config Check (required)
Phase 0:  Initialize session
Phase 1:  Explore (CodeGraph builds code map)
Phase 2:  Multi-branch reasoning (Yggdrasil MCP)
Phase 3:  Refactor execution (optional worktree isolation)
Phase 4:  Verify (TUIdbug screenshot comparison)
Iterate until verification passes
```

### Dependencies

- **MCP servers**: yggdrasil-mcp, tui-mcp, codegraph
- **Sub-skills**: using-git-worktrees, systematic-debugging

---

## 4. agc-docs — Project Documentation Standards

### Problem Solved

Generic documentation standards don't match actual project needs. Every time you write docs, you have to纠结 format, naming, and content requirements.

### Core Approach

Instead of applying generic rules:
1. Interview user to understand project context
2. Generate project-specific `docs/DOC-SPEC.md`
3. Enforce project standards throughout development lifecycle

### Initialization Questionnaire

| Question | Options |
|----------|---------|
| Project type | Application / Library&SDK / Infrastructure / Mixed |
| Team size | Solo / Small team (2-10) / Medium/Large team (10+) |
| Doc types | README, CHANGELOG, API, ADR, User Guide... |
| Special requirements | Naming conventions, formatting preferences, tool requirements... |

### Trigger Rules

The following operations automatically check DOC-SPEC:
- Creating/modifying `.md` files in `docs/`
- Creating/modifying project root `.md` files
- Version releases
- PR creation

### Template Library

Provides templates for: README, CHANGELOG, CONTRIBUTING, API, ARCHITECTURE, ADR, RUNBOOK, and more.

---

## Installation & Usage

```bash
# Install
npm install @juntz/coding-skills

# Interactively select and activate skills
npx @juntz/coding-skills
```

After activation, AI tools read activated skills from the `.skills/` directory.
