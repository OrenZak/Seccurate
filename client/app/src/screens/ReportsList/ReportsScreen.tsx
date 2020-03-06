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
    fetchNextCompletedScans,
    fetchScanResults,
    selectCompletedScans,
    selectScanResults,
} from '../../state/scans/scans.slice';

interface OwnProps {}

interface ConnectedProps {
    completedScans: { data: Scan[]; error?: string; totalCount: number };
    scanResults: { data: Result[]; error?: string };
}

interface DispatchProps {
    fetchCompletedScans: ({ page, pageCount }: FetchAllParams) => void;
    fetchNextCompletedScans: ({ page, pageCount }: FetchAllParams) => void;
    fetchScanResults: ({ scanId }: FetchScanResultsPayload) => void;
}

type Props = OwnProps & ConnectedProps & DispatchProps;
const ReportsScreen: React.FC<Props> = props => {
    const classes = useStyles();
    const { completedScans, scanResults } = props;
    const [showReportModal, setShowReportModal] = useState(false);
    const [targetLoadingIndex, setTargetLoadingIndex] = useState(-1);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        props.fetchCompletedScans({ page: 0, pageCount: 100 });
    }, []);

    useEffect(() => {
        console.log('scanResults updated: ', scanResults);
        if (scanResults.data && scanResults.data.length > 0) {
            setShowReportModal(true);
            stopLoader();
        }
    }, [scanResults]);

    const onTargetClicked = (scan: Scan, index: number) => {
        console.log('onTargetClicked ', scan);
        startLoader(index);
        fetchResults(scan);
    };

    const handleReportModalClose = () => {
        setShowReportModal(false);
    };

    const renderReportModal = () => {
        return (
            <div>
                <ReportModal isOpen={showReportModal} onClose={handleReportModalClose} results={scanResults.data} />
            </div>
        );
    };

    const fetchResults = (scan: Scan) => {
        props.fetchScanResults({ scanId: scan.scanID });
    };

    const startLoader = (index: number) => {
        setTargetLoadingIndex(index);
    };

    const stopLoader = () => {
        setTargetLoadingIndex(-1);
    };

    const handleOnChangePage = (newPage: number) => {
        if (page < newPage) {
            if (props.completedScans.data.length < props.completedScans.totalCount) {
                props.fetchNextCompletedScans({ page: newPage, pageCount: rowsPerPage });
            }
        }
        setPage(newPage);
    };

    const handleOnChangeRowsPerPage = (newRowsPerPage: number) => {
        const currentScansCount = props.completedScans.data.length;
        if (currentScansCount < props.completedScans.totalCount && currentScansCount < (page + 1) * newRowsPerPage) {
            props.fetchCompletedScans({ page: 0, pageCount: (page + 1) * newRowsPerPage });
        }
        if (props.completedScans.totalCount <= (page + 1) * newRowsPerPage && page > 0) {
            setPage(page - 1);
        }
        setRowsPerPage(newRowsPerPage);
    };

    return (
        <div>
            <Grid container direction="row" spacing={4} className={classes.listFabContainer}>
                <Grid item>
                    <ReportsList
                        completedScans={completedScans.data || []}
                        onItemClicked={onTargetClicked}
                        scanLoadingIndex={targetLoadingIndex}
                        page={page}
                        totalCompletedScans={completedScans.totalCount}
                        rowsPerPage={rowsPerPage}
                        onChangePage={handleOnChangePage}
                        onChangeRowsPerPage={handleOnChangeRowsPerPage}
                    />
                </Grid>
            </Grid>
            {renderReportModal()}
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
        completedScans: selectCompletedScans(state),
        scanResults: selectScanResults(state),
    };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
    return bindActionCreators(
        {
            fetchCompletedScans,
            fetchNextCompletedScans,
            fetchScanResults,
        },
        dispatch,
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportsScreen);
