import { sagaCreator } from '../../utils/saga';
import { put, call } from 'redux-saga/effects';
import { login, loginSucceed, loginFailed } from './app.slice';
import ApiGateway from '../../services/gateway.api';

function handleLogin({ apiGateway }: { apiGateway: ApiGateway }) {
    return function*({ payload }: { payload: LoginParams }) {
        const result = yield call(apiGateway.user.login, payload.username, payload.password);

        if (result.error) {
            yield put(loginFailed(result.error));
        } else if (result.response) {
            yield put(loginSucceed());
        }
    };
}

export default sagaCreator({
    [login.type]: { handler: handleLogin },
});
