import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppNavDrawer from './components/AppNavDrawer';
import Screens from '../screen';
import { connect } from 'react-redux';
import { RootState } from '../../state/rootReducer';
import { Dispatch, bindActionCreators } from 'redux';
import { login, selectIsLoggedIn, selectLoginError, selectLoginLoading } from '../../state/app/app.slice';
import LoginModal from '../Login';

interface OwnProps {}

interface ConnectedProps {
    loggedIn: boolean;
    loginError?: string;
    loginLoading: boolean;
}

interface DispatchProps {
    login: typeof login;
}

type Props = OwnProps & ConnectedProps & DispatchProps;

const MainScreen: React.FC<Props> = props => {
    const classes = useStyles();

    const [selectedScreen, setSelectedScreen] = useState<string>(Screens.TargetsScreen.id);

    const CurrentScreen: React.ComponentType<any> = Screens[selectedScreen].generator();

    const handleLogin = (username: string, password: string) => {
        props.login({ username, password });
    };

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
            {props.loggedIn && <CurrentScreen />}
            <LoginModal
                isOpen={!props.loggedIn}
                onLoginClicked={handleLogin}
                loginError={props.loginError}
                loginLoading={props.loginLoading}
            />
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

function mapStateToProps(state: RootState, ownProps: OwnProps): ConnectedProps {
    return {
        loggedIn: selectIsLoggedIn(state),
        loginError: selectLoginError(state),
        loginLoading: selectLoginLoading(state),
    };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
    return bindActionCreators(
        {
            login,
        },
        dispatch,
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);
