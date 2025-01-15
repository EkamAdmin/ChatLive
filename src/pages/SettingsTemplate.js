import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';

const SettingsTemplate = () => {
  const navigate = useNavigate();
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
 const [errorMessage, setErrorMessage] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();


    if (!templateName || !templateDescription) {
      setErrorMessage('Template Name and Description are required');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5001/template/AddTemplate', {
        templateName,
        templateDescription, // Save the Draft.js content as JSON
      });

      if (response.status === 200) {
        console.log('Template added successfully');
        navigate('/ViewTemplate');
      }
    } catch (err) {
      setErrorMessage('Error adding template');
    }
  };

  return (
    <AdminDashboard>
      <div style={cardContainerStyle}>
        {/* <h2 style={headingStyle}>Create a New Template</h2> */}
        <input
            type="text"
            required
            style={inputStyle}
             placeholder="Number of days of message deletion"
          />
          <button type="submit" style={buttonStyle}>OK</button>
       
        {errorMessage && <p style={errorStyle}>{errorMessage}</p>}
      </div>
      <br></br>
      <div style={cardContainerStyle}>
        {/* <h2 style={headingStyle}>Create a New Template</h2> */}
        <input
            type="text"
            required
            style={inputStyle}
             placeholder="Number of minutes of delay message colour start"
          />
          <button type="submit" style={buttonStyle}>OK</button>
       
        {errorMessage && <p style={errorStyle}>{errorMessage}</p>}
      </div>
    </AdminDashboard>
  );
};

/* 🔹 Inline CSS Styles */
const cardContainerStyle = {
  maxWidth: '600px',
  margin: 'auto',
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  textAlign: 'center'
};

const headingStyle = {
  fontSize: '22px',
  fontWeight: 'bold',
  marginBottom: '15px'
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px'
};

const labelStyle = {
  fontSize: '16px',
  fontWeight: 'bold',
  textAlign: 'left'
};

const inputStyle = {
  width: '60%',
  padding: '8px',
  borderRadius: '5px',
  border: '1px solid #ccc'
};

const editorContainerStyle = {
  minHeight: '150px',
  padding: '10px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  backgroundColor: 'white',
  cursor: 'text',
  textAlign: 'left'
};

const buttonStyle = {
  padding: '10px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px'
};

const errorStyle = {
  color: 'red',
  fontSize: '14px',
  marginTop: '10px'
};

export default SettingsTemplate;