// PrivateRoute.js

import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  // console.log(isAuthenticated);
  // console.log((localStorage.getItem('token')?.token!=null||localStorage.getItem('token')?.token!=undefined)?true:false);
  return isAuthenticated ? children : <Navigate to="/" />;
};

export default PrivateRoute;