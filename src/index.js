import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
</Routes>

);
