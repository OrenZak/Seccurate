interface FetchAllParams {
    page: number;
    pageCount: number;
}

interface StartScanPayload {
    scanId: string;
    scanName: string;
}

interface FetchScanResultsPayload {
    scanId: string;
}
