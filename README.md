# AIShell

🤖 一个基于 AI 的命令行工具，用自然语言生成 Shell 命令。

## 功能特性

- 🚀 **自然语言输入**: 用日常语言描述你想做的事情
- 🔍 **多模型支持**: 支持 Claude、Kimi-K2、DeepSeek 等多种 AI 模型
- 🎛️ **自定义模型**: 支持自定义每个模型的具体版本
- 📚 **详细解释模式**: 使用 `--verbose` 参数获取命令的详细解释和参数说明
- 🤖 **AI 解读输出**: 使用 `-u, --human` 参数让 AI 用易懂的语言总结命令结果
- 📜 **历史记录**: 自动保存命令历史，支持交互式查看和搜索
- 📊 **Token 统计**: 多维度统计 AI Token 使用量，支持按模型/时间查看
- 🎨 **美观输出**: 使用彩色输出和清晰的格式

## 安装

### 方式1：全局 npm 安装（推荐）

```bash
# 克隆仓库
git clone <your-repo-url>
cd aishell

# 安装依赖并构建
npm install
npm run build

# 安装为全局命令
npm install -g .

# 初始化配置
aishell init
```

### 方式2：从源代码运行

```bash
# 克隆仓库
git clone <your-repo-url>
cd aishell

# 安装依赖
npm install

# 运行开发模式
npm run dev "你的任务描述"
```

## 配置

### 快速配置（推荐）

使用交互式初始化命令：

```bash
aishell init
```

这个命令会引导你：

1. **选择 AI 提供商**（Claude、Kimi 或 DeepSeek）
2. **输入 API Key**
3. **选择默认模型**
4. **选择保存位置**（全局或本地）

### 配置位置

aishell 支持两级配置：

- **全局配置** (`~/.aishell/.env`) - 在电脑任意目录使用
- **本地配置** (`./.env`) - 仅在当前项目目录有效

配置优先级：**本地配置 > 全局配置**

### 手动配置

如果不想使用交互式初始化，可以手动创建 `.env` 文件：

#### Claude (Anthropic)

```bash
# ~/.aishell/.env 或 ./.env
ANTHROPIC_API_KEY=sk-ant-xxxxx
CLAUDE_MODEL=claude-sonnet-4-20250514  # 可选
```

获取 API Key: https://console.anthropic.com/

#### Kimi (Moonshot)

```bash
KIMI_API_KEY=sk-xxxxx
KIMI_MODEL=kimi-k2-0711-preview  # 可选
```

获取 API Key: https://platform.moonshot.cn/

#### DeepSeek

```bash
DEEPSEEK_API_KEY=sk-xxxxx
DEEPSEEK_MODEL=deepseek-chat  # 可选
```

获取 API Key: https://platform.deepseek.com/

### 查看当前配置

```bash
aishell config
```

## 使用方法

### 全局安装后使用

安装为全局命令后，可以在电脑任意目录使用：

```bash
# 基础用法
aishell "帮我看一下当前 CPU 使用率最高的程序"

# 查看帮助
aishell --help

# 初始化配置
aishell init

# 查看当前配置
aishell config

# 选择模型
aishell "查看磁盘使用情况" --model kimi
aishell "查看磁盘使用情况" --model claude
aishell "查看磁盘使用情况" --model deepseek

# 详细模式（显示命令解释）
aishell "查看磁盘使用情况" --verbose

# AI 解读输出
aishell "查看系统内存使用情况" --human

# 列出可用模型
aishell --list-models

# 查看历史记录（交互式 TUI）
aishell history

# 搜索历史记录
aishell history --search "磁盘"
```

### 从源代码运行

如果还未全局安装，可以从项目目录运行：

```bash
# 基础用法
npm run dev "帮我看一下当前 CPU 使用率最高的程序"

# 初始化配置
npm run init

# 其他选项同上
npm run dev "查看磁盘使用情况" -- --verbose
```

### 功能说明

#### 详细模式 (`--verbose` 或 `-v`)

显示生成的命令、详细解释和参数说明：

```bash
aishell "列出所有 Node.js 进程" --verbose
```

#### AI 解读输出 (`--human` 或 `-u`)

