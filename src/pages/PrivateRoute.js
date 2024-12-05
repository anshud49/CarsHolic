import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const [isValidToken, setIsValidToken] = useState(null);
  const access_token = localStorage.getItem('access_token');

  useEffect(() => {
    const checkTokenValidity = async () => {
      if (!access_token) {
        setIsValidToken(false);
        return;
      }

      try {
        const response = await fetch('https://carsholic.vercel.app/api/cars/', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        if (response.ok) {
          setIsValidToken(true);
        } else {
          setIsValidToken(false);
        }
      } catch (error) {
        setIsValidToken(false);
      }
    };

    checkTokenValidity();
  }, [access_token]);


  return isValidToken ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
