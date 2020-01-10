import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import TrackChangesIcon from '@material-ui/icons/TrackChanges';
import ReportIcon from '@material-ui/icons/Report';

const AppNavDrawer: React.FC = () => {
    const classes = useStyles();
    const drawerTabsData = [
        { title: 'Targets', icon: <TrackChangesIcon /> },
        { title: 'Reports', icon: <ReportIcon /> },
    ];

    return (
        <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
                paper: classes.drawerPaper,
            }}
        >
            <div className={classes.toolbar} />
            <List>
                {drawerTabsData.map(item => (
                    <ListItem button key={item.title}>
                        <ListItemIcon className={classes.tabColor}>{item.icon}</ListItemIcon>
                        <ListItemText className={classes.tabColor} primary={item.title} />
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
};

const drawerWidth = 240;
const useStyles = makeStyles(theme => ({
    toolbar: theme.mixins.toolbar,
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
        backgroundColor: '#414141',
    },
    tabColor: {
        color: '#ffffff',
    },
}));

export default AppNavDrawer;
