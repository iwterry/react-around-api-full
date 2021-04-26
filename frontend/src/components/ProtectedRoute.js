import React from 'react';
import { Route, Redirect } from 'react-router-dom';

function ProtectedRoute(props) {
  const { Component, ...otherPropsGiven } = props;
  const { path, isLoggedIn } = otherPropsGiven;

  return (
    <Route path={path}>
      {
        () => isLoggedIn ? <Component {...otherPropsGiven} /> : <Redirect to="/signin" />
      }
    </Route>
  );
}

export default ProtectedRoute;