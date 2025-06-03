// src/organisms/Sidebar.jsx

import React from "react";
import Text from "../atoms/Text";
import Label from "../atoms/Label";
import Input from "../atoms/Input";
import Select from "../atoms/Select";
import Button from "../atoms/Button";

export default function Sidebar({
  dashboards,
  selectedDashboard,
  setSelectedDashboard,

  // Dashboard creation props:
  newDashboardName,
  setNewDashboardName,
  handleExcelUpload,
  createDashboard,

  // User creation props:
  newUser,
  handleUserInputChange,
  handleCreateUser,
}) {
  return (
    <aside className="w-64 bg-gray-700 rounded p-4 text-white flex flex-col gap-6">
      {/* === DASHBOARD LIST & NAVIGATION === */}
      <div>
        <Text as="h3" size="large" color="white" className="uppercase mb-2">
          Dashboards
        </Text>
        <ul className="space-y-2 mb-4">
          {dashboards.map((d, idx) => (
            <li
              key={idx}
              onClick={() => setSelectedDashboard(idx)}
              className={`p-2 rounded cursor-pointer ${
                idx === selectedDashboard
                  ? "bg-blue-600 font-semibold"
                  : "hover:bg-gray-600"
              }`}
            >
              {d.name}
            </li>
          ))}
        </ul>
      </div>

      {/* === OPRET DASHBOARD FORM === */}
      <div>
        <Text as="h4" size="base" color="white" className="mb-2">
          Create Dashboard
        </Text>
        <div className="flex flex-col gap-2">
          <div>
            <Label htmlFor="dashboardName" className="mb-1">
              Dashboard name
            </Label>
            <Input
              id="dashboardName"
              name="dashboardName"
              type="text"
              placeholder=""
              value={newDashboardName}
              onChange={(e) => setNewDashboardName(e.target.value)}
              className="text-black"
            />
          </div>
          <div>
            <Label htmlFor="excelUpload" className="mb-1">
              Select file
            </Label>
            <input
              id="excelUpload"
              type="file"
              accept=".xlsx, .xls"
              onChange={handleExcelUpload}
              className="w-full text-sm rounded bg-gray-200 text-black"
            />
          </div>
          <Button
            onClick={createDashboard}
            variant="primary"
            className="mt-2 w-full"
          >
            Create Dashboard
          </Button>
        </div>
      </div>

      {/* === OPRET BRUGER FORM === */}
      <div>
        <Text as="h4" size="base" color="white" className="mb-2">
          Create user
        </Text>
        <form className="flex flex-col gap-2" onSubmit={(e) => {
          e.preventDefault();
          handleCreateUser();
        }}>
          <div>
            <Label htmlFor="username" className="mb-1">
              Username
            </Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="Skriv brugernavn..."
              value={newUser.username}
              onChange={handleUserInputChange}
              className="text-black"
            />
          </div>
          <div>
            <Label htmlFor="password" className="mb-1">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Skriv adgangskode..."
              value={newUser.password}
              onChange={handleUserInputChange}
              className="text-black"
            />
          </div>
          <div>
            <Label htmlFor="role" className="mb-1">
              Role
            </Label>
            <Select
              id="role"
              name="role"
              value={newUser.role}
              onChange={handleUserInputChange}
              className="text-black"
            >
              <option value="user">User</option>
              <option value="superuser">Superuser</option>
            </Select>
          </div>
          <Button type="submit" variant="primary" className="mt-2 w-full">
            Create user
          </Button>
        </form>
      </div>
    </aside>
  );
}
