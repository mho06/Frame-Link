// src/pages/Login.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = e => {
    e.preventDefault();

    // Replace this with real auth logic
    if (email && password) {
      const user = { name: 'John Doe', role: 'user' }; // Fake user object
      if (onLogin) {
        onLogin(user); // Callback to set user in App state
      }
      navigate('/'); // Redirect to home
    } else {
      alert('Please enter email and password');
    }
  };

  const goToSignup = () => {
    navigate('/signup'); // Make sure /signup route exists
  };

  return (
    <div className="form-container">
      <h2 className="text-center mb-2">Welcome Back</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="login-email">Email</label>
          <input
            type="email"
            id="login-email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="login-password">Password</label>
          <input
            type="password"
            id="login-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
          Login
        </button>
      </form>
      <p className="text-center mt-2">
        Don’t have an account?{' '}
        <span className="nav-link nav-link-underline" onClick={goToSignup} style={{ cursor: 'pointer' }}>
          Sign Up
        </span>
      </p>
    </div>
  );
};

export default Login;
