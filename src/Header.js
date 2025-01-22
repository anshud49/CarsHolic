import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './App.css';
import Anshu from './pages/Company.png';


function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      const storedIsLoggedIn = localStorage.getItem('isLoggedIn');
      setIsLoggedIn(storedIsLoggedIn === 'true');
    };
  
    handleStorageChange(); 

    window.addEventListener('storage', handleStorageChange);
  
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
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
        <img src={Anshu} className="site-logoHeader" alt="Company Logo" />
      </Link>
     
      <nav>
      <Link  className="headlinks"  to="/explore">Explore</Link>
        {isLoggedIn ? (
          <>
            <Link className="headlinks" to="/post">Your Cars</Link>
            <Link className="headlinks" to="/create">Create Post</Link>
            <a href="/" className="headlinks"  onClick={logout}>
              Logout
            </a>
          </>
        ) : (
          <>
            <Link className="headlinks" to="/login">Login</Link>
            <Link className="headlinks" to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;







