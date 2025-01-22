import React, { useState, useEffect,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import EmojiPicker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import axios from 'axios';

// ChatUI Component
const ChatUI = ({
  messages,
  currentTemplateDescription,
  setCurrentTemplateDescription,
  handleSendMessage,
  selectedPlayer,
}) => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
     const [file, setFile] = useState(null);
      const fileInputRef = useRef(null); // Reference for the file input
    const addEmoji = (emoji) => {
      setCurrentTemplateDescription((prev) => prev + emoji.native);
      setShowEmojiPicker(false);
    };
  return (
    
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%', // This ensures it takes full height of its parent container
      maxHeight: 'calc(100vh - 40px)', // Optional: Limits the height to viewport minus padding
      backgroundColor: 'rgb(255, 255, 255)', 
      borderRadius: '18px',
      overflow: 'hidden' // Prevents content from overflowing
    }}>
      <div style={{ 
        padding: '8px', 
        backgroundColor: 'rgb(88, 98, 97)', 
        color: '#fff', 
        textAlign: 'center', 
        borderRadius: '5px 5px 0 0' 
      }}>
        {/* <h2 style={{ fontSize: '16px' }}>Chat Room</h2> */}
        {selectedPlayer && (
          <div style={{ fontSize: '14px', marginTop: '5px', color: '#fff' }}>
            <p><strong>Chatting with:</strong>(ID: {selectedPlayer.playerID})</p>
          </div>
        )}
      </div>
    
      {/* Chat Messages */}
      <div style={{ 
        flex: 1, // Makes this section take up all available space
        overflowY: 'auto', 
        padding: '16px', 
        backgroundColor: '#f9f9f9' 
      }}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              justifyContent: msg.senderId === 'Admin' ? 'flex-end' : 'flex-start',
              marginBottom: '12px',
            }}
          >
            <div
              style={{
                maxWidth: '60%',
                padding: '10px',
                borderRadius: '8px',
                backgroundColor: msg.senderId === 'Admin' ? 'rgb(209 231 221)' : 'rgb(209 231 221)',
                color: msg.senderId === 'Admin' ? 'rgb(0 0 0)' : 'rgb(0 0 0 / 58%)',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                border: msg.isSeen ? '1px solid #d1e7dd' : '1px solid rgb(0 123 255 / 37%)',
              }}
            >
              <p style={{ margin: 0 }}>{msg.message}</p>
              <small style={{ display: 'block', marginTop: '5px', fontSize: '12px', color: '#6c757d' }}>
                {new Date(msg.timestamp).toLocaleString()}
              </small>
              {msg.fileUrl && (
                msg.fileType === '.pdf' ? (
                  <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer">
                    View PDF
                  </a>
                ) : (
                  <img
                    src={msg.fileUrl}
                    alt="Uploaded file"
                    style={{ maxWidth: '200px', borderRadius: '8px', marginTop: '8px' }}
                  />
                )
              )}
              {/* <small style={{ display: 'block', marginTop: '5px', fontSize: '12px', color: '#6c757d' }}>
                {new Date(msg.timestamp).toLocaleString()}
              </small> */}
            </div>
          </div>
        ))}
      </div>
    
      {/* Message Input */}
      <div style={{ 
        padding: '8px', 
        backgroundColor: '#f0f0f0', 
        borderTop: '1px solid #ddd', 
        borderRadius: '0 0 5px 5px' 
      }}>
        <form style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} onSubmit={handleSendMessage}>
        <button
          type="button"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          style={{
            padding: '10px',
            backgroundColor: '#e9ecef',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '8px',
          }}
        >
          😊
        </button>
        <input
          type="file"
          accept="image/*,.pdf"
          ref={fileInputRef} // Attach the ref here
          onChange={(e) => setFile(e.target.files[0])}
          style={{
            marginRight: '8px',
          }}
        />
          <input
            type="text"
            placeholder="Type a message..."
            value={currentTemplateDescription}
            onChange={(e) => setCurrentTemplateDescription(e.target.value)}
            style={{
              flex: 1, // Takes all available width
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              
            }}
          />
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
         {showEmojiPicker && (
                <div style={{ position: 'absolute', bottom: '100px', left: '16px', zIndex: 100 }}>
                  <EmojiPicker data={data} onEmojiSelect={addEmoji} />
                </div>
              )}
      </div>
    </div>    
  );
};

