import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';

import LoadComponent from '@components/LoadComponent';
import PrivateRoute from '@components/PrivateRoute';
import { GlobalStyle } from '@styled';
import { history } from '@utils/history';

const Home = LoadComponent(() => import('@routes/Home'));
const Login = LoadComponent(() => import('@routes/Login'));
const Register = LoadComponent(() => import('@routes/Register'));

const App = () => {
  return (
    <>
      <GlobalStyle />
      <Router history={history}>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <PrivateRoute path="/" component={Home} />
        </Switch>
      </Router>
    </>
  );
};

export default App;
