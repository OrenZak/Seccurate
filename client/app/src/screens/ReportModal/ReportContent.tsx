import { Link, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import ErrorIcon from '@material-ui/icons/Error';
import React, { useEffect, useState } from 'react';
import { FixedSizeList, ListChildComponentProps } from 'react-window';

interface Props {
    results: Result[];
    onResultClicked: (result: Result) => void;
}

const ReportContent: React.FC<Props> = props => {
    const [screenWidth, setScreenWidth] = useState<number>(0);
    const [screenHeight, setScreenHeight] = useState<number>(0);

    const getDisplayableSeverity = (severity: number): string => {
        switch (severity) {
            case 1:
                return 'High';
            case 2:
                return 'Medium';
            case 3:
                return 'Low';
            default:
                return '';
        }
    };

    useEffect(() => {
        setScreenWidth(window.innerWidth);
        setScreenHeight(window.innerHeight);

    }, [])

    const renderItem = ({ style, index }: ListChildComponentProps) => {
        const result = props.results[index];
        return (
            <ListItem style={style} key={index}>
                <ListItemIcon>
                    <ErrorIcon />
                </ListItemIcon>
                <ListItemText
                    primary={result.name + ' - ' + getDisplayableSeverity(result.severity)}
                    secondary={result.url}
                    style={{width: screenWidth * 0.36}}
                />
                <ListItemText
                    primary={<Link>See more...</Link>}
                    onClick={() => {
                        props.onResultClicked(result);
                    }}
                    style={{width: screenWidth * 0.1}}
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
                    <FixedSizeList height={screenHeight * 0.65} width={screenWidth * 0.4} itemCount={props.results.length} itemSize={80} >
                        {renderItem}
                    </FixedSizeList>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default ReportContent;
