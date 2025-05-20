import React, { useState } from "react";

export default function UserManagement() {
  const [newUser, setNewUser] = useState({ username: "", password: "", role: "user" });
  const [created, setCreated] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Her kunne du kalde en API eller gemme i localStorage
    console.log("Ny bruger oprettet:", newUser);
    setCreated(true);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-2">Opret ny bruger</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Brugernavn"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Kodeord"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          className="w-full p-2 border rounded"
        >
          <option value="user">Bruger</option>
          <option value="superuser">Superbruger</option>
        </select>
        <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-2 rounded">
          Opret bruger
        </button>
        {created && <p className="text-green-600">Bruger oprettet!</p>}
      </form>
    </div>
  );
}
