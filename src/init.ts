import * as path from 'path';
import * as os from 'os';
import * as readline from 'readline';
import {
    getConfigPaths,
    ensureGlobalConfigDir,
    loadConfigFile,
    saveConfigFile,
} from './config.js';

interface ProviderInfo {
    name: string;
    envKeyPrefix: string;
    models: string[];
    defaultModel: string;
}

const PROVIDERS: Record<string, ProviderInfo> = {
    claude: {
        name: 'Claude (Anthropic)',
        envKeyPrefix: 'ANTHROPIC',
        models: [
            'claude-opus-4-1-20250805',
            'claude-sonnet-4-20250514',
            'claude-3-5-haiku-20241022',
        ],
        defaultModel: 'claude-sonnet-4-20250514',
    },
    kimi: {
        name: 'Kimi (Moonshot)',
        envKeyPrefix: 'KIMI',
        models: [
            'kimi-k2-0711-preview',
            'kimi-k2-preview',
            'kimi-k1-preview',
        ],
        defaultModel: 'kimi-k2-0711-preview',
    },
    deepseek: {
        name: 'DeepSeek',
        envKeyPrefix: 'DEEPSEEK',
        models: [
            'deepseek-chat',
            'deepseek-reasoner',
        ],
        defaultModel: 'deepseek-chat',
    },
};

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function question(prompt: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(prompt, (answer) => {
            resolve(answer.trim());
        });
    });
}

function displayProviderList(): void {
    console.log('\n支持的模型提供商:\n');
    Object.entries(PROVIDERS).forEach(([key, provider], index) => {
        console.log(`${index + 1}. ${provider.name} (${key})`);
    });
    console.log();
}

async function selectProvider(): Promise<string> {
    displayProviderList();

    while (true) {
        const choice = await question('请选择一个模型提供商 (输入序号或名称): ');

        // 尝试按序号匹配
        const providerArray = Object.keys(PROVIDERS);
        const index = parseInt(choice) - 1;
        if (index >= 0 && index < providerArray.length) {
            return providerArray[index];
        }

        // 尝试按名称匹配
        const matched = Object.entries(PROVIDERS).find(
            ([key, provider]) =>
                key.toLowerCase() === choice.toLowerCase() ||
                provider.name.toLowerCase().includes(choice.toLowerCase())
        );

        if (matched) {
            return matched[0];
        }

        console.log('❌ 无效的选择，请重试。\n');
    }
}

async function inputApiKey(provider: string): Promise<string> {
    const providerInfo = PROVIDERS[provider];
    const envKey = `${providerInfo.envKeyPrefix}_API_KEY`;

    console.log(`\n请输入你的 ${providerInfo.name} API Key`);
    console.log(`(环境变量名: ${envKey})\n`);

    let apiKey = '';
    while (!apiKey) {
        apiKey = await question(`API Key: `);
        if (!apiKey) {
            console.log('❌ API Key 不能为空，请重试。\n');
        }
    }

    return apiKey;
}

async function selectModel(provider: string): Promise<string> {
    const providerInfo = PROVIDERS[provider];

    console.log(`\n${providerInfo.name} 支持的模型:\n`);
    providerInfo.models.forEach((model, index) => {
        const isDefault = model === providerInfo.defaultModel ? ' (默认)' : '';
        console.log(`${index + 1}. ${model}${isDefault}`);
    });
    console.log();

    while (true) {
        const choice = await question('请选择一个模型 (输入序号或模型名称): ');

        // 尝试按序号匹配
        const index = parseInt(choice) - 1;
        if (index >= 0 && index < providerInfo.models.length) {
            return providerInfo.models[index];
        }

        // 尝试按名称匹配
        const matched = providerInfo.models.find(
            (model) => model.toLowerCase().includes(choice.toLowerCase())
        );

        if (matched) {
            return matched;
        }

        console.log('❌ 无效的选择，请重试。\n');
    }
}

function selectConfigLocation(): Promise<'global' | 'local'> {
    return new Promise((resolve) => {
        const homeDir = os.homedir();
        const globalPath = path.join(homeDir, '.aishell', '.env');
        const localPath = path.join(process.cwd(), '.env');

        console.log('\n选择配置保存位置:\n');
        console.log(`1. 全局配置 (${globalPath})`);
        console.log(`   - 在电脑任意目录都能使用此配置\n`);
        console.log(`2. 本地配置 (${localPath})`);
        console.log(`   - 只在当前项目目录有效\n`);

        rl.question('请选择 (1 或 2): ', (answer) => {
            if (answer.trim() === '1') {
                console.log('✅ 将保存到全局配置\n');
                resolve('global');
            } else {
                console.log('✅ 将保存到本地配置\n');
                resolve('local');
            }
        });
    });
}

async function askConfirmation(prompt: string): Promise<boolean> {
    while (true) {
        const answer = await question(`${prompt} (y/n): `);
        const lower = answer.toLowerCase();

        if (lower === 'y' || lower === 'yes') {
            return true;
        }
        if (lower === 'n' || lower === 'no') {
            return false;
        }

        console.log('❌ 请输入 y 或 n\n');
    }
}

export async function runInit(): Promise<void> {
    try {
        console.log('\n🚀 AiShell 配置向导\n');
        console.log('此工具将帮助你配置 AI 模型提供商的 API Key 和模型选择。\n');

        // 获取配置位置
        const configLocation = await selectConfigLocation();
        const configPaths = getConfigPaths();

        let envPath: string;
        if (configLocation === 'global') {
            ensureGlobalConfigDir();
            envPath = configPaths.global;
        } else {
            envPath = configPaths.local;
        }

        // 加载现有配置
        const config = loadConfigFile(envPath);

        // 选择提供商
        const provider = await selectProvider();
        const providerInfo = PROVIDERS[provider];

        // 输入 API Key
        const apiKey = await inputApiKey(provider);

        // 选择模型
        const model = await selectModel(provider);

        // 显示总结
        console.log('\n📋 配置总结:\n');
        console.log(`提供商: ${providerInfo.name}`);
        console.log(`模型: ${model}`);
        console.log(`API Key: ${apiKey.substring(0, 3)}...${apiKey.substring(apiKey.length - 3)}`);
        console.log();

        // 确认并保存
        const confirmed = await askConfirmation('是否保存此配置?');

        if (confirmed) {
            // 保存到配置文件
            config.set(`${providerInfo.envKeyPrefix}_API_KEY`, apiKey);
            config.set(`${provider.toUpperCase()}_MODEL`, model);

            // 如果是首次配置，设置为默认模型
            if (!config.has('DEFAULT_MODEL')) {
                config.set('DEFAULT_MODEL', provider);
            }

            saveConfigFile(envPath, config);

            console.log(`\n✅ 配置已保存到 ${configLocation === 'global' ? '全局' : '本地'}配置文件\n`);
            console.log(`配置文件路径: ${envPath}\n`);
            console.log('现在你可以在任意目录使用 aishell 命令:');
            console.log(`  aishell "描述你想执行的任务"\n`);
            console.log('例如:');
            console.log(`  aishell "列出当前目录的所有文件"\n`);
        } else {
            console.log('\n⏭️  配置已取消\n');
        }

    } catch (error) {
        if (error instanceof Error && error.message === 'readline was closed') {
            // 正常退出
            return;
        }
        console.error('❌ 配置出错:', error);
        process.exit(1);
    } finally {
        rl.close();
    }
}
