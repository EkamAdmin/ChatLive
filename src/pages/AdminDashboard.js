import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = ({ children }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(null);

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
          <a href="#" style={navLinkStyle}>Home</a>
          <a href="#" style={navLinkStyle}>Settings</a>

          {/* Templates Dropdown */}
          <div style={dropdownContainerStyle} 
            onMouseEnter={() => setDropdownOpen('templates')} 
            onMouseLeave={() => setDropdownOpen(null)}>
            <span style={navLinkStyle}>Templates ▼</span>
            {dropdownOpen === 'templates' && (
              <div style={dropdownMenuStyle}>
                <span onClick={() => navigate('/create-template')} style={dropdownItemStyle}>Create Template</span>
                <span onClick={() => navigate('/view-templates')} style={dropdownItemStyle}>View Templates</span>
              </div>
            )}
          </div>
		  <div style={dropdownContainerStyle} 
            onMouseEnter={() => setDropdownOpen('welcome')} 
            onMouseLeave={() => setDropdownOpen(null)}>
            <span style={navLinkStyle}>Welcome Messages ▼</span>
            {dropdownOpen === 'welcome' && (
              <div style={dropdownMenuStyle}>
                <span onClick={() => navigate('/create-welcomemessage')} style={dropdownItemStyle}>Create Message</span>
                <span onClick={() => navigate('/view-welcomemessage')} style={dropdownItemStyle}>View Message</span>
              </div>
            )}
          </div>
          <a href="#" style={navLinkStyle}>Normal User Chat</a>
          <a href="#" style={navLinkStyle}>End User Chat</a>
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
