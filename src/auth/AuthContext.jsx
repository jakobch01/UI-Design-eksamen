import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const fakeUsers = [
  { username: "admin", password: "admin123", role: "superuser" },
  { username: "user", password: "user123", role: "user" },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (username, password) => {
    const found = fakeUsers.find(
      (u) => u.username === username && u.password === password
    );
    if (found) setUser(found);
    return found;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

