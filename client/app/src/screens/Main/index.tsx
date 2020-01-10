import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppNavDrawer from '../../components/AppNavDrawer';
import TargetsScreen from '../TargetsList/TargetsScreen';
import Screens from '../screen';

const MainScreen: React.FC = () => {
    const classes = useStyles();

    const [selectedScreen, setSelectedScreen] = useState(Screens.TargetsScreen.id);

    const CurrentScreen = Screens[selectedScreen].generator();

    return (
        <div className={classes.container}>
            <div>
                <AppNavDrawer />
            </div>
            <CurrentScreen />
        </div>
    );
};

const useStyles = makeStyles(_ => ({
    container: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 130,
    },
    listFabContainer: {
        marginLeft: '20%',
    },
}));

export default MainScreen;
