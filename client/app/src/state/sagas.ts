import { all } from 'redux-saga/effects';
import app from './app/app.saga';
import targets from './targets/targets.saga';
import configs from './configs/configs.saga';
import users from './users/users.saga';
import scans from './scans/scans.saga';

import { SagaParams } from './createStore';

export default (sagaParams: SagaParams) =>
    function*() {
        yield all([app, targets, configs, users, scans].map(saga => saga(sagaParams)));
    };

export { app, targets };
