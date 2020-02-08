import { Button, Switch } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import AddIcon from '@material-ui/icons/Add';
import React, { useEffect, useState } from 'react';
import AddFieldModal from './components/AddField/AddFieldModal';
import ScanConfigList from './components/ScanConfigList';

interface Props {
    target?: Target;
    onTargetAdded: ({ target }: AddTargetParams) => void;
}

const CreateTargetContent: React.FC<Props> = props => {
    const classes = useStyles();

    const [target, setTarget] = useState<Target>(
        props.target || {
            description: '',
            url: '',
            name: '',
            scanType: 'all',
        },
    );

    const [isSaveChecked, setIsSaveChecked] = useState<boolean>(false);
    const [configName, setConfigName] = useState<string>();
    const [hasSiteLogin, setHasSiteLogin] = useState<boolean>(false);
    const [formAction, setFormAction] = useState<string>('');
    const [loginFormFields, setLoginFormFields] = useState<{ [key: string]: string }>({ formAction: '' });
    const [addFieldShow, setAddFieldShow] = useState<boolean>(false);

    const handleScanTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const scanType: 'all' | 'rxss' | 'sqli' = event.target.value as ScanType;
        setTarget({ ...target, scanType });
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
        const loginInfo: LoginInfo = Object.assign({}, target.loginInfo, { form: info });
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
                    value={target.url}
                    onChange={handleMainURLChange}
                />
                <TextField
                    id="standard-basic"
                    label="Scan Name"
                    placeholder={'Enter Scan Name'}
                    fullWidth
                    value={target.name}
                    onChange={handleNameChange}
                />
                <TextField
                    id="standard-basic"
                    label="Scan Description"
                    placeholder={'Enter Scan Description'}
                    fullWidth
                    value={target.description}
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
                                    placeholder={'1-10'}
                                    size={'small'}
                                    value={target.config?.maxDepth}
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
                                    value={target.config?.interval}
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
                                    value={target.config?.timeout}
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
                                    <Select value={target.scanType} onChange={handleScanTypeChange}>
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

    const handleFormActionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const formAction = event.target.value as string;
        setFormAction(formAction);
        const loginInfo: LoginInfo = Object.assign({}, target.loginInfo, { formAction });
        setTarget({ ...target, loginInfo });
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
                <Grid item xs>
                    <TextField
                        id="standard-basic"
                        label={'Form Action'}
                        disabled={!hasSiteLogin}
                        fullWidth
                        onChange={handleFormActionChange}
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
        fields.forEach((field: Field) => {
            simpifiedFields[field.name] = field.value;
        });

        setLoginFormFields(simpifiedFields);
        setAddFieldShow(false);
    };

    const verifyValues = () => {
        if (hasSiteLogin && formAction.trim().length == 0) {
            return false;
        }

        if (isSaveChecked && configName?.trim().length == 0) {
            return false;
        }

        if (
            target.name.trim().length === 0 ||
            target.description.trim().length === 0 ||
            target.url.trim().length === 0
        ) {
            return false;
        }
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
                                onClick={() => {
                                    if (verifyValues()) {
                                        props.onTargetAdded({ target });
                                    }
                                }}
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
