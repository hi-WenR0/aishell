import Anthropic from '@anthropic-ai/sdk';
import type { AIProvider } from '../types/provider.js';
import type { CommandResult } from '../types/index.js';
import { getSystemPrompt, getUserPrompt, parseResponse, getSummarizeSystemPrompt, getSummarizeUserPrompt } from './base.js';

export class ClaudeProvider implements AIProvider {
    name = 'Claude';
    private client: Anthropic;
    private model: string;

    constructor(apiKey: string, model?: string) {
        this.client = new Anthropic({ apiKey });
        this.model = model || 'claude-sonnet-4-20250514';
    }

    async generateCommand(task: string, verbose: boolean): Promise<CommandResult> {
        const message = await this.client.messages.create({
            model: this.model,
            max_tokens: 1024,
            system: getSystemPrompt(verbose),
            messages: [
                {
                    role: 'user',
                    content: getUserPrompt(task, verbose),
                },
            ],
        });

        const content = message.content[0];
        if (content.type !== 'text') {
            throw new Error('Unexpected response type from API');
        }

        return parseResponse(content.text);
    }

    async summarizeOutput(command: string, output: string): Promise<string> {
        const message = await this.client.messages.create({
            model: this.model,
            max_tokens: 1024,
            system: getSummarizeSystemPrompt(),
            messages: [
                {
                    role: 'user',
                    content: getSummarizeUserPrompt(command, output),
                },
            ],
        });

        const content = message.content[0];
        if (content.type !== 'text') {
            throw new Error('Unexpected response type from API');
        }

        return content.text;
    }
}
