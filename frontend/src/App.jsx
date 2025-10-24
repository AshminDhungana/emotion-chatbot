import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ChatPage from "./pages/ChatPage";
import { loginUser, guestLogin } from "./services/api";

function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
  const stored = localStorage.getItem("user");
  if (stored) {
    const userData = JSON.parse(stored);
    if (userData.role === "guest") {
      localStorage.removeItem("user");
    }
  }
}, []);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  const handleLogin = async (email, password) => {
    const res = await loginUser(email, password);
    if (res.success) setUser(res.data.user);
    return res;
  };

  const handleGuest = () => {
    const res = guestLogin();
    if (res.success) setUser(res.data.user);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  if (!user) {
    return (
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <LoginPage
                onLogin={handleLogin}
                onGuest={handleGuest}
                onRegister={() => (window.location.href = "/register")}
              />
            }
          />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/chat" element={<ChatPage user={user} onLogout={handleLogout} />} />
        <Route path="*" element={<Navigate to="/chat" />} />
      </Routes>
    </Router>
  );
}

export default App;
