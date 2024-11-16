    import React, { useState } from 'react';
    import { useNavigate } from 'react-router-dom';
    import './LoginPage.css';
    import '../App.css';
    import Anshu from './Company.png'

    const RegisterPage = () => {
        const [username, setUsername] = useState('');
        const [password, setPassword] = useState('');
        const [email, setEmail] = useState('');
        const [confirmPassword, setConfirmPassword] = useState('');
        const [error, setError] = useState(null);
        const navigate = useNavigate();

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

            
                navigate('/login');
            } catch (error) {
                console.error('Registration failed:', error);
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
                        <div className="input-ele-container">
                            <label className="input-label" htmlFor="passwordInput">Password</label>
                            <input
                                type="password"
                                id="passwordInput"
                                className="text-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="new-password"
                                required
                            />
                        </div>
                        <div className="input-ele-container">
                            <label className="input-label" htmlFor="confirmPasswordInput">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPasswordInput"
                                className="text-input"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                autoComplete="new-password"
                                required
                            />
                        </div>
                        {error && <p className="error-message">{error}</p>}
                        <button type="submit" className="login-button">Register</button>
                        <div className="newaccount">
                            Already have an account? <a href="/login">Login here</a>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    export default RegisterPage;
