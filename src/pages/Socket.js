import { io } from 'socket.io-client';
const baseURL = process.env.REACT_APP_BASE_URL;

const socket = io(`${baseURL}`);
export default socket;
