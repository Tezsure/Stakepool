import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Home from './components/Home';
import Account from './components/Account';
//import Wager from './components/Wager';
import Error from './components/Error';

class App extends Component {
  render() {
    return (
       <BrowserRouter basename="/components">
        <div>
            <Switch>
             <Route path="/" component={Home} exact/>
             <Route path="/account" component={Account}/>
             <Route component={Error}/>
           </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
