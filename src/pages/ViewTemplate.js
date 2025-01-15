import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ViewTemplate = () => {
  const [templates, setTemplates] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5001/template/GetAllTemplates')
      .then(response => setTemplates(response.data.data))
      .catch(() => console.error("Error fetching templates"));
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this template?');
    if (!confirmDelete) {
      toast.warning('Action was canceled');
      return;
    }

    try {
      await axios.delete(`http://localhost:5001/template/DeleteTemplate/${id}`);
      setTemplates(templates.filter((template) => template._id !== id));
      toast.success('Template deleted successfully!');
    } catch (err) {
      toast.error('Error deleting template');
    }
  };

  return (
    <AdminDashboard>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Templates</h2>
      <div style={cardContainerStyle}>
        {templates.length > 0 ? (
          templates.map((template) => (
            <div key={template._id} style={cardStyle}>
              <h3 style={cardTitleStyle}>{template.templateName}</h3>
              <p style={cardDescriptionStyle}>{template.templateDescription}</p>
              <div style={buttonContainerStyle}>
                <button onClick={() => navigate(`/EditTemplate/${template._id}`)} style={editButtonStyle}>Edit</button>
                <button onClick={() => handleDelete(template._id)} style={deleteButtonStyle}>Delete</button>
              </div>
            </div>
          ))
        ) : (
          <p>No templates found</p>
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

export default ViewTemplate;











