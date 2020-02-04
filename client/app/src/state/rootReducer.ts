import { combineReducers } from 'redux';

import app from './app/app.slice';
import targets from './targets/targets.slice';
import configs from './configs/configs.slice';
import users from './users/users.slice';
// import reports from './reports/reports.slice';

const rootReducer = combineReducers({
    app,
    targets,
    configs,
    users,
    // reports,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
