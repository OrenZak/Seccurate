import React from 'react';
import './App.css';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';

const App: React.FC = () => {
  const classes = useStyles();
  return (
    <AppBar position='static' className={classes.toolbar}>
      <Toolbar>
        <Typography variant='h6' className={classes.title}>
          Seccurate
        </Typography>
        <SupervisedUserCircleIcon />
      </Toolbar>
    </AppBar>
  );
};

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  },
  toolbar: {
    backgroundColor: '#222831'
  }
}));

export default App;