让 AI 用易懂的语言总结命令执行结果：

```bash
aishell "查看系统内存使用情况" --human
```

#### 选择 AI 模型 (`--model`)

```bash
aishell "生成随机密码" --model claude
aishell "生成随机密码" --model kimi
aishell "生成随机密码" --model deepseek
```

#### 列出可用模型 (`--list-models`)

```bash
aishell --list-models
```

## 开发

```bash
# 安装依赖
npm install

# 开发模式运行
npm run dev "你的任务描述"

# 初始化配置
npm run init

# 构建项目
npm run build

# 类型检查
npm run type-check

# 监听模式（自动重新编译）
npm run watch

# 测试
npm run test

# 验证（构建 + 测试）
npm run verify
```

## 技术栈

- **TypeScript**: 类型安全的 JavaScript
- **Commander.js**: 命令行接口框架
- **Anthropic SDK**: Claude AI API 集成
- **OpenAI SDK**: Kimi 和 DeepSeek API 集成（兼容 OpenAI 格式）
- **Chalk**: 终端彩色输出
- **Ora**: 优雅的终端加载动画
- **dotenv**: 环境变量管理

## 示例

```bash
# 查找文件
aishell "在当前目录递归查找所有 .ts 文件"

# 系统信息
aishell "显示当前系统的磁盘使用情况"

# 获取易懂的输出解释
aishell "显示当前系统的磁盘使用情况" --human

# 网络操作
aishell "查看 8080 端口被哪个进程占用"

# Git 操作
aishell "显示最近 5 条 git 提交记录"

# 详细模式
aishell "列出所有 Node.js 进程" --verbose

# 组合使用详细模式和 AI 解读
aishell "列出所有 Node.js 进程" --verbose --human

# 使用特定模型
aishell "生成一个随机UUID" --model kimi
```

## 历史记录

AIShell 会自动保存你的询问和生成的命令历史。

### 存储位置

历史记录以 JSON 格式保存在 `~/.aishell/history.json`。

### 交互式查看

```bash
aishell history
```

打开交互式 TUI 界面，支持以下操作：

| 快捷键     | 功能             |
| ---------- | ---------------- |
| ↑/↓ 或 j/k | 选择历史记录     |
| ←/→ 或 h/l | 翻页             |
| Enter      | 查看详情         |
| c          | 复制命令到剪贴板 |
| t          | 复制任务描述     |
| d          | 删除当前记录     |
| s          | 查看统计信息     |
| C          | 清空所有历史     |
| q          | 退出             |

### 搜索历史

```bash
aishell history --search "关键词"
```

## Token 使用统计

AIShell 会自动记录每次请求的 Token 使用量，你可以通过交互式界面查看统计数据。

### 查看统计

```bash
aishell stats
```

打开交互式 TUI 界面，支持多种统计维度：

| 快捷键 | 视图   | 说明                             |
| ------ | ------ | -------------------------------- |
| 1      | 总览   | 总体使用情况，输入/输出比例      |
| 2      | 按模型 | 各 AI 模型的使用量对比           |
| 3      | 按天   | 最近 10 天的使用趋势             |
| 4      | 按周   | 最近 10 周的使用趋势             |
| 5      | 按月   | 最近 12 个月的使用趋势           |
| 6      | 趋势图 | ASCII 柱状图展示最近 14 天的趋势 |
| q      | 退出   | 退出统计界面                     |

### 统计指标

- **总 Tokens**: 累计使用的 Token 总数
- **输入 Tokens**: 发送给 AI 的 Token 数（包含 prompt）
- **输出 Tokens**: AI 生成的 Token 数
- **平均每次请求**: 每次调用的平均 Token 消耗

## 许可证

MIT

## 注意事项

- ⚠️ 请谨慎使用生成的命令，特别是涉及删除或修改文件的操作
- 🔍 建议在执行前仔细检查生成的命令
- 🌍 需要配置至少一个 AI 模型的 API Key 才能使用
- 📁 全局配置保存在 `~/.aishell/.env`，本地配置保存在 `./.env`
- 📜 历史记录保存在 `~/.aishell/history.json`，最多保存 500 条
- 📊 Token 使用统计可通过 `aishell stats` 查看
