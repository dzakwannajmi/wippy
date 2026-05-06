const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

// ✅ Ambil PORT dari Railway secara otomatis
const PORT = process.env.PORT || 3001;

// ✅ CORS support untuk localhost dev + Vercel production
const ALLOWED_ORIGINS = [
    "http://localhost:5173",
    process.env.FRONTEND_URL,
].filter(Boolean); // hapus undefined kalau FRONTEND_URL belum di-set

const io = new Server(server, {
    cors: {
        origin: ALLOWED_ORIGINS,
        methods: ["GET", "POST"]
    }
});

const activeRooms = {};

io.on('connection', (socket) => {
    console.log('New connection:', socket.id);

    // 1. HOST MEMBUAT ROOM
    socket.on('create_room', (data) => {
        const { roomId, roomPass, hostName } = data;

        activeRooms[roomId] = {
            password: roomPass,
            hostId: socket.id,
            players: [{ id: socket.id, name: hostName, score: 0 }]
        };

        socket.join(roomId);
        io.to(roomId).emit('update_players', activeRooms[roomId].players);
        console.log(`Arena Created: ${roomId} by ${hostName}`);
    });

    // 2. GUEST BERGABUNG
    socket.on('join_room', (data, callback) => {
        const { roomId, roomPass, playerName } = data;
        const room = activeRooms[roomId];

        if (!room) return callback({ status: "error", message: "Arena not found!" });
        if (room.password !== roomPass) return callback({ status: "error", message: "Wrong password!" });

        const isAlreadyIn = room.players.find(p => p.id === socket.id);
        if (!isAlreadyIn) {
            room.players.push({ id: socket.id, name: playerName, score: 0 });
        }

        socket.join(roomId);
        io.to(roomId).emit('update_players', room.players);
        callback({ status: "success" });
    });

    // 3. MULAI GAME
    socket.on('start_game', (data) => {
        const { roomId, category } = data;

        if (activeRooms[roomId]) {
            console.log(`🚀 Arena ${roomId} launching quiz category: ${category}`);
            io.to(roomId).emit('receive_start_game', category);
        }
    });

    // 4. UPDATE SCORE
    socket.on('update_score', (data) => {
        const { roomId, score } = data;
        const room = activeRooms[roomId];
        if (room) {
            const player = room.players.find(p => p.id === socket.id);
            if (player) {
                player.score = score;
                io.to(roomId).emit('update_players', room.players);
            }
        }
    });

    // 5. TERMINATE ROOM
    socket.on('cancel_room', (roomId) => {
        io.to(roomId).emit('room_terminated', "Host telah mengakhiri permainan.");
        delete activeRooms[roomId];
        console.log(`Room ${roomId} terminated by Host`);
    });

    // 6. HANDLING DISCONNECT
    socket.on('disconnecting', () => {
        socket.rooms.forEach(room => {
            if (activeRooms[room] && activeRooms[room].hostId === socket.id) {
                io.to(room).emit('room_terminated', "Host terputus. Ruangan dibubarkan.");
                delete activeRooms[room];
            }
        });
    });

    socket.on('disconnect', () => {
        console.log('User Disconnected:', socket.id);
    });
});

// ✅ Gunakan PORT dari env, bukan hardcoded 3001
server.listen(PORT, () => {
    console.log(`🚀 WIPPY ENGINE READY ON PORT ${PORT}`);
});