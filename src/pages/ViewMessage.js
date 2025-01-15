import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ViewMessage = () => {
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5001/welcomeMessage/GetAllWelcomeMessages')
      .then(response => setMessages(response.data.data))
      .catch(() => console.error("Error fetching messages"));
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this message?');
    if (!confirmDelete) {
      toast.warning('Action was canceled');
      return;
    }

    try {
      await axios.delete(`http://localhost:5001/welcomeMessage/DeleteWelcomeMessage/${id}`);
      setMessages(messages.filter((msg) => msg._id !== id));
      toast.success('Message deleted successfully!');
    } catch (err) {
      toast.error('Error deleting message');
    }
  };

  return (
    <AdminDashboard>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Welcome Messages</h2>
      <div style={cardContainerStyle}>
        {messages.length > 0 ? (
          messages.map((message) => (
            <div key={message._id} style={cardStyle}>
              <p style={cardDescriptionStyle}>{message.message}</p>
              <div style={buttonContainerStyle}>
                <button onClick={() => navigate(`/EditMessage/${message._id}`)} style={editButtonStyle}>Edit</button>
                <button onClick={() => handleDelete(message._id)} style={deleteButtonStyle}>Delete</button>
              </div>
            </div>
          ))
        ) : (
          <p>No messages found</p>
        )}
      </div>
    </AdminDashboard>
  );
};

/* 🔹 Inline CSS Styles */
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

export default ViewMessage;






