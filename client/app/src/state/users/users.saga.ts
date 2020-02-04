import { sagaCreator } from '../../utils/saga';
import { put, call } from 'redux-saga/effects';
import {
    fetchAllUsers,
    fetchUsersStart,
    fetchUsersSucceed,
    fetchUsersFailed,
    createUser,
    updateUser,
    deleteUser,
    addUserFailed,
    addUserSucceed,
    updateUserSucceed,
    updateUserFailed,
    deleteUserFailed,
    deleteUserSucceed,
} from './users.slice';
import ApiGateway, { ApiResult } from '../../services/gateway.api';

function handleFetchAllUsers({ apiGateway }: { apiGateway: ApiGateway }) {
    return function*() {
        yield put(fetchUsersStart());
        const result: ApiResult<FetchAllUsersResponse> = yield call(apiGateway.users.fetchAll);
        console.log('handleFetchAllUsers: ', result);
        if (result.error) {
            yield put(fetchUsersFailed({ error: result.error }));
        } else if (result.response) {
            yield put(fetchUsersSucceed({ users: result.response.usersArray }));
        }
    };
}

function handleCreateUser({ apiGateway }: { apiGateway: ApiGateway }) {
    return function*({ payload }: { payload: CreateUserParams }) {
        const result: ApiResult<{ msg: string }> = yield call(apiGateway.users.createUser, payload);
        if (result.error) {
            yield put(addUserFailed({ error: result.error }));
        } else if (result.response) {
            yield put(addUserSucceed());
        }
    };
}

function handleUpdateUser({ apiGateway }: { apiGateway: ApiGateway }) {
    return function*({ payload }: { payload: UpdateUserParams }) {
        const result: ApiResult<{ msg: string }> = yield call(apiGateway.users.updateUser, payload);
        console.log('handleUpdateUser: ', payload, result);
        if (result.error) {
            yield put(updateUserFailed({ error: result.error }));
        } else if (result.response) {
            yield put(updateUserSucceed());
        }
    };
}

function handleDeleteUser({ apiGateway }: { apiGateway: ApiGateway }) {
    return function*({ payload }: { payload: DeleteUserParams }) {
        const result: ApiResult<{ msg: string }> = yield call(apiGateway.users.deleteUser, payload);
        if (result.error) {
            yield put(deleteUserFailed({ error: result.error }));
        } else if (result.response) {
            yield put(deleteUserSucceed());
        }
    };
}

export default sagaCreator({
    [fetchAllUsers.type]: { handler: handleFetchAllUsers },
    [createUser.type]: { handler: handleCreateUser },
    [updateUser.type]: { handler: handleUpdateUser },
    [deleteUser.type]: { handler: handleDeleteUser },
});
