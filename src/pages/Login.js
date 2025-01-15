import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [playerID, setPlayerID] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!playerID || !playerName) {
      setErrorMessage('Both fields are required.');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5001/player/GetByPlayerID/${playerID}`);
      if (response.data.message === 'Player found') {

       const player = response.data.data;
        // Store the auth token in localStorage
        // localStorage.setItem('authToken', player.playerID);  // Assuming playerID is the token
        if (player.isAdmin) {
          navigate('/AdminDashboard', { state: { playerID, playerName, isAdmin: player.isAdmin } });
        } else {
          navigate('/Dashboard', { state: { playerID, playerName, isAdmin: player.isAdmin } });
        }
      } else {
        setErrorMessage('Player not found');
      }
    } catch (error) {
      setErrorMessage('Error connecting to the server');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.image}></div>
        <div style={styles.form}>
          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.subtitle}>Please login to your account</p>
          <input
            type="text"
            placeholder="Enter Player ID"
            value={playerID}
            onChange={(e) => setPlayerID(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Enter Password"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            style={styles.input}
          />
          <button onClick={handleLogin} style={styles.button}>Login</button>
          {errorMessage && <p style={styles.error}>{errorMessage}</p>}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: 'rgb(88, 98, 97)',
    fontFamily: 'Roboto, sans-serif', // Apply Roboto font
  },
  card: {
    display: 'flex',
    width: '750px',
    height: '350px',
    backgroundColor: 'rgb(200, 200, 200)',
    borderRadius: '18px',
    overflow: 'hidden',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)',
  },
  image: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    backgroundImage: `url('images/flag.png')`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    backgroundSize: 'contain',
  },
  form: {
    flex: 1,
    padding: '10px',
    color: 'rgb(88, 98, 97)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderLeft: '1px dotted rgb(44, 44, 46)',
  },
  title: {
    color: 'rgb(41 41 151)',
    fontSize: '24px',
    marginBottom: '10px',
    textAlign: 'center',
  },
  subtitle: {
    color: 'rgb(0 0 0)',
    fontSize: '14px',
    marginBottom: '30px',
    textAlign: 'center',
  },
  input: {
    width: '80%',
    padding: '12px',
    marginBottom: '15px',
    border: '2px solid white',
    borderRadius: '5px',
    backgroundColor: '#393e46',
    color: '#eeeeee',
    fontSize: '16px',
  },
  button: {
    width: '50%',
    padding: '10px',
    border: 'none',
    borderRadius: '25px',
    backgroundColor: 'rgb(0 123 255)',
    color: '#ffffff',
    fontSize: '16px',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'background-color 0.3s',
    marginTop: '20px',
  },
  error: {
    color: '#ff4d4d',
    marginTop: '10px',
    textAlign: 'center',
  },
};

export default Login;
