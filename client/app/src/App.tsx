import React, { useState } from 'react';
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import AppToolBar from './screens/Main/components/AppToolBar';
import MainScreen from './screens/Main';
import { store } from './state';
import { Provider } from 'react-redux';
import { CookiesProvider } from 'react-cookie';

const theme = createMuiTheme({
    palette: {
        primary: {
            // light: will be calculated from palette.primary.main,
            main: '#F6C74C',
            // dark: will be calculated from palette.primary.main,
            // contrastText: will be calculated to contrast with palette.primary.main
        },
        secondary: {
            light: '#F66B4C',
            main: '#F66B4C',
            // dark: will be calculated from palette.secondary.main,
            contrastText: '#F6C74C',
        },
        // Used by `getContrastText()` to maximize the contrast between
        // the background and the text.
        contrastThreshold: 3,
        // E.g., shift from Red 500 to Red 300 or Red 700.
        tonalOffset: 0.2,
    },
});

const App: React.FC = () => {
    const classes = useStyles();
    const [isLoginClicked, setIsLoginClicked] = useState<boolean>(false);
    return (
        <div className={classes.root}>
            <CookiesProvider>
                <Provider store={store}>
                    <ThemeProvider theme={theme}>
                        <AppToolBar
                            onLogoutClicked={() => {
                                setIsLoginClicked(true);
                                setTimeout(() => {
                                    setIsLoginClicked(false);
                                }, 250);
                            }}
                        />
                        <MainScreen isLoginClicked={isLoginClicked} />
                    </ThemeProvider>
                </Provider>
            </CookiesProvider>
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
