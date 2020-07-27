import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Home from './components/Home';
import Wager from './components/Wager';
import Error from './components/Error';

class App extends Component {
  render() {
    return (
       <BrowserRouter>
        <div>
            <Switch>
             <Route path="/" component={Home} exact/>
             <Route path="/wager" component={Wager}/>
             <Route component={Error}/>
           </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
