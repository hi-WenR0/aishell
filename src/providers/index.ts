import type { AIProvider, ProviderType } from '../types/provider.js';
import { ClaudeProvider } from './claude.js';
import { KimiProvider } from './kimi.js';
import { DeepSeekProvider } from './deepseek.js';

export function createProvider(type: ProviderType): AIProvider {
    switch (type) {
        case 'claude': {
            const apiKey = process.env.ANTHROPIC_API_KEY;
            if (!apiKey) {
                throw new Error('未找到 ANTHROPIC_API_KEY，请在 .env 文件中设置');
            }
            const model = process.env.CLAUDE_MODEL;
            return new ClaudeProvider(apiKey, model);
        }
        case 'kimi': {
            const apiKey = process.env.KIMI_API_KEY;
            if (!apiKey) {
                throw new Error('未找到 KIMI_API_KEY，请在 .env 文件中设置');
            }
            const model = process.env.KIMI_MODEL;
            return new KimiProvider(apiKey, model);
        }
        case 'deepseek': {
            const apiKey = process.env.DEEPSEEK_API_KEY;
            if (!apiKey) {
                throw new Error('未找到 DEEPSEEK_API_KEY，请在 .env 文件中设置');
            }
            const model = process.env.DEEPSEEK_MODEL;
            return new DeepSeekProvider(apiKey, model);
        }
        default:
            throw new Error(`不支持的模型类型: ${type}`);
    }
}

export function getAvailableProviders(): ProviderType[] {
    const providers: ProviderType[] = [];
    if (process.env.ANTHROPIC_API_KEY) providers.push('claude');
    if (process.env.KIMI_API_KEY) providers.push('kimi');
    if (process.env.DEEPSEEK_API_KEY) providers.push('deepseek');
    return providers;
}

export function getDefaultProvider(): ProviderType | null {
    // 优先使用环境变量中设置的默认模型
    const defaultModel = process.env.DEFAULT_MODEL as ProviderType;
    if (defaultModel && ['kimi', 'claude', 'deepseek'].includes(defaultModel)) {
        return defaultModel;
    }
    // 否则自动选择可用的模型
    if (process.env.KIMI_API_KEY) return 'kimi';
    if (process.env.ANTHROPIC_API_KEY) return 'claude';
    if (process.env.DEEPSEEK_API_KEY) return 'deepseek';
    return null;
}
