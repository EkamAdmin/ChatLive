import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SuperAdminDashboard from './SuperAdminDashboard';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const baseURL = process.env.REACT_APP_BASE_URL;

const ViewAdmin = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

   // Define a mapping for role IDs to role names
   const roleNames = {
    2: 'Admin',
    3: 'User',
  };

  // Fetch users when the component is mounted
  useEffect(() => {
    axios.get(`${baseURL}/user/GetAllUsers`)
  .then(response => {
    const filteredUsers = response.data.data.filter(user => user.roleId === 2);
    setUsers(filteredUsers);
  })
  .catch(() => console.error("Error fetching users"));
  }, []);

  // Handle deleting a user
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (!confirmDelete) {
      toast.warning('Action was canceled');
      return;
    }

    try {
      await axios.delete(`${baseURL}/user/DeleteUser/${id}`);
      setUsers(users.filter((user) => user._id !== id));
      toast.success('User deleted successfully!');
    } catch (err) {
      toast.error('Error deleting user');
    }
  };

  return (
    <SuperAdminDashboard>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Users</h2>
      <div style={cardContainerStyle}>
        {users.length > 0 ? (
          users.map((user) => (
            <div key={user._id} style={cardStyle}>
              <h3 style={cardTitleStyle}>{user.userId}</h3>
              {/* <p style={cardDescriptionStyle}>Role ID: {user.roleId}</p> */}
              <p style={cardDescriptionStyle}>Role: {roleNames[user.roleId]}</p> {/* Display role name */}
              <div style={buttonContainerStyle}>
                <button onClick={() => navigate(`/EditAdmin/${user._id}`)} style={editButtonStyle}>Edit</button>
                <button onClick={() => handleDelete(user._id)} style={deleteButtonStyle}>Delete</button>
              </div>
            </div>
          ))
        ) : (
          <p>No users found</p>
        )}
      </div>
    </SuperAdminDashboard>
  );
};

// 🔹 Inline CSS Styles
const cardContainerStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '20px',
  padding: '20px',
};

const cardStyle = {
  backgroundColor: 'white',
  padding: '15px',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  textAlign: 'center',
};

const cardTitleStyle = {
  fontSize: '18px',
  fontWeight: 'bold',
};

const cardDescriptionStyle = {
  fontSize: '14px',
  color: '#555',
};

const buttonContainerStyle = {
  marginTop: '10px',
  display: 'flex',
  justifyContent: 'space-between',
};

const editButtonStyle = {
  padding: '6px 12px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '14px',
};

const deleteButtonStyle = {
  padding: '6px 12px',
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '14px',
};

export default ViewAdmin;





