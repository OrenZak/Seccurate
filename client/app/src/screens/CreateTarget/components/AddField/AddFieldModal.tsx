import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import AddFieldContent from './AddFieldContent';

interface Props {
    isOpen: boolean;
    onFieldsAdded: (fields: Field[]) => void;
    onClose: () => void;
}

const AddFieldModal: React.FC<Props> = props => {
    const classes = useStyles();

    const handleClose = () => {
        props.onClose();
    };

    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
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
                        <AddFieldContent onFieldsAdded={props.onFieldsAdded} />
                    </div>
                </Fade>
            </Modal>
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
            borderRadius: 10,
            padding: theme.spacing(2, 4, 3),
            outline: 'none',
        },
    }),
);

export default AddFieldModal;
