import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Button, Typography } from '@material-ui/core';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import AppLogo from './AppLogo';
import ManageUsersModal from '../../ManageUsers';
import { prependOnceListener } from 'cluster';

interface Props {
    onLogoutClicked: () => void;
}

const AppToolBar: React.FC<Props> = props => {
    const classes = useStyles();

    const [manageUsersShow, setManageUsersShow] = useState<boolean>(false);

    return (
        <div>
            <ManageUsersModal isOpen={manageUsersShow} close={() => setManageUsersShow(false)} />
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar className={classes.toolbar}>
                    <AppLogo />
                    <Button
                        onClick={() => {
                            setManageUsersShow(true);
                        }}
                    >
                        <SupervisedUserCircleIcon fontSize="large" className={classes.manageButton} />
                    </Button>
                    <Button
                        onClick={() => {
                            props.onLogoutClicked();
                        }}
                    >
                        <Typography>Logout</Typography>
                    </Button>
                </Toolbar>
            </AppBar>
        </div>
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
