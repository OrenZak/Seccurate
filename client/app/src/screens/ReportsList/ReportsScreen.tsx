import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import ReportsList from './components/ReportsList';
import ReportModal from '../ReportModal';

const ReportsScreen: React.FC = () => {
    const classes = useStyles();
    const [showReportModal, setShowReportModal] = useState(false);

    const [fetchResultsLoading, setFetchResultsLoading] = useState(false);
    const [targetLoadingIndex, setTargetLoadingIndex] = useState(-1);
    const [targetResults, setTargetResults] = useState<Result[]>([
        {
            name: 'First Result',
            description: ' First Description',
            payload: 'some_payload',
            recommendation: 'Please do that',
            requestB64: '64',
            severity: '3',
            url: 'https://walla.com/path',
            vulnID: '1',
        },
        {
            name: 'Sec Result',
            description: ' Sec Description',
            payload: 'some_payload',
            recommendation: 'Please do that',
            requestB64: '642',
            severity: '2',
            url: 'https://walla.com/path2',
            vulnID: '1',
        },
    ]);

    const onTargetClicked = (target: Target, index: number) => {
        startLoader(index);
        fetchResults(target);
    };

    const handleReportModalClose = () => {
        setShowReportModal(false);
    };

    const renderReporModal = () => {
        if (targetResults) {
            return (
                <div>
                    <ReportModal isOpen={showReportModal} onClose={handleReportModalClose} results={targetResults} />
                </div>
            );
        }
    };

    const fetchResults = (target: Target) => {
        setTimeout(() => {
            setFetchResultsLoading(true);
            setShowReportModal(true);
            stopLoader();
        }, 1000);
    };

    const startLoader = (index: number) => {
        setFetchResultsLoading(true);
        setTargetLoadingIndex(index);
    };

    const stopLoader = () => {
        setFetchResultsLoading(false);
        setTargetLoadingIndex(-1);
    };

    return (
        <div>
            <Grid container direction="row" xs={12} spacing={4} className={classes.listFabContainer}>
                <Grid item>
                    <ReportsList onItemClicked={onTargetClicked} targetLoadingIndex={targetLoadingIndex} />
                </Grid>
            </Grid>
            {renderReporModal()}
        </div>
    );
};

const useStyles = makeStyles(_ => ({
    container: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 130,
    },
    listFabContainer: {
        marginLeft: '15%',
    },
}));

export default ReportsScreen;
