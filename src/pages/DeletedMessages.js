import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SuperAdminDashboard from './SuperAdminDashboard';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const baseURL = process.env.REACT_APP_BASE_URL;

const DeletedMessages = () => {
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

//   useEffect(() => {
//     const response =  axios.get(`${baseURL}/messages`)
//       .then(response => setMessages(response.data.data))
//       .catch(() => console.error("Error fetching messages"));
//   }, []);
useEffect(() => {
    axios.get(`${baseURL}/messages`)
      .then(response => {
          const deletedMessages = response.data.data.filter(msg => msg.isDeleted === true); // ✅ Filter deleted messages
          setMessages(deletedMessages);
      })
      .catch(error => console.error("Error fetching messages:", error));
}, []);


  return (
    <SuperAdminDashboard>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Deleted Messages</h2>
      <div style={cardContainerStyle}>
        {messages.length > 0 ? (
          messages.map((message) => (
            <div key={message._id} style={cardStyle}>
              {message.fileUrl ? (
  <img 
    src={message.fileUrl} 
    alt="Uploaded file" 
    style={{ maxWidth: '200px', borderRadius: '8px', marginTop: '8px' }} 
  />
) : (
  <p style={cardDescriptionStyle}>{message.message}</p>
)}

              <h6>{message.deletedBy}</h6>
              <h6>{message.deletedDate ? new Date(message.deletedDate).toISOString().slice(0, 19) + "Z" : 'N/A'}</h6>
            </div>
          ))
        ) : (
          <p>No messages found</p>
        )}
      </div>
    </SuperAdminDashboard>
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

export default DeletedMessages;






