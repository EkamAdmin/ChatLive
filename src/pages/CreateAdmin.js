import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import SuperAdminDashboard from './SuperAdminDashboard';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const baseURL = process.env.REACT_APP_BASE_URL;

const CreateAdmin = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get user ID if editing
  const [userId, setUserId] = useState('');
  const [roleId, setRoleId] = useState(2); // Default role is 2 (Admin)
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch existing user when editing
  useEffect(() => {
    if (id) {
      axios.get(`${baseURL}/user/GetUser/${id}`)
        .then(response => {
          if (response.data && response.data.data) {
            setUserId(response.data.data.userId);
            setRoleId(response.data.data.roleId);
          }
        })
        .catch(() => setErrorMessage('Error fetching user.'));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      setErrorMessage('User ID is required');
      return;
    }

    const confirmSave = window.confirm('Do you want to save this user?');
    if (!confirmSave) {
      toast.warning('Action was canceled');
      return;
    }

    try {
      if (id) {
        await axios.put(`${baseURL}/user/UpdateUser/${id}`, { userId, roleId });
      } else {
        await axios.post(`${baseURL}/user/AddUser`, { userId, roleId });
      }
      toast.success('User saved successfully!');
      navigate('/ViewAdmin');
    } catch (err) {
      toast.error('Error saving user');
    }
  };

  return (
    <SuperAdminDashboard>
      <div style={cardContainerStyle}>
        <h2 style={headingStyle}>{id ? 'Update' : 'Create'} Admin</h2>
        <form onSubmit={handleSubmit} style={formStyle}>
          <label style={labelStyle}>User ID:</label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
            style={inputStyle}
          />
          <label style={labelStyle}>Role ID:</label>
          <select
            value={roleId}
            onChange={(e) => setRoleId(Number(e.target.value))}
            style={inputStyle}
          >
            <option value={2}>Admin</option>
            <option value={3}>User</option>
          </select>
          <button type="submit" style={buttonStyle}>{id ? 'Update' : 'Create'} Admin</button>
        </form>
        {errorMessage && <p style={errorStyle}>{errorMessage}</p>}
      </div>
    </SuperAdminDashboard>
  );
};

// 🔹 Inline CSS Styles
const cardContainerStyle = {
  maxWidth: '600px',
  margin: 'auto',
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  textAlign: 'center',
};

const headingStyle = {
  fontSize: '22px',
  fontWeight: 'bold',
  marginBottom: '15px',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
};

const labelStyle = {
  fontSize: '16px',
  fontWeight: 'bold',
  textAlign: 'left',
};

const inputStyle = {
  width: '100%',
  padding: '8px',
  borderRadius: '5px',
  border: '1px solid #ccc',
};

const buttonStyle = {
  padding: '10px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px',
};

const errorStyle = {
  color: 'red',
  fontSize: '14px',
  marginTop: '10px',
};

export default CreateAdmin;


