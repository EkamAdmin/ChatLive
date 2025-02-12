// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import PrivateRoute from './PrivateRoute';
import CreateTemplate from './pages/CreateTemplate';
import ViewTemplate from './pages/ViewTemplate';
import CreateMessage from './pages/CreateMessage';
import CreateAdmin from './pages/CreateAdmin';
import ViewAdmin from './pages/ViewAdmin';
import ViewMessage from './pages/ViewMessage';
import AdminEndUserChat from './pages/AdminEndUserChat';
import DeletedMessages from './pages/DeletedMessages'
import AdminNormalUserChat from './pages/AdminNormalUserChat';
import SettingsTemplate from './pages/SettingsTemplate';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <Router>
      <>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Dashboard" element={<PrivateRoute element={<Dashboard />} />} />
          <Route path="/AdminDashboard" element={<PrivateRoute element={<AdminDashboard />} />} />
          <Route path="/SuperAdminDashboard" element={<PrivateRoute element={<SuperAdminDashboard />} />} />

          <Route path="/SettingsTemplate" element={<PrivateRoute element={<SettingsTemplate />} />} />

          <Route path="/CreateTemplate" element={<PrivateRoute element={<CreateTemplate />} />} />
          <Route path="/EditTemplate/:id" element={<PrivateRoute element={<CreateTemplate />} />} /> 
          <Route path="/ViewTemplate" element={<PrivateRoute element={<ViewTemplate />} />} />

          <Route path="/CreateMessage" element={<PrivateRoute element={<CreateMessage />} />} />
          <Route path="/EditMessage/:id" element={<PrivateRoute element={<CreateMessage />} />} />
          <Route path="/ViewMessage" element={<PrivateRoute element={<ViewMessage />} />} />

          <Route path="/AdminEndUserChat" element={<PrivateRoute element={<AdminEndUserChat />} />} />
          <Route path="/AdminNormalUserChat" element={<PrivateRoute element={<AdminNormalUserChat />} />} />

          <Route path="/CreateAdmin" element={<PrivateRoute element={<CreateAdmin />} />} />
          <Route path="/EditAdmin/:id" element={<PrivateRoute element={<CreateAdmin />} />} /> 
          <Route path="/ViewAdmin" element={<PrivateRoute element={<ViewAdmin />} />} />

          <Route path="/DeletedMessages" element={<PrivateRoute element={<DeletedMessages />} />} />
        </Routes>

        <ToastContainer position="top-right" autoClose={3000} />
      </>
    </Router>
  );
};

export default App;