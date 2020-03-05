import { sagaCreator } from '../../utils/saga';
import { put, call } from 'redux-saga/effects';
import {
    fetchAllConfigs,
    fetchConfigsStart,
    fetchConfigsSucceed,
    fetchConfigsFailed,
    addConfig,
    updateConfig,
    deleteConfig,
    addConfigFailed,
    addConfigSucceed,
    updateConfigSucceed,
    updateConfigFailed,
    deleteConfigFailed,
    deleteConfigSucceed,
} from './configs.slice';
import ApiGateway, { ApiResult } from '../../services/gateway.api';

function handleFetchAllConfigs({ apiGateway }: { apiGateway: ApiGateway }) {
    return function*({ payload }: { payload: FetchAllParams }) {
        yield put(fetchConfigsStart());
        const result: ApiResult<FetchAllConfigsResponse> = yield call(
            apiGateway.savedConfig.fetchAll,
            payload.page,
            payload.pageCount,
        );
        const countResult: ApiResult<{count: number}> = yield call(apiGateway.savedConfig.getCount);
        if (result.error) {
            yield put(fetchConfigsFailed({ error: result.error }));
        } else if (result.response) {
            const configs = result.response.configs;
            const count = countResult.response?.count ?? configs.length;
            yield put(fetchConfigsSucceed({ configs, count }));
        }
    };
}

function handleAddConfig({ apiGateway }: { apiGateway: ApiGateway }) {
    return function*({ payload }: { payload: AddConfigParams }) {
        const result: ApiResult<{ scanConfigID: string }> = yield call(apiGateway.savedConfig.add, payload.config);
        if (result.error) {
            yield put(addConfigFailed({ error: result.error }));
        } else if (result.response) {
            yield put(addConfigSucceed());
        }
    };
}

function handleUpdateConfig({ apiGateway }: { apiGateway: ApiGateway }) {
    return function*({ payload }: { payload: UpdateConfigParams }) {
        const result: ApiResult<{ msg: string }> = yield call(apiGateway.savedConfig.update, payload.config);
        if (result.error) {
            yield put(updateConfigFailed({ error: result.error }));
        } else if (result.response) {
            yield put(updateConfigSucceed());
        }
    };
}

function handleDeleteConfig({ apiGateway }: { apiGateway: ApiGateway }) {
    return function*({ payload }: { payload: DeleteConfigParams }) {
        const result: ApiResult<{ msg: string }> = yield call(apiGateway.savedConfig.delete, payload.id);
        if (result.error) {
            yield put(deleteConfigFailed({ error: result.error }));
        } else if (result.response) {
            yield put(deleteConfigSucceed());
        }
    };
}

export default sagaCreator({
    [fetchAllConfigs.type]: { handler: handleFetchAllConfigs },
    [addConfig.type]: { handler: handleAddConfig },
    [updateConfig.type]: { handler: handleUpdateConfig },
    [deleteConfig.type]: { handler: handleDeleteConfig },
});
