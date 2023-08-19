import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { io } from 'socket.io-client';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

const socket = io('https://online-server-games.onrender.com');
socket.connect();
socket.on('error', (error) => {
    console.error('Socket error:', error);
});

root.render(
    <React.StrictMode>
        <App socket={socket} />
    </React.StrictMode>
);
