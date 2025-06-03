import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import Text from "../atoms/Text";
import Input from "../atoms/Input";
import Button from "../atoms/Button";

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
        <Text as="h2" size="xl" color="white" className="mb-6 text-center">
          Login
        </Text>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <Text as="label" color="white" className="block font-semibold mb-1">
              Email:
            </Text>
            <Input
              type="text"
              name="username"
              placeholder="Enter the email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <Text as="label" color="white" className="block font-semibold mb-1">
              Password:
            </Text>
            <Input
              type="password"
              name="password"
              placeholder="Enter the password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-blue-700">
            Login
          </Button>
          {error && (
            <Text size="small" color="red-400" className="text-center">
              {error}
            </Text>
          )}
        </form>
      </div>
    </div>
  );
}
