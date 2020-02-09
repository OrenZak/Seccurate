import { combineReducers } from 'redux';

import app from './app/app.slice';
import targets from './targets/targets.slice';
import configs from './configs/configs.slice';
import users from './users/users.slice';
import scans from './scans/scans.slice';

const rootReducer = combineReducers({
    app,
    targets,
    configs,
    users,
    scans,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
