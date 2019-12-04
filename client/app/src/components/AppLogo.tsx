import React from 'react';
import seccurate_image from '../assets/images/Seccurate_logo_image.png'
import seccurate_title from '../assets/images/SeccurateName_logo.png'
import { makeStyles } from '@material-ui/core/styles';
import { height } from '@material-ui/system';


const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  logo_image: {
    margin: theme.spacing(2),
    height: '30px'
  },
  logo_title: {
    height: '20px',
    marginTop: '20px',
    marginBottom: '20px'
  },
}));


const AppLogo: React.FC = () => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
        <img src={seccurate_image} className={classes.logo_image}/>
        <img src={seccurate_title} className={classes.logo_title}/>
        </div>
      
    );
  };

export default AppLogo;