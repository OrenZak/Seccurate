import { sagaCreator } from '../../utils/saga';
import { put, call } from 'redux-saga/effects';
import {
    fetchAllTargets,
    fetchTargetsStart,
    fetchTargetsSucceed,
    fetchTargetsFailed,
    addTarget,
    updateTarget,
    deleteTarget,
    addTargetsFailed,
    addTargetsSucceed,
    updateTargetsSucceed,
    updateTargetsFailed,
    deleteTargetsFailed,
    deleteTargetsSucceed,
} from './targets.slice';
import ApiGateway, { ApiResult } from '../../services/gateway.api';

function handleFetchAll({ apiGateway }: { apiGateway: ApiGateway }) {
    return function*({ payload }: { payload: FetchAllParams }) {
        yield put(fetchTargetsStart());
        const result: ApiResult<FetchAllResponse> = yield call(
            apiGateway.targets.fetchAll,
            payload.page,
            payload.pageCount,
        );
        if (result.error) {
            yield put(fetchTargetsFailed({ error: result.error }));
        } else if (result.response) {
            yield put(fetchTargetsSucceed({ targets: result.response.targets }));
        }
    };
}

function handleAddTarget({ apiGateway }: { apiGateway: ApiGateway }) {
    return function*({ payload }: { payload: AddTargetParams }) {
        console.log('handleAddTarget Before result: ');
        const result: ApiResult<AddTargetParams> = yield call(apiGateway.targets.add, payload.target);
        console.log('handleAddTarget result: ', result);
        if (result.error) {
            yield put(addTargetsFailed({ error: result.error }));
        } else if (result.response) {
            yield put(addTargetsSucceed());
        }
    };
}

function handleUpdateTarget({ apiGateway }: { apiGateway: ApiGateway }) {
    return function*({ payload }: { payload: UpdateTargetParams }) {
        const result: ApiResult<UpdateTargetParams> = yield call(apiGateway.targets.update, payload.target);
        console.log('handleUpdateTarget result: ', result);
        if (result.error) {
            yield put(updateTargetsFailed({ error: result.error }));
        } else if (result.response) {
            yield put(updateTargetsSucceed());
        }
    };
}

function handleDeleteTarget({ apiGateway }: { apiGateway: ApiGateway }) {
    return function*({ payload }: { payload: DeleteTargetParams }) {
        const result: ApiResult<DeleteTargetParams> = yield call(apiGateway.targets.delete, payload.id);
        console.log('handleDeleteTarget result: ', result);
        if (result.error) {
            yield put(deleteTargetsFailed({ error: result.error }));
        } else if (result.response) {
            yield put(deleteTargetsSucceed());
        }
    };
}

export default sagaCreator({
    [fetchAllTargets.type]: { handler: handleFetchAll },
    [addTarget.type]: { handler: handleAddTarget },
    [updateTarget.type]: { handler: handleUpdateTarget },
    [deleteTarget.type]: { handler: handleDeleteTarget },
});
