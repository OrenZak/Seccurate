import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import ReportsList from './components/ReportsList';

const ReportsScreen: React.FC = () => {
    const classes = useStyles();
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportToShow, setReportToShow] = useState<Report>();

    const onReportClicked = (report: Report) => {
        setReportToShow(report);
        setShowReportModal(true);
    };

    const handleReportModalClose = () => {
        setShowReportModal(false);
    };

    return (
        <div>
            <Grid container direction="row" xs={12} spacing={4} className={classes.listFabContainer}>
                <Grid item>
                    <ReportsList onItemClicked={onReportClicked} />
                </Grid>
            </Grid>
            {/* <div>
                <ReportModal isOpen={showReportModal} onClose={handleReportModalClose} report={reportToShow}/>
            </div> */}
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
