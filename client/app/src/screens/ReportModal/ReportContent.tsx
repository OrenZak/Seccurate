import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import { ListItem, ListItemIcon, ListItemText, Typography, Link, ListItemSecondaryAction } from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';

interface Props {
    results: Result[];
    onResultClicked: (result: Result) => void;
}

const ReportContent: React.FC<Props> = props => {
    const renderItem = ({ index }: ListChildComponentProps) => {
        const result = props.results[index];
        return (
            <ListItem key={result.vulnID}>
                <ListItemIcon>
                    <ErrorIcon />
                </ListItemIcon>
                <ListItemText primary={result.name + ' - ' + result.severity} secondary={result.url} />
                <ListItemText
                    primary={<Link>See more...</Link>}
                    onClick={() => {
                        props.onResultClicked(result);
                    }}
                />
            </ListItem>
        );
    };

    return (
        <Grid container direction={'column'} justify={'center'} alignItems={'center'}>
            <Grid item>
                <h2>Report</h2>
            </Grid>
            <Grid container item direction={'column'} justify={'flex-start'} alignItems={'flex-start'}>
                <Grid item>
                    <h4>Found Vulnerabilities:</h4>
                </Grid>
                <Grid item>
                    <FixedSizeList height={500} itemCount={props.results.length} itemSize={35} width={500}>
                        {renderItem}
                    </FixedSizeList>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default ReportContent;
