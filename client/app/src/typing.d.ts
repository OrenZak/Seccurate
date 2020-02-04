type ScanType = 'all' | 'rxss' | 'sqli';
type Role = 'ADMIN' | 'USER';
declare interface Target {
    id?: string;
    scanID?: string;
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
    username: string;
    password: string;
    role: Role;
}

declare interface Scan {
    name: string;
    timestamp: string;
    description: string;
    maxDepth: string;
    timeout: string;
    interval: string;
    vulnsScanned: string;
    done: boolean;
    credentials: any;
    loginPage: any;
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
