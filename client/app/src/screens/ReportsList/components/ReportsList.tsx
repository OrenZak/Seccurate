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
import { Typography, Link } from '@material-ui/core';

interface Column {
    id: 'id' | 'mainUrl' | 'name' | 'desc' | 'num' | 'scanType' | 'report';
    label: string;
    minWidth?: number;
    align: 'right' | 'left' | 'center';
}

const columns: Column[] = [
    { id: 'num', label: '#', minWidth: 10, align: 'left' },
    { id: 'mainUrl', label: 'MainUrl', minWidth: 100, align: 'center' },
    {
        id: 'name',
        label: 'Scan Name',
        minWidth: 100,
        align: 'center',
    },
    {
        id: 'desc',
        label: 'Description',
        minWidth: 170,
        align: 'center',
    },
    {
        id: 'scanType',
        label: 'Scan Type',
        minWidth: 80,
        align: 'center',
    },
    {
        id: 'report',
        label: 'Report',
        minWidth: 80,
        align: 'center',
    },
];

function createData(
    id: string,
    mainUrl: string,
    name: string,
    desc: string,
    scanType: ScanType
): Report {
    return { id, mainUrl, name, desc, scanType };
}

const rows = [createData('id_29348','www.walla.com', 'first page', 'do all scan types', 'all')];

const useStyles = makeStyles({
    root: {
        width: '100%',
    },
    container: {
        minHeight: 500,
    },
});

interface Props {
    onItemClicked: (report: Report) => void;
}

const ReportsList: React.FC<Props> = (props) => {
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

    const renderValue = (column: Column, report: Report, index: number): any => {
        switch (column.id) {
            case 'report':
                return (
                    <Typography>
                        <Link href="#" onClick={() => props.onItemClicked(report)}>
                            Show Report
                        </Link>
                    </Typography>
                );
            case 'num':
                return index;;
            default:
                return report[column.id];
        }
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
                        {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row: Report) => {
                            return (
                                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                    {columns.map((column: Column, index: number) => {
                                        return (
                                            <TableCell key={column.id} align={column.align}>
                                                {renderValue(column, row, index)}
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

export default ReportsList;
