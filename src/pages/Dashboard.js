import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import EmojiPicker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import axios from 'axios';

const Dashboard = () => {
  const location = useLocation();
  const { playerID } = location.state || {}; // Logged-in user's ID

  const [messages, setMessages] = useState([]);
  const [currentTemplateDescription, setCurrentTemplateDescription] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [file, setFile] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const chatContainerRef = useRef(null);
  const fileInputRef = useRef(null); // Reference for the file input
  const isAtBottomRef = useRef(true); // Tracks if the user is at the bottom of the chat
  const navigate = useNavigate();

  // Scroll to the bottom of the chat
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  // Fetch messages and add welcome message if no messages exist
  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://localhost:5001/messages', {
        params: { senderId: playerID },
      });
      const fetchedMessages = response.data.data;

      // If no messages exist, fetch welcome messages and add one if available
      if (fetchedMessages.length === 0) {
        const welcomeResponse = await axios.get('http://localhost:5001/welcomeMessage/GetAllWelcomeMessages');
        const welcomeMessages = welcomeResponse.data.data;

        if (welcomeMessages.length > 0) {
          const defaultMessage = welcomeMessages[0]; // Use the first welcome message
          setMessages([{
            senderId: 'Admin',
            receiverId: playerID,
            message: defaultMessage.message,
            timestamp: defaultMessage.createdDate,
            isSeen: true,
          }]);
        }
      } else {
        setMessages(fetchedMessages);
      }

      await axios.put('http://localhost:5001/messages/markAsSeen', {
        senderId: 'Admin',
        receiverId: playerID,
      });

      if (isAtBottomRef.current) {
        scrollToBottom();
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    if (playerID) {
      fetchMessages();
      const intervalId = setInterval(fetchMessages, 1000);
      return () => clearInterval(intervalId);
    }
  }, [playerID]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!currentTemplateDescription.trim() && !file) return;

    setIsSending(true);

    const formData = new FormData();
    formData.append('senderId', playerID);
    formData.append('receiverId', 'Admin');
    formData.append('message', currentTemplateDescription);
    if (file) {
      formData.append('file', file);
    }

    try {
      const response = await axios.post('http://localhost:5001/messages/send', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessages((prevMessages) => [...prevMessages, response.data.data]);
      setCurrentTemplateDescription('');
      setFile(null);

      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const addEmoji = (emoji) => {
    setCurrentTemplateDescription((prev) => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    navigate('/');
  };

  return (
    <div style={{ fontFamily: 'Roboto, sans-serif', height: '100vh', padding: '16px', backgroundColor: 'rgb(231, 228, 228)' }}>
      <div style={{ textAlign: 'center', backgroundColor: 'rgb(88 98 97)', color: '#fff', padding: '8px' }}>
        <h1 style={{ margin: 0 }}>Welcome - {playerID}</h1>
      </div>
      <div style={{ textAlign: 'right', backgroundColor: 'rgb(88 98 97)', color: '#fff', padding: '8px' }}>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            padding: '4px 8px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Logout
        </button>
      </div>

      <div
        ref={chatContainerRef}
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100% - 100px)',
          marginTop: '16px',
          overflowY: 'auto',
          padding: '16px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          backgroundImage:
            'linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.9)), url("https://png.pngtree.com/png-vector/20230726/ourmid/pngtree-colored-line-drawings-of-items-like-nintendo-ds-controller-png-image_6746109.png")',
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: msg.senderId === playerID ? 'flex-end' : 'flex-start',
              marginBottom: '12px',
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '4px', color: '#6c757d' }}>
              {msg.senderId}
            </div>

            <div
              style={{
                maxWidth: '60%',
                padding: '10px',
                borderRadius: '8px',
                backgroundColor: msg.senderId === playerID ? '#d1e7dd' : '#f8d7da',
                color: msg.senderId === playerID ? '#0f5132' : '#842029',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                border: msg.isSeen ? '1px solid #d1e7dd' : '2px solid #007bff',
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
            </div>
          </div>
        ))}
      </div>
      <form
        style={{ display: 'flex', padding: '16px', backgroundColor: '#f8f9fa', alignItems: 'center' }}
        onSubmit={handleSendMessage}
      >
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
            flex: 1,
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
        <button
          type="submit"
          style={{
            marginLeft: '8px',
            padding: '10px 16px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
          disabled={isSending}
        >
          {isSending ? 'Sending...' : 'Send'}
        </button>
      </form>
      {showEmojiPicker && (
        <div style={{ position: 'absolute', bottom: '100px', left: '16px', zIndex: 100 }}>
          <EmojiPicker data={data} onEmojiSelect={addEmoji} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
