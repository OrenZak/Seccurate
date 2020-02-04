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
    deleteTarget,
    selectFetchTargetsInfo,
    selectDeleteTargetsInfo,
    selectTargets,
} from '../../state/targets/targets.slice';
import { connect } from 'react-redux';
import { selectIsLoggedIn } from '../../state/app/app.slice';

interface OwnProps {}

interface ConnectedProps {
    isLoggedIn: boolean;
    targets: Target[];
    fetch: { isLoading: boolean; error?: string };
    delete: { succeed?: boolean; error?: string };
}

interface DispatchProps {
    fetchAllTargets: ({ page, pageCount }: FetchAllParams) => void;
    deleteTarget: ({ id }: DeleteTargetParams) => void;
}

type Props = OwnProps & ConnectedProps & DispatchProps;

const TargetsScreen: React.FC<Props> = props => {
    const classes = useStyles();
    const [selectedTarget, setSelectedTarget] = useState<Target>();
    const [openCrateTargetModal, setOpenCrateTargetModal] = useState(false);

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
        }
    };

    const onItemSelected = (target: Target) => {
        console.log('target: ', target);
        setSelectedTarget(target);
    };

    const handleCreateTargetModalClose = () => {
        setOpenCrateTargetModal(false);
    };

    useEffect(() => {
        props.fetchAllTargets({ page: 0, pageCount: 10 });
    }, [props.isLoggedIn]);

    return (
        <div>
            <Grid container direction="row" spacing={4} className={classes.listFabContainer}>
                <Grid item xs={8}>
                    <TargetList targets={props.targets} onItemSelected={onItemSelected} />
                </Grid>
                <MainButtons
                    onAddTargetClicked={onAddTargetClicked}
                    onEditTargetClicked={onEditTargetClicked}
                    onDeleteTargetClicked={onDeleteTargetClicked}
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
        fetch: selectFetchTargetsInfo(state),
        delete: selectDeleteTargetsInfo(state),
    };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
    return bindActionCreators(
        {
            fetchAllTargets,
            deleteTarget,
        },
        dispatch,
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(TargetsScreen);
