import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
//import settings file
    import UserSettings from './user';
    import StoreSettings from './store';
//material-u
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import useStyles from './styles';
function Settings(props) {
    const {location, history} = props;

    const classes = useStyles();
    const handleChangeTab = (event, value) =>{
        history.push(value);
    }
    return (
        <Paper square>
            <Tabs indicatorColor="primary"  value={location.pathname} onChange={handleChangeTab}>
                <Tab label="Pengguna" value="/settings/user" />
                <Tab label="Toko" value="/settings/store" />
            </Tabs>
            <div className={classes.tabContent}>
                <Switch>
                    <Route path="/settings/user" component={UserSettings} />
                    <Route path="/settings/store" component={StoreSettings} />
                    <Redirect to="/settings/user" />
                </Switch>
            </div>

        </Paper>
    );
};

export default Settings;