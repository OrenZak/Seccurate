import { all } from 'redux-saga/effects';
import app from './app/app.saga';
import targets from './targets/targets.saga';
import configs from './configs/configs.saga';
import users from './users/users.saga';
// import reports from './reports/reports.saga';

import { SagaParams } from './createStore';

export default (sagaParams: SagaParams) =>
    function*() {
        yield all([app, targets, configs, users].map(saga => saga(sagaParams)));
    };

export { app, targets };
