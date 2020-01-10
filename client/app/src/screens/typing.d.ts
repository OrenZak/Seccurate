declare interface Target {
    id: string;
    name: string;
    description: string;
    mainURL: string;
    scanType: 'all' | 'rxss' | 'sqli';
}

declare interface ScanConfig {
    id: string;
    name: string;
    max_depth: number;
    interval: number;
    timeout: number;
}
