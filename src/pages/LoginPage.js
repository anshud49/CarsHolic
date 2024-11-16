import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import '../App.css';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); 

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLoginSubmit = async (event) => {
      event.preventDefault();
  

      setError(null);
  
      try {
          const response = await fetch('https://carsholic.vercel.app/api/login/', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ username, password }),  
          });
  
          const data = await response.json();
  
          if (!response.ok) {
              throw new Error(data.message || 'Invalid username or password');
          }
  
         
          if (data.access && data.refresh) {
              localStorage.setItem('access_token', data.access);
              localStorage.setItem('refresh_token', data.refresh);
              localStorage.setItem('isLoggedIn', 'true');
             
              navigate('/'); 
          } else {
              throw new Error('Missing tokens');
          }
      } catch (error) {
          console.error('Login failed:', error);
          setError(error.message || 'An error occurred');
          localStorage.setItem('isLoggedIn', 'false');
        
          setUsername('');  
          setPassword('');  
      }
  };
  

    return (
        <div className="container">
            <div className="inner-container">
                <img src="/static/ipo/assets/company-logo.png" className="site-logo" alt="Company Logo" />
                <form onSubmit={handleLoginSubmit} id="loginForm">
                    <div className="input-ele-container">
                        <label className="input-label" htmlFor="usernameInput">Username</label>
                        <input 
                            type="text" 
                            id="usernameInput" 
                            className="text-input" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)} 
                            autoComplete="username"
                        />
                    </div>
                    <div className="input-ele-container password-container">
                        <div className="pass-container">
                            <label className="input-label" htmlFor="passwordInput">Password</label>
                            <a href="/forgotpassword" className="forgot-password-link">Forgot Password?</a>
                        </div>
                        <input 
                            type={showPassword ? 'text' : 'password'} 
                            id="passwordInput" 
                            className="text-input" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} 
                            autoComplete="current-password"
                        />
                        <i 
                            className={`bi ${showPassword ? 'bi-eye' : 'bi-eye-slash'} toggle-password`} 
                            onClick={togglePasswordVisibility}
                        ></i>
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="login-button">Login</button>
                    <div className="or-container">
                        <div className="line"></div>
                        <div className="or-text">or sign in with</div>
                        <div className="line"></div>
                    </div>
                    <button className="google-button">
                        <img src="https://www.google.com/favicon.ico" alt="Google icon" width="20" height="20" />
                        Continue with Google
                    </button>
                    <div className="newaccount">
                        <a href="/newaccount">Create an account</a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
