import React from 'react';
import { useNavigate } from 'react-router-dom';

const Register = ({ onRegister }) => {
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    const country = formData.get('country');
    onRegister(name, email, password, country);
  };

  return (
    <div className="page">
      <div className="form-container">
        <h2 className="text-center mb-2">Join FrameLink</h2>
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="register-name">Full Name</label>
            <input type="text" name="name" id="register-name" required />
          </div>
          <div className="form-group">
            <label htmlFor="register-email">Email</label>
            <input type="email" name="email" id="register-email" required />
          </div>
          <div className="form-group">
            <label htmlFor="register-password">Password</label>
            <input type="password" name="password" id="register-password" required />
          </div>
          <div className="form-group">
            <label htmlFor="register-country">Country</label>
            <select name="country" id="register-country" required>
              <option value="">Select Country</option>
              <option value="US">United States</option>
              <option value="UK">United Kingdom</option>
              <option value="CA">Canada</option>
              <option value="AU">Australia</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
              <option value="JP">Japan</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Create Account</button>
        </form>
        <p className="text-center mt-2">
          Already have an account? <span onClick={() => navigate('/login')} style={{ cursor: 'pointer', color: '#667eea' }}>Login</span>
        </p>
      </div>
    </div>
  );
};

export default Register;