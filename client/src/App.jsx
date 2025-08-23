// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './Context/AuthContext';
import Navbar from './components/Navbar';
import LoginPage from './components/LoginPage';

import Dashboard from './components/Dashboard';
import './App.css';
import Home from './Pages/Home';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Home Route */}
          <Route path="/" element={
            <>
            <Home/>
            </>
          } />
          
          {/* Login Route */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Dashboard Route */}
          <Route path="/dashboard" element={
            <>
              <Navbar />
              <Dashboard />
            </>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
