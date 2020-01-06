import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const AppLogo: React.FC = () => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <img src={require('../assets/images/Seccurate_logo_image.png')} className={classes.logo_image} alt="" />
            <img src={require('../assets/images/SeccurateName_logo.png')} className={classes.logo_title} alt="" />
        </div>
    );
};

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    logo_image: {
        margin: theme.spacing(2),
        height: '30px',
    },
    logo_title: {
        height: '20px',
        marginTop: '20px',
        marginBottom: '20px',
    },
}));

export default AppLogo;
