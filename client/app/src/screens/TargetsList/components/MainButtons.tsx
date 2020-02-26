import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';

interface Props {
    showStartScan: boolean;
    onAddTargetClicked: () => void;
    onEditTargetClicked: () => void;
    onDeleteTargetClicked: () => void;
    onStartScanClicked: () => void;
}

const MainButtons: React.FC<Props> = props => {
    const classes = useStyles();

    const renderStartScanButton = () => {
        return (
            props.showStartScan && (
                <Grid item>
                    <Grid container item direction="row" xs={12} alignItems="baseline">
                        <Grid item xs={4}>
                            <Fab
                                className={classes.fabGreen}
                                size={'small'}
                                onClick={() => {
                                    props.onStartScanClicked();
                                }}
                            >
                                <PlayArrowIcon />
                            </Fab>
                        </Grid>
                        <Grid item xs={7}>
                            Start Scan
                        </Grid>
                    </Grid>
                </Grid>
            )
        );
    };
    return (
        <Grid container item direction="column" xs={2} spacing={3}>
            <Grid item>
                <Grid container item direction="row" xs={12} alignItems="baseline">
                    <Grid item xs={4}>
                        <Fab
                            className={classes.fabYellow}
                            aria-label="add"
                            size={'small'}
                            onClick={() => {
                                props.onAddTargetClicked();
                            }}
                        >
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
                        <Fab
                            aria-label="edit"
                            size={'small'}
                            onClick={() => {
                                props.onEditTargetClicked();
                            }}
                        >
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
                        <Fab
                            aria-label="delete"
                            size={'small'}
                            onClick={() => {
                                props.onDeleteTargetClicked();
                            }}
                        >
                            <DeleteIcon />
                        </Fab>
                    </Grid>
                    <Grid item xs={7}>
                        Delete Target
                    </Grid>
                </Grid>
            </Grid>

            {renderStartScanButton()}
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
    fabGreen: {
        backgroundColor: '#7fcd91',
        '&:hover': {
            backgroundColor: '#7fcd91',
            // Reset on touch devices, it doesn't add specificity
            '@media (hover: none)': {
                backgroundColor: '#7fcd91',
            },
        },
    },
}));

export default MainButtons;
