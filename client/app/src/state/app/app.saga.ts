import { sagaCreator } from '../../utils/saga';
import { put, call } from 'redux-saga/effects';
import { login, loginStart, loginSucceed, loginFailed } from './app.slice';
import ApiGateway from '../../services/gateway.api';

function handleLogin({ apiGateway }: { apiGateway: ApiGateway }) {
    return function*({ payload }: { payload: LoginParams }) {
        yield put(loginStart());
        const result = yield call(apiGateway.user.login, payload.username, payload.password);
        if (result.error) {
            console.log('results Error: ', result);
            yield put(loginFailed({ error: result.error }));
        } else if (result.response) {
            yield put(loginSucceed());
        }
    };
}

export default sagaCreator({
    [login.type]: { handler: handleLogin },
});
