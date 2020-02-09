interface FetchAllConfigsParams {
    page: number;
    pageCount: number;
}

interface AddConfigParams {
    config: ScanConfig;
}

interface UpdateConfigParams {
    config: ScanConfig;
}

interface DeleteConfigParams {
    id: string;
}
