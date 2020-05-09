import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { Grid, Tooltip } from '@material-ui/core';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    result: Result;
}

const ResultsModal: React.FC<Props> = props => {
    const classes = useStyles();

    const handleClose = () => {
        props.onClose();
    };

    const renderAffectedUrlsSection = () => {
        return (
            <div>
                {renderRow('Affected Urls :')}
                <ul>
                    {renderAffectedUrlsList()}
                </ul>
            </div>
        );
    };

    const renderAffectedUrlsList = () => {
        return props.result.affected_urls.map((url: string, index: number) =>
            renderRow(
                '',
                    <h5 className={classes.text}>
                        {`${index + 1}. `}
                        {url}
                    </h5>
                ,
            ),
        );
    };

    const renderRecommendationList = () => {
        return props.result.recommendations.mitigations.map((mitigation: string, index: number) =>
            renderRow(
                '',
                <h5 className={classes.textList}>
                    {`${index + 1}. `}
                    {mitigation}
                </h5>
            ),
        );
    };

    const renderRecommendationSection = () => {
        return (
            <div>
                {renderRow(`Recommendations - ${props.result.recommendations.description}`)}
                <ul>
                    {renderRecommendationList()}
                </ul>
            </div>
        );
    };
    const renderRow = (title: string, value?: any) => {
        return (
            <li className={classes.main}>
                <h4 className={classes.title}>{title}</h4>
                {value}
            </li>
        );
    };

    const getDisplayableSeverity = (severity: number): string => {
        switch (severity) {
            case 1:
                return 'High';
            case 2:
                return 'Medium';
            case 3:
                return 'Low';
            default:
                return '';
        }
    };

    const renderContent = () => {
        const { result } = props;
        return (
            <Grid container direction={'row'} justify={'center'}
                style={{overflowY: 'scroll', height: '100%', width: '100%', padding: 10}}>
                <Grid item >
                    <h2>Results</h2>
                </Grid>
                <Grid container item direction={'column'} justify={'flex-start'} alignItems={'flex-start'}>
                    <ul style={{display: 'flex', flexDirection: 'column', flexWrap: 'wrap', justifyContent: 'space-around'}}>
                        {renderRow('Name:', <h5 className={classes.text}>{result.name}</h5>)}
                        {renderRow('Description:', <h5 className={classes.text}>{result.description}</h5>)}
                        {renderRow('Severity:', <h5 className={classes.text}>{getDisplayableSeverity(result.severity)}</h5>)}
                        {renderRow('Vulnerable Url:', <h5 className={classes.text}>{result.url}</h5>)}
                        {props.result.affected_urls && renderAffectedUrlsSection()}
                        {renderRow('Request(Base64):', <h5 className={classes.text}>{atob(result.requestB64)}</h5>)}
                        {renderRow('Payload:', <h5 className={classes.text}>{result.payload}</h5>)}
                        {renderRecommendationSection()}
                    </ul>
                </Grid>
            </Grid>
        );
    };

    return (
        <div>
            <Modal
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
                    <div className={classes.paper}>{renderContent()}</div>
                </Fade>
            </Modal>
        </div>
    );
};

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        modal: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        paper: {
            backgroundColor: 'white',
            boxShadow: theme.shadows[5],
            width: '50%',
            height: '75%',
            borderRadius: 10,
            outline: 'none',
        },
        text: {
            color: '#9AA0A0',
        },
        textList: {
            color: '#9AA0A0',
        },
        request: {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            width: '200px',
        },
        main: {
            display: 'flex',
            flexDirection: 'row',
            margin: -10,
            // backgroundColor: '#000fff'
        },
        title: {
            marginRight: 20,
            // backgroundColor: 'red'
        },
    }),
);

export default ResultsModal;
