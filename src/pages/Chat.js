import React, { useState, useEffect } from 'react';
import axios from 'axios';
import socket from './Socket'; // Import the socket instance
import ChatUI from './ChatUI'; // Import the ChatUI component
const baseURL = process.env.REACT_APP_BASE_URL;

const Chat = ({ currentUserId, selectedUserId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  // Fetch message history when the component mounts or the selected user changes
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${baseURL}/messages`, {
          params: {
            senderId: currentUserId,
            receiverId: selectedUserId,
          },
        });
        setMessages(response.data.data);
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };

    if (selectedUserId) {
      fetchMessages();
    }
  }, [currentUserId, selectedUserId]);

  // Listen for real-time messages
  useEffect(() => {
    socket.on('receiveMessage', (message) => {
      if (
        (message.senderId === selectedUserId && message.receiverId === currentUserId) ||
        (message.senderId === currentUserId && message.receiverId === selectedUserId)
      ) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [currentUserId, selectedUserId]);

  // Handle sending messages
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (newMessage.trim()) {
      const messageData = {
        senderId: currentUserId,
        receiverId: selectedUserId,
        message: newMessage,
        timestamp: new Date().toISOString(),
      };

      // Emit the message via WebSocket
      socket.emit('sendMessage', messageData);

      // Update UI immediately
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setNewMessage('');

      // Optionally save to backend (if required)
      try {
        await axios.post(`${baseURL}/messages/send`, messageData);
      } catch (err) {
        console.error('Error sending message:', err);
      }
    }
  };

  return (
    <ChatUI
      messages={messages}
      currentUserId={currentUserId}
      setCurrentTemplateDescription={setNewMessage} // Bind input state
      currentTemplateDescription={newMessage} // Bind message state
      selectedPlayer={selectedPlayer} // Pass the selected player
      handleSendMessage={handleSendMessage} // Bind send handler
    />
  );
};

export default Chat;
