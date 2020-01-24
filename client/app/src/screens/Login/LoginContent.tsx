import React, { useState } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { Button, FormHelperText, FormControl } from '@material-ui/core';

interface Props {
    loginError?: string;
    loginLoading: boolean;
    onLoginSubmit: ({ username, password }: { username: string; password: string }) => void;
}

enum FIELD_ERRORS {
    'empty',
    'not according to rules',
    'none',
}

interface Errors {
    usernameError: FIELD_ERRORS;
    passwordError: FIELD_ERRORS;
}

const LoginContent: React.FC<Props> = props => {
    const classes = useStyles();

    const [username, setUserName] = useState();
    const [password, setPassword] = useState();
    const [errors, setErrors] = useState<Errors>({
        usernameError: FIELD_ERRORS.empty,
        passwordError: FIELD_ERRORS.empty,
    });

    const handleSubmit = () => {
        props.onLoginSubmit({ username, password });
    };

    const handleUsernameChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        const username = event.target.value;
        setUserName(username);
        setUsernameError(username);
    };

    const setUsernameError = (username: string) => {
        if (username && username.length > 5) {
            setErrors({
                usernameError: FIELD_ERRORS.none,
                passwordError: errors.passwordError,
            });
        } else {
            if (!!username || username.length === 0) {
                setErrors({
                    usernameError: FIELD_ERRORS.empty,
                    passwordError: errors.passwordError,
                });
            } else {
                setErrors({
                    usernameError: FIELD_ERRORS['not according to rules'],
                    passwordError: errors.passwordError,
                });
            }
        }
    };

    const handlePasswordChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        const password = event.target.value;
        setPassword(event.target.value);
        setPasswordError(password);
    };

    const setPasswordError = (password: string) => {
        if (password && password.length >= 5) {
            setErrors({
                usernameError: errors.usernameError,
                passwordError: FIELD_ERRORS.none,
            });
        } else {
            if (!!password || password.length === 0) {
                setErrors({
                    usernameError: errors.usernameError,
                    passwordError: FIELD_ERRORS.empty,
                });
            } else {
                setErrors({
                    usernameError: errors.usernameError,
                    passwordError: FIELD_ERRORS['not according to rules'],
                });
            }
        }
    };

    return (
        <Grid container direction={'column'} justify={'center'} alignItems={'center'}>
            <Grid item xs>
                <h2> Login </h2>
            </Grid>
            <Grid item xs className={classes.formContainer}>
                <Grid item xs>
                    <TextField id="standard-basic" label="Username" fullWidth onChange={handleUsernameChanged} />
                </Grid>
                <Grid item xs>
                    <FormControl fullWidth>
                        <TextField
                            id="standard-basic"
                            label="Password"
                            type={'password'}
                            onChange={handlePasswordChanged}
                        />
                        <FormHelperText error>
                            {props.loginError && !props.loginLoading ? props.loginError : ''}
                        </FormHelperText>
                    </FormControl>
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
                        Login
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    );
};

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formContainer: {
            width: '80%',
        },
        button: {
            marginTop: theme.spacing(4),
            marginRight: theme.spacing(4),
        },
    }),
);

export default LoginContent;
