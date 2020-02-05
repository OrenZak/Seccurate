import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { fetchAllConfigs, selectConfigs, selectFetchConfigsInfo } from '../../../state/configs/configs.slice';
import { RootState } from '../../../state/rootReducer';

interface OwnProps {
    onItemSelected: (target: ScanConfig) => void;
}

interface ConnectedProps {
    configs: ScanConfig[];
    fetch: { isLoading: boolean; error?: string };
}

interface DispatchProps {
    fetchAllConfigs: ({ page, pageCount }: FetchAllConfigsParams) => void;
}

type Props = OwnProps & ConnectedProps & DispatchProps;

interface Column {
    id: 'id' | 'name';
    label: string;
    minWidth?: number;
    align: 'right' | 'left' | 'center';
    format?: (value: number) => string;
}

const columns: Column[] = [
    { id: 'id', label: '#', minWidth: 10, align: 'left' },
    { id: 'name', label: 'Config Name', minWidth: 50, align: 'left' },
];

const useStyles = makeStyles({
    root: {
        width: '100%',
    },
    container: {
        minHeight: 500,
        maxHeight: 500,
    },
});

const ScanConfigList: React.FC<Props> = props => {
    const classes = useStyles();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    useEffect(() => {
        props.fetchAllConfigs({ page, pageCount: 10 });
    }, []);

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
                        {props.configs &&
                            props.configs
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((config: ScanConfig, index: number) => {
                                    const key = page * (index + 1) + index + 1;
                                    return (
                                        <TableRow
                                            hover
                                            role="checkbox"
                                            tabIndex={-1}
                                            key={key}
                                            onClick={() => {
                                                props.onItemSelected({ ...config });
                                            }}
                                        >
                                            {columns.map(column => {
                                                const value = column.id === 'id' ? key : config[column.id];
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
                count={(props.configs || []).length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </Paper>
    );
};

function mapStateToProps(state: RootState, ownProps: OwnProps): ConnectedProps {
    return {
        configs: selectConfigs(state),
        fetch: selectFetchConfigsInfo(state),
    };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
    return bindActionCreators(
        {
            fetchAllConfigs,
        },
        dispatch,
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(ScanConfigList);
