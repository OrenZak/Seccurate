type ScanType = 'all' | 'rxss' | 'sqli';
type Role = 'Admin' | 'User';
declare interface Target {
    id: string;
    name: string;
    description: string;
    mainURL: string;
    scanType: ScanType;
}

declare interface ScanConfig {
    id: string;
    name: string;
    max_depth: number;
    interval: number;
    timeout: number;
}

declare interface User {
    id: string;
    name: string;
    role: Role;
}

declare interface Report {
    id: string;
    mainUrl: string;
    name: string;
    desc: string;
    scanType: ScanType;
}
