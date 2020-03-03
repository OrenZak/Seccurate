import { makeStyles } from '@material-ui/core/styles';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import {
    login,
    selectIsLoggedIn,
    selectLoginError,
    selectLoginLoading,
    logout,
    SnackBarMessage,
    selectSnackbar,
} from '../../state/app/app.slice';
import { RootState } from '../../state/rootReducer';
import LoginModal from '../Login';
import Screens from '../screen';
import AppNavDrawer from './components/AppNavDrawer';
import { withCookies, ReactCookieProps } from 'react-cookie';
import { Snackbar } from '@material-ui/core';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

interface OwnProps {
    isLoginClicked: boolean;
}

interface ConnectedProps {
    loggedIn: boolean;
    loginError?: string;
    loginLoading: boolean;
    snackbar: { msg?: SnackBarMessage };
}

interface DispatchProps {
    login: typeof login;
    logout: typeof logout;
}

type Props = OwnProps & ConnectedProps & DispatchProps & ReactCookieProps;

function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const MainScreen: React.FC<Props> = props => {
    const classes = useStyles();

    const [selectedScreen, setSelectedScreen] = useState<string>(Screens.TargetsScreen.id);

    const CurrentScreen: React.ComponentType<any> = Screens[selectedScreen].generator();

    const handleLogin = (username: string, password: string) => {
        props.login({ username, password });
    };

    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (props.isLoginClicked) {
            props.logout();
        }
    }, [props.isLoginClicked]);

    useEffect(() => {
        if (snackbar.msg) {
            setOpen(true);
        }
    }, [props.snackbar]);

    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };
    const { snackbar } = props;
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
            <Snackbar open={open} autoHideDuration={1500} onClose={handleClose}>
                <Alert onClose={handleClose} severity={snackbar.msg?.type}>
                    {snackbar.msg?.text}
                </Alert>
            </Snackbar>
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
        snackbar: selectSnackbar(state),
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
