// src/auth/AuthContext.jsx
import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

// Start med nogle “fake” brugere i hukommelsen (kun til demonstration):
const initialUsers = [
  { username: "admin", password: "admin123", role: "superuser" },
  { username: "user", password: "user123", role: "user" },
];

export const AuthProvider = ({ children }) => {
  // 1) Gem alle brugere (inkl. dem vi opretter) i state:
  const [users, setUsers] = useState(initialUsers);
  // 2) Gem den aktuelle indloggede bruger:
  const [user, setUser] = useState(null);

  // LOGIN-funktion: Tjekker blot i “users”-listen:
  const login = (username, password) => {
    const found = users.find(
      (u) => u.username === username && u.password === password
    );
    if (found) {
      setUser(found);
      return found;
    }
    return null;
  };

  // LOGOUT:
  const logout = () => {
    setUser(null);
  };

  // CREATEUSER: Tilføjer ny bruger til “users”-listen
  const createUser = ({ username, password, role }) => {
    // Sikre, at brugernavnet ikke allerede eksisterer
    if (users.some((u) => u.username === username)) {
      alert("Brugernavnet findes allerede!");
      return;
    }
    const newUser = { username, password, role };
    setUsers((prev) => [...prev, newUser]);
    alert(`Bruger '${username}' oprettet med rolle '${role}'.`);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, createUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
