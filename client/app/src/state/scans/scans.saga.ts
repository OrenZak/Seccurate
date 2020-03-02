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
} from './scans.slice';
import ApiGateway, { ApiResult } from '../../services/gateway.api';
import { END_POINTS } from '../../config';

// const api_gateway = require('socket.io-client')(END_POINTS.gatewayURL);
// api_gateway.on('scan_completed', function*() {
//     yield put(scanCompleted());
// });

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
        } else if (result.response) {
            yield put(startScanSucceed());
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
});
