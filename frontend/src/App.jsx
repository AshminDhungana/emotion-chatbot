import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ChatPage from "./pages/ChatPage";
import { loginUser, guestLogin } from "./services/api";

// Guest Page Component (was missing in your code)
function GuestPage({ onGuestLogin }) {
  const navigate = useNavigate();
  
  useEffect(() => {
    onGuestLogin();
    navigate('/chat');
  }, [onGuestLogin, navigate]);
  
  return <div>Loading guest session...</div>;
}

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("user");
    console.log("Stored user data:", stored); // Debug log
    
    if (stored) {
      try {
        const userData = JSON.parse(stored);
        console.log("Parsed user data:", userData); // Debug log
        
        // Don't persist guest users
        if (userData.role !== "guest") {
          setUser(userData);
        } else {
          console.log("Removing guest user from localStorage");
          localStorage.removeItem("user");
        }
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("user");
      }
    } else {
      console.log("No stored user found");
    }
    setIsLoading(false);
  }, []);

  // Sync user to localStorage when it changes
  useEffect(() => {
    if (user && user.role !== "guest") {
      localStorage.setItem("user", JSON.stringify(user));
    } else if (!user) {
      localStorage.removeItem("user");
    }
  }, [user]);

  const handleLogin = async (email, password) => {
    try {
      const res = await loginUser(email, password);
      if (res.success) {
        setUser(res.data.user);
      }
      return res;
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: error.message };
    }
  };

  const handleGuest = () => {
    try {
      const res = guestLogin();
      if (res.success) {
        setUser(res.data.user);
      }
      return res;
    } catch (error) {
      console.error("Guest login error:", error);
      return { success: false, error: error.message };
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // Navigation wrapper components to use navigate hook properly
  function LoginPageWrapper() {
    const navigate = useNavigate();
    return (
      <LoginPage
        onLogin={handleLogin}
        onGuest={() => navigate("/guest")}
        onRegister={() => navigate("/register")}
      />
    );
  }

  function RegisterPageWrapper() {
    const navigate = useNavigate();
    return <RegisterPage onRegister={handleLogin} />;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {!user ? (
          <>
            <Route path="/" element={<LoginPageWrapper />} />
            <Route path="/guest" element={<GuestPage onGuestLogin={handleGuest} />} />
            <Route path="/register" element={<RegisterPageWrapper />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <>
            <Route path="/chat" element={<ChatPage user={user} onLogout={handleLogout} />} />
            <Route path="*" element={<Navigate to="/chat" replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;