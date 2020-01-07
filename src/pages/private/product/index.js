import React from 'react';
import {Route, Switch} from 'react-router-dom';
import GridProduct from './grid';
import EditProduct from './edit';

function Product() {
    return (
        <Switch>
            <Route path="/product/edit/:productId" component={EditProduct} />
            <Route component={GridProduct}/>
        </Switch>
    )
}

export default Product;