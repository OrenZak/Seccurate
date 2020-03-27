import { Button, createStyles, Divider, Fab, makeStyles, Theme } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { RootState } from '../../state/rootReducer';
import { createUser, deleteUser, fetchAllUsers, selectUsers, updateUser } from '../../state/users/users.slice';
import AddUserModal from './components/AddUserModal';
import EditUserModal from './components/EditUserRoleModal';

interface OwnProps {}

interface ConnectedProps {
    users: User[];
}

interface DispatchProps {
    fetchAllUsers: () => void;
    createUser: ({ user }: CreateUserParams) => void;
    updateUser: ({ user }: UpdateUserParams) => void;
    deleteUser: ({ userName }: DeleteUserParams) => void;
}

type Props = OwnProps & ConnectedProps & DispatchProps;

const ManageUsersContent: React.FC<Props> = props => {
    const classes = useStyles();

    const [showAddUserModal, setShowAddUserModal] = useState<boolean>(false);
    const [showEditRoleModal, setShowEditRoleModal] = useState<boolean>(false);
    const [userToEdit, setUserToEdit] = useState<User>();

    useEffect(() => {
        props.fetchAllUsers();
    }, []);

    const handleEditClicked = (user: User) => {
        setUserToEdit(user);
        setShowEditRoleModal(true);
    };

    const handleDelete = (user: User) => {
        props.deleteUser({ userName: user.username });
    };

    const renderDivider = (index: number) => {
        if (index < props.users.length - 1) {
            return <div style={{ height: '1px', width: '100%', backgroundColor: '#D7D7D7' }} />;
        }
    };

    const renderUsersRows = () => {
        return props.users.map((user: User, index: number) => {
            return (
                <Grid container xs={12} item direction={'row'} justify={'center'} alignItems={'center'}>
                    <Grid item xs={4}>
                        <h5 className={classes.columnText}>{user.username}</h5>
                    </Grid>
                    <Grid item xs={4}>
                        <h5 className={classes.columnRole}>{user.role}</h5>
                    </Grid>
                    <Grid item xs={2}>
                        <Button onClick={() => handleEditClicked(user)}>
                            <EditIcon />
                        </Button>
                    </Grid>
                    <Grid item xs={2}>
                        <Button
                            onClick={() => {
                                if (window.confirm(`Are you sure you want to delete ${user.username} ?`)) {
                                    handleDelete(user);
                                }
                            }}
                        >
                            <DeleteIcon />
                        </Button>
                    </Grid>
                    {renderDivider(index)}
                </Grid>
            );
        });
    };

    const renderUsersList = () => {
        return (
            <Grid container item direction={'column'} style={{ width: '80%' }}>
                <Grid container item xs={12} direction={'row'}>
                    <Grid item sm={4}>
                        <h4 className={classes.columnTitle}>User Name</h4>
                    </Grid>
                    <Grid item sm={5}>
                        <h4 className={classes.columnTitle}>Role</h4>
                    </Grid>
                </Grid>
                {renderUsersRows()}
            </Grid>
        );
        // return (
        //     <Grid container item direction={'column'} style={{ width: '80%' }}>
        //         <Grid container item xs={12} direction={'row'} justify={'center'} alignItems={'center'}>
        //             <Grid item xs={12} sm={6}>
        //                 <h4 className={classes.columnTitle}>User Name</h4>
        //             </Grid>
        //             <Grid item xs={12} sm={6}>
        //                 <h4 className={classes.columnTitle}>Role</h4>
        //             </Grid>
        //         </Grid>
        //         {renderUsersRows()}
        //     </Grid>
        // );
    };

    return (
        <div>
            <Grid container direction={'column'} justify={'center'} alignItems={'center'}>
                <Grid item>
                    <h4>Manage Users</h4>
                </Grid>
                {renderUsersList()}
                <Fab
                    className={classes.fabYellow}
                    aria-label="add"
                    size={'small'}
                    onClick={() => {
                        setShowAddUserModal(true);
                    }}
                >
                    <AddIcon />
                </Fab>
            </Grid>
            <AddUserModal
                isOpen={showAddUserModal}
                close={() => setShowAddUserModal(false)}
                onCreateUser={(user: User) => {
                    props.createUser({ user });
                    setShowAddUserModal(false);
                }}
            />
            <EditUserModal
                isOpen={showEditRoleModal}
                close={() => setShowEditRoleModal(false)}
                user={userToEdit}
                onRoleChange={(updatedUser: User) => {
                    props.updateUser({ user: updatedUser });
                    setShowEditRoleModal(false);
                }}
            />
        </div>
    );
};

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        columnTitle: {
            margin: 0,
            textAlign: 'center',
            lineHeight: 3.5,
        },
        columnText: {
            margin: 0,
            textAlign: 'center',
            lineHeight: 3.5,
            color: '#757575',
        },
        columnRole: {
            margin: 0,
            marginLeft: '50%',
            marginRight: 10,
            textAlign: 'center',
            lineHeight: 3.5,
            color: '#757575',
        },
        fabYellow: {
            position: 'relative',
            float: 'right',
            backgroundColor: '#F6C74C',
            '&:hover': {
                backgroundColor: '#F6C74C',
                // Reset on touch devices, it doesn't add specificity
                '@media (hover: none)': {
                    backgroundColor: '#F6C74C',
                },
            },
        },
    }),
);

function mapStateToProps(state: RootState, ownProps: OwnProps): ConnectedProps {
    return {
        users: selectUsers(state),
    };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
    return bindActionCreators(
        {
            fetchAllUsers,
            createUser,
            updateUser,
            deleteUser,
        },
        dispatch,
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageUsersContent);
