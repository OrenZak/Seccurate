import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import ReportsList from './components/ReportsList';
import ReportModal from '../ReportModal';
import { RootState } from '../../state/rootReducer';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
    fetchCompletedScans,
    fetchScanResults,
    selectCompltedScans,
    selectScanResults,
} from '../../state/scans/scans.slice';

interface OwnProps {}

interface ConnectedProps {
    completedScans: { data: Scan[]; error?: string };
    scanResults: { data: Result[]; error?: string };
}

interface DispatchProps {
    fetchCompletedScans: ({ page, pageCount }: FetchAllParams) => void;
    fetchScanResults: ({ scanId }: FetchScanResultsPayload) => void;
}

type Props = OwnProps & ConnectedProps & DispatchProps;
const ReportsScreen: React.FC<Props> = props => {
    const classes = useStyles();
    const { completedScans, scanResults } = props;
    const [showReportModal, setShowReportModal] = useState(false);
    const [targetLoadingIndex, setTargetLoadingIndex] = useState(-1);

    useEffect(() => {
        props.fetchCompletedScans({ page: 0, pageCount: 10 });
    }, []);

    useEffect(() => {
        console.log('scanResults updated: ', scanResults);
        if (scanResults.data && scanResults.data.length > 0) {
            setShowReportModal(true);
            stopLoader();
        }
    }, [scanResults]);

    const onTargetClicked = (scan: Scan, index: number) => {
        startLoader(index);
        fetchResults(scan);
    };

    const handleReportModalClose = () => {
        setShowReportModal(false);
    };

    const renderReporModal = () => {
        return (
            <div>
                <ReportModal isOpen={showReportModal} onClose={handleReportModalClose} results={scanResults.data} />
            </div>
        );
    };

    const fetchResults = (scan: Scan) => {
        props.fetchScanResults({ scanId: scan.timestamp });
    };

    const startLoader = (index: number) => {
        setTargetLoadingIndex(index);
    };

    const stopLoader = () => {
        setTargetLoadingIndex(-1);
    };

    return (
        <div>
            <Grid container direction="row" spacing={4} className={classes.listFabContainer}>
                <Grid item>
                    <ReportsList
                        completedScans={completedScans.data || []}
                        onItemClicked={onTargetClicked}
                        scanLoadingIndex={targetLoadingIndex}
                    />
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

function mapStateToProps(state: RootState, ownProps: OwnProps): ConnectedProps {
    return {
        completedScans: selectCompltedScans(state),
        scanResults: selectScanResults(state),
    };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
    return bindActionCreators(
        {
            fetchCompletedScans,
            fetchScanResults,
        },
        dispatch,
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportsScreen);
