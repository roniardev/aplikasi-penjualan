import React from 'react';
import {Route, Switch} from 'react-router-dom';
    //import Private component
    import Settings from './settings';
    import Product from './product';
    import Transaction from './transaction';
    import Home from './home';

function Private() {
    return (
        <Switch>
            <Route path="/settings" component={Settings} />
            <Route path="/product" component={Product} />
            <Route path="/transaction" component={Transaction} />
            <Route component={Home} />
        </Switch>
    )
}

export default Private;