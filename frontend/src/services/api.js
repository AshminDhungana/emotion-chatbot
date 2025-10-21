const API_BASE = import.meta.env.VITE_API_BASE_URL;

// Login API
export const loginUser = async (email, password) => {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

// Guest login
export const guestLogin = () => {
  const guest = { username: "Guest", email: "guest@example.com" };
  return { success: true, data: { user: guest } };
};

// Chat API
export const sendChatMessage = async (message, token = null) => {
  try {
    const res = await fetch(`${API_BASE}/chat/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ message }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Chat request failed");
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
};
