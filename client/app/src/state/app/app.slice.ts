import { createSlice, PayloadAction, createAction } from '@reduxjs/toolkit';

interface AppState {
    login: {
        isLoading: boolean;
        isLoggedIn: boolean;
        loginError?: string;
    };
}

const initialState: AppState = {
    login: {
        isLoading: false,
        isLoggedIn: false,
    },
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        loginStart(state) {
            return {
                ...state,
                login: {
                    loginError: undefined,
                    isLoggedIn: false,
                    isLoading: true,
                },
            };
        },
        loginSucceed(state) {
            return {
                ...state,
                login: {
                    loginError: undefined,
                    isLoggedIn: true,
                    isLoading: false,
                },
            };
        },
        loginFailed(state, action: PayloadAction<{ error: string }>) {
            return {
                ...state,
                login: {
                    loginError: action.payload.error,
                    isLoggedIn: false,
                    isLoading: false,
                },
            };
        },
        logoutSucceed(state) {
            return {
                ...state,
                login: {
                    loginError: undefined,
                    isLoggedIn: false,
                    isLoading: false,
                },
            };
        },
    },
});

// -- STATE SELECTORS --//
export function selectIsLoggedIn(state: { app: AppState }) {
    return state.app.login.isLoggedIn;
}

export function selectLoginError(state: { app: AppState }) {
    return state.app.login.loginError;
}

export function selectLoginLoading(state: { app: AppState }) {
    return state.app.login.isLoading;
}

// -- SAGA ACTIONS -- //
export const login = createAction<LoginParams>(appSlice.name + '/login');
export const logout = createAction(appSlice.name + '/logout');

// -- SAGA ACTIONS -- //
export const { loginStart, logoutSucceed, loginSucceed, loginFailed } = appSlice.actions;

export default appSlice.reducer;
