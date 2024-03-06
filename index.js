const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');

const httpServer = http.createServer((req, res) => {
    if (req.url === '/') {
        // Serve the HTML page for checking WebSocket state
        res.end('Hello, World!');
    } else {
        res.writeHead(404);
        res.end('Page not found');
    }
});

const io = new Server(httpServer);

let nextRoomId = 1; // Initialize the room ID counter

io.on('connection', (socket) => {
    console.log('A client connected');

    socket.on('createRoom', () => {
        const roomId = `r${nextRoomId++}`; // Generate the room ID
        socket.join(roomId); // Join the newly created room
        socket.emit('roomCreated', roomId); // Send the room ID to the client
        console.log(`Room ${roomId} created`);
    });

    socket.on('join', (roomId, name) => {
        console.log(`${name} joined room: ${roomId}`);
        socket.join(roomId);
    });

    socket.on('message', ({ room, name, text }) => {
        console.log(`Message received in room ${room} from ${name}: ${text}`);
        socket.to(room).emit('message', { name, text });
    });

    socket.on('leave', (room) => {
        console.log(`Client left room: ${room}`);
        socket.leave(room);
    });
});

const WS_PORT = process.env.WS_PORT || 3001;
httpServer.listen(WS_PORT, () => {
    console.log(`WebSocket server running on port ${WS_PORT}`);
});
