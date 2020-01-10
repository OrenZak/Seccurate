import React from 'react';
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
    id: 'mainUrl' | 'name' | 'desc' | 'num';
    label: string;
    minWidth?: number;
    align: 'right' | 'left' | 'center';
    format?: (value: number) => string;
}

const columns: Column[] = [
    { id: 'num', label: '#', minWidth: 10, align: 'left' },
    { id: 'mainUrl', label: 'MainUrl', minWidth: 100, align: 'center' },
    {
        id: 'name',
        label: 'Scan Name',
        minWidth: 170,
        align: 'center',
    },
    {
        id: 'desc',
        label: 'Description',
        minWidth: 170,
        align: 'center',
    },
];

interface Data {
    num: number;
    mainUrl: string;
    name: string;
    desc: string;
}

function createData(num: number, mainUrl: string, name: string, desc: string): Data {
    return { num, mainUrl, name, desc };
}

const rows = [createData(1, 'www.walla.com', 'first page', 'do all scan types')];

const useStyles = makeStyles({
    root: {
        width: '100%',
    },
    container: {
        minHeight: 500,
    },
});

interface Props {
    onItemSelected: (target: Target) => void;
}

const TargetList: React.FC<Props> = props => {
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

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
                        {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row: Data) => {
                            return (
                                <TableRow
                                    hover
                                    role="checkbox"
                                    tabIndex={-1}
                                    key={row.num}
                                    onClick={() => {
                                        props.onItemSelected({
                                            id: `${row.num}`,
                                            name: row.name,
                                            description: row.desc,
                                            mainURL: row.mainUrl,
                                            scanType: 'all',
                                        });
                                    }}
                                >
                                    {columns.map(column => {
                                        const value = row[column.id];
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
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </Paper>
    );
};

export default TargetList;
