import { createSlice, PayloadAction, createAction } from '@reduxjs/toolkit';

interface ConfigsState {
    configs: ScanConfig[];
    totalConfigCount: number;
    fetch: {
        isLoading: boolean;
        error?: string;
    };
    add: {
        succeed?: boolean;
        error?: string;
    };
    update: {
        succeed?: boolean;
        error?: string;
    };
    delete: {
        succeed?: boolean;
        error?: string;
    };
}

const initialState: ConfigsState = {
    configs: [],
    totalConfigCount: 0,
    fetch: {
        isLoading: false,
    },
    add: {},
    update: {},
    delete: {},
};

const configsSlice = createSlice({
    name: 'configs',
    initialState,
    reducers: {
        fetchConfigsStart(state) {
            return {
                ...state,
                fetch: {
                    isLoading: true,
                    error: undefined,
                },
            };
        },
        fetchConfigsSucceed(state, action: PayloadAction<{ configs: ScanConfig[]; count: number }>) {
            return {
                ...state,
                configs: action.payload.configs,
                totalConfigCount: action.payload.count,
                fetch: {
                    isLoading: false,
                    error: undefined,
                },
            };
        },
        fetchConfigsFailed(state, action: PayloadAction<{ error: string }>) {
            return {
                ...state,
                configs: [],
                fetch: {
                    isLoading: false,
                    error: action.payload.error,
                },
            };
        },
        addConfigSucceed(state) {
            return {
                ...state,
                add: {
                    succeed: true,
                    error: undefined,
                },
            };
        },
        addConfigFailed(state, action: PayloadAction<{ error: string }>) {
            return {
                ...state,
                add: {
                    succeed: false,
                    error: action.payload.error,
                },
            };
        },
        updateConfigSucceed(state) {
            return {
                ...state,
                update: {
                    succeed: true,
                    error: undefined,
                },
            };
        },
        updateConfigFailed(state, action: PayloadAction<{ error: string }>) {
            return {
                ...state,
                update: {
                    succeed: false,
                    error: action.payload.error,
                },
            };
        },
        deleteConfigSucceed(state) {
            return {
                ...state,
                add: {
                    succeed: true,
                    error: undefined,
                },
            };
        },
        deleteConfigFailed(state, action: PayloadAction<{ error: string }>) {
            return {
                ...state,
                add: {
                    succeed: false,
                    error: action.payload.error,
                },
            };
        },
    },
});

// -- STATE SELECTORS --//
export function selectConfigs(state: { configs: ConfigsState }) {
    return state.configs.configs;
}

export function selectTotalConfigs(state: { configs: ConfigsState }) {
    return state.configs.totalConfigCount;
}

export function selectFetchConfigsInfo(state: { configs: ConfigsState }) {
    return state.configs.fetch;
}

export function selectAddConfigInfo(state: { configs: ConfigsState }) {
    return state.configs.add;
}

export function selectUpdateConfigInfo(state: { configs: ConfigsState }) {
    return state.configs.update;
}

export function selectDeleteConfigInfo(state: { configs: ConfigsState }) {
    return state.configs.delete;
}

// -- SAGA ACTIONS -- //
export const fetchAllConfigs = createAction<FetchAllConfigsParams>(configsSlice.name + '/fetchAllConfigs');
export const fetchNextConfigs = createAction<FetchAllConfigsParams>(configsSlice.name + '/fetchNextConfigs');
export const addConfig = createAction<AddConfigParams>(configsSlice.name + '/addConfig');
export const updateConfig = createAction<UpdateConfigParams>(configsSlice.name + '/updateConfig');
export const deleteConfig = createAction<DeleteConfigParams>(configsSlice.name + '/deleteConfig');

// -- SAGA ACTIONS -- //
export const {
    fetchConfigsStart,
    fetchConfigsSucceed,
    fetchConfigsFailed,
    addConfigSucceed,
    addConfigFailed,
    updateConfigSucceed,
    updateConfigFailed,
    deleteConfigSucceed,
    deleteConfigFailed,
} = configsSlice.actions;

export default configsSlice.reducer;
