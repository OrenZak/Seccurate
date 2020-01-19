import React, { useState } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import ReportContent from './ReportContent';
import ResultsModal from './ResultsModal';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    results: Result[];
}

const ReportModal: React.FC<Props> = props => {
    const classes = useStyles();

    const [resultToShow, setResultToShow] = useState<Result>();
    const [showResultModal, setShowResultModal] = useState(false);

    const handleClose = () => {
        props.onClose();
    };

    const renderResultModal = () => {
        if (resultToShow) {
            return (
                <ResultsModal
                    isOpen={showResultModal}
                    onClose={() => {
                        setShowResultModal(false);
                        setResultToShow(undefined);
                    }}
                    result={resultToShow}
                />
            );
        }
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
                    <div className={classes.paper}>
                        <ReportContent
                            results={props.results}
                            onResultClicked={(result: Result) => {
                                setResultToShow(result);
                                setShowResultModal(true);
                            }}
                        />
                    </div>
                </Fade>
            </Modal>
            {renderResultModal()}
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
            width: '40%',
            height: '75%',
            borderRadius: 10,
            padding: theme.spacing(2, 4, 3),
            outline: 'none',
        },
    }),
);

export default ReportModal;
