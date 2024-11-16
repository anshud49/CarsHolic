import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
    
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const logout = (event) => {
    event.preventDefault();

    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');

    if (accessToken && refreshToken) {
      fetch('https://carsholic.vercel.app/api/logout/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      })
        .then((response) => {
          if (response.ok || response.status === 205) {
            
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.setItem('isLoggedIn', 'false');
            setIsLoggedIn(false);
            navigate('/login');
          } else {
            console.error('Logout failed:', response.status);
          }
        })
        .catch((error) => {
          console.error('Logout error:', error);
        });
    } else {
      console.error('No tokens found.');
    }
  };

  return (
    <header>
      <Link to="/" className="logo">
        CarHolic
      </Link>
      <nav>
        {isLoggedIn ? (
          <>
            <Link to="/create">Create New Post</Link>
            <a href="/" onClick={logout}>
              Logout
            </a>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
