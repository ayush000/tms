import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { isLoggedIn, logout, getUserProfile, ROLES } from '@utils/auth';

const redirectTo = (rest, pathname) => (
  <Route
    {...rest}
    render={(props) => (
      <Redirect to={{ pathname, state: { from: props.location } }} />
    )}
  />
);

const PrivateRoute = ({ component: Component, ...rest }) => {
  if (!isLoggedIn()) {
    logout();
    return redirectTo(rest, '/login');
  }

  const { acl } = rest;

  // if a basic user tries to access admin/manager accessible routes
  if (
    acl &&
    !acl.includes(ROLES.BASIC) &&
    getUserProfile().role === ROLES.BASIC
  ) {
    return redirectTo(rest, '/user');
  }

  // if a manager tries to access admin accessible routes
  if (
    acl &&
    !acl.includes(ROLES.MANAGER) &&
    getUserProfile().role === ROLES.MANAGER
  ) {
    return redirectTo(rest, '/dashboard');
  }

  // if an admin tries to access a basic users accessible routes (without ids)
  if (
    acl &&
    !acl.includes(ROLES.ADMIN) &&
    getUserProfile().role === ROLES.ADMIN
  ) {
    return redirectTo(rest, '/dashboard');
  }

  return <Route {...rest} render={(props) => <Component {...props} />} />;
};

export default PrivateRoute;
