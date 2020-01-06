import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppToolBar from './components/AppToolBar';
import MainScreen from './screens/Main';

const App: React.FC = () => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <AppToolBar />
            <MainScreen />
        </div>
    );
};

const useStyles = makeStyles(_ => ({
    root: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 130,
    },
}));

export default App;
