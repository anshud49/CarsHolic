import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const access_token=localStorage.getItem('access_token');
  let isLoggedIn;
  if(access_token)
    isLoggedIn=true;
  isLoggedIn &= (localStorage.getItem('isLoggedIn') === 'true');
  return isLoggedIn ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
