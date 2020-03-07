import { sagaCreator } from '../../utils/saga';
import { put, call, select } from 'redux-saga/effects';
import {
    fetchAllTargets,
    fetchNextPage,
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
    selectTargets,
} from './targets.slice';
import ApiGateway, { ApiResult } from '../../services/gateway.api';
import { showMessage } from '../app/app.slice';

function handleFetchAll({ apiGateway }: { apiGateway: ApiGateway }) {
    return function*({ payload }: { payload: FetchAllParams }) {
        yield put(fetchTargetsStart());
        const result: ApiResult<FetchAllResponse> = yield call(
            apiGateway.targets.fetchAll,
            payload.page,
            payload.pageCount,
        );
        const countResult: ApiResult<{ count: number }> = yield call(apiGateway.targets.getCount);
        if (result.error) {
            yield put(fetchTargetsFailed({ error: result.error }));
        } else if (result.response) {
            const targets = result.response.targets;
            const count = countResult.response?.count ?? targets.length;
            yield put(fetchTargetsSucceed({ targets, count }));
        }
    };
}

function handleFetchNextPage({ apiGateway }: { apiGateway: ApiGateway }) {
    return function*({ payload }: { payload: FetchAllParams }) {
        yield put(fetchTargetsStart());
        const result: ApiResult<FetchAllResponse> = yield call(
            apiGateway.targets.fetchAll,
            payload.page,
            payload.pageCount,
        );
        const countResult: ApiResult<{ count: number }> = yield call(apiGateway.targets.getCount);
        if (result.error) {
            yield put(fetchTargetsFailed({ error: result.error }));
        } else if (result.response) {
            const currentTargets: Target[] = yield select(selectTargets);
            const targets = currentTargets.concat(result.response.targets);
            const count = countResult.response?.count ?? targets.length;
            yield put(fetchTargetsSucceed({ targets, count }));
        }
    };
}

function handleAddTarget({ apiGateway }: { apiGateway: ApiGateway }) {
    return function*({ payload }: { payload: AddTargetParams }) {
        const result: ApiResult<AddTargetParams> = yield call(apiGateway.targets.add, payload.target);
        if (result.error) {
            yield put(addTargetsFailed({ error: result.error }));
        } else if (result.response) {
            const currentTargets: Target[] = yield select(selectTargets);
            yield put(fetchAllTargets({ page: 0, pageCount: currentTargets.length }));
            yield put(addTargetsSucceed());
            yield put(showMessage({ msg: { text: 'Target was added', type: 'success' } }));
        }
    };
}

function handleUpdateTarget({ apiGateway }: { apiGateway: ApiGateway }) {
    return function*({ payload }: { payload: UpdateTargetParams }) {
        const result: ApiResult<UpdateTargetParams> = yield call(apiGateway.targets.update, payload.target);
        console.log('handleUpdateTarget ', result);
        if (result.error) {
            yield put(updateTargetsFailed({ error: result.error }));
        } else if (result.response) {
            const currentTargets: Target[] = yield select(selectTargets);
            yield put(fetchAllTargets({ page: 0, pageCount: currentTargets.length }));
            yield put(updateTargetsSucceed());
            yield put(showMessage({ msg: { text: 'Target was updated', type: 'success' } }));
        }
    };
}

function handleDeleteTarget({ apiGateway }: { apiGateway: ApiGateway }) {
    return function*({ payload }: { payload: DeleteTargetParams }) {
        const result: ApiResult<DeleteTargetParams> = yield call(apiGateway.targets.delete, payload.id);
        if (result.error) {
            yield put(deleteTargetsFailed({ error: result.error }));
        } else if (result.response) {
            const currentTargets: Target[] = yield select(selectTargets);
            yield put(fetchAllTargets({ page: 0, pageCount: currentTargets.length }));
            yield put(deleteTargetsSucceed());
            yield put(showMessage({ msg: { text: 'Target was deleted', type: 'success' } }));
        }
    };
}

export default sagaCreator({
    [fetchAllTargets.type]: { handler: handleFetchAll },
    [fetchNextPage.type]: { handler: handleFetchNextPage },
    [addTarget.type]: { handler: handleAddTarget },
    [updateTarget.type]: { handler: handleUpdateTarget },
    [deleteTarget.type]: { handler: handleDeleteTarget },
});
