import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

interface Column {
    id: 'url' | 'name' | 'description' | 'num';
    label: string;
    minWidth?: number;
    align: 'right' | 'left' | 'center';
    format?: (value: number) => string;
}

const columns: Column[] = [
    { id: 'num', label: '#', minWidth: 10, align: 'left' },
    { id: 'url', label: 'MainUrl', minWidth: 100, align: 'center' },
    {
        id: 'name',
        label: 'Scan Name',
        minWidth: 170,
        align: 'center',
    },
    {
        id: 'description',
        label: 'Description',
        minWidth: 170,
        align: 'center',
    },
];

const useStyles = makeStyles({
    root: {
        width: '100%',
    },
    container: {
        minHeight: 500,
    },
});

interface Props {
    targets: Target[];
    onItemSelected: (target: Target) => void;
}

const TargetList: React.FC<Props> = props => {
    const classes = useStyles();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Paper className={classes.root}>
            <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map(column => (
                                <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.targets
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((target: Target, index: number) => {
                                const key = page * (index + 1) + index + 1;
                                return (
                                    <TableRow
                                        hover
                                        role="checkbox"
                                        selected={selectedIndex === key}
                                        tabIndex={-1}
                                        key={key}
                                        onClick={() => {
                                            if (selectedIndex === key) {
                                                setSelectedIndex(-1);
                                            } else {
                                                setSelectedIndex(key);
                                            }
                                            props.onItemSelected({ ...target });
                                        }}
                                    >
                                        {columns.map(column => {
                                            const value = column.id === 'num' ? key : target[column.id];
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    {column.format && typeof value === 'number'
                                                        ? column.format(value)
                                                        : value}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={props.targets.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </Paper>
    );
};

export default TargetList;
