# DeepSeek 支持和模型自定义 - 更新说明

## 📋 更新内容

### ✨ 新功能

#### 1. DeepSeek 模型支持

- 添加了 DeepSeek 作为第三个 AI 模型选项
- 支持 DeepSeek 官方 API (https://api.deepseek.com)
- 配置简单，与其他模型保持一致

#### 2. 自定义模型版本

- 所有模型现在都支持自定义版本配置
- 通过环境变量灵活配置每个模型的具体版本
- 无需修改代码即可升级或切换模型版本

### 🔧 新增配置选项

在 `.env` 文件中添加以下新配置：

```env
# Claude 模型自定义
CLAUDE_MODEL=claude-sonnet-4-20250514

# Kimi 模型自定义
KIMI_MODEL=kimi-k2-0711-preview

# DeepSeek 模型自定义
DEEPSEEK_API_KEY=your_deepseek_api_key_here
DEEPSEEK_MODEL=deepseek-chat
```

### 📁 文件更新清单

#### 新文件

- ✅ `src/providers/deepseek.ts` - DeepSeek 提供者实现

#### 修改文件

- ✅ `src/providers/index.ts` - 支持 DeepSeek 和模型自定义
- ✅ `src/types/provider.ts` - 添加 'deepseek' 类型
- ✅ `src/index.tsx` - 更新 CLI 帮助信息
- ✅ `.env.example` - 添加 DeepSeek 和模型配置选项
- ✅ `README.md` - 更新文档
- ✅ `QUICK_REFERENCE.md` - 更新快速参考

### 🚀 使用示例

#### 使用 DeepSeek 模型

```bash
npm run dev "查看系统信息" -- -m deepseek
```

#### 使用自定义的 Claude 模型版本

```bash
# 在 .env 中设置
CLAUDE_MODEL=claude-opus-4-1-20250805

# 然后使用
npm run dev "任务描述" -- -m claude
```

#### 列出所有可用模型

```bash
npm run dev "" -- --list-models
```

#### 设置 DeepSeek 为默认模型

```bash
# 在 .env 中设置
DEFAULT_MODEL=deepseek

# 然后可以直接使用，无需指定 -m 参数
npm run dev "任务描述"
```

### 📊 模型对照表

| 模型     | API 提供商 | 配置项            | 默认模型版本             |
| -------- | ---------- | ----------------- | ------------------------ |
| claude   | Anthropic  | ANTHROPIC_API_KEY | claude-sonnet-4-20250514 |
| kimi     | Moonshot   | KIMI_API_KEY      | kimi-k2-0711-preview     |
| deepseek | DeepSeek   | DEEPSEEK_API_KEY  | deepseek-chat            |

### 🔐 获取 API Key

#### DeepSeek

1. 访问 https://platform.deepseek.com/
2. 注册账户并登录
3. 在控制面板中生成 API Key
4. 复制 API Key 到 `.env` 文件中

### ⚙️ 技术实现细节

#### DeepSeek 提供者实现

- 使用 OpenAI SDK (兼容 OpenAI API 格式)
- API 基础 URL: `https://api.deepseek.com`
- 默认模型: `deepseek-chat`
- 支持 `generateCommand()` 和 `summarizeOutput()` 方法

#### 模型自定义机制

- 从环境变量中读取 `{PROVIDER_NAME}_MODEL`
- 如果未设置，使用提供者的默认模型
- 支持在运行时通过环境变量切换模型版本

### 🧪 测试验证

```bash
# 类型检查
npm run type-check

# 构建
npm run build

# 测试 DeepSeek（需要配置 DEEPSEEK_API_KEY）
npm run dev "显示当前时间" -- -m deepseek

# 测试模型列表
npm run dev "" -- --list-models
```

### 📝 向后兼容性

✅ **完全向后兼容**

- 现有的 Claude 和 Kimi 配置继续工作
- 不设置模型自定义时，使用默认版本
- 所有现有命令保持不变

### 🎯 使用建议

1. **生产环境**: 建议明确指定模型版本，以保证稳定性

   ```env
   CLAUDE_MODEL=claude-sonnet-4-20250514
   KIMI_MODEL=kimi-k2-0711-preview
   DEEPSEEK_MODEL=deepseek-chat
   ```

2. **开发环境**: 可以不设置模型配置，使用默认版本

   ```env
   ANTHROPIC_API_KEY=your_key
   # 无需设置 CLAUDE_MODEL，使用默认版本
   ```

3. **多模型对比**: 设置多个 API Key，快速切换测试
   ```bash
   npm run dev "任务" -- -m claude
   npm run dev "任务" -- -m kimi
   npm run dev "任务" -- -m deepseek
   ```

### 🔄 迁移步骤

如果你已有现有的项目：

1. 更新 `.env` 文件：

   ```bash
   cp .env.example .env
   ```

2. 重新配置 API Key 和模型（可选）

3. 重建项目：

   ```bash
   npm run build
   ```

4. 测试新功能：
   ```bash
   npm run dev "测试" -- -m deepseek
   ```

### 📚 相关文档

- 📖 [README.md](README.md) - 完整使用文档
- 🚀 [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - 快速参考卡
- 📝 [CHANGELOG.md](CHANGELOG.md) - 版本更新日志

---

**更新日期**: 2026-01-28  
**功能**: ✅ 已完成并测试  
**兼容性**: ✅ 100% 向后兼容
