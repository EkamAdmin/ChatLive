// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import PrivateRoute from './PrivateRoute'; // Import the PrivateRoute component
import CreateTemplate from './pages/CreateTemplate';
import ViewTemplates from './pages/ViewTemplates';
import CreateMessage from './pages/CreateMessage';
import ViewMessage from './pages/ViewMessage';
import { ToastContainer } from 'react-toastify';


const App = () => {
  return (
    <Router>
       <>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Dashboard" element={<PrivateRoute element={<Dashboard />} />} />
          <Route path="/AdminDashboard" element={<PrivateRoute element={<AdminDashboard />} />} />

          <Route path="/CreateTemplate" element={<PrivateRoute element={<CreateTemplate />} />} />
          <Route path="/ViewTemplate" element={<PrivateRoute element={<ViewTemplates />} />} />

          <Route path="/CreateMessage" element={<PrivateRoute element={<CreateMessage />} />} />
          <Route path="/EditMessage/:id" element={<PrivateRoute element={<CreateMessage />} />} />
          <Route path="/ViewMessage" element={<PrivateRoute element={<ViewMessage />} />} />
        </Routes>

        <ToastContainer position="top-right" autoClose={3000} />
      </>
    </Router>
     
  );
};

export default App;
