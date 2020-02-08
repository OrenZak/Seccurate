import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import DoneIcon from '@material-ui/icons/Done';

interface Props {
    onFieldsAdded: (fields: Field[]) => void;
}

const AddFieldContent: React.FC<Props> = props => {
    const [nameField, setNameField] = useState<string>('');
    const [valueField, setValueField] = useState<string>('');
    const [loginFormFields, setLoginFormFields] = useState<Field[]>([]);
    const [nextFieldIsEmpty, setNextFieldIsEmpty] = useState<boolean>(true);

    const deleteField = (deleteIndex: number) => {
        const newList = loginFormFields.filter((_: Field, index: number) => index !== deleteIndex);
        setLoginFormFields(newList);
    };

    const renderLoginFormFieldList = () => {
        return loginFormFields.map((field: Field, index: number) => (
            <Grid container item direction={'row'} justify={'center'} alignItems={'center'}>
                <Grid item xs>
                    <TextField id="standard-basic" label={`${field.name}`} value={field.value} fullWidth />
                </Grid>
                <Grid item>
                    <Button onClick={() => deleteField(index)}>
                        <DeleteIcon />
                    </Button>
                </Grid>
            </Grid>
        ));
    };

    const handleNameChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.value as string;
        setNameField(name);
        setNextFieldIsEmpty(name.trim().length === 0 || valueField.trim().length === 0);
    };

    const handleValueChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value as string;
        setValueField(value);
        setNextFieldIsEmpty(nameField.trim().length === 0 || value.trim().length === 0);
    };

    const addNextField = () => {
        loginFormFields.push({ name: nameField, value: valueField });
        setNameField('');
        setValueField('');
    };

    const handleDoneClicked = () => {
        props.onFieldsAdded(loginFormFields);
    };

    const renderNextField = () => {
        return (
            <Grid container item direction={'row'} justify={'center'} alignItems={'center'} spacing={1}>
                <Grid item>
                    <TextField
                        size={'small'}
                        id="field-name"
                        label="Name"
                        value={nameField}
                        variant="outlined"
                        onChange={handleNameChanged}
                    />
                </Grid>
                <Grid item>
                    <TextField
                        size={'small'}
                        id="field-value"
                        label="Value"
                        value={valueField}
                        variant="outlined"
                        onChange={handleValueChanged}
                    />
                </Grid>
                <Grid item>
                    <Button disabled={nextFieldIsEmpty} onClick={addNextField}>
                        <DoneIcon />
                    </Button>
                </Grid>
            </Grid>
        );
    };

    return (
        <Grid container direction={'column'} justify={'center'} alignItems={'center'} spacing={2}>
            <Grid item>
                <h4>Add Login Form Field</h4>
            </Grid>
            {renderLoginFormFieldList()}
            {renderNextField()}
            <Grid item>
                <Button
                    variant="contained"
                    size={'medium'}
                    color={'primary'}
                    disabled={loginFormFields.length === 0}
                    onClick={handleDoneClicked}
                >
                    Done
                </Button>
            </Grid>
        </Grid>
    );
};

export default AddFieldContent;
