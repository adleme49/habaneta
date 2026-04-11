import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Home from './pages/Home';
import Library from './pages/Library';

import './index.css';
import './theme/variables.css';

import { StoreProvider } from './store/store';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <StoreProvider>
      <BrowserRouter>
        <Switch>
          <Route path="/home" component={Home} />
          <Route path="/library" component={Library} />
          <Route exact path="/" render={() => <Redirect to="/home" />} />
        </Switch>
      </BrowserRouter>
    </StoreProvider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);

export default App;
