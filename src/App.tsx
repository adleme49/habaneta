import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import Home from './pages/Home';

import './index.css';
import './theme/variables.css';

import GeneralState from './context/global/general.state';

const App: React.FC = () => (
  <GeneralState>
    <BrowserRouter>
      <Switch>
        <Route path="/home" component={Home} />
        <Route exact path="/" render={() => <Redirect to="/home" />} />
      </Switch>
    </BrowserRouter>
  </GeneralState>
);

export default App;
