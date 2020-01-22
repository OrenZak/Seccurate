type ScanType = 'all' | 'rxss' | 'sqli';
type Role = 'Admin' | 'User';
declare interface Target {
    id?: string;
    name: string;
    description: string;
    mainURL: string;
    scanType: ScanType;
}

declare interface ScanConfig {
    id?: string;
    name: string;
    maxDepth: number;
    interval: number;
    timeout: number;
    loginInfo: { [key: string]: string };
}

declare interface User {
    id: string;
    name: string;
    role: Role;
}

declare interface Result {
    name: string;
    description: string;
    payload: string;
    recommendation: string;
    requestB64: string;
    severity: string;
    url: string;
    vulnID: string;
}
