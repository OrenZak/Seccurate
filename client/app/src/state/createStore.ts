import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import rootReducer, { RootState } from './rootReducer';
import createRootSaga from './sagas';
import ApiGateway from '../services/gateway.api';

export interface SagaParams {
    apiGateway: ApiGateway;
}

export function createReduxStore(initialState: Partial<RootState> = {}, sagaParams: SagaParams) {
    const sagaMiddleware = createSagaMiddleware();
    const rootSaga = createRootSaga(sagaParams);

    const store = configureStore({
        reducer: rootReducer,
        middleware: [...getDefaultMiddleware({ thunk: false }), sagaMiddleware],
        preloadedState: initialState,
    });

    sagaMiddleware.run(rootSaga);

    return store;
}

export const store = createReduxStore(undefined, {
    apiGateway: new ApiGateway(),
});
