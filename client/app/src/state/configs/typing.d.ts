interface FetchAllConfigsParams {
    page: number;
    pageCount: number;
}

interface AddConfigParams {
    name: string;
    config: ScanConfig;
}

interface UpdateConfigParams {
    config: ScanConfig;
}

interface DeleteConfigParams {
    id: string;
}
