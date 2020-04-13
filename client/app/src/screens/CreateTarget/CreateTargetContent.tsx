import { Button, Switch, FormLabel, RadioGroup, Radio } from '@material-ui/core';
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
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { SnackBarMessage } from '../../state/app/app.slice';
import EditConfigModal from './components/EditConfigModal';

interface Props {
    target?: Target;
    isEdit: boolean;
    onTargetAdded: ({ target }: AddTargetParams) => void;
    onSaveConfig: ({ name, config }: AddConfigParams) => void;
    onUpdateConfig: ({ name, config }: UpdateConfigParams) => void;
    onDeleteConfig: ({ id }: DeleteConfigParams) => void;
    onShowMessage: ({ text, type, duration }: SnackBarMessage) => void;
}

const CreateTargetContent: React.FC<Props> = props => {
    const classes = useStyles();

    const [target, setTarget] = useState<Target>(
        props.target || {
            description: '',
            url: '',
            name: '',
            scanType: 'ALL',
        },
    );

    const [isSaveChecked, setIsSaveChecked] = useState<boolean>(false);
    const [configName, setConfigName] = useState<string>();
    const [hasSiteLogin, setHasSiteLogin] = useState<boolean>(false);
    const [formAction, setFormAction] = useState<string>();
    const [authenticationType, setAuthenticationType] = useState<string>('Cookie');
    const [loginFormFields, setLoginFormFields] = useState<{ [key: string]: string }>();
    const [addFieldShow, setAddFieldShow] = useState<boolean>(false);
    const [selectedConfig, setSelectedConfig] = useState<ScanConfig>();
    const [editConfigModalShow, setEditConfigModalShow] = useState<boolean>(false);
    const [timeout, setConfigTimeout] = useState<number>();

    const handleScanTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const scanType: ScanType = event.target.value as ScanType;
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
        if (Number(event.target.value) !== NaN) {
            const interval = parseInt(event.target.value);
            const scanConfig: ScanConfig = Object.assign({}, target.config, { interval });
            setTarget({ ...target, config: scanConfig });
        }
    };
    const handleTimeoutChange = (event: React.ChangeEvent<{ value: string }>) => {
        if (Number(event.target.value) !== NaN) {
            const timeoutValue = parseInt(event.target.value);
            const timeout = timeoutValue * 1000;
            setConfigTimeout(timeoutValue);
            const scanConfig: ScanConfig = Object.assign({}, target.config, { timeout });
            setTarget({ ...target, config: scanConfig });
        }
    };

    const handleDepthChange = (event: React.ChangeEvent<{ value: string }>) => {
        if (Number(event.target.value) !== NaN) {
            const maxDepth = parseInt(event.target.value);
            const scanConfig: ScanConfig = Object.assign({}, target.config, { maxDepth });
            setTarget({ ...target, config: scanConfig });
        }
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

    const extractFormFields = (loginInfo: LoginInfo) => {
        console.log(loginInfo);
        setFormAction(loginInfo.formAction);
        setLoginFormFields(loginInfo.form);
    };

    useEffect(() => {
        if (target?.loginInfo) {
            const ent = Object.entries(target?.loginInfo!);
            if (ent.length > 0) {
                setHasSiteLogin(true);
                extractFormFields(target.loginInfo);
            }
        }
        if(target?.config?.timeout) {
            setConfigTimeout(target.config.timeout);
        }
    }, []);

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

    const setAuthenticationTypeInfo = (authenticationType: AuthenticationType) => {
        const loginInfo: LoginInfo = Object.assign({}, target.loginInfo, { authenticationType, form: loginFormFields });
        setTarget({ ...target, loginInfo });
    };

    const setLoginInfo = (info?: { [key: string]: string }) => {
        const loginInfo: LoginInfo = Object.assign({}, target.loginInfo, { form: info });
        setTarget({ ...target, loginInfo });
    };

    const handleAuthenticationChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newAuthenticationType = (event.target as HTMLInputElement).value;
        setAuthenticationType(newAuthenticationType);
        if (newAuthenticationType === 'Cookie') {
            setLoginFormFields({});
            setAuthenticationTypeInfo('Cookie');
        } else {
            setLoginFormFields({});
            if (newAuthenticationType === 'BasicAuth') {
                setLoginFormFields({ username: '', password: '' });
                setAuthenticationTypeInfo('BasicAuth');
            }
        }
    };

    const renderAuthenticationTypeRadio = () => {
        return (
            <FormControl component="fieldset" style={{ marginTop: 10 }}>
                <FormLabel component="legend">Authentication Type</FormLabel>
                <RadioGroup
                    aria-label="authenticationType"
                    name="authenticationType"
                    value={authenticationType}
                    onChange={handleAuthenticationChanged}
                >
                    <div style={{ flex: 1, flexDirection: 'column' }}>
                        <FormControlLabel value="Cookie" control={<Radio />} label="Cookie" disabled={!hasSiteLogin} />
                        <FormControlLabel
                            value="BasicAuth"
                            control={<Radio />}
                            label="BasicAuth"
                            disabled={!hasSiteLogin}
                        />
                    </div>
                </RadioGroup>
            </FormControl>
        );
    };

    const renderMainForm = () => {
        return (
            <form noValidate autoComplete="off">
                <TextField
                    label="Application MainURL"
                    placeholder={'Enter Application MainURL'}
                    fullWidth
                    value={target.url}
                    onChange={handleMainURLChange}
                />
                <TextField
                    label="Scan Name"
                    placeholder={'Enter Scan Name'}
                    fullWidth
                    value={target.name}
                    onChange={handleNameChange}
                />
                <TextField
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
                                    type={'number'}
                                    value={target.config?.maxDepth ?? ''}
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
                                    type={'number'}
                                    value={target.config?.interval ?? ''}
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
                                    type={'number'}
                                    value={timeout ?? ''}
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
                                        <MenuItem value={'ALL'}>All</MenuItem>
                                        <MenuItem value={'RXSS'}>RXSS</MenuItem>
                                        <MenuItem value={'SQLI'}>SQLI</MenuItem>
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

    const handleFormFieldChanged = (key: string, event: React.ChangeEvent<{ value: string }>) => {
        const newFields = {
            ...loginFormFields,
            [key]: event.target.value,
        };
        setLoginFormFields(newFields);
    };

    const renderLoginFormFieldList = () => {
        if (loginFormFields) {
            return Object.entries(loginFormFields).map(([key, value]) => {
                return (
                    <Grid item xs>
                        <TextField
                            label={`${key}`}
                            value={value}
                            disabled={!hasSiteLogin}
                            onChange={(event: React.ChangeEvent<{ value: string }>) => {
                                handleFormFieldChanged(key, event);
                            }}
                            fullWidth
                        />
                    </Grid>
                );
            });
        } else {
            return null;
        }
    };

    const renderAddLoginFormButton = () => {
        return (
            authenticationType === 'Cookie' && (
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
            )
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
                    {renderAuthenticationTypeRadio()}
                </Grid>
                <Grid item xs>
                    <TextField
                        label={'Form Action'}
                        value={formAction}
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
        setTarget({ ...target, config: scanConfig });
        if (!selectedConfig || scanConfig.id !== selectedConfig?.id) {
            console.log('selectedConfig: ', scanConfig);
            setSelectedConfig(scanConfig);
        } else {
            setSelectedConfig(undefined);
        }
    };

    const renderScanConfigList = () => {
        return <ScanConfigList onItemSelected={onScanConfigSelected} selectedConfig={selectedConfig} />;
    };

    const handleAddFields = (fields: Field[]) => {
        let simplifiedFields: { [key: string]: string } = {};
        fields.forEach((field: Field) => {
            simplifiedFields[field.name] = field.value;
        });

        setLoginFormFields(simplifiedFields);
        setAddFieldShow(false);
    };

    const verifyValues = () => {
        if (verifyTargetInfo() && verifyScanInfo() && verifyLoginInfo()) {
            props.onShowMessage({
                text: `Target was ${props.isEdit ? 'updated' : 'added'} successfully`,
                type: 'success',
                duration: 1000,
            });
            return true;
        }
        return false;
    };

    const verifyTargetInfo = () => {
        if (
            target.name.trim().length === 0 ||
            target.description.trim().length === 0 ||
            target.url.trim().length === 0
        ) {
            props.onShowMessage({ text: 'Please fill the target info ', type: 'error', duration: 1000 });
            return false;
        }
        return true;
    };

    const verifyScanInfo = () => {
        if (target.config) {
            if (!target.config.maxDepth || target.config.maxDepth < 1 || target.config.maxDepth > 10) {
                props.onShowMessage({ text: 'Depth should be between 1-10 value', type: 'error', duration: 1000 });
                return false;
            }
            if (!target.config.interval || target.config.interval < 250 || target.config.interval > 1000) {
                props.onShowMessage({
                    text: 'Interval should be between 250-1000 milliseconds',
                    type: 'error',
                    duration: 1000,
                });
                return false;
            }
            if (!target.config.timeout || target.config.timeout < 10000 || target.config.timeout > 30000) {
                props.onShowMessage({ text: 'Timeout should be between 10-30 seconds', type: 'error', duration: 1000 });
                return false;
            }
        } else {
            props.onShowMessage({ text: 'Please fill the scan info', type: 'error', duration: 1000 });
            return false;
        }

        if (isSaveChecked) {
            if (!configName || configName.trim().length === 0) {
                props.onShowMessage({ text: 'Please set the saved config name', type: 'error', duration: 1000 });
                return false;
            }
        }
        return true;
    };

    const verifyLoginInfo = () => {
        if (hasSiteLogin) {
            if (target.loginInfo === undefined) {
                props.onShowMessage({ text: 'Please fill site login info', type: 'error', duration: 1000 });
                return false;
            }
            if (!formAction || formAction.trim().length === 0) {
                props.onShowMessage({ text: 'Please fill form action', type: 'error', duration: 1000 });
                return false;
            }
            if (authenticationType === 'BasicAuth') {
                if (
                    !loginFormFields ||
                    loginFormFields.username === undefined ||
                    loginFormFields.password === undefined
                ) {
                    props.onShowMessage({ text: 'Please fill username and password', type: 'error', duration: 1000 });
                    return false;
                } else {
                    if (
                        !loginFormFields ||
                        loginFormFields.username.trim().length === 0 ||
                        loginFormFields.password.trim().length === 0
                    ) {
                        props.onShowMessage({
                            text: 'Please fill username and password',
                            type: 'error',
                            duration: 1000,
                        });
                        return false;
                    }
                }
            } else {
                if (loginFormFields === {} || loginFormFields === undefined) {
                    props.onShowMessage({ text: 'Please fill site login form info', type: 'error', duration: 1000 });
                    return false;
                }
            }
        }
        return true;
    };

    const getActionButtonText = () => (props.isEdit ? 'Update' : 'Add Target');

    const getTitleText = () => (props.isEdit ? 'Edit Target' : 'Add New Target');

    const onUpdateConfig = ({ name, config }: UpdateConfigParams) => {
        console.log('Create content onUpdateConfig');
        props.onUpdateConfig({ name, config });
        setTarget({ ...target, config });
        setSelectedConfig(undefined);
        setEditConfigModalShow(false);
    };

    const onUpdateConfigError = ({ err }: { err: string }) => {
        props.onShowMessage({ text: err, type: 'error' });
    };

    const editSelectedConfig = () => {
        setEditConfigModalShow(true);
    };

    const deleteSelectedConfig = () => {
        if (selectedConfig) {
            props.onDeleteConfig({ id: selectedConfig.id! });
            setSelectedConfig(undefined);
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
                    <h2>{getTitleText()}</h2>
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
                        <Grid
                            container
                            item
                            xs
                            justify={'flex-end'}
                            alignItems={'center'}
                            className={classes.configButtons}
                        >
                            <Grid item xs={3}>
                                <Button
                                    size="medium"
                                    variant="contained"
                                    color="primary"
                                    disabled={selectedConfig === undefined}
                                    onClick={() => {
                                        editSelectedConfig();
                                    }}
                                >
                                    <EditIcon />
                                </Button>
                            </Grid>
                            <Grid item xs={2}>
                                <Button
                                    size="medium"
                                    variant="contained"
                                    color="primary"
                                    disabled={selectedConfig === undefined}
                                    onClick={() => {
                                        deleteSelectedConfig();
                                    }}
                                >
                                    <DeleteIcon />
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container justify={'center'} alignItems={'center'} className={classes.bottomGrid}>
                <Grid item>
                    <Button
                        size="large"
                        variant="contained"
                        color="primary"
                        className={classes.addTargetButton}
                        onClick={() => {
                            if (verifyValues()) {
                                props.onTargetAdded({ target });

                                if (configName) {
                                    props.onSaveConfig({ name: configName, config: target.config! });
                                }
                            }
                        }}
                    >
                        {getActionButtonText()}
                    </Button>
                </Grid>
            </Grid>
            {selectedConfig && (
                <EditConfigModal
                    config={selectedConfig}
                    isOpen={editConfigModalShow}
                    onClose={() => setEditConfigModalShow(false)}
                    onError={onUpdateConfigError}
                    onUpdateConfig={onUpdateConfig}
                />
            )}
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
            width: '300px',
        },
        bottomGrid: {
            marginTop: theme.spacing(6),
        },
        configButtons: {
            marginTop: theme.spacing(2),
        },
    }),
);

export default CreateTargetContent;
