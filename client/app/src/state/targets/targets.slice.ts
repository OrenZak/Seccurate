import { createSlice, PayloadAction, createAction } from '@reduxjs/toolkit';

interface TargetsState {
    targets: Target[];
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

const initialState: TargetsState = {
    targets: [],
    fetch: {
        isLoading: false,
    },
    add: {},
    update: {},
    delete: {},
};

const targetsSlice = createSlice({
    name: 'targets',
    initialState,
    reducers: {
        fetchTargetsStart(state) {
            return {
                ...state,
                fetch: {
                    isLoading: true,
                    error: undefined,
                },
            };
        },
        fetchTargetsSucceed(state, action: PayloadAction<{ targets: Target[] }>) {
            return {
                ...state,
                targets: action.payload.targets,
                fetch: {
                    isLoading: false,
                    error: undefined,
                },
            };
        },
        fetchTargetsFailed(state, action: PayloadAction<{ error: string }>) {
            return {
                ...state,
                targets: [],
                fetch: {
                    isLoading: false,
                    error: action.payload.error,
                },
            };
        },
        addTargetsSucceed(state) {
            return {
                ...state,
                add: {
                    succeed: true,
                    error: undefined,
                },
            };
        },
        addTargetsFailed(state, action: PayloadAction<{ error: string }>) {
            return {
                ...state,
                add: {
                    succeed: false,
                    error: action.payload.error,
                },
            };
        },
        updateTargetsSucceed(state) {
            return {
                ...state,
                update: {
                    succeed: true,
                    error: undefined,
                },
            };
        },
        updateTargetsFailed(state, action: PayloadAction<{ error: string }>) {
            return {
                ...state,
                update: {
                    succeed: false,
                    error: action.payload.error,
                },
            };
        },
        deleteTargetsSucceed(state) {
            return {
                ...state,
                add: {
                    succeed: true,
                    error: undefined,
                },
            };
        },
        deleteTargetsFailed(state, action: PayloadAction<{ error: string }>) {
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
export function selectTargets(state: { targets: TargetsState }) {
    return state.targets.targets;
}

export function selectFetchTargetsInfo(state: { targets: TargetsState }) {
    return state.targets.fetch;
}

export function selectAddTargetsInfo(state: { targets: TargetsState }) {
    return state.targets.add;
}

export function selectUpdateTargetsInfo(state: { targets: TargetsState }) {
    return state.targets.update;
}

export function selectDeleteTargetsInfo(state: { targets: TargetsState }) {
    return state.targets.delete;
}

// -- SAGA ACTIONS -- //
export const fetchAllTargets = createAction<FetchAllParams>(targetsSlice.name + '/fetchAllTargets');
export const addTarget = createAction<AddTargetParams>(targetsSlice.name + '/addTarget');
export const updateTarget = createAction<UpdateTargetParams>(targetsSlice.name + '/updateTarget');
export const deleteTarget = createAction<DeleteTargetParams>(targetsSlice.name + '/deleteTarget');

// -- SAGA ACTIONS -- //
export const {
    fetchTargetsStart,
    fetchTargetsSucceed,
    fetchTargetsFailed,
    addTargetsSucceed,
    addTargetsFailed,
    updateTargetsSucceed,
    updateTargetsFailed,
    deleteTargetsSucceed,
    deleteTargetsFailed,
} = targetsSlice.actions;

export default targetsSlice.reducer;
