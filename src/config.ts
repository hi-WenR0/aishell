import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

/**
 * 配置管理模块
 * 支持全局配置 (~/.aishell/.env) 和本地配置 (./.env)
 * 优先级: 本地配置 > 全局配置
 */

export interface ConfigPaths {
    global: string;
    local: string;
}

/**
 * 获取配置文件路径
 */
export function getConfigPaths(): ConfigPaths {
    const homeDir = os.homedir();
    return {
        global: path.join(homeDir, '.aishell', '.env'),
        local: path.join(process.cwd(), '.env'),
    };
}

/**
 * 确保全局配置目录存在
 */
export function ensureGlobalConfigDir(): void {
    const configPaths = getConfigPaths();
    const configDir = path.dirname(configPaths.global);

    if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
    }
}

/**
 * 加载配置文件
 */
export function loadConfigFile(filePath: string): Map<string, string> {
    const config = new Map<string, string>();

    if (!fs.existsSync(filePath)) {
        return config;
    }

    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.split('\n');

        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#')) {
                const [key, ...valueParts] = trimmed.split('=');
                if (key) {
                    config.set(key.trim(), valueParts.join('=').trim());
                }
            }
        }
    } catch (error) {
        console.warn(`⚠️  无法读取配置文件 ${filePath}:`, error);
    }

    return config;
}

/**
 * 合并配置（本地配置覆盖全局配置）
 */
export function mergeConfigs(
    global: Map<string, string>,
    local: Map<string, string>
): Map<string, string> {
    const merged = new Map(global);

    for (const [key, value] of local) {
        merged.set(key, value);
    }

    return merged;
}

/**
 * 保存配置文件
 */
export function saveConfigFile(filePath: string, config: Map<string, string>): void {
    // 确保目录存在
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    const lines: string[] = [];

    for (const [key, value] of config) {
        if (value) {
            lines.push(`${key}=${value}`);
        }
    }

    fs.writeFileSync(filePath, lines.join('\n') + (lines.length > 0 ? '\n' : ''), 'utf-8');
}

/**
 * 加载所有配置（全局 + 本地）
 * 返回合并后的配置
 */
export function loadAllConfigs(): Map<string, string> {
    const paths = getConfigPaths();

    const globalConfig = loadConfigFile(paths.global);
    const localConfig = loadConfigFile(paths.local);

    return mergeConfigs(globalConfig, localConfig);
}

/**
 * 获取配置值
 */
export function getConfigValue(key: string): string | undefined {
    const config = loadAllConfigs();
    return config.get(key);
}

/**
 * 设置配置值
 */
export function setConfigValue(key: string, value: string, isGlobal: boolean = false): void {
    const paths = getConfigPaths();
    const targetPath = isGlobal ? paths.global : paths.local;

    const config = loadConfigFile(targetPath);
    config.set(key, value);
    saveConfigFile(targetPath, config);
}

/**
 * 显示配置信息
 */
export function displayConfigInfo(): void {
    const paths = getConfigPaths();

    console.log('\n📁 配置文件位置:\n');
    console.log(`全局配置: ${paths.global}`);
    console.log(`本地配置: ${paths.local}\n`);

    const globalConfig = loadConfigFile(paths.global);
    const localConfig = loadConfigFile(paths.local);

    if (globalConfig.size > 0) {
        console.log('✅ 全局配置:');
        for (const [key, value] of globalConfig) {
            if (key.includes('API_KEY')) {
                console.log(`  ${key}: ${value.substring(0, 3)}...${value.substring(value.length - 3)}`);
            } else {
                console.log(`  ${key}: ${value}`);
            }
        }
    }

    if (localConfig.size > 0) {
        console.log('\n✅ 本地配置:');
        for (const [key, value] of localConfig) {
            if (key.includes('API_KEY')) {
                console.log(`  ${key}: ${value.substring(0, 3)}...${value.substring(value.length - 3)}`);
            } else {
                console.log(`  ${key}: ${value}`);
            }
        }
    }

    if (globalConfig.size === 0 && localConfig.size === 0) {
        console.log('❌ 未找到任何配置\n');
    } else {
        console.log();
    }
}
