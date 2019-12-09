import React from 'react';
import './App.css';
import { makeStyles } from '@material-ui/core/styles';
import AppNavDrawer from './components/AppNavDrawer';
import AppToolBar from './components/AppToolBar';


const App: React.FC = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
    <AppToolBar/>
    <AppNavDrawer/>
  </div>
  );
};

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  }
}));

export default App;
