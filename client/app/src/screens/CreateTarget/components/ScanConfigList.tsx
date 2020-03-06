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
import {
    fetchAllConfigs,
    fetchNextConfigs,
    selectConfigs,
    selectFetchConfigsInfo,
    selectTotalConfigs,
} from '../../../state/configs/configs.slice';
import { RootState } from '../../../state/rootReducer';

interface OwnProps {
    onItemSelected: (target: ScanConfig) => void;
}

interface ConnectedProps {
    configs: ScanConfig[];
    fetch: { isLoading: boolean; error?: string };
    totalConfigs: number;
}

interface DispatchProps {
    fetchAllConfigs: ({ page, pageCount }: FetchAllConfigsParams) => void;
    fetchNextConfigs: ({ page, pageCount }: FetchAllConfigsParams) => void;
}

type Props = OwnProps & ConnectedProps & DispatchProps;

interface Column {
    id: 'id' | 'name';
    label: string;
    style?: object;
    align: 'right' | 'left' | 'center';
    format?: (value: number) => string;
}

const columns: Column[] = [
    { id: 'id', label: '#', style: { minWidth: 10 }, align: 'left' },
    { id: 'name', label: 'Config Name', style: { minWidth: '30', maxWidth: 30 }, align: 'left' },
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
        if (page < newPage) {
            if (props.configs.length < props.totalConfigs) {
                props.fetchNextConfigs({ page: newPage, pageCount: rowsPerPage });
            }
        }
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newRowsPerPage = +event.target.value;
        const currentConfigsCount = props.configs.length;
        if (currentConfigsCount < props.totalConfigs && currentConfigsCount < (page + 1) * newRowsPerPage) {
            props.fetchAllConfigs({ page: 0, pageCount: (page + 1) * newRowsPerPage });
        }
        if (props.totalConfigs <= (page + 1) * newRowsPerPage && page > 0) {
            setPage(page - 1);
        }
        setRowsPerPage(newRowsPerPage);
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
                                <TableCell key={column.id} align={column.align} style={column.style}>
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
                                    const key = page * rowsPerPage + index + 1;
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
                count={props.totalConfigs}
                rowsPerPage={rowsPerPage}
                page={page}
                labelRowsPerPage={'Per page'}
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
        totalConfigs: selectTotalConfigs(state),
    };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
    return bindActionCreators(
        {
            fetchAllConfigs,
            fetchNextConfigs,
        },
        dispatch,
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(ScanConfigList);
