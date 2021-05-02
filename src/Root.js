import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Stats from './components/Stats/Stats';
// import Stats from './components/Stats/stats-new';
import Home from './components/Home/Home';
import StakingOrders from './components/StakingOrders/StakingOrders';
import FAQ from './components/FAQ/Faq';

import Error from './components/Error';

import './scss/App.scss';

export default function Root() {
    return (
        <BrowserRouter basename="/">
            <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/mainnet" component={Home} />
                <Route exact path="/staking-orders" component={StakingOrders} />
                <Route exact path="/mainnet-stats" component={Stats} />
                <Route exact path="/testnet-stats" component={Stats} />
                <Route exact path="/faq" component={FAQ} />
                <Route component={Error} />
            </Switch>
        </BrowserRouter>
    );
}
