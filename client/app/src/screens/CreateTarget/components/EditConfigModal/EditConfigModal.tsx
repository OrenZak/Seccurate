import React, { useState, useEffect } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { Grid, Button, TextField } from '@material-ui/core';

interface Props {
    config?: ScanConfig;
    isOpen: boolean;
    onClose: () => void;
    onUpdateConfig: ({ name, config }: UpdateConfigParams) => void;
    onError: ({ err }: { err: string }) => void;
}

const EditConfigModal: React.FC<Props> = props => {
    const classes = useStyles();

    const [configName, setConfigName] = useState(props.config?.name ?? '');
    const [maxDepth, setMaxDepth] = useState<number | undefined>();
    const [interval, setTheInterval] = useState<number | undefined>();
    const [timeout, setTheTimeout] = useState<number | undefined>();

    useEffect(() => {
        const { config } = props;
        setConfigName(config?.name ?? '');
        setMaxDepth(config?.maxDepth);
        setTheInterval(config?.interval);
        setTheTimeout(config?.timeout);
    }, [props.config]);

    const handleClose = () => {
        props.onClose();
    };

    const handleNameChange = (event: React.ChangeEvent<{ value: string }>) => {
        setConfigName(event.target.value);
    };

    const handleDepthChange = (event: React.ChangeEvent<{ value: string }>) => {
        setMaxDepth(+event.target.value);
    };

    const handleIntervalChange = (event: React.ChangeEvent<{ value: string }>) => {
        setTheInterval(+event.target.value);
    };

    const handleTimeoutChange = (event: React.ChangeEvent<{ value: string }>) => {
        setTheTimeout(+event.target.value);
    };

    const isValid = (): { err: string | undefined } => {
        if (configName.trim().length === 0) {
            return { err: 'Name could not be empty' };
        }

        if (maxDepth === undefined || maxDepth > 10 || maxDepth < 1) {
            return { err: 'Depth should be between 1-10 ' };
        }

        if (interval === undefined || interval > 1000 || interval < 250) {
            return { err: 'Interval should be between 250-1000 miliseconds' };
        }

        if (timeout === undefined || timeout > 30 || timeout < 10) {
            return { err: 'Timeout should be between 10-30 seconds' };
        }
        return { err: undefined };
    };

    const handleSubmit = () => {
        const { err } = isValid();
        if (!err && interval && timeout && maxDepth) {
            props.onUpdateConfig({
                name: configName,
                config: {
                    ...props.config,
                    interval,
                    timeout,
                    maxDepth,
                },
            });
        } else {
            if (err) {
                props.onError({ err });
            }
        }
    };

    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
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
                    <div className={classes.paper}>
                        <Grid container direction={'column'} justify={'center'} alignItems={'center'}>
                            <Grid item xs>
                                <h2> Update Config </h2>
                            </Grid>
                            <Grid item xs className={classes.formContainer}>
                                <Grid item xs>
                                    <TextField
                                        label="Scan Name"
                                        value={configName}
                                        fullWidth
                                        onChange={handleNameChange}
                                    />
                                </Grid>
                                <Grid item>
                                    <Grid container direction={'row'} alignItems={'center'}>
                                        <Grid item xs>
                                            <h5>Crawl Depth:</h5>
                                        </Grid>
                                        <Grid item xs>
                                            <TextField
                                                placeholder={'1-10'}
                                                size={'small'}
                                                value={maxDepth}
                                                onChange={handleDepthChange}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <Grid container direction={'row'} alignItems={'center'}>
                                        <Grid item xs>
                                            <h5>Crawl Interval:</h5>
                                        </Grid>
                                        <Grid item xs>
                                            <TextField
                                                placeholder={'250-1000(milis)'}
                                                size={'small'}
                                                value={interval}
                                                onChange={handleIntervalChange}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <Grid container direction={'row'} alignItems={'center'}>
                                        <Grid item xs>
                                            <h5>Crawl Timeout:</h5>
                                        </Grid>
                                        <Grid item xs>
                                            <TextField
                                                placeholder={'10-30(sec)'}
                                                size={'small'}
                                                value={timeout}
                                                onChange={handleTimeoutChange}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid container item xs justify={'flex-end'} alignItems={'center'}>
                                <Grid item>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        color={'primary'}
                                        onClick={handleSubmit}
                                        className={classes.button}
                                    >
                                        Update
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </div>
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
            borderRadius: 10,
            padding: theme.spacing(2, 4, 3),
            outline: 'none',
        },
        formContainer: {
            minWidth: '300px',
        },
        button: {
            marginTop: theme.spacing(4),
            marginRight: theme.spacing(4),
        },
    }),
);

export default EditConfigModal;
