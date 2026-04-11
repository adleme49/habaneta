import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import Home from './pages/Home';

import './index.css';
import './theme/variables.css';

import { StoreProvider } from './store/store';

const App: React.FC = () => (
  <StoreProvider>
    <BrowserRouter>
      <Switch>
        <Route path="/home" component={Home} />
        <Route exact path="/" render={() => <Redirect to="/home" />} />
      </Switch>
    </BrowserRouter>
  </StoreProvider>
);

export default App;
