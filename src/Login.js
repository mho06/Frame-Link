import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabase'; // make sure this file is inside /src

const Login = ({ onLogin }) => {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // 1. Authenticate with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail.trim(),
      password: loginPassword,
    });

    if (error) {
      alert(error.message);
      return;
    }

    // 2. Fetch user profile from `profiles` table using user ID
    const userId = data?.user?.id;
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError || !profileData) {
      alert('Logged in, but profile not found.');
      console.error(profileError);
      return;
    }

    // 3. Pass user data to App
    const userData = {
      id: userId,
      email: profileData.email,
      name: profileData.full_name || 'User',
      role: profileData.role || 'user',
      country: profileData.country || '',
    };

    onLogin(userData); // send to App.js
    navigate('/');
  };

  return (
    <div className="page">
      <div className="form-container">
        <h2 className="text-center mb-2">Welcome Back</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="login-email">Email</label>
            <input
              type="email"
              id="login-email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input
              type="password"
              id="login-password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Login
          </button>
        </form>
        <p className="text-center mt-2">
          Don’t have an account?{' '}
          <span onClick={() => navigate('/register')} style={{ cursor: 'pointer', color: '#667eea' }}>
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
