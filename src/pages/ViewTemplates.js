import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminDashboard from './AdminDashboard';

const ViewTemplates = () => {
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5001/template/GetAllTemplates')
      .then(response => setTemplates(response.data.data))
      .catch(() => console.error("Error fetching templates"));
  }, []);

  return (
    <AdminDashboard>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>All Templates</h2>
      <div style={cardContainerStyle}>
        {templates.length > 0 ? (
          templates.map((template) => (
            <div key={template._id} style={cardStyle}>
              <h3 style={cardTitleStyle}>{template.templateName}</h3>
              <p style={cardDescriptionStyle}>{template.templateDescription}</p>
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
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', // Responsive grid
  gap: '20px',
  padding: '20px'
};

const cardStyle = {
  backgroundColor: 'white',
  padding: '15px',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  transition: 'transform 0.3s',
  textAlign: 'center'
};

const cardTitleStyle = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#333',
  marginBottom: '10px'
};

const cardDescriptionStyle = {
  fontSize: '14px',
  color: '#555'
};

export default ViewTemplates;
