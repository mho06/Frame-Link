import React, { useState } from 'react';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    // Fake login logic (replace with real one)
    if (email && password) {
      onLogin({ name: 'John Doe', role: 'user' }); // Sample user object
    } else {
      alert('Please enter email and password');
    }
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
        Don’t have an account? <span className="nav-link" onClick={() => onLogin(null)}>Sign Up</span>
      </p>
    </div>
  );
};

export default LoginPage;
