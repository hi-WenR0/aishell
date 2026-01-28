# AiShell Init 命令使用指南

## 概述

`init` 命令是一个交互式的配置工具，可以帮助你轻松地设置 AI 模型提供商、API Key 和选择默认模型。

## 使用方式

### 方式 1: 使用 npm init 脚本

```bash
npm run init
```

### 方式 2: 使用通用命令

```bash
npm run dev init
```

### 方式 3: 编译后直接运行

```bash
npm run build
./dist/index.js init
```

## 交互流程

执行 `npm run init` 后，你会看到以下步骤：

### 1. 选择模型提供商

```
支持的模型提供商:

1. Claude (Anthropic) (claude)
2. Kimi (Moonshot) (kimi)
3. DeepSeek (deepseek)

请选择一个模型提供商 (输入序号或名称):
```

你可以：

- 输入序号 (1, 2, 3)
- 输入提供商名称 (claude, kimi, deepseek)
- 输入完整名称 (Claude, Kimi, DeepSeek)

### 2. 输入 API Key

```
请输入你的 Claude (Anthropic) API Key
(环境变量名: ANTHROPIC_API_KEY)

API Key:
```

输入你的 API Key。为了安全起见，输入时不会显示密码。

### 3. 选择模型

```
Claude (Anthropic) 支持的模型:

1. claude-opus-4-1-20250805
2. claude-sonnet-4-20250514 (默认)
3. claude-3-5-haiku-20241022

请选择一个模型 (输入序号或模型名称):
```

你可以：

- 输入序号
- 输入模型名称的一部分（会自动匹配）

### 4. 确认和保存

```
📋 配置总结:

提供商: Claude (Anthropic)
模型: claude-sonnet-4-20250514
API Key: sk-...3aBc

是否保存此配置? (y/n):
```

输入 `y` 或 `yes` 确认保存，或输入 `n` 或 `no` 取消。

## 支持的模型

### Claude (Anthropic)

- `claude-opus-4-1-20250805`
- `claude-sonnet-4-20250514` (默认)
- `claude-3-5-haiku-20241022`

### Kimi (Moonshot)

- `kimi-k2-0711-preview` (默认)
- `kimi-k2-preview`
- `kimi-k1-preview`

### DeepSeek

- `deepseek-chat` (默认)
- `deepseek-reasoner`

## 配置文件

配置会被保存到项目根目录的 `.env` 文件中：

```env
ANTHROPIC_API_KEY=sk-...
CLAUDE_MODEL=claude-sonnet-4-20250514
DEFAULT_MODEL=claude
```

### 环境变量说明

| 变量名              | 说明             | 例子                            |
| ------------------- | ---------------- | ------------------------------- |
| `ANTHROPIC_API_KEY` | Claude API Key   | `sk-ant-...`                    |
| `KIMI_API_KEY`      | Kimi API Key     | `sk-...`                        |
| `DEEPSEEK_API_KEY`  | DeepSeek API Key | `sk-...`                        |
| `CLAUDE_MODEL`      | Claude 模型      | `claude-sonnet-4-20250514`      |
| `KIMI_MODEL`        | Kimi 模型        | `kimi-k2-0711-preview`          |
| `DEEPSEEK_MODEL`    | DeepSeek 模型    | `deepseek-chat`                 |
| `DEFAULT_MODEL`     | 默认提供商       | `claude`, `kimi`, 或 `deepseek` |

## 多次运行 init

你可以多次运行 `npm run init` 来：

- 添加新的模型提供商配置
- 更新现有提供商的 API Key
- 切换默认模型

每次运行都会覆盖相应提供商的配置，其他提供商的配置会被保留。

## 获取 API Key

### Claude (Anthropic)

1. 访问 https://console.anthropic.com
2. 注册并登录账户
3. 在 API Keys 页面创建新的 API Key
4. 复制 API Key

### Kimi (Moonshot)

1. 访问 https://platform.moonshot.cn
2. 注册并登录账户
3. 在 API Keys 页面创建新的 API Key
4. 复制 API Key

### DeepSeek

1. 访问 https://platform.deepseek.com
2. 注册并登录账户
3. 在 API Keys 页面创建新的 API Key
4. 复制 API Key

## 示例

完整的交互示例：

```bash
$ npm run init

🚀 AiShell 配置向导

此工具将帮助你配置 AI 模型提供商的 API Key 和模型选择。

支持的模型提供商:

1. Claude (Anthropic) (claude)
2. Kimi (Moonshot) (kimi)
3. DeepSeek (deepseek)

请选择一个模型提供商 (输入序号或名称): 1

请输入你的 Claude (Anthropic) API Key
(环境变量名: ANTHROPIC_API_KEY)

API Key: sk-ant-v0-...

Claude (Anthropic) 支持的模型:

1. claude-opus-4-1-20250805
2. claude-sonnet-4-20250514 (默认)
3. claude-3-5-haiku-20241022

请选择一个模型 (输入序号或模型名称): 2

📋 配置总结:

提供商: Claude (Anthropic)
模型: claude-sonnet-4-20250514
API Key: sk-...3aBc

是否保存此配置? (y/n): y

✅ 配置已保存到 .env 文件

现在你可以使用以下命令运行 aishell:
  npm run dev "描述你想执行的任务"

例如:
  npm run dev "列出当前目录的所有文件"
```

## 故障排除

### 找不到 .env 文件？

`.env` 文件会在首次运行 `init` 时自动创建在项目根目录。

### API Key 无法使用？

- 确保 API Key 是有效的，未过期
- 确保没有意外的空格或特殊字符
- 检查 `.env` 文件中的 API Key 是否正确保存

### 模型选择无效？

确保你输入的模型名称是完整的或能匹配列出的模型。

## 安全建议

1. **不要提交 .env 文件**: 在 `.gitignore` 中添加 `.env` 以避免泄露 API Key
2. **定期轮换 API Key**: 定期在提供商的控制台中更新 API Key
3. **使用环境变量**: 在生产环境中，使用系统环境变量而不是 `.env` 文件
4. **检查权限**: 确保 `.env` 文件的权限设置正确（只有当前用户可读）
