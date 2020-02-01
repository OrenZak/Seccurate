import React, { useState, useEffect } from 'react';
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

interface Props {
    onTargetAdded: ({ target }: AddTargetParams) => void;
}

const CreateTargetContent: React.FC<Props> = props => {
    const classes = useStyles();

    const [target, setTarget] = useState<Target>({
        description: '',
        url: '',
        name: '',
        scanType: 'all',
        config: {
            interval: 250,
            maxDepth: 3,
            timeout: 30,
        },
    });
    const [scanType, setScanType] = useState<string>('All');
    const [isSaveChecked, setIsSaveChecked] = useState<boolean>(false);
    const [configName, setConfigName] = useState<string>();
    const [hasSiteLogin, setHasSiteLogin] = useState<boolean>(false);
    const [loginFormFields, setLoginFormFields] = useState<{ [key: string]: string }>({});
    const [addFieldShow, setAddFieldShow] = useState<boolean>(false);

    const handleScanTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const scanTypeVal: 'all' | 'rxss' | 'sqli' = event.target.value as ScanType;
        setScanType(scanTypeVal);
        setTarget({ ...target, scanType: scanTypeVal });
    };

    const handleNameChange = (event: React.ChangeEvent<{ value: string }>) => {
        const name = event.target.value;
        setTarget({ ...target, name });
    };

    const handleMainURLChange = (event: React.ChangeEvent<{ value: string }>) => {
        const url = event.target.value;
        setTarget({ ...target, url });
    };

    const handleDescriptionChange = (event: React.ChangeEvent<{ value: string }>) => {
        const description = event.target.value;
        setTarget({ ...target, description });
    };

    const handleIntervalChange = (event: React.ChangeEvent<{ value: string }>) => {
        const interval = event.target.value;
        const scanConfig: ScanConfig = Object.assign({}, target.config, { interval });
        setTarget({ ...target, config: scanConfig });
    };
    const handleTimeoutChange = (event: React.ChangeEvent<{ value: string }>) => {
        const timeout = event.target.value;
        const scanConfig: ScanConfig = Object.assign({}, target.config, { timeout });
        setTarget({ ...target, config: scanConfig });
    };

    const handleDepthChange = (event: React.ChangeEvent<{ value: string }>) => {
        const maxDepth = event.target.value;
        const scanConfig: ScanConfig = Object.assign({}, target.config, { maxDepth });
        setTarget({ ...target, config: scanConfig });
    };

    const handleSaveCheckChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsSaveChecked(event.target.checked);
        const save = event.target.checked;
        const scanConfig: ScanConfig = Object.assign({}, target.config, { save });
        setTarget({ ...target, config: scanConfig });
    };

    const handleConfigNameChange = (event: React.ChangeEvent<{ value: string }>) => {
        setConfigName(event.target.value);
    };

    const handleHasSiteLoginChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setHasSiteLogin(event.target.checked);
        if (event.target.checked) {
            setLoginInfo(loginFormFields);
        } else {
            setLoginInfo();
        }
    };

    useEffect(() => {
        if (isSaveChecked) {
            const scanConfig: ScanConfig = Object.assign({}, target.config, { name: configName });
            setTarget({ ...target, config: scanConfig });
        } else {
            const scanConfig: ScanConfig = Object.assign({}, target.config, { name: undefined });
            setTarget({ ...target, config: scanConfig });
        }
    }, [isSaveChecked, configName]);

    useEffect(() => {
        setLoginInfo(loginFormFields);
    }, [loginFormFields]);

    const setLoginInfo = (info?: { [key: string]: string }) => {
        const loginInfo: LoginInfo = Object.assign({}, target.loginInfo, { form: info, formAction: 'walla.com' });
        setTarget({ ...target, loginInfo });
    };

    const renderMainForm = () => {
        return (
            <form noValidate autoComplete="off">
                <TextField
                    id="standard-basic"
                    label="Application MainURL"
                    placeholder={'Enter Application MainURL'}
                    fullWidth
                    onChange={handleMainURLChange}
                />
                <TextField
                    id="standard-basic"
                    label="Scan Name"
                    placeholder={'Enter Scan Name'}
                    fullWidth
                    onChange={handleNameChange}
                />
                <TextField
                    id="standard-basic"
                    label="Scan Description"
                    placeholder={'Enter Scan Description'}
                    fullWidth
                    onChange={handleDescriptionChange}
                />

                <Grid container direction={'column'}>
                    <Grid item>
                        <Grid container direction={'row'} alignItems={'center'}>
                            <Grid item xs>
                                <h5>Crawl Depth:</h5>
                            </Grid>
                            <Grid item xs>
                                <TextField
                                    id="standard-basic"
                                    placeholder={'1-10'}
                                    size={'small'}
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
                                    id="standard-basic"
                                    placeholder={'250-1000(milis)'}
                                    size={'small'}
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
                                    id="standard-basic"
                                    placeholder={'10-30(sec)'}
                                    size={'small'}
                                    onChange={handleTimeoutChange}
                                />
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
                            onChange={handleConfigNameChange}
                        />
                    </Grid>
                </Grid>
            </form>
        );
    };

    const renderLoginFormFieldList = () => {
        return Object.entries(loginFormFields).forEach(([key, value]) => {
            return (
                <Grid item xs>
                    <TextField id="standard-basic" label={`${key}`} value={value} disabled={!hasSiteLogin} fullWidth />
                </Grid>
            );
        });
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
        let simpifiedFields: { [key: string]: string } = {};
        const x = fields.map((field: Field) => {
            simpifiedFields[field.name] = field.value;
            return { [field.name]: field.value };
        });

        console.log(x);
        setLoginFormFields(simpifiedFields);
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
                                onClick={() => props.onTargetAdded({ target })}
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
