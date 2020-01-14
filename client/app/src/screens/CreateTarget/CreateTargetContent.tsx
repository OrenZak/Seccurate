import React, { useState } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox';
import { Switch, Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import ScanConfigList from './components/ScanConfigList';
import AddFieldModal from './components/AddField/AddFieldModal';

interface Props {}

const CreateTargetContent: React.FC<Props> = props => {
    const classes = useStyles();

    const [scanType, setScanType] = useState<string>('All');
    const [isSaveChecked, setIsSaveChecked] = useState<boolean>(false);
    const [hasSiteLogin, setHasSiteLogin] = useState<boolean>(false);
    const [loginFormFields, setLoginFormFields] = useState<Field[]>([]);
    const [addFieldShow, setAddFieldShow] = useState<boolean>(false);

    const handleScanTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setScanType(event.target.value as string);
    };

    const handleSaveCheckChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsSaveChecked(event.target.checked);
    };

    const handleHasSiteLoginChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setHasSiteLogin(event.target.checked);
    };

    const renderMainForm = () => {
        return (
            <form noValidate autoComplete="off">
                <TextField
                    id="standard-basic"
                    label="Application MainURL"
                    placeholder={'Enter Application MainURL'}
                    fullWidth
                />
                <TextField id="standard-basic" label="Scan Name" placeholder={'Enter Scan Name'} fullWidth />
                <TextField
                    id="standard-basic"
                    label="Scan Description"
                    placeholder={'Enter Scan Description'}
                    fullWidth
                />

                <Grid container direction={'column'}>
                    <Grid item>
                        <Grid container direction={'row'} alignItems={'center'}>
                            <Grid item xs>
                                <h5>Crawl Depth:</h5>
                            </Grid>
                            <Grid item xs>
                                <TextField id="standard-basic" placeholder={'1-10'} size={'small'} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Grid container direction={'row'} alignItems={'center'}>
                            <Grid item xs>
                                <h5>Crawl Interval:</h5>
                            </Grid>
                            <Grid item xs>
                                <TextField id="standard-basic" placeholder={'250-1000(milis)'} size={'small'} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Grid container direction={'row'} alignItems={'center'}>
                            <Grid item xs>
                                <h5>Crawl Timeout:</h5>
                            </Grid>
                            <Grid item xs>
                                <TextField id="standard-basic" placeholder={'10-30(sec)'} size={'small'} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Grid container direction={'row'} alignItems={'center'}>
                            <Grid item xs>
                                <h5>Scan Type:</h5>
                            </Grid>
                            <Grid item xs>
                                <FormControl className={classes.formControl}>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={scanType}
                                        onChange={handleScanTypeChange}
                                    >
                                        <MenuItem value={'all'}>All</MenuItem>
                                        <MenuItem value={'rxx'}>RXSS</MenuItem>
                                        <MenuItem value={'sqli'}>SQLI</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid container direction={'column'} spacing={1}>
                    <Grid item xs>
                        <FormControlLabel
                            control={
                                <Checkbox checked={isSaveChecked} onChange={handleSaveCheckChange} color={'primary'} />
                            }
                            label="Save Scan Config"
                        />
                    </Grid>
                    <Grid item xs>
                        <TextField
                            id="standard-basic"
                            label="Config Name"
                            placeholder={'Enter Config Name'}
                            disabled={!isSaveChecked}
                            fullWidth
                        />
                    </Grid>
                </Grid>
            </form>
        );
    };

    const renderLoginFormFieldList = () => {
        return loginFormFields.map((field: Field) => (
            <Grid item xs>
                <TextField
                    id="standard-basic"
                    label={`${field.name}`}
                    value={field.value}
                    disabled={!hasSiteLogin}
                    fullWidth
                />
            </Grid>
        ));
    };

    const renderAddLoginFormButton = () => {
        return (
            <Button
                size="small"
                variant="contained"
                className={classes.button}
                startIcon={<AddIcon />}
                disabled={!hasSiteLogin}
                onClick={() => {
                    setAddFieldShow(true);
                }}
            >
                Add field
            </Button>
        );
    };

    const renderLoginSiteForm = () => {
        return (
            <Grid container direction={'column'} justify={'center'} alignItems={'center'}>
                <Grid item>
                    <FormControlLabel
                        control={<Switch checked={hasSiteLogin} onChange={handleHasSiteLoginChange} color="primary" />}
                        label="Site Login"
                    />
                </Grid>
                {renderLoginFormFieldList()}
                {renderAddLoginFormButton()}
            </Grid>
        );
    };

    const onScanConfigSelected = (scanConfig: ScanConfig) => {
        console.log(scanConfig);
    };

    const renderScanConfigList = () => {
        return <ScanConfigList onItemSelected={onScanConfigSelected} />;
    };

    const handleAddFields = (fields: Field[]) => {
        loginFormFields.push(...fields);
        setAddFieldShow(false);
    };

    return (
        <div>
            <AddFieldModal
                isOpen={addFieldShow}
                onClose={() => {
                    setAddFieldShow(false);
                }}
                onFieldsAdded={handleAddFields}
            />
            <Grid container direction={'column'} spacing={1} justify={'center'} alignItems={'center'}>
                <Grid item>
                    <h2>Add New Target</h2>
                </Grid>
                <Grid container item direction={'row'} spacing={3}>
                    <Grid item xs>
                        {renderMainForm()}
                    </Grid>
                    <Grid item xs>
                        {renderLoginSiteForm()}
                    </Grid>
                    <Grid container direction={'row'} item xs justify={'flex-end'} alignItems={'center'}>
                        <Grid item>{renderScanConfigList()}</Grid>
                        <Grid item>
                            <Button
                                size="medium"
                                variant="contained"
                                color="primary"
                                className={classes.addTargetButton}
                            >
                                Add Target
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
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
            width: '50%',
            height: '50%',
            borderRadius: 10,
            padding: theme.spacing(2, 4, 3),
            outline: 'none',
        },
        formControl: {
            margin: theme.spacing(1),
            minWidth: 100,
        },
        button: {
            marginTop: theme.spacing(2),
            margin: theme.spacing(1),
            backgroundColor: 'white',
        },
        addTargetButton: {
            marginTop: theme.spacing(2),
            margin: theme.spacing(1),
        },
    }),
);

export default CreateTargetContent;
