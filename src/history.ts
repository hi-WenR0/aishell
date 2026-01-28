/**
 * 历史记录管理模块
 * 将历史记录保存到 ~/.aishell/history.json
 */

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import type { HistoryItem, HistoryFile } from './types/history.js';

const HISTORY_VERSION = '1.0.0';
const MAX_HISTORY_ITEMS = 500; // 最多保存 500 条记录
const MAX_OUTPUT_LENGTH = 2000; // 输出最多保存 2000 字符

/**
 * 获取历史文件路径
 */
export function getHistoryFilePath(): string {
    return path.join(os.homedir(), '.aishell', 'history.json');
}

/**
 * 确保历史目录存在
 */
function ensureHistoryDir(): void {
    const historyPath = getHistoryFilePath();
    const dir = path.dirname(historyPath);

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

/**
 * 生成唯一 ID
 */
function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 加载历史记录
 */
export function loadHistory(): HistoryFile {
    const historyPath = getHistoryFilePath();

    if (!fs.existsSync(historyPath)) {
        return {
            version: HISTORY_VERSION,
            items: [],
        };
    }

    try {
        const content = fs.readFileSync(historyPath, 'utf-8');
        const data = JSON.parse(content) as HistoryFile;
        return data;
    } catch (error) {
        console.warn('⚠️  历史记录文件损坏，将创建新文件');
        return {
            version: HISTORY_VERSION,
            items: [],
        };
    }
}

/**
 * 保存历史记录
 */
export function saveHistory(history: HistoryFile): void {
    ensureHistoryDir();
    const historyPath = getHistoryFilePath();

    // 限制历史记录数量
    if (history.items.length > MAX_HISTORY_ITEMS) {
        history.items = history.items.slice(-MAX_HISTORY_ITEMS);
    }

    fs.writeFileSync(historyPath, JSON.stringify(history, null, 2), 'utf-8');
}

/**
 * 添加一条历史记录
 */
export function addHistoryItem(item: Omit<HistoryItem, 'id' | 'timestamp'>): HistoryItem {
    const history = loadHistory();

    const newItem: HistoryItem = {
        ...item,
        id: generateId(),
        timestamp: Date.now(),
        // 截断过长的输出
        output: item.output ? item.output.slice(0, MAX_OUTPUT_LENGTH) : undefined,
    };

    history.items.push(newItem);
    saveHistory(history);

    return newItem;
}

/**
 * 获取所有历史记录（最新的在前）
 */
export function getHistoryItems(): HistoryItem[] {
    const history = loadHistory();
    return [...history.items].reverse();
}

/**
 * 搜索历史记录
 */
export function searchHistory(keyword: string): HistoryItem[] {
    const history = loadHistory();
    const lowerKeyword = keyword.toLowerCase();

    return history.items
        .filter(item =>
            item.task.toLowerCase().includes(lowerKeyword) ||
            item.command.toLowerCase().includes(lowerKeyword)
        )
        .reverse();
}

/**
 * 删除指定历史记录
 */
export function deleteHistoryItem(id: string): boolean {
    const history = loadHistory();
    const index = history.items.findIndex(item => item.id === id);

    if (index === -1) {
        return false;
    }

    history.items.splice(index, 1);
    saveHistory(history);
    return true;
}

/**
 * 清空所有历史记录
 */
export function clearHistory(): void {
    const history: HistoryFile = {
        version: HISTORY_VERSION,
        items: [],
    };
    saveHistory(history);
}

/**
 * 获取历史统计信息
 */
export function getHistoryStats(): {
    total: number;
    executed: number;
    successful: number;
    providers: Record<string, number>;
} {
    const history = loadHistory();

    const stats = {
        total: history.items.length,
        executed: 0,
        successful: 0,
        providers: {} as Record<string, number>,
    };

    for (const item of history.items) {
        if (item.executed) {
            stats.executed++;
            if (item.exitCode === 0) {
                stats.successful++;
            }
        }

        stats.providers[item.provider] = (stats.providers[item.provider] || 0) + 1;
    }

    return stats;
}
