import { createSlice, PayloadAction, createAction } from '@reduxjs/toolkit';

export interface SnackBarMessage {
    text: string;
    type: 'success' | 'error';
    duration?: number;
}
interface AppState {
    isAdmin: boolean;
    login: {
        isLoading: boolean;
        isLoggedIn: boolean;
        loginError?: string;
    };
    snackbar: {
        msg?: SnackBarMessage;
    };
}

const initialState: AppState = {
    isAdmin: false,
    login: {
        isLoading: false,
        isLoggedIn: false,
    },
    snackbar: {},
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
        loginSucceed(state, action: PayloadAction<{ isAdmin: boolean }>) {
            return {
                ...state,
                isAdmin: action.payload.isAdmin,
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
                isAdmin: false,
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
                isAdmin: false,
                login: {
                    loginError: undefined,
                    isLoggedIn: false,
                    isLoading: false,
                },
            };
        },
        setSnackbarMessage(state, action: PayloadAction<{ msg: SnackBarMessage }>) {
            return {
                ...state,
                snackbar: {
                    msg: action.payload.msg,
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

export function selectSnackbar(state: { app: AppState }) {
    return state.app.snackbar;
}

// -- SAGA ACTIONS -- //
export const login = createAction<LoginParams>(appSlice.name + '/login');
export const logout = createAction(appSlice.name + '/logout');
export const showMessage = createAction<{ msg: SnackBarMessage }>(appSlice.name + '/showMessage');

// -- SAGA ACTIONS -- //
export const { loginStart, logoutSucceed, loginSucceed, loginFailed, setSnackbarMessage } = appSlice.actions;

export default appSlice.reducer;
