import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateMessage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get message ID if editing
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch existing message when editing
  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:5001/welcomeMessage/GetWelcomeMessage/${id}`)
        .then(response => {
          if (response.data && response.data.data) {
            setMessage(response.data.data.message);
          }
        })
        .catch(() => setErrorMessage('Error fetching message.'));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message) {
      setErrorMessage('Message is required');
      return;
    }

    const confirmSave = window.confirm('Do you want to save this message?');
    if (!confirmSave) {
      toast.warning('Action was canceled');
      return;
    }

    try {
      if (id) {
        await axios.put(`http://localhost:5001/welcomeMessage/UpdateWelcomeMessage/${id}`, { message });
      } else {
        await axios.post('http://localhost:5001/welcomeMessage/AddWelcomeMessage', { message });
      }
      toast.success('Message saved successfully!');
      navigate('/ViewMessage');
    } catch (err) {
      toast.error('Error saving message');
    }
  };

  return (
    <AdminDashboard>
      <div style={cardContainerStyle}>
        <h2 style={headingStyle}>{id ? 'Update' : 'Create'} Welcome Message</h2>
        <form onSubmit={handleSubmit} style={formStyle}>
          <label style={labelStyle}>Message:</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle}>{id ? 'Update' : 'Create'} Message</button>
        </form>
        {errorMessage && <p style={errorStyle}>{errorMessage}</p>}
      </div>
    </AdminDashboard>
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

export default CreateMessage;














