import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import '../App.css';
import Anshu from './Company.png';
import { GoogleLogin } from '@react-oauth/google';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const navigate = useNavigate();

    const togglePasswordVisibility1 = () => {
        setShowPassword1(!showPassword1);
    };
    const togglePasswordVisibility2 = () => {
        setShowPassword2(!showPassword2);
    };

    const handleRegisterSubmit = async (event) => {
        event.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await fetch('https://carsholic.vercel.app/api/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            navigate('/login');  // Redirect to login after successful registration
        } catch (error) {
            console.error('Registration failed:', error);
            setError(error.message || 'An error occurred');
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const response = await fetch('https://carsholic.vercel.app/api/auth/google/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: credentialResponse.credential }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Google login failed');
            }

            if (data.access && data.refresh) {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('access_token', data.access);
                localStorage.setItem('refresh_token', data.refresh);
                navigate('/');
            } else {
                throw new Error('Missing tokens');
            }
        } catch (error) {
            console.error('Google Login failed:', error);
            setError(error.message || 'An error occurred');
        }
    };

    return (
        <div className="container">
            <div className="inner-container">
                <img src={Anshu} className="site-logo" alt="Company Logo" />
                <form onSubmit={handleRegisterSubmit} id="registerForm">
                    <div className="input-ele-container">
                        <label className="input-label" htmlFor="usernameInput">Username</label>
                        <input
                            type="text"
                            id="usernameInput"
                            className="text-input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            autoComplete="username"
                            required
                        />
                    </div>
                    <div className="input-ele-container">
                        <label className="input-label" htmlFor="emailInput">Email</label>
                        <input
                            type="email"
                            id="emailInput"
                            className="text-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            required
                        />
                    </div>
                    <div className="input-ele-container password-container">
                        <label className="input-label" htmlFor="passwordInput">Password</label>
                        <input
                            type={showPassword1 ? 'text' : 'password'}
                            id="passwordInput"
                            className="text-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="new-password"
                            required
                        />
                        <i
                            className={`fa-regular ${showPassword1 ? 'fa-eye-slash' : 'fa-solid fa-eye'} toggle-password`}
                            onClick={togglePasswordVisibility1}
                        ></i>
                    </div>
                    <div className="input-ele-container password-container">
                        <label className="input-label" htmlFor="confirmPasswordInput">Confirm Password</label>
                        <input
                            type={showPassword2 ? 'text' : 'password'}
                            id="confirmPasswordInput"
                            className="text-input"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            autoComplete="new-password"
                            required
                        />
                        <i
                            className={`fa-regular ${showPassword2 ? 'fa-eye-slash' : 'fa-solid fa-eye'} toggle-password`}
                            onClick={togglePasswordVisibility2}
                        ></i>
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="login-button">Sign Up</button>

                    <div className="or-container">
                        <div className="line"></div>
                        <div className="or-text">or sign up with</div>
                        <div className="line"></div>
                    </div>

                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => console.log('Google Login Failed')}
                    />
                    <div className="newaccount">
                        Already have an account? <a href="/login">Login here</a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
