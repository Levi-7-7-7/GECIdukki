"use client";

import React, { useState, useEffect } from "react";
import { Users, Printer, AlertCircle, CheckCircle, ShieldCheck } from "lucide-react";

interface UserRecord {
  id: number;
  username: string;
  role: string;
  fullName: string;
  status: string;
}

export function UserManagementView({ currentUsername }: { currentUsername: string }) {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("TEACHER");
  const [fullName, setFullName] = useState("");
  const [status, setStatus] = useState("ACTIVE");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const d = await res.json();
      if (d.users) setUsers(d.users);
    } catch {
      setError("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSelect = (u: UserRecord) => {
    setSelectedId(u.id);
    setUsername(u.username);
    setRole(u.role);
    setFullName(u.fullName);
    setStatus(u.status);
    setPassword("");
    setError(null);
  };

  const handleClear = () => {
    setSelectedId(null);
    setUsername("");
    setPassword("");
    setRole("TEACHER");
    setFullName("");
    setStatus("ACTIVE");
    setError(null);
    setSuccess(null);
  };

  const handleAdd = async () => {
    setError(null);
    if (!username.trim() || !password.trim() || !fullName.trim()) {
      setError("Username, password, and full name are required");
      return;
    }
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role, fullName, status }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      setSuccess(`User ${username} added!`);
      handleClear();
      fetchUsers();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error adding user");
    }
  };

  const handleUpdate = async () => {
    if (!selectedId) return;
    setError(null);
    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedId, username, password, role, fullName, status }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      setSuccess("User updated successfully!");
      handleClear();
      fetchUsers();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error updating user");
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    if (username === currentUsername) {
      setError("You cannot delete the account currently in use.");
      return;
    }
    if (!confirm(`Delete user ${username}?`)) return;
    try {
      const res = await fetch(`/api/users?id=${selectedId}`, { method: "DELETE" });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      setSuccess("User deleted!");
      handleClear();
      fetchUsers();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error deleting user");
    }
  };

  return (
    <div className="space-y-6">
      <div className="hidden print:block text-center border-b pb-4 mb-4">
        <h1 className="text-xl font-black uppercase">SMART EXAM SEATING ARRANGEMENT SYSTEM</h1>
        <h2 className="text-sm font-bold uppercase mt-1">SYSTEM USER ACCOUNTS LIST</h2>
        <p className="text-xs text-gray-500 mt-1">Generated: {new Date().toLocaleString()}</p>
      </div>

      <div className="flex items-center justify-between no-print">
        <div>
          <h1 className="text-xl font-bold text-slate-900">User Management (Admin Only)</h1>
          <p className="text-xs text-slate-500">Manage administrator and examination coordinator login accounts</p>
        </div>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-xl bg-[#ec912d] hover:bg-[#d47f22] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider"
        >
          <Printer className="h-4 w-4" /> Print Users
        </button>
      </div>

      {error && <div className="no-print p-3 rounded-xl bg-rose-50 text-xs text-rose-700 flex items-center gap-2"><AlertCircle className="h-4 w-4" /> {error}</div>}
      {success && <div className="no-print p-3 rounded-xl bg-emerald-50 text-xs text-emerald-700 flex items-center gap-2"><CheckCircle className="h-4 w-4" /> {success}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs space-y-4 no-print">
          <h2 className="text-sm font-bold uppercase text-slate-700">{selectedId ? "Edit User" : "Add User"}</h2>
          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Username</label>
              <input
                type="text"
                placeholder="e.g. coordinator"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                placeholder="e.g. Dr. Rajesh Sharma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Password {selectedId && "(leave blank to keep unchanged)"}</label>
              <input
                type="password"
                placeholder={selectedId ? "••••••••" : "Enter password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 font-bold text-[#2463b4]"
                >
                  <option value="TEACHER">TEACHER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button onClick={handleAdd} className="rounded-lg bg-[#147d79] text-white py-2 font-bold uppercase hover:bg-[#0f6663]">Add User</button>
              <button onClick={handleUpdate} disabled={!selectedId} className="rounded-lg bg-[#2463b4] text-white py-2 font-bold uppercase hover:bg-blue-700 disabled:opacity-50">Update</button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={handleDelete} disabled={!selectedId} className="rounded-lg bg-rose-600 text-white py-2 font-bold uppercase hover:bg-rose-700 disabled:opacity-50">Delete</button>
              <button onClick={handleClear} className="rounded-lg bg-slate-200 text-slate-700 py-2 font-bold uppercase hover:bg-slate-300">Clear</button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0f2343] text-white uppercase text-[11px]">
              <tr>
                <th className="py-2.5 px-3">Username</th>
                <th className="py-2.5 px-3">Full Name</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {users.map((u) => (
                <tr
                  key={u.id}
                  onClick={() => handleSelect(u)}
                  className={`cursor-pointer hover:bg-blue-50/80 transition ${selectedId === u.id ? "bg-blue-100/70 font-semibold" : ""}`}
                >
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">{u.username}</td>
                  <td className="py-3 px-3 text-slate-800">{u.fullName}</td>
                  <td className="py-3 px-3">
                    <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                      u.role === "ADMIN" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="rounded bg-emerald-100 text-emerald-700 px-2 py-0.5 text-[10px] font-bold">
                      {u.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
