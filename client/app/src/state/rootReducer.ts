import { combineReducers } from 'redux';

import app from './app/app.slice';
import targets from './targets/targets.slice';
import reports from './reports/reports.slice';

const rootReducer = combineReducers({
    app,
    targets,
    reports,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
