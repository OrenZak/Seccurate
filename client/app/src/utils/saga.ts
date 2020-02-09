import { all, takeEvery, fork } from 'redux-saga/effects';
import { SagaParams } from '../state/createStore';

interface SagaCreatorDefinition {
    handler: (sagaParams: SagaParams) => Parameters<typeof takeEvery>[1];
}
interface SagaCreatorConfig {
    [actionType: string]: SagaCreatorDefinition;
}

function generateWatcher(sagaParams: SagaParams, actionType: string, def: SagaCreatorDefinition) {
    return function*() {
        yield takeEvery(actionType, def.handler(sagaParams));
    };
}

export function sagaCreator(sagas: SagaCreatorConfig) {
    return function*(sagaParams: SagaParams) {
        yield all(
            Object.keys(sagas).map(actionType => {
                return fork(generateWatcher(sagaParams, actionType, sagas[actionType]));
            }),
        );
    };
}
