// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import CreateTemplate from './pages/CreateTemplate';
import ViewTemplates from './pages/ViewTemplates';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/create-template" element={<CreateTemplate />} />
        <Route path="/view-templates" element={<ViewTemplates />} />
      </Routes>
    </Router>
  );
};

export default App;
