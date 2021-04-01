import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Mainnet from './components/mainnet';
import StatsDelphinet from './components/stats_delphinet';
import Home from './components/Home/Home';
import FAQ from './components/FAQ';
import Account from './components/Account';
//import Wager from './components/Wager';
import Error from './components/Error';

import './App.scss';

class App extends Component {
  render() {
    return (
       <BrowserRouter basename="/components">
        <div>
            <Switch>
             <Route path="/" component={Home} exact/>
             <Route path="/account" component={Account}/>
             <Route path="/FAQ" component={FAQ}/>
             <Route path="/mainnet" component={Mainnet}/>
             <Route path="/statsdelphinet" component={StatsDelphinet}/>
             <Route component={Error}/>
           </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
