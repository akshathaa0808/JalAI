import Chat from "./pages/Chat"
import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login"

import { BrowserRouter, Routes, Route } from "react-router-dom"

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* 🔐 FIRST SCREEN = FARMER SETUP */}
        <Route path="/" element={<Login />} />

        {/* 🌾 OPTIONAL LANDING PAGE */}
        <Route path="/home" element={<Home />} />

        {/* 📊 DASHBOARD */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* 🤖 CHAT ASSISTANT */}
        <Route path="/chat" element={<Chat />} />

      </Routes>

    </BrowserRouter>
  )
}

export default App