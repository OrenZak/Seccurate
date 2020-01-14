import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { Button, makeStyles, Theme, createStyles, Paper, Divider, Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import EditUserModal from './components/EditUserRoleModal';
import AddUserModal from './components/AddUserModal';

const ManageUsersContent: React.FC = _ => {
    const classes = useStyles();
    const [usersList, setUsersList] = useState<User[]>([
        { id: '1', name: 'orenz@seccurate.com', role: 'Admin' },
        { id: '2', name: 'zuru@seccurate.com', role: 'User' },
    ]);

    const [showAddUserModal, setShowAddUserModal] = useState<boolean>(false);
    const [showEditRoleModal, setShowEditRoleModal] = useState<boolean>(false);
    const [userToEdit, setUserToEdit] = useState<User>();

    const handleEdit = (user: User) => {
        setUserToEdit(user);
        setShowEditRoleModal(true);
    };

    const handleDelete = (user: User) => {
        const newList = usersList.filter((useri: User) => useri.id != user.id);
        setUsersList(newList);
    };

    const renderDivider = (index: number) => {
        if (index < usersList.length - 1) {
            return <div style={{ height: '1px', width: '100%', backgroundColor: '#D7D7D7' }} />;
        }
    };

    const renderUsersRows = () => {
        return usersList.map((user: User, index: number) => {
            return (
                <Grid container item xs={12} direction={'row'} justify={'center'} alignItems={'center'}>
                    <Grid item xs={12} sm={6}>
                        <h5 className={classes.columnText}>{user.name}</h5>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Grid container item xs={12} direction={'row'} justify={'center'} alignItems={'center'}>
                            <Grid item xs={10} sm={8}>
                                <h5 className={classes.columnRole}>{user.role}</h5>
                            </Grid>
                            <Grid item xs={6} sm={2}>
                                <Button onClick={() => handleEdit(user)}>
                                    <EditIcon />
                                </Button>
                            </Grid>
                            <Grid item xs={6} sm={2}>
                                <Button onClick={() => handleDelete(user)}>
                                    <DeleteIcon />
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Divider style={{ backgroundColor: 'red' }} />
                    {renderDivider(index)}
                </Grid>
            );
        });
    };

    const renderUsersList = () => {
        return (
            <Grid container item direction={'column'} style={{ width: '80%' }}>
                <Grid container item xs={12} direction={'row'} justify={'center'} alignItems={'center'}>
                    <Grid item xs={12} sm={6}>
                        <h4 className={classes.columnTitle}>Email</h4>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <h4 className={classes.columnTitle}>Role</h4>
                    </Grid>
                </Grid>
                {renderUsersRows()}
            </Grid>
        );
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
                onUserAdded={(user: User) => {
                    //TODO: handle add user
                }}
            />
            <EditUserModal
                isOpen={showEditRoleModal}
                close={() => setShowEditRoleModal(false)}
                user={userToEdit}
                onRoleChange={(updatedUser: User) => {
                    const newList = usersList.map((user: User) => {
                        return user.id === updatedUser.id ? updatedUser : user;
                    });
                    setUsersList(newList);
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

export default ManageUsersContent;
