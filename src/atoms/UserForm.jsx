import React, { useState } from "react";
import Input from "../atoms/Input";
import Label from "../atoms/Label";
import Button from "../atoms/Button";
import Text from "../atoms/Text";

export default function UserForm({ onCreateUser }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "user",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      alert("Udfyld venligst brugernavn og adgangskode.");
      return;
    }
    onCreateUser(formData);
    setFormData({ username: "", password: "", role: "user" });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-700 p-4 rounded space-y-4">
      <Text as="h3" size="large" color="white" className="mb-2">
        Opret ny bruger
      </Text>

      <div>
        <Label htmlFor="username">Brugernavn</Label>
        <Input
          id="username"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
        />
      </div>

      <div>
        <Label htmlFor="password">Adgangskode</Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
        />
      </div>

      <div>
        <Label htmlFor="role">Rolle</Label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full p-2 rounded"
        >
          <option value="user">Bruger</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <Button type="submit" className="bg-green-500 text-white">
        Opret bruger
      </Button>
    </form>
  );
}
