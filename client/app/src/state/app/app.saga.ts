import { sagaCreator } from '../../utils/saga';
import { put, call } from 'redux-saga/effects';
import { login, logout, loginStart, loginSucceed, loginFailed, logoutSucceed } from './app.slice';
import ApiGateway from '../../services/gateway.api';

function handleLogin({ apiGateway }: { apiGateway: ApiGateway }) {
    return function*({ payload }: { payload: LoginParams }) {
        yield put(loginStart());
        const result = yield call(apiGateway.user.login, payload.username, payload.password);
        console.log('Login ', result);
        if (result.error) {
            yield put(loginFailed({ error: result.error }));
        } else {
            yield put(loginSucceed({ isAdmin: result.isAdmin }));
        }
    };
}

function handleLogout({ apiGateway }: { apiGateway: ApiGateway }) {
    return function*() {
        const result = yield call(apiGateway.user.logout);
        console.log('Logout ', result);
        if (result.error) {
            yield put(loginFailed({ error: result.error }));
        } else if (result.response) {
            yield put(logoutSucceed());
        }
    };
}

export default sagaCreator({
    [login.type]: { handler: handleLogin },
    [logout.type]: { handler: handleLogout },
});
