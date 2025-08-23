// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider } from './Context/AuthContext';
import Navbar from './components/Navbar';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import Home from './Pages/Home';
import AllEvents from './components/AllEvents';
import EventSuccessPage from './components/EventSucessPage';
import './App.css';
import AdminCreateEventApp from './components/AdminCreateEventApp';

function App() {
  return (
    <AuthProvider>
      <Router>
        <MainApp />
      </Router>
    </AuthProvider>
  );
}

// 👇 keep all logic here but still only one exported App
function MainApp() {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/v1/users/auth_getprofile', {
          credentials: 'include', // send cookies
        });

        if (!res.ok) {
          // Unauthorized or error → redirect to login
          navigate('/login');
          return;
        }

        const data = await res.json();
        console.log("Profile data:", data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        navigate('/login'); // fallback
      }
    };

    fetchProfile();
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route
        path="/Events"
        element={
          <>
            <Navbar />
            <AllEvents />
          </>
        }
      />
      <Route path="/eventname" element={<EventSuccessPage />} />
      <Route path="/Create" element={<AdminCreateEventApp/>} />
    </Routes>
  );
}

export default App;
