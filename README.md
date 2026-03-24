# 🟢 Wippy Arena: Emerald Edition

**A High-Fidelity Real-Time Competitive Programming Quiz Platform**

Wippy Arena is a modern, gamified web application designed for developers to challenge their skills in **PHP, JavaScript, and React**. Featuring a futuristic *Cyber-Emerald* aesthetic, it delivers real-time synchronization, fluid animations, and a global leaderboard.

---

## 🚀 Key Features

- ⚔️ **Real-Time Duel**  
  Compete with other players in synchronized quiz sessions using Socket.io.

- 🧠 **Neural HUD Interface**  
  High-performance UI powered by Framer Motion & GSAP.

- 🧩 **Tech-Specific Arenas**  
  Dedicated arenas for PHP, JavaScript, and React with authentic branding.

- 🏆 **Global Hall of Fame**  
  Persistent scoring system integrated with MySQL via PHP.

- 📊 **Performance Analytics**  
  Detailed performance insights including accuracy and response efficiency.

---

## 🛠️ Tech Stack

**Frontend**
- React 19
- Vite 6

**Styling**
- Tailwind CSS v4

**Animations**
- Framer Motion
- GSAP

**Icons**
- Lucide React
- React Icons

**Real-Time Engine**
- Socket.io-client

**Backend**
- Node.js (Socket Server)
- PHP 8 (API Layer)

**Database**
- MySQL

---

## 📂 Project Structure

```
wippy/
├── backend/                
│   ├── db.php              
│   ├── server.js           
│   ├── save_score.php      
│   ├── get_leaderboard.php 
│   ├── test_db.php         
│   └── .env                
├── frontend/               
│   ├── public/             
│   └── src/
│       ├── components/     
│       ├── pages/          
│       ├── App.jsx         
│       ├── index.css       
│       └── main.jsx        
├── question.js             
├── .gitignore              
├── LICENSE                 
├── README.md               
└── vite.config.js          
```

---

## ⚙️ Installation & Setup

### 1. Clone Repository

```bash
git clone https://github.com/dzakwannajmi/wippy.git
cd wippy
```

### 2. Install Dependencies

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### 3. Environment Configuration

Create a `.env` file inside the `frontend` folder:

```env
VITE_SOCKET_URL=http://localhost:3001
VITE_API_URL=http://localhost:8000
```

### 4. Initialize System

Run three services in separate terminals:

#### 🖥️ Terminal 1: Frontend
```bash
cd frontend
npm run dev
```

#### ⚡ Terminal 2: Socket Server
```bash
cd backend
node server.js
```

#### 🗄️ Terminal 3: PHP API Server
```bash
cd backend
php -S localhost:8000
```

---

## 🛡️ License

Distributed under the **MIT License**.  
See the `LICENSE` file for more information.

---

## 👨‍💻 Author

**Dzakwan Najmi**  
*"Building the future of competitive learning, one node at a time."*