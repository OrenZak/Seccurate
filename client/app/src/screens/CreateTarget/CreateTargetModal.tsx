import React, {useEffect, useState} from 'react';
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
import { showMessage, SnackBarMessage } from '../../state/app/app.slice';
import { addConfig, updateConfig, deleteConfig } from '../../state/configs/configs.slice';
import { connect } from 'react-redux';
import {createHumanTarget} from '../../utils/typeConverter';

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
    addConfig: ({ name, config }: AddConfigParams) => void;
    updateConfig: ({ name, config }: UpdateConfigParams) => void;
    deleteConfig: ({ id }: DeleteConfigParams) => void;
    showMessage: ({ msg }: { msg: SnackBarMessage }) => void;
}

type Props = OwnProps & ConnectedProps & DispatchProps;

const CreateTargetModal: React.FC<Props> = props => {
    const classes = useStyles();
    const [selectedTarget, setSelectedTarget] = useState<Target>();

    const handleClose = () => {
        props.onClose();
    };

    useEffect(() => {
        if (props.isOpen && props.target) {
            setSelectedTarget(createHumanTarget(props.target));
        } else {
            setSelectedTarget(undefined);
        }
    }, [props.isOpen]);

    const handOnTargetAdded = ({ target }: AddTargetParams) => {
        if (selectedTarget) {
            // is edit mode
            props.updateTarget({ target });
            props.onClose();
        } else {
            props.addTarget({ target });
            props.onClose();
        }
    };

    const handleOnSaveConfig = ({ name, config }: AddConfigParams) => {
        props.addConfig({ name, config });
    };

    const handleOnUpdateConfig = ({ name, config }: UpdateConfigParams) => {
        props.updateConfig({ name, config });
    };

    const handleOnDeleteConfig = ({ id }: DeleteConfigParams) => {
        props.deleteConfig({ id });
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
                        <CreateTargetContent
                            target={selectedTarget}
                            isEdit={selectedTarget !== undefined}
                            onTargetAdded={handOnTargetAdded}
                            onSaveConfig={handleOnSaveConfig}
                            onUpdateConfig={handleOnUpdateConfig}
                            onDeleteConfig={handleOnDeleteConfig}
                            onShowMessage={({ text, type, duration }: SnackBarMessage) => {
                                props.showMessage({ msg: { text, type, duration } });
                            }}
                        />
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
            addConfig,
            updateConfig,
            deleteConfig,
            showMessage,
        },
        dispatch,
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateTargetModal);
