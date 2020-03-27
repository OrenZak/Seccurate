type ScanType = 'ALL' | 'RXSS' | 'SQLI';
type Role = 'ADMIN' | 'USER';
declare type AuthenticationType = 'Cookie' | 'BasicAuth'
declare interface Target {
    scanID?: string;
    name: string;
    description: string;
    url: string;
    scanType: ScanType;
    loginInfo?: LoginInfo;
    config?: ScanConfig;
}

declare interface LoginInfo {
    authenticationType: AuthenticationType
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
    username: string;
    password?: string;
    role: Role;
}

declare interface Scan {
    name: string;
    scanID: string;
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
    recommendations: Recommendations;
    requestB64: string;
    severity: number;
    url: string;
    affected_urls: string[];
    vulnID: string;
}

declare interface Recommendations {
    description: string;
    mitigations: string[];
}
