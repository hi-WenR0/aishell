# AIShell

🤖 一个基于 AI 的命令行工具，用自然语言生成 Shell 命令。

## 功能特性

- 🚀 **自然语言输入**: 用日常语言描述你想做的事情
- 🔍 **多模型支持**: 支持 Claude、Kimi-K2、DeepSeek 等多种 AI 模型
- 🎛️ **自定义模型**: 支持自定义每个模型的具体版本
- 📚 **详细解释模式**: 使用 `--verbose` 参数获取命令的详细解释和参数说明
- 🤖 **AI 解读输出**: 使用 `-u, --human` 参数让 AI 用易懂的语言总结命令结果
- 🎨 **美观输出**: 使用彩色输出和清晰的格式

## 安装

```bash
# 克隆仓库
git clone <your-repo-url>
cd aishell

# 安装依赖
npm install

# 构建项目
npm run build

# 配置 API Key
cp .env.example .env
# 编辑 .env 文件，填入你的 API Key
```

## 配置

支持三种 AI 模型，配置任意一个即可使用：

### Kimi (Moonshot)

1. 前往 [Moonshot Platform](https://platform.moonshot.cn/) 获取 API Key
2. 在 `.env` 文件中添加：
   ```
   KIMI_API_KEY=your_kimi_api_key_here
   KIMI_MODEL=kimi-k2-0711-preview  # 可选，自定义模型版本
   ```

### Claude (Anthropic)

1. 前往 [Anthropic Console](https://console.anthropic.com/) 获取 API Key
2. 在 `.env` 文件中添加：
   ```
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   CLAUDE_MODEL=claude-sonnet-4-20250514  # 可选，自定义模型版本
   ```

### DeepSeek

1. 前往 [DeepSeek Platform](https://platform.deepseek.com/) 获取 API Key
2. 在 `.env` 文件中添加：
   ```
   DEEPSEEK_API_KEY=your_deepseek_api_key_here
   DEEPSEEK_MODEL=deepseek-chat  # 可选，自定义模型版本
   ```

## 使用方法

### 基础用法

```bash
# 开发模式（自动选择可用模型）
npm run dev "帮我看一下当前 CPU 使用率最高的程序是哪几个"

# 或构建后使用
npm start "帮我看一下当前 CPU 使用率最高的程序是哪几个"
```

### 选择模型

```bash
# 使用 Kimi 模型
npm run dev "查看磁盘使用情况" -- --model kimi

# 使用 Claude 模型
npm run dev "查看磁盘使用情况" -- --model claude

# 使用 DeepSeek 模型
npm run dev "查看磁盘使用情况" -- --model deepseek

# 查看可用模型
npm run dev "" -- --list-models
```

**输出示例:**

```
生成的命令:
```

top -l 1 -o cpu -n 10

```

```

### Verbose 模式

添加 `--verbose` 或 `-v` 参数获取详细解释:

```bash
npm run dev "帮我看一下当前 CPU 使用率最高的程序是哪几个" -- --verbose
```

**输出示例:**

```
生成的命令:
```

top -l 1 -o cpu -n 10

```

命令说明:
使用 top 命令查看当前系统中 CPU 使用率最高的进程

参数解释:
  -l 1 - 只显示一次采样结果（默认持续更新）
  -o cpu - 按 CPU 使用率排序
  -n 10 - 显示前 10 个进程

常用用法:
  1. top -l 1 -o mem -n 10: 查看内存使用率最高的 10 个进程
  2. top -l 1 -stats pid,command,cpu,mem: 自定义显示列
  3. top -u: 按 CPU 使用率降序排列
```

### AI 解读输出

添加 `-u` 或 `--human` 参数，让 AI 用易懂的语言总结命令结果:

```bash
npm run dev "查看系统内存使用情况" -- -u
```

**输出示例:**

```
生成的命令:
vm_stat

命令输出:
Pages inactive:                   178952.
Pages speculative:                  2074.
...

🤖 AI 解读:
这是一条在 macOS 上查看"内存使用状况"的快照。简单来说：

- 系统有大约 56 MB 的空闲内存
- 当前活跃内存占用约 2.9 GB
- 压缩内存帮助腾出了额外空间
- 内存使用在正常范围内，无需优化
```

这个功能特别有用，可以帮助你：

- 快速理解复杂的命令输出
- 获取关键信息的人类友好解释
- 在缺乏命令行经验时理解系统状态

## 开发

```bash
# 开发模式（使用 tsx）
npm run dev "你的任务描述"

# 构建
npm run build

# 类型检查
npm run type-check

# 监听模式
npm run watch
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
npm run dev "在当前目录递归查找所有 .ts 文件"

# 系统信息
npm run dev "显示当前系统的磁盘使用情况"

# 获取易懂的输出解释
npm run dev "显示当前系统的磁盘使用情况" -- -u

# 网络操作
npm run dev "查看 8080 端口被哪个进程占用"

# Git 操作
npm run dev "显示最近 5 条 git 提交记录"

# 详细模式
npm run dev "列出所有 Node.js 进程" -- --verbose

# 组合使用详细模式和 AI 解读
npm run dev "列出所有 Node.js 进程" -- --verbose -u
```

## 许可证

MIT

## 注意事项

- 请谨慎使用生成的命令，特别是涉及删除或修改文件的操作
- 建议在执行前仔细检查生成的命令
- `--execute` 功能暂未实现，需要手动复制执行命令
