import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    fetch('/api/v1/user/info')
      .then(response => response.json())
      .then(data => setIsAuthenticated(data.success))
      .catch(error => console.error('Error fetching auth status:', error));
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/login" element={!isAuthenticated ? <Login/> : <Navigate to="/dashboard" replace />}></Route>
        <Route path="/signup" element={!isAuthenticated ? <Signup/> : <Navigate to="/dashboard" replace />}></Route>
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard/> : <Navigate to="/login" replace />}></Route>
      </Routes>
    </Router>
   
  );
}

export default App;