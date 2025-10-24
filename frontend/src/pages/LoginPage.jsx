import { useState } from "react";

export default function LoginPage({ onLogin, onGuest, onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await onLogin(email, password);
      if (!res.success) setError(res.error || "Invalid credentials");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600">
          Welcome Back 👋
        </h1>

        {error && (
          <p className="text-red-500 text-center mb-4 font-medium">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`${
              loading ? "bg-indigo-300" : "bg-indigo-500 hover:bg-indigo-600"
            } text-white py-2 rounded-md font-semibold transition`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Guest Mode */}
        <div className="text-center mt-4">
          <button
            onClick={onGuest}
            className="text-indigo-500 hover:underline font-medium"
          >
            Continue as Guest
          </button>
        </div>

        {/* Register */}
        <div className="text-center mt-3 text-gray-600">
          Don’t have an account?{" "}
          <button
            onClick={onRegister}
            className="text-indigo-500 font-semibold hover:underline"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
