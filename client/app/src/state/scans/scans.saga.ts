import { sagaCreator } from '../../utils/saga';
import { put, call } from 'redux-saga/effects';
import {
    fetchCompletedScansSucceed,
    fetchCompletedScansFailed,
    startScanSucceed,
    startScanFailed,
    fetchScanResultsSucceed,
    fetchScanResultsFailed,
    fetchCompletedScans,
    startScan,
    fetchScanResults,
    scanCompleted,
    updateScanCompleted,
} from './scans.slice';
import ApiGateway, { ApiResult } from '../../services/gateway.api';
import { showMessage } from '../app/app.slice';
import { removeTargetByScanId } from '../targets/targets.slice';

function handleUpdateScanCompleted() {
    return function*() {
        console.log('updateScanCompleted');
        yield put(scanCompleted());
    };
}

function handleFetchCompletedScans({ apiGateway }: { apiGateway: ApiGateway }) {
    return function*({ payload }: { payload: FetchAllParams }) {
        console.log('handleFetchCompletedScans', payload);
        const result: ApiResult<FetchAllCompletedScansResponse> = yield call(
            apiGateway.scans.fetchAllCompleted,
            payload.page,
            payload.pageCount,
        );
        if (result.error) {
            yield put(fetchCompletedScansFailed({ error: result.error }));
        } else if (result.response) {
            yield put(fetchCompletedScansSucceed({ scans: result.response.scans }));
        }
    };
}

function handleStartScan({ apiGateway }: { apiGateway: ApiGateway }) {
    return function*({ payload }: { payload: StartScanPayload }) {
        const result: ApiResult<{ msg: string }> = yield call(apiGateway.scans.start, payload.scanId);
        if (result.error) {
            yield put(startScanFailed({ error: result.error }));
            yield put(
                showMessage({
                    msg: {
                        text: result.error || 'Failed to start scan',
                        type: 'error',
                        duration: 2000,
                    },
                }),
            );
        } else if (result.response) {
            yield put(startScanSucceed());
            yield put(removeTargetByScanId({ scanId: payload.scanId }));
            yield put(
                showMessage({
                    msg: {
                        text: `Successfully started scan ${payload.scanName}. A detailed report will appear in the Reports tab upon scan completion`,
                        type: 'success',
                        duration: 3000,
                    },
                }),
            );
        }
    };
}

function handleFetchScanResults({ apiGateway }: { apiGateway: ApiGateway }) {
    return function*({ payload }: { payload: FetchScanResultsPayload }) {
        const result: ApiResult<{ results: Result[] }> = yield call(apiGateway.scans.getResults, payload.scanId);
        if (result.error) {
            yield put(fetchScanResultsFailed({ error: result.error }));
        } else if (result.response) {
            yield put(fetchScanResultsSucceed({ scanResults: result.response.results }));
        }
    };
}

export default sagaCreator({
    [fetchCompletedScans.type]: { handler: handleFetchCompletedScans },
    [startScan.type]: { handler: handleStartScan },
    [fetchScanResults.type]: { handler: handleFetchScanResults },
    [updateScanCompleted.type]: { handler: handleUpdateScanCompleted },
});
