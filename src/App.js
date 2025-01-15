// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import PrivateRoute from './PrivateRoute'; // Import the PrivateRoute component
import CreateTemplate from './pages/CreateTemplate';
import ViewTemplates from './pages/ViewTemplates';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Dashboard" element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="/AdminDashboard" element={<PrivateRoute element={<AdminDashboard />} />} />
        <Route path="/create-template" element={<PrivateRoute element={<CreateTemplate />} />} />
        <Route path="/view-templates" element={<PrivateRoute element={<ViewTemplates />} />} />
      </Routes>
    </Router>
  );
};

export default App;
