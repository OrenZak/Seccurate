type ScanType = 'all' | 'rxss' | 'sqli';
type Role = 'Admin' | 'User';
declare interface Target {
    id?: string;
    timestamp?: string;
    name: string;
    description: string;
    url: string;
    scanType: ScanType;
    loginInfo?: LoginInfo;
    config?: ScanConfig;
}

declare interface LoginInfo {
    form: { [key: string]: string };
    formAction: string;
}

declare interface ScanConfig {
    id?: string;
    name?: string;
    maxDepth: number;
    interval: number;
    timeout: number;
    save?: boolean;
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
