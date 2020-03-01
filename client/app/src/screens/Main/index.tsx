import { makeStyles } from '@material-ui/core/styles';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { login, selectIsLoggedIn, selectLoginError, selectLoginLoading, logout } from '../../state/app/app.slice';
import { RootState } from '../../state/rootReducer';
import LoginModal from '../Login';
import Screens from '../screen';
import AppNavDrawer from './components/AppNavDrawer';
import { withCookies, ReactCookieProps } from 'react-cookie';

interface OwnProps {
    isLoginClicked: boolean;
}

interface ConnectedProps {
    loggedIn: boolean;
    loginError?: string;
    loginLoading: boolean;
}

interface DispatchProps {
    login: typeof login;
    logout: typeof logout;
}

type Props = OwnProps & ConnectedProps & DispatchProps & ReactCookieProps;

const MainScreen: React.FC<Props> = props => {
    const classes = useStyles();

    const [selectedScreen, setSelectedScreen] = useState<string>(Screens.TargetsScreen.id);

    const CurrentScreen: React.ComponentType<any> = Screens[selectedScreen].generator();

    const handleLogin = (username: string, password: string) => {
        props.login({ username, password });
    };

    useEffect(() => {
        if (props.isLoginClicked) {
            props.logout();
        }
    }, [props.isLoginClicked]);

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
            {props.cookies?.get('user_sid') && <CurrentScreen cookies={props.cookies} />}
            <LoginModal
                isOpen={!props.cookies?.get('user_sid')}
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
            logout,
        },
        dispatch,
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(withCookies(MainScreen));
