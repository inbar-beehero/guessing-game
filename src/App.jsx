import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import PlayerPage from "./pages/PlayerPage.jsx";
import TeamPage from "./pages/TeamPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/player" element={<PlayerPage />} />
      <Route path="/team" element={<TeamPage />} />
    </Routes>
  );
}
