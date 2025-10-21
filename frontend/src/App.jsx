import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import ChatPage from "./pages/ChatPage";
import { loginUser, guestLogin } from "./services/api";

export default function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const handleLogin = async (email, password) => {
    const res = await loginUser(email, password);
    if (res.success) {
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
    }
    return res;
  };

  const handleGuest = () => {
    const res = guestLogin();
    if (res.success) {
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
    }
  };

  return user ? (
    <ChatPage user={user} />
  ) : (
    <LoginPage onLogin={handleLogin} onGuest={handleGuest} />
  );
}
