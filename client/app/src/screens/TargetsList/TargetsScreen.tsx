import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TargetList from './components/TargetsList';
import MainButtons from './components/MainButtons';
import CreateTargetModal from '../CreateTarget';
import { RootState } from '../../state/rootReducer';
import { Dispatch, bindActionCreators } from 'redux';
import {
    fetchAllTargets,
    fetchNextPage,
    deleteTarget,
    selectFetchTargetsInfo,
    selectDeleteTargetsInfo,
    selectTargets,
    selectTotalTargets,
} from '../../state/targets/targets.slice';
import { startScan, selectIsScanRunning, updateScanCompleted } from '../../state/scans/scans.slice';
import { connect } from 'react-redux';
import { selectIsLoggedIn } from '../../state/app/app.slice';
import { END_POINTS } from '../../config';
import { setTimeout } from 'timers';

interface OwnProps {}

interface ConnectedProps {
    isLoggedIn: boolean;
    targets: Target[];
    totalTargets: number;
    fetch: { isLoading: boolean; error?: string };
    delete: { succeed?: boolean; error?: string };
    isScanRunning: boolean;
}

interface DispatchProps {
    fetchAllTargets: ({ page, pageCount }: FetchAllParams) => void;
    fetchNextPage: ({ page, pageCount }: FetchAllParams) => void;
    deleteTarget: ({ id }: DeleteTargetParams) => void;
    startScan: ({ scanId, scanName }: StartScanPayload) => void;
    updateScanCompleted: () => void;
}

type Props = OwnProps & ConnectedProps & DispatchProps;

const TargetsScreen: React.FC<Props> = props => {
    const classes = useStyles();
    const [selectedTarget, setSelectedTarget] = useState<Target>();
    const [openCrateTargetModal, setOpenCrateTargetModal] = useState(false);
    const [shouldClearSelection, setShouldClearSelection] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const onAddTargetClicked = () => {
        if (!openCrateTargetModal) {
            setSelectedTarget(undefined); //remove selection
            setOpenCrateTargetModal(true);
        }
    };

    const onEditTargetClicked = () => {
        if (selectedTarget) {
            setOpenCrateTargetModal(true);
        }
    };

    const onDeleteTargetClicked = () => {
        if (selectedTarget && selectedTarget.scanID) {
            props.deleteTarget({ id: selectedTarget.scanID });
            setSelectedTarget(undefined);
        }
    };

    const onStartScanClicked = () => {
        if (selectedTarget) {
            props.startScan({ scanId: selectedTarget.scanID!, scanName: selectedTarget.name });
        }
    };

    const onItemSelected = (target: Target) => {
        if (selectedTarget?.scanID === target.scanID) {
            setSelectedTarget(undefined);
        } else {
            setSelectedTarget(target);
        }
    };

    const handleCreateTargetModalClose = () => {
        setOpenCrateTargetModal(false);
        setSelectedTarget(undefined);
        setShouldClearSelection(true);
        setTimeout(() => {
            setShouldClearSelection(false);
        }, 100)
    };

    useEffect(() => {
        props.fetchAllTargets({ page: 0, pageCount: 10 });
    }, [props.isLoggedIn]);

    useEffect(() => {
        const api_gateway = require('socket.io-client')(END_POINTS.gatewayURL);
        api_gateway.on('scan_completed', () => {
            props.updateScanCompleted();
        });
    }, []);

    const handleOnChangePage = (newPage: number) => {
        if (page < newPage) {
            if (props.targets.length < props.totalTargets) {
                props.fetchNextPage({ page: newPage, pageCount: rowsPerPage });
            }
        }
        setPage(newPage);
    };

    const handleOnChangeRowsPerPage = (newRowsPerPage: number) => {
        const currentTargetsCount = props.targets.length;
        if (currentTargetsCount < props.totalTargets && currentTargetsCount < (page + 1) * newRowsPerPage) {
            props.fetchAllTargets({ page: 0, pageCount: (page + 1) * newRowsPerPage });
        }
        if (props.totalTargets <= (page + 1) * newRowsPerPage && page > 0) {
            setPage(page - 1);
        }
        setRowsPerPage(newRowsPerPage);
    };

    return (
        <div>
            <Grid container direction="row" spacing={4} className={classes.listFabContainer}>
                <Grid item xs={8}>
                    <TargetList
                        targets={props.targets}
                        totalTargets={props.totalTargets}
                        onItemSelected={onItemSelected}
                        shouldClearSelection={shouldClearSelection}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        onChangePage={handleOnChangePage}
                        onChangeRowsPerPage={handleOnChangeRowsPerPage}
                    />
                </Grid>
                <MainButtons
                    showStartScan={!props.isScanRunning && selectedTarget !== undefined}
                    onAddTargetClicked={onAddTargetClicked}
                    onEditTargetClicked={onEditTargetClicked}
                    onDeleteTargetClicked={onDeleteTargetClicked}
                    onStartScanClicked={onStartScanClicked}
                />
            </Grid>
            <div>
                <CreateTargetModal
                    isOpen={openCrateTargetModal}
                    onClose={handleCreateTargetModalClose}
                    target={selectedTarget}
                />
            </div>
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
        isLoggedIn: selectIsLoggedIn(state),
        targets: selectTargets(state),
        totalTargets: selectTotalTargets(state),
        fetch: selectFetchTargetsInfo(state),
        delete: selectDeleteTargetsInfo(state),
        isScanRunning: selectIsScanRunning(state),
    };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
    return bindActionCreators(
        {
            fetchAllTargets,
            fetchNextPage,
            deleteTarget,
            startScan,
            updateScanCompleted,
        },
        dispatch,
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(TargetsScreen);
