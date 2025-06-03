// src/pages/LoginPage.jsx

import React, { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import Text from "../atoms/Text";
import Input from "../atoms/Input";
import Button from "../atoms/Button";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  // --- Form state ---
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Refs for focus management
  const usernameRef = useRef(null);
  const errorRef = useRef(null);

  // On mount, focus the username input
  useEffect(() => {
    if (usernameRef.current) {
      usernameRef.current.focus();
    }
  }, []);

  // Clear error when user starts typing
  const clearError = useCallback(() => {
    if (error) setError("");
  }, [error]);

  // Handle form submission
  const handleLogin = useCallback(
    (e) => {
      e.preventDefault();

      // Reset previous error
      setError("");

      const result = login(username.trim(), password);
      if (result) {
        if (result.role === "superuser") {
          navigate("/super");
        } else {
          navigate("/dashboard");
        }
      } else {
        setError("Forkert brugernavn eller kodeord");
        // After setting error, move focus to the error message so screen readers announce it
        setTimeout(() => {
          if (errorRef.current) {
            errorRef.current.focus();
          }
        }, 0);
      }
    },
    [username, password, login, navigate]
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800 px-4">
      <div className="bg-gray-700 p-8 rounded-lg shadow-md w-full max-w-sm">
        <Text
          as="h1"
          size="xl"
          color="white"
          className="mb-6 text-center"
        >
          Login
        </Text>

        <form onSubmit={handleLogin} className="space-y-5" noValidate>
          {/* Username Field */}
          <div>
            <Text
              as="label"
              htmlFor="login-username"
              color="white"
              className="block font-semibold mb-1"
            >
              Email
            </Text>
            <Input
              id="login-username"
              name="username"
              type="text"
              placeholder="Indtast email"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                clearError();
              }}
              ref={usernameRef}
              aria-required="true"
              aria-invalid={error ? "true" : "false"}
            />
          </div>

          {/* Password Field */}
          <div>
            <Text
              as="label"
              htmlFor="login-password"
              color="white"
              className="block font-semibold mb-1"
            >
              Adgangskode
            </Text>
            <Input
              id="login-password"
              name="password"
              type="password"
              placeholder="Indtast adgangskode"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearError();
              }}
              aria-required="true"
              aria-invalid={error ? "true" : "false"}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-700"
          >
            Log ind
          </Button>

          {/* Error Message (live region) */}
          {error && (
            <Text
              as="p"
              size="small"
              color="red-400"
              className="text-center"
              role="alert"
              tabIndex={-1}
              ref={errorRef}
            >
              {error}
            </Text>
          )}
        </form>
      </div>
    </div>
  );
}
