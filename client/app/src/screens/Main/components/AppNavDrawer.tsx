import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import TrackChangesIcon from '@material-ui/icons/TrackChanges';
import ReportIcon from '@material-ui/icons/Report';
import Screens from '../../screen';

interface Props {
    firstScreenId: string;
    onScreenChanged: (screenId: string) => void;
}

const AppNavDrawer: React.FC<Props> = props => {
    const classes = useStyles();
    const drawerTabsData = [
        { id: Screens.TargetsScreen.id, title: 'Targets', icon: <TrackChangesIcon /> },
        { id: Screens.ReportsScreen.id, title: 'Reports', icon: <ReportIcon /> },
    ];

    const [selectedTab, setSelectedTab] = useState<string>(props.firstScreenId);

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
                    <ListItem
                        button
                        key={item.title}
                        onClick={() => {
                            setSelectedTab(item.id);
                            props.onScreenChanged(item.id);
                        }}
                    >
                        <ListItemIcon className={selectedTab === item.id ? classes.selectedTab : classes.tabColor}>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText
                            className={selectedTab === item.id ? classes.selectedTab : classes.tabColor}
                            primary={item.title}
                        />
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
    selectedTab: {
        color: theme.palette.primary.main,
    },
    tabColor: {
        color: '#ffffff',
    },
}));

export default AppNavDrawer;
