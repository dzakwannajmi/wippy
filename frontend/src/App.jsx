import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ArenaEntry from "./pages/ArenaEntry";
import QuizRoom from "./pages/QuizRoom";
import Result from "./pages/Result";
import Navbar from './components/Navbar';
import Leaderboard from "./components/Leaderboard";   

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="pt-32 min-h-screen bg-dark-abyss relative overflow-x-hidden">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/arena" element={<QuizRoom />} />

          <Route path="/entry" element={<ArenaEntry />} />

          <Route path="/result" element={<Result />} />
          
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;