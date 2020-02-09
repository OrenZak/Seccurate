import { createSlice, PayloadAction, createAction } from '@reduxjs/toolkit';

interface UsersState {
    users: User[];
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

const initialState: UsersState = {
    users: [],
    fetch: {
        isLoading: false,
    },
    add: {},
    update: {},
    delete: {},
};

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        fetchUsersStart(state) {
            return {
                ...state,
                fetch: {
                    isLoading: true,
                    error: undefined,
                },
            };
        },
        fetchUsersSucceed(state, action: PayloadAction<{ users: User[] }>) {
            return {
                ...state,
                users: action.payload.users,
                fetch: {
                    isLoading: false,
                    error: undefined,
                },
            };
        },
        fetchUsersFailed(state, action: PayloadAction<{ error: string }>) {
            return {
                ...state,
                users: [],
                fetch: {
                    isLoading: false,
                    error: action.payload.error,
                },
            };
        },
        addUserSucceed(state) {
            return {
                ...state,
                add: {
                    succeed: true,
                    error: undefined,
                },
            };
        },
        addUserFailed(state, action: PayloadAction<{ error: string }>) {
            return {
                ...state,
                add: {
                    succeed: false,
                    error: action.payload.error,
                },
            };
        },
        updateUserSucceed(state) {
            return {
                ...state,
                update: {
                    succeed: true,
                    error: undefined,
                },
            };
        },
        updateUserFailed(state, action: PayloadAction<{ error: string }>) {
            return {
                ...state,
                update: {
                    succeed: false,
                    error: action.payload.error,
                },
            };
        },
        deleteUserSucceed(state) {
            return {
                ...state,
                add: {
                    succeed: true,
                    error: undefined,
                },
            };
        },
        deleteUserFailed(state, action: PayloadAction<{ error: string }>) {
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
export function selectUsers(state: { users: UsersState }) {
    return state.users.users;
}

export function selectFetchUsersInfo(state: { users: UsersState }) {
    return state.users.fetch;
}

export function selectAddUserInfo(state: { users: UsersState }) {
    return state.users.add;
}

export function selectUpdateUserInfo(state: { users: UsersState }) {
    return state.users.update;
}

export function selectDeleteUserInfo(state: { users: UsersState }) {
    return state.users.delete;
}

// -- SAGA ACTIONS -- //
export const fetchAllUsers = createAction(usersSlice.name + '/fetchAllUsers');
export const createUser = createAction<CreateUserParams>(usersSlice.name + '/createUser');
export const updateUser = createAction<UpdateUserParams>(usersSlice.name + '/updateUser');
export const deleteUser = createAction<DeleteUserParams>(usersSlice.name + '/deleteUser');

// -- SAGA ACTIONS -- //
export const {
    fetchUsersStart,
    fetchUsersSucceed,
    fetchUsersFailed,
    addUserSucceed,
    addUserFailed,
    updateUserSucceed,
    updateUserFailed,
    deleteUserSucceed,
    deleteUserFailed,
} = usersSlice.actions;

export default usersSlice.reducer;
