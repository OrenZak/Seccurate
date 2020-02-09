interface FetchAllParams {
    page: number;
    pageCount: number;
}

interface StartScanPayload {
    scanId: string;
}

interface FetchScanResultsPayload {
    scanId: string;
}
