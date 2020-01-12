import React, { useState } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import DoneIcon from '@material-ui/icons/Done';

interface Props {
    onFieldsAdded: (fields: Field[]) => void;
}

const AddFieldContent: React.FC<Props> = props => {
    const [loginFormFields, setLoginFormFields] = useState([]);

    const renderLoginFormFieldList = () => {
        return loginFormFields.map((field: Field) => (
            <Grid container item direction={'row'} justify={'center'} alignItems={'center'}>
                <Grid item xs>
                    <TextField id="standard-basic" label={`${field.name}`} value={field.value} fullWidth />
                </Grid>
                <Grid item>
                    <Button disabled={false}>
                        <DeleteIcon />
                    </Button>
                </Grid>
            </Grid>
        ));
    };

    const renderNextField = () => {
        return (
            <Grid container item direction={'row'}>
                <Grid item>
                    <TextField size={'small'} id="field-name" label="Name" variant="outlined" />
                </Grid>
                <Grid item>
                    <TextField size={'small'} id="field-value" label="Value" variant="outlined" />
                </Grid>
                <Grid item>
                    <Button disabled={nextFieldEmpty}>
                        <DoneIcon />
                    </Button>
                </Grid>
            </Grid>
        );
    };

    return (
        <Grid container direction={'column'} justify={'center'} alignItems={'center'}>
            <Grid item>
                <h4>Add Login Form Field</h4>
            </Grid>
            {renderLoginFormFieldList()}
            {renderNextField()}
            <Grid item>
                <Button variant="contained" size={'medium'} color={'primary'}>
                    Done
                </Button>
            </Grid>
        </Grid>
    );
};

export default AddFieldContent;
