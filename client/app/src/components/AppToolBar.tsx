import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import AppLogo from '../components/AppLogo';

const AppToolBar: React.FC = () => {
    const classes = useStyles();
    return (
        <AppBar position="fixed" className={classes.appBar}>
            <Toolbar className={classes.toolbar}>
                <AppLogo />
                <SupervisedUserCircleIcon className={classes.manageButton} />
            </Toolbar>
        </AppBar>
    );
};

const useStyles = makeStyles(theme => ({
    toolbar: theme.mixins.toolbar,
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    appBar: {
        backgroundColor: '#ffffff',
        zIndex: theme.zIndex.drawer + 1,
    },
    manageButton: {
        color: '#000000',
    },
}));

export default AppToolBar;
