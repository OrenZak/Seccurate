declare interface FetchAllResponse {
    targets: Target[];
}

declare interface FetchAllUsersResponse {
    usersArray: User[];
}

declare interface FetchAllConfigsResponse {
    configs: ScanConfig[];
}

declare interface FetchAllCompletedScansResponse {
    scans: Scan[];
}

declare interface UserPayload {
    username: string;
    password: string;
    role: 'admin' | 'user';
}
