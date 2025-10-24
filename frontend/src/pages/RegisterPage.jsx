import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // 👇 Replace this with real API call
      console.log("Register:", { email, password, name });
      navigate("/"); // redirect back to login
    } catch (err) {
      setError("Registration failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600">Create Account</h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Full Name"
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition font-semibold"
          >
            Register
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/")}
            className="text-indigo-500 font-semibold hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
