import React from 'react';

//material -ui
import Container from '@material-ui/core/Container';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import useStyles from './styles';


function AppLoading() {
    const classes = useStyles();

    return (
        <Container maxWidth="xs">
            <div className={classes.loadingBox}>
                <Typography className={classes.title} variant="h6" component="h2">
                    Aplikasi Penjualan
                </Typography>
                <LinearProgress />
            </div>
        </Container>
    )
}

export default AppLoading; 