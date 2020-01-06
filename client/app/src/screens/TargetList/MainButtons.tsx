import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

const MainButtons: React.FC = () => {
    const classes = useStyles();
    return (
        <Grid container item direction="column" xs={2} spacing={3}>
            <Grid item>
                <Grid container item direction="row" xs={12} alignItems="baseline">
                    <Grid item xs={4}>
                        <Fab className={classes.fabYellow} aria-label="add" size={'small'}>
                            <AddIcon />
                        </Fab>
                    </Grid>
                    <Grid item xs={6}>
                        New Target
                    </Grid>
                </Grid>
            </Grid>
            <Grid item>
                <Grid container item direction="row" xs={12} alignItems="baseline">
                    <Grid item xs={4}>
                        <Fab aria-label="edit" size={'small'}>
                            <EditIcon />
                        </Fab>
                    </Grid>

                    <Grid item xs={6}>
                        Edit Target
                    </Grid>
                </Grid>
            </Grid>
            <Grid item>
                <Grid container item direction="row" xs={12} alignItems="baseline">
                    <Grid item xs={4}>
                        <Fab aria-label="delete" size={'small'}>
                            <DeleteIcon />
                        </Fab>
                    </Grid>
                    <Grid item xs={7}>
                        Delete Target
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

const useStyles = makeStyles(_ => ({
    fabYellow: {
        backgroundColor: '#F6C74C',
        '&:hover': {
            backgroundColor: '#F6C74C',
            // Reset on touch devices, it doesn't add specificity
            '@media (hover: none)': {
                backgroundColor: '#F6C74C',
            },
        },
    },
}));

export default MainButtons;
