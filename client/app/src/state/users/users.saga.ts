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
import { showMessage } from '../app/app.slice';

function handleFetchAllUsers({ apiGateway }: { apiGateway: ApiGateway }) {
    return function*() {
        yield put(fetchUsersStart());
        const result: ApiResult<FetchAllUsersResponse> = yield call(apiGateway.users.fetchAll);
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
            yield put(showMessage({ msg: { text: result.error, type: 'error' } }));
        } else if (result.response) {
            yield put(fetchAllUsers());
            yield put(addUserSucceed());
            yield put(showMessage({ msg: { text: 'User Added Successfully', type: 'success' } }));
        }
    };
}

function handleUpdateUser({ apiGateway }: { apiGateway: ApiGateway }) {
    return function*({ payload }: { payload: UpdateUserParams }) {
        const result: ApiResult<{ msg: string }> = yield call(apiGateway.users.updateUser, payload);
        if (result.error) {
            yield put(updateUserFailed({ error: result.error }));
            yield put(showMessage({ msg: { text: result.error, type: 'error' } }));
        } else if (result.response) {
            yield put(fetchAllUsers());
            yield put(updateUserSucceed());
            yield put(showMessage({ msg: { text: 'User Updated Successfully', type: 'success' } }));
        }
    };
}

function handleDeleteUser({ apiGateway }: { apiGateway: ApiGateway }) {
    return function*({ payload }: { payload: DeleteUserParams }) {
        const result: ApiResult<{ msg: string }> = yield call(apiGateway.users.deleteUser, payload);
        if (result.error) {
            yield put(deleteUserFailed({ error: result.error }));
            yield put(showMessage({ msg: { text: result.error, type: 'error' } }));
        } else if (result.response) {
            yield put(fetchAllUsers());
            yield put(deleteUserSucceed());
            yield put(showMessage({ msg: { text: 'User Deleted Successfully', type: 'success' } }));
        }
    };
}

export default sagaCreator({
    [fetchAllUsers.type]: { handler: handleFetchAllUsers },
    [createUser.type]: { handler: handleCreateUser },
    [updateUser.type]: { handler: handleUpdateUser },
    [deleteUser.type]: { handler: handleDeleteUser },
});
