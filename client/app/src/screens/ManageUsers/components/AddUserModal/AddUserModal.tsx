import React, { useState } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { Grid, Button, TextField, MenuItem, FormControl, Select } from '@material-ui/core';

interface Props {
    isOpen: boolean;
    close: () => void;
    onCreateUser: (user: User) => void;
}

const AddUserModal: React.FC<Props> = props => {
    const classes = useStyles();

    const [roleType, setRoleType] = useState<Role>('USER');
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleRoleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setRoleType(event.target.value as Role);
    };

    const handleUsernameChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        const username = event.target.value as string;
        setUsername(username);
    };

    const handlePasswordChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        const password = event.target.value as string;
        setPassword(password);
    };

    const renderContent = () => {
        return (
            <Grid container direction={'column'} justify={'center'} alignItems={'center'}>
                <Grid item>
                    <h4>Add User</h4>
                </Grid>
                <Grid container item direction={'row'} spacing={2} justify={'center'} alignItems={'center'}>
                    <Grid item>
                        <TextField placeholder={'Username'} value={username} onChange={handleUsernameChanged} />
                    </Grid>
                    <Grid item>
                        <TextField placeholder={'Password'} value={password} onChange={handlePasswordChanged} />
                    </Grid>
                    <Grid item>
                        <FormControl className={classes.formControl}>
                            <Select value={roleType} onChange={handleRoleChange}>
                                <MenuItem value={'ADMIN'}>Admin</MenuItem>
                                <MenuItem value={'USER'}>User</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid item>
                    <Button color={'primary'} variant={'contained'} disabled={username.trim().length === 0} onClick={() => {
                        props.onCreateUser({username, role: roleType, password})
                    }}>
                        Done
                    </Button>
                </Grid>
            </Grid>
        );
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
        formControl: {
            margin: theme.spacing(1),
            minWidth: 100,
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

export default AddUserModal;
