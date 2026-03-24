import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import CreateSessionPage from "./pages/CreateSessionPage.jsx";
import JoinSessionPage from "./pages/JoinSessionPage.jsx";
import RoomPage from "./pages/RoomPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/create" element={<CreateSessionPage />} />
      <Route path="/join" element={<JoinSessionPage />} />
      <Route path="/room/:sessionCode" element={<RoomPage />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

