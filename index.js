const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer();
const io = new Server(server);

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
        console.log(`Message received in room ${room}  from ${name}: ${text}`);
        socket.to(room).emit('message', { name, text });
    });

    socket.on('leave', (room) => {
        console.log(`Client left room: ${room}`);
        socket.leave(room);
    });
});




const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Socket server running on port ${PORT}`);
});
