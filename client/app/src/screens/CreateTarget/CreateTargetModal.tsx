import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import CreateTargetContent from './CreateTargetContent';
import { bindActionCreators, Dispatch } from 'redux';
import { RootState } from '../../state/rootReducer';
import {
    addTarget,
    updateTarget,
    selectAddTargetsInfo,
    selectUpdateTargetsInfo,
} from '../../state/targets/targets.slice';
import { connect } from 'react-redux';

interface OwnProps {
    isOpen: boolean;
    target?: Target;
    onClose: () => void;
}

interface ConnectedProps {
    addTargetInfo: { succeed?: boolean; error?: string };
    updateTargetInfo: { succeed?: boolean; error?: string };
}

interface DispatchProps {
    addTarget: ({ target }: AddTargetParams) => void;
    updateTarget: ({ target }: UpdateTargetParams) => void;
}

type Props = OwnProps & ConnectedProps & DispatchProps;

const CreateTargetModal: React.FC<Props> = props => {
    const classes = useStyles();

    const handleClose = () => {
        props.onClose();
    };

    const handOnTargetAdded = ({ target }: AddTargetParams) => {
        if (props.target) {
            // is edit mode
            props.updateTarget({ target });
        } else {
            props.addTarget({ target });
        }
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
                        <CreateTargetContent target={props.target} onTargetAdded={handOnTargetAdded} />
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
            width: '70%',
            height: '75%',
            borderRadius: 10,
            padding: theme.spacing(2, 4, 3),
            outline: 'none',
        },
    }),
);

function mapStateToProps(state: RootState, ownProps: OwnProps): ConnectedProps {
    return {
        addTargetInfo: selectAddTargetsInfo(state),
        updateTargetInfo: selectUpdateTargetsInfo(state),
    };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
    return bindActionCreators(
        {
            addTarget,
            updateTarget,
        },
        dispatch,
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateTargetModal);
