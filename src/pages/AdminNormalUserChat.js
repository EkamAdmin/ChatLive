import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminDashboard from "./AdminDashboard";
import axios from 'axios';

const ChatUI = ({ currentTemplateDescription, setCurrentTemplateDescription, selectedPlayer }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: 'rgb(255 255 255)',
      borderRadius: '18px',
    }}>
      <div style={{
        padding: '8px',
        backgroundColor: 'rgb(88 98 97)',
        color: '#fff',
        textAlign: 'center',
        borderRadius: '5px 5px 0 0',
      }}>
        <h2 style={{ fontSize: '16px' }}>Chat Room</h2>
        {selectedPlayer && (
          <div style={{ fontSize: '14px', marginTop: '5px', color: '#fff' }}>
            <p><strong>Chatting with:</strong> (ID: {selectedPlayer.playerID})</p>
          </div>
        )}
      </div>

      {/* Input Field with currentTemplateDescription as value */}
      <div style={{
        padding: '8px',
        backgroundColor: '#f0f0f0',
        borderTop: '1px solid #ddd',
        borderRadius: '0 0 5px 5px',
      }}>
        <form style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>

          <input
            type="text"
            placeholder="Type a message..."
            value={currentTemplateDescription}  // ✅ Append template description
            onChange={(e) => setCurrentTemplateDescription(e.target.value)} // ✅ Allow editing
            style={{
              width: 'calc(100% - 120px)',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
          />
          <label
            style={{
              padding: '8px 12px',
              backgroundColor: '#28a745',
              borderRadius: '4px',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              marginLeft: '8px',
            }}
            title="Upload Document"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              className="bi bi-paperclip"
              viewBox="0 0 16 16"
              style={{ marginRight: '4px' }}
            >
              <path d="M4.146 4.146a3 3 0 0 1 4.242 4.243l-5.5 5.5a2 2 0 0 0 2.828 2.828l5.5-5.5a5 5 0 1 0-7.071-7.071L2.707 5.707a4 4 0 0 0 5.657 5.657l5.5-5.5a3 3 0 1 1 4.242 4.242l-5.5 5.5a6 6 0 0 1-8.485-8.485l5.5-5.5a1 1 0 0 1 1.414 1.414l-5.5 5.5a2 2 0 0 0 2.828 2.828l5.5-5.5a5 5 0 1 0-7.071-7.071z" />
            </svg>
            Upload
            <input
              type="file"
              style={{
                display: 'none',
              }}
            />
          </label>
          <button
            type="submit"
            style={{
              padding: '10px 16px',
              marginLeft: '8px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

const AdminNormalUserChat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { playerID } = location.state || {};

  const [templates, setTemplates] = useState([]);
  const [players, setPlayers] = useState([]);
  const [currentTemplateDescription, setCurrentTemplateDescription] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState(null); // Track selected player

  const fetchAllTemplates = async () => {
    try {
      const response = await axios.get('http://localhost:5001/template/GetAllTemplates');
      setTemplates(response.data.data);
    } catch (err) {
      console.error('Error fetching templates');
    }
  };

  const fetchAllPlayers = async () => {
    try {
      const response = await axios.get('http://localhost:5001/Player/getAllPlayers');
      const filteredPlayers = response.data.data.filter((player) => player.playerID !== "" && player.isAdmin === false);

      setPlayers(filteredPlayers);
    } catch (err) {
      console.error('Error fetching players');
    }
  };

  useEffect(() => {
    fetchAllTemplates();
    fetchAllPlayers();
  }, []);

  const handlePlayerClick = (player) => {
    setSelectedPlayer(player); // Set selected player when clicked
  };

  return (

    <AdminDashboard>

      <div style={{ display: 'flex', flex: 1 }}>
        {/* Player List */}
        <div style={{ flex: 0.75, padding: '16px', backgroundColor: 'rgb(249, 249, 249)', marginRight: '8px', borderRadius: '18px', overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
          <h3 style={{ fontSize: '18px', textAlign: 'center' }}>All Players</h3>
          {players.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {players.map((player) => (
                <li
                  key={player._id}
                  onClick={() => handlePlayerClick(player)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '8px',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '12px',
                    backgroundColor: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  <div>
                    
                    <p style={{ fontSize: '12px', color: '#555', margin: '2px 0' }}></p>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '12px', color: '#4CAF50', margin: '0' }}>
                      {`${Math.floor(Math.random() * 12) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')} ${Math.random() > 0.5 ? 'AM' : 'PM'}`}
                    </p>
                    <div
                      style={{
                        display: 'inline-block',
                        backgroundColor: Math.random() > 0.5 ? '#FFA500' : '#FF0000', // Randomly choose between orange and red
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        padding: '5px 8px',
                        borderRadius: '50%',
                        textAlign: 'center',
                      }}
                    >
                      {Math.floor(Math.random() * 10)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ textAlign: 'center', color: '#555' }}>No players found</p>
          )}
        </div>

        <div style={{ flex: 1.5, padding: '16px', backgroundColor: 'rgb(200 200 200)', marginRight: '8px', borderRadius: '18px', display: 'flex', flexDirection: 'column' }}>
          <ChatUI currentTemplateDescription={currentTemplateDescription} selectedPlayer={selectedPlayer} />
        </div>

        <div style={{ flex: 0.75, padding: '16px', backgroundColor: 'rgb(249, 249, 249)', borderRadius: '18px', overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
          {templates.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {templates.map((template) => (
                <li
                  key={template._id}
                  onClick={() => setCurrentTemplateDescription(template.templateDescription)}
                  style={{
                    marginBottom: '8px',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  <p style={{ fontSize: '14px' }}><strong>Template Name:</strong> {template.templateName}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No templates found</p>
          )}
        </div>
      </div>
    </AdminDashboard>

  );
};

export default AdminNormalUserChat;








