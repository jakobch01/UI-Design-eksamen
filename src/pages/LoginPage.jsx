import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    const result = login(username, password);
    if (result) {
      if (result.role === "superuser") navigate("/super");
      else navigate("/dashboard");
    } else {
      setError("Forkert brugernavn eller kodeord");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800 px-4">
      <div className="bg-gray-700 p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Login</h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-white font-semibold mb-1">Email:</label>
            <input
              type="text"
              placeholder="Enter the email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded bg-gray-900 text-white"
            />
          </div>
          <div>
            <label className="block text-white font-semibold mb-1">Password:</label>
            <input
              type="password"
              placeholder="Enter the password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded bg-gray-900 text-white"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold py-2 px-4 rounded"
          >
            LOGIN
          </button>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
}