"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Printer, AlertCircle, CheckCircle } from "lucide-react";

interface Department {
  id: number;
  code: string;
  name: string;
  status: string;
}

export function DepartmentView({ userRole }: { userRole: string }) {
  const [depts, setDepts] = useState<Department[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isTeacher = userRole === "TEACHER";

  const fetchDepts = async () => {
    try {
      const res = await fetch("/api/departments");
      const data = await res.json();
      if (data.departments) setDepts(data.departments);
    } catch {
      setError("Failed to fetch departments");
    }
  };

  useEffect(() => {
    fetchDepts();
  }, []);

  const handleSelect = (d: Department) => {
    setSelectedId(d.id);
    setCode(d.code);
    setName(d.name);
    setStatus(d.status);
    setError(null);
  };

  const handleClear = () => {
    setSelectedId(null);
    setCode("");
    setName("");
    setStatus("ACTIVE");
    setError(null);
    setSuccess(null);
  };

  const handleAdd = async () => {
    setError(null);
    if (!code.trim() || !name.trim()) {
      setError("Code and Name are required");
      return;
    }
    try {
      const res = await fetch("/api/departments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, name, status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess("Department added!");
      handleClear();
      fetchDepts();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error adding department");
    }
  };

  const handleUpdate = async () => {
    if (!selectedId) return;
    setError(null);
    try {
      const res = await fetch("/api/departments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedId, code, name, status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess("Department updated!");
      handleClear();
      fetchDepts();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error updating department");
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    if (!confirm(`Delete department ${code}?`)) return;
    try {
      const res = await fetch(`/api/departments?id=${selectedId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess("Department deleted!");
      handleClear();
      fetchDepts();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error deleting department");
    }
  };

  return (
    <div className="space-y-6">
      <div className="hidden print:block text-center border-b pb-4 mb-4">
        <h1 className="text-xl font-black uppercase">SMART EXAM SEATING ARRANGEMENT SYSTEM</h1>
        <h2 className="text-sm font-bold uppercase mt-1">COLLEGE DEPARTMENTS LIST</h2>
        <p className="text-xs text-gray-500 mt-1">Generated: {new Date().toLocaleString()}</p>
      </div>

      <div className="flex items-center justify-between no-print">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Department Management</h1>
          <p className="text-xs text-slate-500">Configure academic departments (CSE, ECE, EEE, ME, CE, IT...)</p>
        </div>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-xl bg-[#ec912d] hover:bg-[#d47f22] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider"
        >
          <Printer className="h-4 w-4" /> Print Department List
        </button>
      </div>

      {error && <div className="no-print p-3 rounded-xl bg-rose-50 text-xs text-rose-700">{error}</div>}
      {success && <div className="no-print p-3 rounded-xl bg-emerald-50 text-xs text-emerald-700">{success}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs space-y-4 no-print">
          <h2 className="text-sm font-bold uppercase text-slate-700">{selectedId ? "Edit Department" : "Add Department"}</h2>
          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Department Code</label>
              <input
                type="text"
                placeholder="e.g. CSE"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono uppercase focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Department Name</label>
              <input
                type="text"
                placeholder="e.g. Computer Science and Engineering"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button onClick={handleAdd} disabled={isTeacher} className="rounded-lg bg-[#147d79] text-white py-2 font-bold uppercase hover:bg-[#0f6663] disabled:opacity-50">Add</button>
              <button onClick={handleUpdate} disabled={isTeacher || !selectedId} className="rounded-lg bg-[#2463b4] text-white py-2 font-bold uppercase hover:bg-blue-700 disabled:opacity-50">Update</button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={handleDelete} disabled={isTeacher || !selectedId} className="rounded-lg bg-rose-600 text-white py-2 font-bold uppercase hover:bg-rose-700 disabled:opacity-50">Delete</button>
              <button onClick={handleClear} className="rounded-lg bg-slate-200 text-slate-700 py-2 font-bold uppercase hover:bg-slate-300">Clear</button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0f2343] text-white uppercase text-[11px]">
              <tr>
                <th className="py-2.5 px-3">Code</th>
                <th className="py-2.5 px-3">Department Name</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {depts.map((d) => (
                <tr
                  key={d.id}
                  onClick={() => handleSelect(d)}
                  className={`cursor-pointer hover:bg-blue-50/80 transition ${selectedId === d.id ? "bg-blue-100/70 font-semibold" : ""}`}
                >
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{d.code}</td>
                  <td className="py-2.5 px-3 text-slate-800">{d.name}</td>
                  <td className="py-2.5 px-3">
                    <span className="rounded bg-emerald-100 text-emerald-700 px-2 py-0.5 text-[10px] font-bold">{d.status}</span>
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
