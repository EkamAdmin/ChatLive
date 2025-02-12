import React, { useState } from 'react';
import axios from 'axios';
const baseURL = process.env.REACT_APP_BASE_URL;

const ChatUI = ({ currentTemplateDescription, setCurrentTemplateDescription, selectedPlayer }) => {
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async (e) => {
    alert('Hello Send');
    e.preventDefault();

    if (!selectedPlayer || !currentTemplateDescription.trim()) {
      alert('Please select a player and type a message.');
      return;
    }

    setIsSending(true);

    const payload = {
      senderId: "currentUserId", // Replace with the actual sender's ID
      receiverId: selectedPlayer.playerID, // Receiver ID
      message: currentTemplateDescription,
      fileUrl: "", // Add file upload handling here if needed
      fileType: "", // Specify file type if needed
    };

    try {
      const response = await axios.post(`${baseURL}/messages/send`, payload);
      console.log('Message sent:', response.data);

      // Optionally clear the input field
      setCurrentTemplateDescription('');

      // Update the UI with the new message (if necessary)
      // Example: setMessages([...messages, response.data.data]);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send the message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

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
            {/* <p><strong>Chatting with:</strong> {selectedPlayer.playerName} (ID: {selectedPlayer.playerID})</p> */}
            <p><strong>Chatting with:</strong> (ID: {selectedPlayer.playerID})</p>
          </div>
        )}
      </div>
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
        }} onSubmit={handleSendMessage}>
          
          <input
            type="text"
            placeholder="Type a message..."
            value={currentTemplateDescription}  // Append template description
            onChange={(e) => setCurrentTemplateDescription(e.target.value)} // Allow editing
            style={{
              width: 'calc(100% - 120px)',
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
            disabled={isSending} // Disable button while sending
          >
            {isSending ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatUI;
