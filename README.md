# Wippy Arena · Emerald Edition

<img width="1920" height="1080" alt="Wippy Arena Screenshot" src="https://github.com/user-attachments/assets/dcde2613-dc4d-49e0-b690-50a757d14297" />

<div align="center">

[![Live Demo](https://img.shields.io/badge/LIVE_DEMO-wippy--rosy.vercel.app-50C878?style=for-the-badge&logoColor=white)](https://wippy-rosy.vercel.app)
[![Backend](https://img.shields.io/badge/BACKEND-Railway-50C878?style=for-the-badge)](https://wippy-backend-production.up.railway.app)
[![License](https://img.shields.io/badge/LICENSE-MIT-white?style=for-the-badge)](./LICENSE)

**A High-Fidelity Real-Time Competitive Programming Quiz Platform**

</div>

---

## Overview

Wippy Arena is a modern, gamified web application where developers battle their knowledge in **PHP, JavaScript, and React**. Built on a futuristic *Cyber-Emerald* aesthetic, the platform delivers true real-time synchronization via WebSockets, a server-validated combo scoring system, and fluid full-screen animations — all hosted on a cloud-native stack with zero PHP.

---

## Features

### ⚔️ Real-Time Quiz Battle
- Synchronized multiplayer sessions via Socket.io
- Server-side timer — every player sees the same countdown
- All answers and scores validated server-side, no client cheating possible
- Live scoreboard updates after every answer

### 🔥 Combo & Speed Scoring
- **Speed Bonus** — answer in under 3s for +50 pts, under 6s for +25 pts
- **Combo Multiplier** — chain correct answers to multiply your score
  - ×1.2 at 2 streak · ×1.5 at 3 streak · ×2.0 at 5+ streak
- Full-screen **TikTok-style fire animation** triggers at every 5-combo milestone
- Score breakdown popup (Base + Speed + Combo) shown on each correct answer

### 🏆 Podium & Leaderboard
- Animated podium screen revealing 3rd → 2nd → 1st place
- Global Hall of Fame backed by MySQL on Aiven Cloud
- Accuracy and average response time tracked per session

### 🎮 Game Experience
- Animated tutorial overlay on first game start (4 slides, auto-advancing)
- 3-2-1 countdown before questions begin
- Category selector: PHP · JavaScript · React (20 shuffled questions each)
- Room system with ID + password — share with friends to battle

### 🎨 UI & Animation
- Cyber-Emerald dark theme with PixelBlast animated background
- Framer Motion scroll-triggered sections on landing page
- Magic Bento grid, CardSwap stack, ScrollFloat text animations
- Fully responsive — desktop and mobile

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 + Vite 7 |
| **Styling** | Tailwind CSS v4 |
| **Animations** | Framer Motion · GSAP |
| **Icons** | React Icons |
| **Real-Time** | Socket.io 4 |
| **Backend** | Node.js + Express 5 |
| **Database** | MySQL (Aiven Cloud) |
| **Frontend Host** | Vercel |
| **Backend Host** | Railway |

---

## Project Structure

```
wippy/
├── backend/
│   ├── server.js           # Express + Socket.io + Game logic + API routes
│   └── package.json
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── FireStreakOverlay.jsx   # Full-screen fire animation
│       │   ├── GameTutorial.jsx        # Pre-game tutorial overlay
│       │   ├── Footer.jsx              # Site footer
│       │   ├── WaitingArena.jsx        # Lobby waiting room
│       │   ├── MagicBento.jsx          # Feature grid
│       │   ├── PixelBlast.jsx          # Background animation
│       │   └── ...
│       ├── pages/
│       │   ├── Home.jsx                # Landing page
│       │   ├── Entry.jsx               # Create / join room
│       │   ├── QuizRoom.jsx            # Main game screen
│       │   ├── Podium.jsx              # End-game podium
│       │   └── Result.jsx              # Score submission
│       ├── App.jsx
│       └── main.jsx
├── .npmrc
└── README.md
```

---

## Scoring Formula

```
timeLeft  = 10 - secondsUsed

speedBonus = timeLeft >= 7 ? 50 : timeLeft >= 4 ? 25 : 0
baseScore  = 100 + speedBonus

multiplier = combo >= 5 ? 2.0
           : combo >= 3 ? 1.5
           : combo >= 2 ? 1.2
           : 1.0

finalScore = round(baseScore × multiplier)
```

> Example: answer in 2s with a 5-combo streak → (100 + 50) × 2.0 = **300 pts**

---

## Local Development

### 1. Clone

```bash
git clone https://github.com/dzakwannajmi/wippy.git
cd wippy
```

### 2. Install Dependencies

```bash
# Frontend
cd frontend && npm install

# Backend
cd ../backend && npm install
```

### 3. Environment Variables

Create `frontend/.env`:

```env
VITE_SOCKET_URL=http://localhost:8080
VITE_API_URL=http://localhost:8080
```

Create `backend/.env`:

```env
APP_PORT=8080
MYSQLHOST=your_host
MYSQLPORT=your_port
MYSQLUSER=your_user
MYSQLPASSWORD=your_password
MYSQLDATABASE=your_database
FRONTEND_URL=http://localhost:5173
```

### 4. Run

```bash
# Terminal 1 — Frontend
cd frontend && npm run dev

# Terminal 2 — Backend
cd backend && node server.js
```

App runs at `http://localhost:5173`

---

## Deployment

| Service | Platform | Notes |
|---------|----------|-------|
| Frontend | [Vercel](https://vercel.com) | Auto-deploy on `git push` |
| Backend | [Railway](https://railway.app) | `railway up` from `/backend` |
| Database | [Aiven MySQL](https://aiven.io) | Free tier, keep-alive monthly |

---

## License

Distributed under the **MIT License** — see [`LICENSE`](./LICENSE) for details.

---

## Author

**Dzakwan Najmi**

> *"Building the future of competitive learning, one node at a time."*

[![GitHub](https://img.shields.io/badge/GitHub-dzakwannajmi-50C878?style=flat-square&logo=github)](https://github.com/dzakwannajmi)