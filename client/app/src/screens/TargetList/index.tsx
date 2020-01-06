import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TargetList from './TargetsList';
import MainButtons from './MainButtons';

const TargetsScreen: React.FC = () => {
    const classes = useStyles();

    return (
        <Grid container direction="row" xs={12} spacing={4} className={classes.listFabContainer}>
            <Grid item xs={8}>
                <TargetList />
            </Grid>
            <MainButtons/>
        </Grid>
    );
};

const useStyles = makeStyles(_ => ({
    container: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 130,
    },
    listFabContainer: {
        marginLeft: '20%',
    },
}));

export default TargetsScreen;
