import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppNavDrawer from './components/AppNavDrawer';
import Screens from '../screen';

const MainScreen: React.FC = () => {
    const classes = useStyles();

    const [selectedScreen, setSelectedScreen] = useState<string>(Screens.TargetsScreen.id);

    const CurrentScreen: React.ComponentType<any> = Screens[selectedScreen].generator();

    return (
        <div className={classes.container}>
            <div>
                <AppNavDrawer
                    firstScreenId={Screens.TargetsScreen.id}
                    onScreenChanged={(screenId: string) => {
                        setSelectedScreen(screenId);
                    }}
                />
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
