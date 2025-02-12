import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const badgeStyle = {
  position: 'absolute',
  top: '-5px',
  right: '-10px',
  backgroundColor: 'red',
  color: 'white',
  borderRadius: '50%',
  padding: '5px 8px',
  fontSize: '12px',
  fontWeight: 'bold',
};

const AdminDashboard = ({ children }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [normalUserMessages, setNormalUserMessages] = useState(4);
  const [endUserMessages, setEndUserMessages] = useState(5);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    navigate('/');
  };

  return (
    <div style={{ fontFamily: 'Roboto, sans-serif', height: '100vh', backgroundColor: 'rgb(231 228 228)' }}>
      
      {/* 🔹 Horizontal Navbar */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#333',
        padding: '10px 20px',
        color: 'white'
      }}>
        <div style={{ fontSize: '20px', fontWeight: 'bold' }}>Admin Dashboard</div>

        <div style={{ display: 'flex', gap: '20px', position: 'relative' }}>
          <a style={navLinkStyle} onClick={() => navigate('/AdminDashboard')}>Home</a>
            <span onClick={() => navigate('/AdminEndUserChat')} style={navLinkStyle}>
                End User Chat
            </span>
        </div>

        <button onClick={handleLogout} style={{
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px'
        }}>
          Logout
        </button>
      </nav>

      {/* 🔹 Page Content */}
      <div style={{ padding: '20px' }}>
        {children}
      </div>
    </div>
  );
};

/* 🔹 Inline CSS */
const navLinkStyle = {
  color: 'white',
  textDecoration: 'none',
  padding: '8px 12px',
  fontSize: '16px',
  cursor: 'pointer'
};

const dropdownContainerStyle = {
  position: 'relative',
  display: 'flex'
};

const dropdownMenuStyle = {
  position: 'absolute',
  top: '100%',
  left: '0',
  backgroundColor: '#444',
  minWidth: '160px',
  borderRadius: '4px',
  boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
  zIndex: '1000'
};

const dropdownItemStyle = {
  display: 'block',
  color: 'white',
  padding: '10px 16px',
  textDecoration: 'none',
  fontSize: '14px',
  cursor: 'pointer',
  backgroundColor: '#444'
};

export default AdminDashboard;
