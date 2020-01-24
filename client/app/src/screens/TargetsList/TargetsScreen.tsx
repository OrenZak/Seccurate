import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TargetList from './components/TargetsList';
import MainButtons from './components/MainButtons';
import CreateTargetModal from '../CreateTarget';

const TargetsScreen: React.FC = () => {
    const classes = useStyles();
    const [openCrateTargetModal, setOpenCrateTargetModal] = useState(false);

    const onAddTargetClicked = () => {
        if (!openCrateTargetModal) {
            setOpenCrateTargetModal(true);
        }
    };

    const onEditTargetClicked = () => {};

    const onDeleteTargetClicked = () => {};

    const onItemSelected = (target: Target) => {
        alert(JSON.stringify(target));
    };

    const handleCreateTargetModalClose = () => {
        setOpenCrateTargetModal(false);
    };

    return (
        <div>
            <Grid container direction="row" spacing={4} className={classes.listFabContainer}>
                <Grid item xs={8}>
                    <TargetList onItemSelected={onItemSelected} />
                </Grid>
                <MainButtons
                    onAddTargetClicked={onAddTargetClicked}
                    onEditTargetClicked={onEditTargetClicked}
                    onDeleteTargetClicked={onDeleteTargetClicked}
                />
            </Grid>
            <div>
                <CreateTargetModal isOpen={openCrateTargetModal} onClose={handleCreateTargetModalClose} />
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

export default TargetsScreen;
