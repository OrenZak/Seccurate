import { all } from 'redux-saga/effects';
import app from './app/app.saga';
// import targets from './targets/targets.saga';
// import reports from './reports/reports.saga';

import { SagaParams } from './createStore';

export default (sagaParams: SagaParams) =>
    function*() {
        yield all([app].map(saga => saga(sagaParams)));
        // yield all([app, targets, reports].map(saga => saga(sagaParams)));
    };

export { app };
// export { app, targets, reports };
