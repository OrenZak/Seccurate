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
import { Typography, Link, CircularProgress } from '@material-ui/core';

// name: string;
// timestamp: string;
// description: string;
// maxDepth: string;
// timeout: string;
// interval: string;
// vulnsScanned: string;
// done: boolean;
// credentials: any;
// loginPage: any;
interface Column {
    // 'url  | 'scanType'
    id: 'num' | 'name' | 'description' | 'report';
    label: string;
    minWidth?: number;
    align: 'right' | 'left' | 'center';
}

const columns: Column[] = [
    { id: 'num', label: '#', minWidth: 10, align: 'left' },
    // { id: 'url', label: 'MainUrl', minWidth: 100, align: 'center' },
    {
        id: 'name',
        label: 'Scan Name',
        minWidth: 100,
        align: 'center',
    },
    {
        id: 'description',
        label: 'Description',
        minWidth: 170,
        align: 'center',
    },
    // {
    //     id: 'scanType',
    //     label: 'Scan Type',
    //     minWidth: 80,
    //     align: 'center',
    // },
    {
        id: 'report',
        label: 'Report',
        minWidth: 80,
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
    completedScans: Scan[];
    onItemClicked: (scan: Scan, index: number) => void;
    scanLoadingIndex: number;
}

const ReportsList: React.FC<Props> = props => {
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

    const renderValue = (column: Column, scan: Scan, index: number): any => {
        switch (column.id) {
            case 'report':
                if (props.scanLoadingIndex === index) {
                    return <CircularProgress />;
                } else {
                    return (
                        <Typography>
                            <Link href="#" onClick={() => props.onItemClicked(scan, index)}>
                                Show Report
                            </Link>
                        </Typography>
                    );
                }

            case 'num':
                return index;
            default:
                return scan[column.id];
        }
    };
    const { completedScans } = props;
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
                        {completedScans
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((scan: Scan, index: number) => {
                                console.log('page, index : ', page, index);
                                const key = page * rowsPerPage + index + 1;
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={key}>
                                        {columns.map((column: Column, index: number) => {
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    {renderValue(column, scan, key)}
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
                count={completedScans.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </Paper>
    );
};

export default ReportsList;
