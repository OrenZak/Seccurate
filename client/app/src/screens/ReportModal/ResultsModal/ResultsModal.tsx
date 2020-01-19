import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { Grid } from '@material-ui/core';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    result: Result;
}

const ResultsModal: React.FC<Props> = props => {
    const classes = useStyles();

    const handleClose = () => {
        props.onClose();
    };

    const renderContent = () => {
        const { result } = props;
        return (
            <Grid container direction={'column'} justify={'center'} alignItems={'center'}>
                <Grid item>
                    <h2>Results</h2>
                </Grid>
                <Grid container item direction={'column'} justify={'flex-start'} alignItems={'flex-start'}>
                    <Grid container item direction={'row'} justify={'flex-start'} alignItems={'center'} spacing={2}>
                        <Grid item>
                            <h4>Name: </h4>
                        </Grid>
                        <Grid item>
                            <h5 className={classes.text}> {result.name}</h5>
                        </Grid>
                    </Grid>
                    <Grid container item direction={'row'} justify={'flex-start'} alignItems={'center'} spacing={2}>
                        <Grid item>
                            <h4>Description: </h4>
                        </Grid>
                        <Grid item>
                            <h5 className={classes.text}> {result.description}</h5>
                        </Grid>
                    </Grid>
                    <Grid container item direction={'row'} justify={'flex-start'} alignItems={'center'} spacing={2}>
                        <Grid item>
                            <h4>URL Path:</h4>
                        </Grid>
                        <Grid item>
                            <h5 className={classes.text}> {result.url}</h5>
                        </Grid>
                    </Grid>
                    <Grid container item direction={'row'} justify={'flex-start'} alignItems={'center'} spacing={2}>
                        <Grid item>
                            <h4>Severity:</h4>
                        </Grid>
                        <Grid item>
                            <h5 className={classes.text}> {result.severity}</h5>
                        </Grid>
                    </Grid>
                    <Grid container item direction={'row'} justify={'flex-start'} alignItems={'center'} spacing={2}>
                        <Grid item>
                            <h4>Request(Base64):</h4>
                        </Grid>
                        <Grid item>
                            <h5 className={classes.text}> {result.requestB64}</h5>
                        </Grid>
                    </Grid>
                    <Grid container item direction={'row'} justify={'flex-start'} alignItems={'center'} spacing={2}>
                        <Grid item>
                            <h4>Payload:</h4>
                        </Grid>
                        <Grid item>
                            <h5 className={classes.text}> {result.payload}</h5>
                        </Grid>
                    </Grid>
                    <Grid container item direction={'row'} justify={'flex-start'} alignItems={'center'} spacing={2}>
                        <Grid item>
                            <h4>Recommendation: </h4>
                        </Grid>
                        <Grid item>
                            <h5 className={classes.text}> {result.recommendation}</h5>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        );
    };

    return (
        <div>
            <Modal
                className={classes.modal}
                open={props.isOpen}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={props.isOpen}>
                    <div className={classes.paper}>{renderContent()}</div>
                </Fade>
            </Modal>
        </div>
    );
};

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        modal: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        paper: {
            backgroundColor: 'white',
            boxShadow: theme.shadows[5],
            width: '40%',
            height: '75%',
            borderRadius: 10,
            padding: theme.spacing(2, 4, 3),
            outline: 'none',
        },
        text: {
            color: '#757575',
        },
    }),
);

export default ResultsModal;
