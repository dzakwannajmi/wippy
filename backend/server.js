const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const PORT = process.env.APP_PORT || 8080;

const ALLOWED_ORIGINS = [
    "http://localhost:5173",
    process.env.FRONTEND_URL,
].filter(Boolean);

const io = new Server(server, {
    cors: {
        origin: ALLOWED_ORIGINS,
        methods: ["GET", "POST"]
    }
});

// =============================================
// DATABASE CONNECTION
// =============================================
let pool;

async function connectDB() {
    try {
        console.log("🔌 Connecting to DB...");

        pool = mysql.createPool({
            host: process.env.MYSQLHOST,
            port: parseInt(process.env.MYSQLPORT),
            user: process.env.MYSQLUSER,
            password: process.env.MYSQLPASSWORD,
            database: process.env.MYSQLDATABASE,
            waitForConnections: true,
            connectionLimit: 10,
            connectTimeout: 60000,
            ssl: { rejectUnauthorized: false }
        });

        const conn = await pool.getConnection();
        console.log("✅ Database connected successfully");
        conn.release();

        await pool.execute(`
            CREATE TABLE IF NOT EXISTS leaderboard (
                id INT AUTO_INCREMENT PRIMARY KEY,
                player_name VARCHAR(255) NOT NULL,
                score INT DEFAULT 0,
                accuracy FLOAT DEFAULT 0,
                avg_time FLOAT DEFAULT 0,
                room_id VARCHAR(255) DEFAULT 'Global',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log("✅ Table leaderboard ready");
    } catch (err) {
        console.error("❌ Database connection failed:", err.message);
    }
}

connectDB();

// =============================================
// API ROUTES (Pengganti PHP)
// =============================================

// GET /api/leaderboard — pengganti get_leaderboard.php
app.get('/api/leaderboard', async (req, res) => {
    try {
        const [rows] = await pool.execute(`
            SELECT player_name, score, accuracy, avg_time
            FROM leaderboard
            ORDER BY score DESC, accuracy DESC
            LIMIT 10
        `);
        res.json(rows);
    } catch (err) {
        console.error("❌ Leaderboard error:", err.message);
        res.status(500).json({ status: "error", message: err.message });
    }
});

// POST /api/save-score — pengganti save_score.php
app.post('/api/save-score', async (req, res) => {
    try {
        const {
            playerName = "Anonymous",
            score = 0,
            accuracy = 0,
            avgTime = 0,
            roomId = "Global"
        } = req.body;

        // Cek apakah player sudah ada di room ini
        const [existing] = await pool.execute(
            "SELECT id FROM leaderboard WHERE player_name = ? AND room_id = ?",
            [playerName, roomId]
        );

        if (existing.length > 0) {
            return res.json({ status: "success", message: "Legend already recorded!" });
        }

        await pool.execute(
            "INSERT INTO leaderboard (player_name, score, accuracy, avg_time, room_id) VALUES (?, ?, ?, ?, ?)",
            [playerName, score, accuracy, avgTime, roomId]
        );

        res.json({ status: "success", message: "Score Saved!" });
    } catch (err) {
        console.error("❌ Save score error:", err.message);
        res.status(500).json({ status: "error", message: err.message });
    }
});

// Health check
app.get('/', (req, res) => {
    res.json({ status: "ok", message: "🚀 Wippy Engine Running" });
});

// =============================================
// SOCKET.IO
// =============================================
const activeRooms = {};

io.on('connection', (socket) => {
    console.log('New connection:', socket.id);

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

    socket.on('start_game', (data) => {
        const { roomId, category } = data;
        if (activeRooms[roomId]) {
            console.log(`🚀 Arena ${roomId} launching: ${category}`);
            io.to(roomId).emit('receive_start_game', category);
        }
    });

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

    socket.on('cancel_room', (roomId) => {
        io.to(roomId).emit('room_terminated', "Host telah mengakhiri permainan.");
        delete activeRooms[roomId];
        console.log(`Room ${roomId} terminated by Host`);
    });

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

server.listen(PORT, () => {
    console.log(`🚀 WIPPY ENGINE READY ON PORT ${PORT}`);
});