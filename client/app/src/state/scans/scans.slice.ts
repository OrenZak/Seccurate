import { createSlice, PayloadAction, createAction } from '@reduxjs/toolkit';

interface ScansState {
    isScanRunning: boolean;
    completedScans: {
        data: Scan[];
        totalCount: number;
        error?: string;
    };
    startScan: {
        succeed?: boolean;
        error?: string;
    };
    scanResults: {
        data: Result[];
        error?: string;
    };
}

const initialState: ScansState = {
    isScanRunning: false,
    completedScans: {
        data: [],
        totalCount: 0,
    },
    startScan: {},
    scanResults: {
        data: [],
    },
};

const scansSlice = createSlice({
    name: 'scans',
    initialState,
    reducers: {
        fetchCompletedScansSucceed(state, action: PayloadAction<{ scans: Scan[], count: number }>) {
            return {
                ...state,
                completedScans: {
                    data: action.payload.scans,
                    totalCount: action.payload.count,
                    error: undefined,
                },
            };
        },
        fetchCompletedScansFailed(state, action: PayloadAction<{ error: string }>) {
            return {
                ...state,
                completedScans: {
                    data: [],
                    totalCount: 0,
                    error: action.payload.error,
                },
            };
        },
        startScanSucceed(state) {
            return {
                ...state,
                startScan: {
                    succeed: true,
                    error: undefined,
                },
            };
        },
        startScanFailed(state, action: PayloadAction<{ error: string }>) {
            return {
                ...state,
                startScan: {
                    succeed: false,
                    error: action.payload.error,
                },
            };
        },
        fetchScanResultsSucceed(state, action: PayloadAction<{ scanResults: Result[] }>) {
            return {
                ...state,
                scanResults: {
                    data: action.payload.scanResults,
                    error: undefined,
                },
            };
        },
        fetchScanResultsFailed(state, action: PayloadAction<{ error: string }>) {
            return {
                ...state,
                scanResults: {
                    data: [],
                    error: action.payload.error,
                },
            };
        },
        scanCompleted(state) {
            return {
                ...state,
                isScanRunning: false,
            };
        },
    },
});

// -- STATE SELECTORS --//
export function selectCompletedScans(state: { scans: ScansState }) {
    return state.scans.completedScans;
}

export function selectStartScanInfo(state: { scans: ScansState }) {
    return state.scans.startScan;
}

export function selectScanResults(state: { scans: ScansState }) {
    return state.scans.scanResults;
}

export function selectIsScanRunning(state: { scans: ScansState }) {
    return state.scans.isScanRunning;
}

// -- SAGA ACTIONS -- //
export const fetchCompletedScans = createAction<FetchAllParams>(scansSlice.name + '/fetchCompletedScans');
export const startScan = createAction<{ scanId: string }>(scansSlice.name + '/startScan');
export const fetchScanResults = createAction<{ scanId: string }>(scansSlice.name + '/fetchScanResults');
export const updateScanCompleted = createAction(scansSlice.name + '/updateScanCompleted');

// -- SAGA ACTIONS -- //
export const {
    fetchCompletedScansSucceed,
    fetchCompletedScansFailed,
    startScanSucceed,
    startScanFailed,
    fetchScanResultsSucceed,
    fetchScanResultsFailed,
    scanCompleted,
} = scansSlice.actions;

export default scansSlice.reducer;
