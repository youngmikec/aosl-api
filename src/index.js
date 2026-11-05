import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import { Server } from 'socket.io';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import compression from 'compression';
import helmet from 'helmet';

import appApi from "./api/index.js";
import database from "./config/index.js";
import { registerChatSocket } from "./api/chat/socket.js";
import { migrateChatRooms } from "./api/chat/services.js";

// CORS options
const corsOptions = {
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}


// app port number
const port = process.env.PORT || 3000;

const app = express();

database.once('open', () => {
    console.log('Successfully connected to database');
    // One-off, idempotent: tags chat rooms created before room types existed.
    migrateChatRooms()
        .then((count) => count && console.log(`Upgraded ${count} chat room(s)`))
        .catch((err) => console.log('Chat room upgrade failed:', err.message));
})

database.on('close', () => {
    database.removeAllListeners();
})

app.use(helmet())
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))
app.use(bodyParser.json({ limit: '50mb' }))
app.use(cors())
app.use(compression())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('AOSL backend says hi')
})

// Use Routes
app.use("/api/welcome", (req, res) => {
    res.send('AOSL says Hi')
});
app.use("/api", appApi);


// Origins allowed to open a chat socket: the website and admin apps. Add more with CORS_ORIGINS (comma separated).
const socketOrigins = [
    process.env.FRONTEND_URL,
    ...(process.env.CORS_ORIGINS || '').split(','),
    'http://localhost:3000',
    'http://localhost:3001',
]
    .map((origin) => (origin || '').trim().replace(/\/$/, ''))
    .filter(Boolean);

// Socket.IO needs the underlying HTTP server, so the app is served through it instead of app.listen.
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: socketOrigins, credentials: true },
    // Messages are short; refuse anything large before it is parsed.
    maxHttpBufferSize: 1e5,
});
registerChatSocket(io);

server.listen(port, (error) => {
    if(error){
        console.log(`Error starting app in port ${ port }`);
    }
    console.log(`server running on port ${port}`);
})

let connections = [];

server.on('connection', (connection) => {
    connections.push(connection);
    // eslint-disable-next-line no-return-assign
    connection.on('close', () => connection = connections.filter(current => current != connection));
    console.log(`${connections.length} connections`);
});

export default app;
// module.exports = app;
