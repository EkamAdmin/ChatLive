import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import SuperAdminDashboard from './SuperAdminDashboard';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const baseURL = process.env.REACT_APP_BASE_URL;

const CreateTemplate = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get template ID if editing
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch existing template when editing
  useEffect(() => {
    if (id) {
      axios.get(`${baseURL}/template/GetTemplate/${id}`)
        .then(response => {
          if (response.data && response.data.data) {
            setTemplateName(response.data.data.templateName);
            setTemplateDescription(response.data.data.templateDescription);
          }
        })
        .catch(() => setErrorMessage('Error fetching template.'));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!templateName) {
      setErrorMessage('Template name is required');
      return;
    }

    const confirmSave = window.confirm('Do you want to save this template?');
    if (!confirmSave) {
      toast.warning('Action was canceled');
      return;
    }

    try {
      if (id) {
        await axios.put(`${baseURL}/template/UpdateTemplate/${id}`, { templateName, templateDescription });
      } else {
        await axios.post(`${baseURL}/template/AddTemplate`, { templateName, templateDescription });
      }
      toast.success('Template saved successfully!');
      navigate('/ViewTemplate');
    } catch (err) {
      toast.error('Error saving template');
    }
  };

  return (
    <SuperAdminDashboard>
      <div style={cardContainerStyle}>
        <h2 style={headingStyle}>{id ? 'Update' : 'Create'} Template</h2>
        <form onSubmit={handleSubmit} style={formStyle}>
          <label style={labelStyle}>Template Name:</label>
          <input
            type="text"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            required
            style={inputStyle}
          />
          <label style={labelStyle}>Template Description:</label>
          <textarea
            value={templateDescription}
            onChange={(e) => setTemplateDescription(e.target.value)}
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle}>{id ? 'Update' : 'Create'} Template</button>
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

export default CreateTemplate;










