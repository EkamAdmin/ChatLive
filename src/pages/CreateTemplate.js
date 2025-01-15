import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';

const CreateTemplate = () => {
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
        navigate('/view-templates');
      }
    } catch (err) {
      setErrorMessage('Error adding template');
    }
  };

  return (
    <AdminDashboard>
      <div style={cardContainerStyle}>
        <h2 style={headingStyle}>Create a New Template</h2>
        <form onSubmit={handleSubmit} style={formStyle}>
          <label style={labelStyle}>Template Name:</label>
          <input
            type="text"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            required
            style={inputStyle}
          />

           <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px' }}>Template Description:</label>
            <textarea
              value={templateDescription}
              onChange={(e) => setTemplateDescription(e.target.value)}
              placeholder="Enter template description"
              style={{ width: '100%', padding: '6px', marginBottom: '8px', borderRadius: '4px', border: '1px solid #ccc', height: '100px' }}
            />

          <button type="submit" style={buttonStyle}>Create Template</button>
        </form>

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
  width: '100%',
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

export default CreateTemplate;