import React from 'react';
import ReactDOM from 'react-dom/client'; // ⬅️ use 'react-dom/client' for React 18+
import App from './App';

// ✅ Use createRoot instead of render
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
