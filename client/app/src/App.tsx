import React from 'react';
import './App.css';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from '@material-ui/core';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import TrackChangesIcon from '@material-ui/icons/TrackChanges';
import ReportIcon from '@material-ui/icons/Report';
import AppLogo from './components/AppLogo'

const drawerWidth = 240;
const drawerTabsData = [{title: 'Scans', icon: <TrackChangesIcon/>}, {title:'Reports', icon: <ReportIcon/>}];

const App: React.FC = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
    <AppBar position='fixed' className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <AppLogo/>
        <Typography variant='h6' noWrap className={classes.title}>
          Seccurate
        </Typography>
        <SupervisedUserCircleIcon className={classes.manageButton}/>
      </Toolbar>
    </AppBar>
    <Drawer
    className={classes.drawer}
    variant="permanent"
    classes={{
      paper: classes.drawerPaper,
    }}
  >
    <div className={classes.toolbar} />
    <List>
      {drawerTabsData.map((item, index) => (
        <ListItem button key={item.title}>
          <ListItemIcon className={classes.tabColor}>{item.icon}</ListItemIcon>
          <ListItemText className={classes.tabColor} primary={item.title} />
          {/* if (index <= drawerTabsData.length) <Divider/> */}
        </ListItem>
      ))}
    </List>
  
  </Drawer>
  </div>
  );
};

const useStyles = makeStyles(theme => ({
  toolbar: theme.mixins.toolbar,
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  },
  appBar: {
    backgroundColor: '#ffffff',
    zIndex: theme.zIndex.drawer + 1,
  },
  manageButton: {
    color: '#000000'
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: '#414141'
  },
  tabColor: {
    color: '#ffffff'
  }
}));

export default App;
