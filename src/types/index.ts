export interface UsageItem {
    usage?: string;
    description?: string;
    command?: string;
}

export interface CommandResult {
    command: string;
    explanation?: {
        description: string;
        parameters: Array<{
            param: string;
            description: string;
        }>;
        commonUsages?: Array<string | UsageItem>;
    };
}
