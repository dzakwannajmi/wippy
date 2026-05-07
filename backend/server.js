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
    "https://wippy-rosy.vercel.app",
    "https://wippy-git-main-dzakwannajmis-projects.vercel.app",
    process.env.FRONTEND_URL,
].filter(Boolean);

const io = new Server(server, {
    cors: {
        origin: ALLOWED_ORIGINS,
        methods: ["GET", "POST"]
    }
});

// =============================================
// DATABASE
// =============================================
let pool;

async function connectDB() {
    try {
        console.log("🔌 Connecting to DB...");
        pool = mysql.createPool({
            host:     process.env.MYSQLHOST     || "shortline.proxy.rlwy.net",
            port:     parseInt(process.env.MYSQLPORT) || 27837,
            user:     process.env.MYSQLUSER     || "root",
            password: process.env.MYSQLPASSWORD || "UpecDTEIvcUcUGJzYPXlhdwjAQNJBNcQ",
            database: process.env.MYSQLDATABASE || "railway",
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
                id          INT AUTO_INCREMENT PRIMARY KEY,
                player_name VARCHAR(255) NOT NULL,
                score       INT          DEFAULT 0,
                accuracy    FLOAT        DEFAULT 0,
                avg_time    FLOAT        DEFAULT 0,
                room_id     VARCHAR(255) DEFAULT 'Global',
                created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log("✅ Table leaderboard ready");
    } catch (err) {
        console.error("❌ Database connection failed:", err.message);
    }
}

connectDB();

// =============================================
// API ROUTES
// =============================================
app.get('/', (req, res) => {
    res.json({ status: "ok", message: "🚀 Wippy Engine Running" });
});

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

app.post('/api/save-score', async (req, res) => {
    try {
        const {
            playerName = "Anonymous",
            score      = 0,
            accuracy   = 0,
            avgTime    = 0,
            roomId     = "Global"
        } = req.body;

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

// =============================================
// QUESTION BANK
// =============================================
const QUESTION_BANK = {
    PHP: [
        { question: "Apa fungsi dari 'echo' di PHP?", options: ["Input Data", "Output Teks", "Hapus Variabel", "Koneksi Database"], answer: 1 },
        { question: "Variabel di PHP selalu dimulai dengan simbol?", options: ["#", "@", "$", "&"], answer: 2 },
        { question: "Fungsi untuk mendapatkan panjang string di PHP?", options: ["length()", "strlen()", "strcount()", "size()"], answer: 1 },
        { question: "Cara menulis komentar satu baris di PHP?", options: ["/* komentar */", "<!-- komentar -->", "// komentar", "## komentar"], answer: 2 },
        { question: "Fungsi untuk menggabungkan array di PHP?", options: ["array_merge()", "array_join()", "array_combine()", "array_push()"], answer: 0 },
        { question: "Cara membuat array di PHP?", options: ["array = []", "$array = []", "#array = []", "@array = []"], answer: 1 },
        { question: "Fungsi untuk mengubah string menjadi huruf besar di PHP?", options: ["toUpper()", "str_upper()", "strtoupper()", "uppercase()"], answer: 2 },
        { question: "Apa ekstensi file PHP?", options: [".ph", ".php", ".php3", ".phpp"], answer: 1 },
        { question: "Operator perbandingan identik di PHP adalah?", options: ["==", "!=", "===", "!=="], answer: 2 },
        { question: "Fungsi untuk menghitung jumlah elemen array di PHP?", options: ["length()", "size()", "count()", "total()"], answer: 2 },
        { question: "Cara mengakses elemen pertama array $arr di PHP?", options: ["$arr[1]", "$arr[0]", "$arr.first()", "$arr->0"], answer: 1 },
        { question: "Fungsi untuk mengecek apakah variabel kosong di PHP?", options: ["isNull()", "isEmpty()", "empty()", "isVoid()"], answer: 2 },
        { question: "Apa output dari: echo 10 % 3; di PHP?", options: ["3", "1", "0", "2"], answer: 1 },
        { question: "Cara include file lain di PHP?", options: ["import 'file.php'", "require 'file.php'", "load 'file.php'", "fetch 'file.php'"], answer: 1 },
        { question: "Superglobal untuk mengambil data dari form POST di PHP?", options: ["$_GET", "$_POST", "$_REQUEST", "$_FORM"], answer: 1 },
        { question: "Fungsi untuk memecah string menjadi array di PHP?", options: ["str_split()", "explode()", "split()", "chunk()"], answer: 1 },
        { question: "Cara mendefinisikan konstanta di PHP?", options: ["const NAME = value", "define('NAME', value)", "let NAME = value", "final NAME = value"], answer: 1 },
        { question: "Fungsi untuk mengecek tipe data di PHP?", options: ["typeOf()", "gettype()", "checktype()", "typeof()"], answer: 1 },
        { question: "Apa fungsi isset() di PHP?", options: ["Menghapus variabel", "Mengecek apakah variabel sudah didefinisikan dan tidak null", "Membuat variabel baru", "Mengeset nilai variabel"], answer: 1 },
        { question: "Cara membuat loop yang pasti dijalankan minimal sekali di PHP?", options: ["for", "while", "do...while", "foreach"], answer: 2 },
    ],
    JAVASCRIPT: [
        { question: "Cara mendeklarasikan variabel yang nilainya tidak bisa diubah?", options: ["let", "var", "const", "static"], answer: 2 },
        { question: "Apa hasil dari typeof []?", options: ["array", "object", "null", "undefined"], answer: 1 },
        { question: "Method array untuk menambah elemen di akhir?", options: ["push()", "pop()", "shift()", "unshift()"], answer: 0 },
        { question: "Cara membuat arrow function di JavaScript?", options: ["function => () {}", "const fn = () => {}", "fn() -> {}", "def fn() {}"], answer: 1 },
        { question: "Apa hasil dari: console.log(0 == '0')?", options: ["false", "true", "undefined", "error"], answer: 1 },
        { question: "Apa hasil dari: console.log(0 === '0')?", options: ["true", "false", "undefined", "error"], answer: 1 },
        { question: "Method untuk menghapus elemen terakhir array?", options: ["push()", "pop()", "slice()", "splice()"], answer: 1 },
        { question: "Cara mengakses properti objek di JavaScript?", options: ["obj->name", "obj::name", "obj.name", "obj[name]"], answer: 2 },
        { question: "Fungsi built-in untuk mengubah string ke integer?", options: ["toInt()", "parseInt()", "Number.toInt()", "convertInt()"], answer: 1 },
        { question: "Apa itu closure di JavaScript?", options: ["Fungsi yang menutup program", "Fungsi yang mengakses variabel dari scope luarnya", "Cara menutup koneksi database", "Method untuk menutup modal"], answer: 1 },
        { question: "Method array untuk membuat array baru hasil transformasi?", options: ["forEach()", "filter()", "map()", "reduce()"], answer: 2 },
        { question: "Apa hasil dari: typeof null?", options: ["null", "undefined", "object", "string"], answer: 2 },
        { question: "Cara membuat Promise di JavaScript?", options: ["new Promise((resolve, reject) => {})", "Promise.create(() => {})", "async Promise() {}", "promise(() => {})"], answer: 0 },
        { question: "Apa fungsi dari async/await di JavaScript?", options: ["Membuat kode berjalan lebih cepat", "Menangani operasi asynchronous dengan syntax yang lebih bersih", "Membuat multiple thread", "Mengoptimasi performa"], answer: 1 },
        { question: "Method untuk menggabungkan dua array di JavaScript?", options: ["join()", "merge()", "concat()", "combine()"], answer: 2 },
        { question: "Apa itu event bubbling di JavaScript?", options: ["Animasi gelembung di CSS", "Event yang merambat dari child ke parent element", "Cara membuat event baru", "Method untuk menghapus event listener"], answer: 1 },
        { question: "Cara destructuring array di JavaScript?", options: ["const {a, b} = arr", "const [a, b] = arr", "const (a, b) = arr", "const <a, b> = arr"], answer: 1 },
        { question: "Apa hasil dari: [1,2,3].reduce((acc, val) => acc + val, 0)?", options: ["123", "6", "0", "undefined"], answer: 1 },
        { question: "Spread operator di JavaScript menggunakan simbol?", options: ["..", "...", "**", "->"], answer: 1 },
        { question: "Method untuk mengecek apakah semua elemen array memenuhi kondisi?", options: ["some()", "every()", "find()", "includes()"], answer: 1 },
    ],
    REACT: [
        { question: "Hook untuk menyimpan state di functional component?", options: ["useEffect", "useRef", "useState", "useContext"], answer: 2 },
        { question: "Hook untuk side effects di React?", options: ["useState", "useEffect", "useCallback", "useMemo"], answer: 1 },
        { question: "Cara passing data dari parent ke child component?", options: ["state", "props", "context", "ref"], answer: 1 },
        { question: "Apa itu JSX di React?", options: ["JavaScript Extension untuk database", "Syntax extension yang memungkinkan menulis HTML di JavaScript", "Library untuk styling", "Package manager React"], answer: 1 },
        { question: "Key prop pada list di React berfungsi untuk?", options: ["Styling elemen list", "Membantu React mengidentifikasi item yang berubah", "Mengurutkan list", "Memberi akses keyboard"], answer: 1 },
        { question: "Hook untuk memoize nilai agar tidak dihitung ulang?", options: ["useCallback", "useRef", "useMemo", "useReducer"], answer: 2 },
        { question: "Cara update state array di React tanpa mutasi?", options: ["state.push(newItem)", "setState([...state, newItem])", "state.add(newItem)", "setState(state + newItem)"], answer: 1 },
        { question: "Apa itu Virtual DOM di React?", options: ["DOM yang tersimpan di database", "Representasi ringan dari DOM asli di memori", "DOM untuk virtual reality", "Plugin untuk manipulasi DOM"], answer: 1 },
        { question: "Hook untuk menyimpan referensi ke DOM element?", options: ["useState", "useEffect", "useRef", "useContext"], answer: 2 },
        { question: "Cara conditional rendering di React?", options: ["if/else statement saja", "Ternary operator atau && operator", "switch statement saja", "try/catch saja"], answer: 1 },
        { question: "React.Fragment digunakan untuk?", options: ["Memecah komponen", "Membungkus multiple element tanpa tambah DOM node", "Membuat animasi", "Mengoptimasi performa"], answer: 1 },
        { question: "Hook untuk share state tanpa prop drilling?", options: ["useState", "useReducer", "useContext", "useRef"], answer: 2 },
        { question: "Lifecycle yang setara dengan useEffect(() => {}, []) di class component?", options: ["componentDidUpdate", "componentWillUnmount", "componentDidMount", "shouldComponentUpdate"], answer: 2 },
        { question: "Cara mencegah re-render component yang tidak perlu?", options: ["React.lazy", "React.memo", "React.Fragment", "React.strict"], answer: 1 },
        { question: "Apa itu controlled component di React?", options: ["Component yang dikontrol CSS", "Form element yang nilainya dikontrol oleh React state", "Component dengan akses penuh ke DOM", "Component yang tidak bisa di-render ulang"], answer: 1 },
        { question: "Package untuk routing di React?", options: ["react-router", "react-navigation", "react-router-dom", "react-path"], answer: 2 },
        { question: "useCallback digunakan untuk?", options: ["Membuat callback baru setiap render", "Memoize fungsi agar referensinya stabil", "Menjalankan callback setelah render", "Menghapus event listener"], answer: 1 },
        { question: "Cara lazy loading component di React?", options: ["React.lazy(() => import('./Component'))", "lazy.import('./Component')", "React.import('./Component')", "import.lazy('./Component')"], answer: 0 },
        { question: "Error boundary di React digunakan untuk?", options: ["Validasi form", "Menangkap JavaScript error di component tree", "Membatasi ukuran bundle", "Mengatur batas animasi"], answer: 1 },
        { question: "Perbedaan useEffect dengan useLayoutEffect?", options: ["Tidak ada perbedaan", "useLayoutEffect berjalan setelah browser paint, useEffect sebelumnya", "useLayoutEffect berjalan sebelum browser paint, useEffect setelahnya", "useLayoutEffect hanya untuk styling"], answer: 2 },
    ],
};

// =============================================
// HELPER
// =============================================
function shuffleArray(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
}

// =============================================
// GAME LOGIC
// =============================================
const activeRooms = {};
const QUESTION_TIME = 10;

function clearRoomTimer(room) {
    if (room.timerInterval) {
        clearInterval(room.timerInterval);
        room.timerInterval = null;
    }
    if (room.nextQuestionTimeout) {
        clearTimeout(room.nextQuestionTimeout);
        room.nextQuestionTimeout = null;
    }
}

function scheduleNextQuestion(roomId, delay) {
    const room = activeRooms[roomId];
    if (!room) return;

    // Prevent double schedule
    if (room.nextQuestionTimeout) return;

    // Stop timer interval
    if (room.timerInterval) {
        clearInterval(room.timerInterval);
        room.timerInterval = null;
    }

    room.nextQuestionTimeout = setTimeout(() => {
        room.nextQuestionTimeout = null;
        nextQuestion(roomId);
    }, delay);
}

function startGameTimer(roomId) {
    const room = activeRooms[roomId];
    if (!room) return;

    // Clear any existing timer first
    if (room.timerInterval) {
        clearInterval(room.timerInterval);
        room.timerInterval = null;
    }

    room.timeLeft = QUESTION_TIME;

    room.timerInterval = setInterval(() => {
        const r = activeRooms[roomId];
        if (!r) {
            clearInterval(room.timerInterval);
            return;
        }

        r.timeLeft--;
        io.to(roomId).emit('timer_tick', r.timeLeft);

        if (r.timeLeft <= 0) {
            clearInterval(r.timerInterval);
            r.timerInterval = null;
            scheduleNextQuestion(roomId, 500);
        }
    }, 1000);
}

function nextQuestion(roomId) {
    const room = activeRooms[roomId];
    if (!room) return;

    clearRoomTimer(room);

    room.currentQuestion++;

    console.log(`📝 Room ${roomId}: soal ${room.currentQuestion + 1}/${room.questions.length}`);

    // All questions done — emit game_over
    if (room.currentQuestion >= room.questions.length) {
        console.log(`🏁 Room ${roomId}: GAME OVER`);
        const finalPlayers = room.players.map(p => ({
            ...p,
            totalQuestions: room.questions.length,
        }));
        io.to(roomId).emit('game_over', {
            players: finalPlayers,
            category: room.category,
            total: room.questions.length,
        });
        return;
    }

    const q = room.questions[room.currentQuestion];
    io.to(roomId).emit('next_question', {
        index:    room.currentQuestion,
        total:    room.questions.length,
        question: q.question,
        options:  q.options,
    });

    room.answeredPlayers = {};
    startGameTimer(roomId);
}

// =============================================
// SOCKET.IO — All handlers inside io.on('connection')
// =============================================
io.on('connection', (socket) => {
    console.log('New connection:', socket.id);

    // ------------------------------------------
    // CREATE ROOM — Host creates a new game room
    // ------------------------------------------
    socket.on('create_room', (data) => {
        const { roomId, roomPass, hostName } = data;

        if (activeRooms[roomId]) {
            console.log(`⚠️ Room ${roomId} already exists, rejoining`);
            socket.join(roomId);
            io.to(roomId).emit('update_players', activeRooms[roomId].players);
            return;
        }

        activeRooms[roomId] = {
            password:            roomPass,
            hostId:              socket.id,
            players:             [{ id: socket.id, name: hostName, score: 0, correct: 0, totalTime: 0, combo: 0 }],
            questions:           [],
            currentQuestion:     -1,
            answeredPlayers:     {},
            timeLeft:            QUESTION_TIME,
            timerInterval:       null,
            nextQuestionTimeout: null,
        };
        socket.join(roomId);
        io.to(roomId).emit('update_players', activeRooms[roomId].players);
        console.log(`🏟️ Arena Created: ${roomId} by ${hostName}`);
    });

    // ------------------------------------------
    // JOIN ROOM — Player joins an existing room
    // ------------------------------------------
    socket.on('join_room', (data, callback) => {
        const { roomId, roomPass, playerName } = data;
        const room = activeRooms[roomId];
        if (!room)                     return callback({ status: "error", message: "Arena not found!" });
        if (room.password !== roomPass) return callback({ status: "error", message: "Wrong password!" });

        const isAlreadyIn = room.players.find(p => p.id === socket.id);
        if (!isAlreadyIn) {
            room.players.push({ id: socket.id, name: playerName, score: 0, correct: 0, totalTime: 0, combo: 0 });
        }
        socket.join(roomId);
        io.to(roomId).emit('update_players', room.players);
        callback({ status: "success" });
    });

    // ------------------------------------------
    // START GAME — Host triggers game start
    // ------------------------------------------
    socket.on('start_game', (data) => {
        const { roomId, category } = data;
        const room = activeRooms[roomId];
        if (!room) return;

        const questions      = shuffleArray(QUESTION_BANK[category] || []);
        room.questions       = questions;
        room.currentQuestion = -1;
        room.answeredPlayers = {};
        room.category        = category;

        io.to(roomId).emit('receive_start_game', category);
        console.log(`🚀 Arena ${roomId} launching: ${category} (${questions.length} soal)`);

        // 3-2-1 countdown before first question
        let countdown = 3;
        io.to(roomId).emit('countdown', countdown);

        const countdownInterval = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                io.to(roomId).emit('countdown', countdown);
            } else {
                clearInterval(countdownInterval);
                setTimeout(() => nextQuestion(roomId), 500);
            }
        }, 1000);
    });

    // ------------------------------------------
    // SUBMIT ANSWER — Player submits their answer
    // ------------------------------------------
    socket.on('submit_answer', (data) => {
        const { roomId, answerIndex, timeUsed } = data;
        const room = activeRooms[roomId];
        if (!room) return;

        // Prevent double submission
        if (room.answeredPlayers[socket.id]) return;
        if (room.nextQuestionTimeout)        return;

        room.answeredPlayers[socket.id] = true;

        const q      = room.questions[room.currentQuestion];
        const player = room.players.find(p => p.id === socket.id);
        if (!player || !q) return;

        const isCorrect = answerIndex === q.answer;
        player.totalTime += timeUsed || 0;

        let gainedScore     = 0;
        let comboBonus      = 0;
        let speedBonus      = 0;
        let newCombo        = 0;
        let comboMultiplier = 1;

        if (isCorrect) {
            // Increment combo streak on correct answer
            player.combo = (player.combo || 0) + 1;
            newCombo     = player.combo;

            // Combo multiplier tiers: x2 / x3 / x5
            if      (player.combo >= 5) comboMultiplier = 2.0;
            else if (player.combo >= 3) comboMultiplier = 1.5;
            else if (player.combo >= 2) comboMultiplier = 1.2;

            // Speed bonus tiers based on remaining time
            const timeLeft = QUESTION_TIME - (timeUsed || 0);
            if      (timeLeft >= 7) speedBonus = 50;
            else if (timeLeft >= 4) speedBonus = 25;

            // Apply multiplier to (base + speed bonus)
            const baseScore = 100 + speedBonus;
            gainedScore     = Math.round(baseScore * comboMultiplier);
            comboBonus      = gainedScore - baseScore;

            player.score   += gainedScore;
            player.correct += 1;
        } else {
            // Reset combo on wrong answer
            player.combo = 0;
            newCombo     = 0;
        }

        // Send score breakdown to this player only
        socket.emit('answer_result', {
            isCorrect,
            correctAnswer:  q.answer,
            gainedScore,
            speedBonus,
            comboBonus,
            comboMultiplier,
            combo:      newCombo,
            totalScore: player.score,
        });

        // Broadcast updated scoreboard to all players in room
        io.to(roomId).emit('update_players', room.players);

        // If all players answered, advance to next question
        const totalAnswered = Object.keys(room.answeredPlayers).length;
        const totalPlayers  = room.players.length;
        console.log(`✏️ Room ${roomId}: ${totalAnswered}/${totalPlayers} answered`);

        if (totalAnswered >= totalPlayers) {
            scheduleNextQuestion(roomId, 1500);
        }
    });

    // ------------------------------------------
    // CANCEL ROOM — Host manually ends the room
    // ------------------------------------------
    socket.on('cancel_room', (roomId) => {
        const room = activeRooms[roomId];
        if (room) {
            clearRoomTimer(room);
            io.to(roomId).emit('room_terminated', "Host telah mengakhiri permainan.");
            delete activeRooms[roomId];
            console.log(`🗑️ Room ${roomId} terminated by Host`);
        }
    });

    // ------------------------------------------
    // DISCONNECTING — Clean up if host leaves
    // ------------------------------------------
    socket.on('disconnecting', () => {
        socket.rooms.forEach(roomId => {
            const room = activeRooms[roomId];
            if (room && room.hostId === socket.id) {
                clearRoomTimer(room);
                io.to(roomId).emit('room_terminated', "Host terputus. Ruangan dibubarkan.");
                delete activeRooms[roomId];
                console.log(`🔌 Room ${roomId} closed — host disconnected`);
            }
        });
    });

    // ------------------------------------------
    // DISCONNECT — Log when any player disconnects
    // ------------------------------------------
    socket.on('disconnect', () => {
        console.log('User Disconnected:', socket.id);
    });

}); // <-- END of io.on('connection') — ALL handlers must be above this line

// =============================================
// START SERVER
// =============================================
server.listen(PORT, () => {
    console.log(`🚀 WIPPY ENGINE READY ON PORT ${PORT}`);
});