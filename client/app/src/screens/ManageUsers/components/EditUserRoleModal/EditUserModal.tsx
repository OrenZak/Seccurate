import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { Grid, Button } from '@material-ui/core';

interface Props {
    isOpen: boolean;
    user?: User;
    close: () => void;
    onRoleChange: (user: User) => void;
}

const EditUserModal: React.FC<Props> = props => {
    const classes = useStyles();

    const renderContent = () => {
        if (props.user) {
            return (
                <Grid container direction={'column'} justify={'center'} alignItems={'center'}>
                    <Grid item>
                        <h4>Edit Role - {props.user.name}</h4>
                    </Grid>
                    <Grid container item direction={'row'} spacing={2} justify={'center'} alignItems={'center'}>
                        <Grid item>
                            <Button
                                color={'primary'}
                                variant={'contained'}
                                onClick={() => {
                                    if (props.user) {
                                        props.onRoleChange({
                                            id: props.user.id,
                                            name: props.user.name,
                                            role: 'Admin',
                                        });
                                    }
                                }}
                            >
                                Admin
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                color={'primary'}
                                variant={'contained'}
                                onClick={() => {
                                    if (props.user) {
                                        props.onRoleChange({
                                            id: props.user.id,
                                            name: props.user.name,
                                            role: 'User',
                                        });
                                    }
                                }}
                            >
                                User
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            );
        }
    };

    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={props.isOpen}
                onClose={props.close}
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
            borderRadius: 10,
            padding: theme.spacing(2, 4, 3),
            outline: 'none',
        },
    }),
);

export default EditUserModal;