// AdminEndUserChat Component
const AdminEndUserChat = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]); // List of users communicating with Admin
  const [messages, setMessages] = useState([]); // Chat messages
  const [templates, setTemplates] = useState([]); // Templates for quick messages
  const [currentTemplateDescription, setCurrentTemplateDescription] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState(null); // Track selected user

  // Fetch all users who have communicated with Admin
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5001/Player/getAllPlayers');
      const filteredPlayers = response.data.data.filter((player) => player.playerID !== "" && player.isAdmin === false);
      console.log(filteredPlayers);
      setUsers(filteredPlayers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Fetch templates for quick replies
  const fetchTemplates = async () => {
    try {
      const response = await axios.get('http://localhost:5001/template/GetAllTemplates');
      setTemplates(response.data.data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  // Fetch messages between Admin and selected user
  const fetchMessages = async (playerID) => {
    try {
      const response = await axios.get('http://localhost:5001/messages', {
        params: { senderId: playerID },
      });
      setMessages(response.data.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Send a message from Admin to the selected user
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!currentTemplateDescription.trim() || !selectedPlayer) return;

    const payload = {
      senderId: 'Admin',
      receiverId: selectedPlayer.playerID,
      message: currentTemplateDescription,
      fileUrl: '',
      fileType: '',
    };

    try {
      const response = await axios.post('http://localhost:5001/messages/send', payload);
      setMessages((prevMessages) => [...prevMessages, response.data.data]); // Append new message
      setCurrentTemplateDescription(''); // Clear input
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Fetch users and templates on mount
  useEffect(() => {
    fetchUsers();
    fetchTemplates();
  }, []);

  // Poll messages for the selected player every second
  useEffect(() => {
    if (selectedPlayer) {
      const intervalId = setInterval(() => {
        fetchMessages(selectedPlayer.playerID);
      }, 1000); // Poll every second

      return () => clearInterval(intervalId); // Cleanup on component unmount or player change
    }
  }, [selectedPlayer]); // Runs whenever selectedPlayer changes

  return (
    <AdminDashboard>
      <div style={{ display: 'flex', flex: 1 }}>
        {/* User List */}
        <div style={{ flex: 0.75, padding: '16px', backgroundColor: 'rgb(249, 249, 249)', marginRight: '8px', borderRadius: '18px', overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
          <h3 style={{ fontSize: '18px', textAlign: 'center' }}>Users</h3>
          {users.length > 0 ? (
          
            <ul style={{ listStyle: 'none', padding: 0 }}>
            {users.map((user) => {
              // Find the last message sent by this user
              const lastMessage = messages
                .filter((msg) => msg.senderId === user.playerID)
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
          
              // Calculate the time difference
              const lastMessageTime = lastMessage ? new Date(lastMessage.timestamp) : null;
              const currentTime = new Date();
              const timeDifference = lastMessageTime
                ? Math.abs(currentTime - lastMessageTime) / (1000 * 60) // Convert to minutes
                : null;
          
              // Determine background color dynamically
              const backgroundColor =
                selectedPlayer?.playerID === user.playerID
                  ? '#e7f3ff' // Highlight selected user
                  : lastMessage && lastMessage.senderId === user.playerID && timeDifference !== null
                  ? timeDifference > 10
                    ? 'red' // Unread message older than 10 minutes
                    : 'orange' // Unread message less than 10 minutes
                  : '#fff'; // Default color for no recent messages
          
              return (
                <li
                  key={user._id}
                  onClick={() => {
                    setSelectedPlayer(user);
                    fetchMessages(user.playerID); // Fetch messages for the selected user immediately
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '8px',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '12px',
                    backgroundColor, // Dynamically set background color
                    cursor: 'pointer',
                  }}
                >
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 'bold', margin: '0' }}>{user.playerID}</p>
                  </div>
                </li>
              );
            })}
          </ul>          
          ) : (
            <p style={{ textAlign: 'center', color: '#555' }}>No users found</p>
          )}
        </div>

        <div style={{ flex: 1.5, padding: '16px', backgroundColor: 'rgb(200 200 200)', borderRadius: '18px', display: 'flex', flexDirection: 'column' }}>
          {selectedPlayer ? (
            <ChatUI
              messages={messages}
              currentTemplateDescription={currentTemplateDescription}
              setCurrentTemplateDescription={setCurrentTemplateDescription}
              handleSendMessage={handleSendMessage}
              selectedPlayer={selectedPlayer}
            />
          ) : (
            <p style={{ textAlign: 'center', color: '#555', margin: 'auto' }}>Select a user to start chatting</p>
          )}
        </div>

        <div style={{ flex: 0.75, padding: '16px', backgroundColor: 'rgb(249, 249, 249)', borderRadius: '18px', overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
          <h3 style={{ fontSize: '18px', textAlign: 'center' }}>Templates</h3>
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
                  <p style={{ fontSize: '14px' }}><strong>{template.templateName}</strong></p>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ textAlign: 'center', color: '#555' }}>No templates found</p>
          )}
        </div>
      </div>
    </AdminDashboard>
  );
};

export default AdminEndUserChat;







