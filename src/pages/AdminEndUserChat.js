import React, { useState, useEffect,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import EmojiPicker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
const baseURL = process.env.REACT_APP_BASE_URL;


const ChatUI = ({
  messages,
  currentTemplateDescription,
  setCurrentTemplateDescription,
  handleSendMessage,
  selectedPlayer,
  file,         // ✅ Receive file prop
  setFile       // ✅ Receive setFile function
}) => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const fileInputRef = useRef(null); // Reference for the file input
    

    const addEmoji = (emoji) => {
      setCurrentTemplateDescription((prev) => prev + emoji.native);
      setShowEmojiPicker(false);
    };

  //   const handleDeleteMessage = async (messageId) => {
  //     alert(messageId);
  //     try {
  //         const response = await axios.put(`${baseURL}/delete/${messageId}`); // ✅ No body needed
  
  //         if (response.data.success) {
  //             console.log('Message deleted successfully:', response.data.data);
  //         }
  //     } catch (error) {
  //         console.error('Error deleting message:', error);
  //     }
  // };  
//   const handleDeleteMessage = async (messageId) => {
//     try {
//         const response = await axios.put(`${baseURL}/delete/${messageId}`, {}, {
//             headers: { Authorization: "Admin123" } // Example header for `deletedBy`
//         });
//        alert(response.data);
//         if (response.data.success) {
//             console.log('Message deleted successfully:', response.data.data);
//         }
//     } catch (error) {
//         console.error('Error deleting message:', error);
//     }
// };
const handleDeleteMessage = async (messageId) => {
  try {

      const response = await axios.put(
          `${baseURL}/messages/delete/${messageId}`, // ✅ Correct API endpoint
          {}, // ✅ Empty object (required in Axios PUT)
          {
              headers: { 
                  Authorization: localStorage.getItem('authToken') // ✅ Ensure the header is passed
              }
          }
      );

      console.log('Response:', response.data);

      if (response.data.success) {
          console.log('Message deleted successfully:', response.data.data);
      } else {
          console.error('Failed to delete message:', response.data.message);
      }
  } catch (error) {
      console.error('Error deleting message:', error.response?.data || error);
  }
};

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'white', borderRadius: '18px' }}>
          <p style={{ textAlign: 'center', width: '100%' }}>
    <strong>Chatting with:</strong> (ID: {selectedPlayer.userId})
         </p>
            {/* Chat Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', backgroundColor: '#f9f9f9' }}>
        {messages.map((msg, index) => (
                    <div
                key={index}
                   style={{
                   display: 'flex',
                 justifyContent: msg.senderId === localStorage.getItem('authToken') 
                ? 'flex-end' // ✅ Sent messages on the right
                : 'flex-start', // ✅ Received messages on the left
                 marginBottom: '10px',
                    position: 'relative',
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
                backgroundColor: msg.senderId === localStorage.getItem('authToken') 
                    ? 'rgb(209, 231, 221)'  // ✅ Light green for sent messages
                    : 'rgb(255, 255, 255)', // ✅ White for received messages
                color: 'rgb(0, 0, 0 / 58%)',
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
                    <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer">View PDF</a>
                ) : (
                    <img src={msg.fileUrl} alt="Uploaded file" 
                         style={{ maxWidth: '200px', borderRadius: '8px', marginTop: '8px' }} />
                )
            )}<div>

<small>
            {msg.senderId !== localStorage.getItem('authToken') && (
            <button
            onClick={() => handleDeleteMessage(msg._id)}
                style={{                  
                    // position: 'absolute',
                    // left: '170px', // ✅ Moves the delete icon to the left
                    // top: '85%',
                    // transform: 'translateY(-50%)', // ✅ Centers the icon vertically
                    background: 'transparent',
                     border: 'none',
                    cursor: 'pointer',
                }}
            >
                <FontAwesomeIcon icon={faTrash} style={{ color: 'red', fontSize: '16px' }} />
            </button>
        )}
            </small>
            </div>
        </div>
    </div>
))}

            </div>

            {/* Message Input Box */}
            <form onSubmit={handleSendMessage} style={{ display: 'flex', alignItems: 'center', padding: '8px', backgroundColor: '#3e3e3e', borderRadius: '24px' }}>
                
                {/* Emoji Picker Button */}
                <button type="button" onClick={() => setShowEmojiPicker(prev => !prev)} style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#fff' }}>
                    😊
                </button>

                {/* File Upload Button */}
                <input
                    type="file"
                    accept="image/*,.pdf"
                    ref={fileInputRef}
                    onChange={(e) => setFile(e.target.files[0])} // ✅ Set file on change
                    style={{ display: 'none' }}
                    id="fileInput"
                />
                <label htmlFor="fileInput" style={{ cursor: 'pointer', marginRight: '12px', color: '#00FF7F', fontSize: '20px' }}>
                    📎
                </label>

                {/* Text Input */}
                <input
                    type="text"
                    placeholder="Text here..."
                    value={currentTemplateDescription}
                    onChange={(e) => setCurrentTemplateDescription(e.target.value)}
                    style={{ flex: 1, padding: '10px', borderRadius: '24px', border: 'none', backgroundColor: '#555555', color: '#fff', fontSize: '16px' }}
                />

                {/* Send Button */}
                <button type="submit" style={{ marginLeft: '12px', backgroundColor: '#32CD32', border: 'none', borderRadius: '24px', padding: '10px 20px', color: '#fff', fontSize: '16px', cursor: 'pointer' }}>
                    ➤
                </button>
            </form>

            {/* Emoji Picker */}
            {showEmojiPicker && (
                <div style={{ position: 'absolute', bottom: '100px', left: '16px', zIndex: 100 }}>
                    <EmojiPicker data={data} onEmojiSelect={addEmoji} />
                </div>
            )}
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
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null); // Define the file input reference
  


  // Fetch all users who have communicated with Admin
  // const fetchUsers = async () => {
  //   try {
  //     const response = await axios.get(`${baseURL}/Player/getAllPlayers`);
  //     const filteredPlayers = response.data.data.filter((player) => player.userId !== "" && player.roleId === 3);
  //     console.log(filteredPlayers);
  //     setUsers(filteredPlayers);
  //   } catch (error) {
  //     console.error('Error fetching users:', error);
  //   }
  // };
  const fetchUsers = async () => {
    try {
        const response = await axios.get(`${baseURL}/Player/getAllPlayers`);
        const players = response.data.data.filter(player => player.userId !== "" && player.roleId === 3);

        // Fetch messages for each user to check if unread
        const messagesResponse = await axios.get(`${baseURL}/messages`);
        const allMessages = messagesResponse.data.data;

        // Update users with last message details
        const updatedUsers = players.map(user => {
            const lastMessage = allMessages
                .filter(msg => msg.senderId === user.userId)
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];

            const lastMessageTime = lastMessage ? new Date(lastMessage.timestamp) : null;
            const currentTime = new Date();
            const timeDifference = lastMessageTime
                ? Math.abs(currentTime - lastMessageTime) / (1000 * 60) // Convert milliseconds to minutes
                : null;

            // Determine background color
            let backgroundColor = "#fff"; // Default color
            if (lastMessage && !lastMessage.isSeen) {
                backgroundColor = timeDifference > 10 ? "red" : "orange"; // Red if more than 10 minutes, else Yellow (orange)
            }

            return { ...user, backgroundColor };
        });

        setUsers(updatedUsers);
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};

  // Fetch templates for quick replies
  const fetchTemplates = async () => {
    try {
      const response = await axios.get(`${baseURL}/template/GetAllTemplates`);
      setTemplates(response.data.data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  // Fetch messages between Admin and selected user
  const fetchMessages = async (userId) => {
    try {
      const response = await axios.get(`${baseURL}/messages`, {
        params: { senderId: userId,
        receiverId:  localStorage.getItem('authToken')},
        
      });
      console.log(response.data.data);
      // ✅ Filter messages for the selected user
      const filteredMessages = response.data.data.filter(
        msg =>((msg.senderId === userId || msg.receiverId === userId) && msg.isDeleted === false)
    );

    // // ✅ Sort messages by latest timestamp (newest first)
    // const sortedMessages = filteredMessages.sort(
    //     (a, b) => new Date(b.timestamp) - new Date(a.timestamp) // Newest first
    // );

    setMessages(filteredMessages); // ✅ Update state with sorted messages
    console.log(filteredMessages); // ✅ Debug log to verify sorting

    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!currentTemplateDescription.trim() && !file) return; // Prevent empty messages

    const formData = new FormData();
    formData.append('senderId', localStorage.getItem('authToken'));
    formData.append('receiverId', selectedPlayer.userId);
    formData.append('message', currentTemplateDescription);
    
    if (file) {
        formData.append('file', file); // Append the file correctly
    }

    try {
        const response = await axios.post(`${baseURL}/messages/send`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        setMessages((prevMessages) => [...prevMessages, response.data.data]); // Append new message
        setCurrentTemplateDescription(''); // Clear input field
        setFile(null); // Clear file selection
        fileInputRef.current.value = ''; // Reset file input
    } catch (error) {
        console.error('Error sending message:', error);
    }
};

  // Fetch users and templates on mount
  // useEffect(() => {
  //   fetchUsers();
  //   fetchTemplates();
  // }, []);
  useEffect(() => {
    fetchUsers();
    fetchTemplates();
    const interval = setInterval(fetchUsers, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
}, []);


  // Poll messages for the selected player every second
  useEffect(() => {
    if (selectedPlayer) {
      const intervalId = setInterval(() => {
        fetchMessages(selectedPlayer.userId);
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
    {users.map((user) => (
        <li
            key={user._id}
           
            onClick={() => {
              console.log(`Clicked on user: ${user.userId}`); // ✅ Debug log
          
              setSelectedPlayer(user);
              fetchMessages(user.userId);
          
              // ✅ Verify if `localStorage.getItem('authToken')` is correct
              console.log("Receiver ID (Admin):", localStorage.getItem('authToken'));
          
              // ✅ Call API and log response
              axios.put(`${baseURL}/messages/markAsSeen`, {
                  senderId: user.userId,
                  receiverId: localStorage.getItem('authToken')
              })
              .then(response => {
                  console.log("Messages marked as seen:", response.data);
              })
              .catch(error => {
                  console.error("Error marking messages as seen:", error);
              });
          }}          
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '8px',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '12px',
                backgroundColor: user.backgroundColor, // ✅ Use dynamic background color
                cursor: 'pointer',
            }}
        >
            <div>
                <p style={{ fontSize: '14px', fontWeight: 'bold', margin: '0' }}>{user.userId}</p>
            </div>
        </li>
    ))}
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
            file={file}  // ✅ Pass file state
            setFile={setFile} // ✅ Pass setFile function
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







