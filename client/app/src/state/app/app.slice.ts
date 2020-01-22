import { createSlice, PayloadAction, createAction } from '@reduxjs/toolkit';
import { ServerError } from '../../services/gateway.api';

interface AppState {
    accessToken?: string;
    loginError?: string;
}

const initialState: AppState = {
    accessToken: undefined,
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        loginSucceed(state, action: PayloadAction<AppState>) {
            return { ...state, ...action.payload };
        },
        loginFailed(state, action: PayloadAction<ServerError>) {
            return { ...state, loginError: action.payload };
        },
    },
});

// -- STATE SELECTORS --//
export function selectAccessToken(state: { app: AppState }) {
    return state.app.accessToken;
}

export function selectLoginError(state: { app: AppState }) {
    return state.app.loginError;
}

// -- SAGA ACTIONS -- //
export const login = createAction<LoginParams>(appSlice.name + '/login');

// -- SAGA ACTIONS -- //
export const { loginSucceed, loginFailed } = appSlice.actions;

export default appSlice.reducer;

