import { createSlice, PayloadAction, createAction } from '@reduxjs/toolkit';

interface ScansState {
    completedScans: {
        data: Scan[];
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
    completedScans: {
        data: [],
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
        fetchCompletedScansSucceed(state, action: PayloadAction<{ scans: Scan[] }>) {
            return {
                ...state,
                completedScans: {
                    data: action.payload.scans,
                    error: undefined,
                },
            };
        },
        fetchCompletedScansFailed(state, action: PayloadAction<{ error: string }>) {
            return {
                ...state,
                completedScans: {
                    data: [],
                    isLoading: false,
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
            console.log('fetchScanResultsSucceed: ', action.payload);
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
    },
});

// -- STATE SELECTORS --//
export function selectCompltedScans(state: { scans: ScansState }) {
    return state.scans.completedScans;
}

export function selectStartScanInfo(state: { scans: ScansState }) {
    return state.scans.startScan;
}

export function selectScanResults(state: { scans: ScansState }) {
    return state.scans.scanResults;
}

// -- SAGA ACTIONS -- //
export const fetchCompletedScans = createAction<FetchAllParams>(scansSlice.name + '/fetchCompletedScans');
export const startScan = createAction<{ scanId: string }>(scansSlice.name + '/startScan');
export const fetchScanResults = createAction<{ scanId: string }>(scansSlice.name + '/fetchScanResults');

// -- SAGA ACTIONS -- //
export const {
    fetchCompletedScansSucceed,
    fetchCompletedScansFailed,
    startScanSucceed,
    startScanFailed,
    fetchScanResultsSucceed,
    fetchScanResultsFailed,
} = scansSlice.actions;

export default scansSlice.reducer;
