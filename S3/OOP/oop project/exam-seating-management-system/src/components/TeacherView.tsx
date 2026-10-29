"use client";

import React, { useState, useEffect } from "react";
import { UserCheck, Printer, AlertCircle, CheckCircle } from "lucide-react";

interface Teacher {
  id: number;
  name: string;
  departmentCode: string;
  designation: string;
  phone: string;
  status: string;
}

interface Department {
  code: string;
}

export function TeacherView({ userRole }: { userRole: string }) {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [departmentCode, setDepartmentCode] = useState("CSE");
  const [designation, setDesignation] = useState("Assistant Professor");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("AVAILABLE");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isTeacher = userRole === "TEACHER";

  const fetchTeachers = async () => {
    try {
      const res = await fetch("/api/teachers");
      const data = await res.json();
      if (data.teachers) setTeachers(data.teachers);
    } catch {
      setError("Failed to fetch teachers");
    }
  };

  const fetchDepts = async () => {
    try {
      const res = await fetch("/api/departments");
      const data = await res.json();
      if (data.departments) setDepartments(data.departments);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchTeachers();
    fetchDepts();
  }, []);

  const handleSelect = (t: Teacher) => {
    setSelectedId(t.id);
    setName(t.name);
    setDepartmentCode(t.departmentCode);
    setDesignation(t.designation);
    setPhone(t.phone);
    setStatus(t.status);
    setError(null);
  };

  const handleClear = () => {
    setSelectedId(null);
    setName("");
    setPhone("");
    setDesignation("Assistant Professor");
    setStatus("AVAILABLE");
    setError(null);
    setSuccess(null);
  };

  const handleAdd = async () => {
    setError(null);
    if (!name.trim() || !phone.trim()) {
      setError("Name and Phone are required");
      return;
    }
    try {
      const res = await fetch("/api/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, departmentCode, designation, phone, status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess("Teacher added!");
      handleClear();
      fetchTeachers();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error saving teacher");
    }
  };

  const handleUpdate = async () => {
    if (!selectedId) return;
    setError(null);
    try {
      const res = await fetch("/api/teachers", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedId, name, departmentCode, designation, phone, status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess("Teacher updated!");
      handleClear();
      fetchTeachers();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error updating teacher");
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    if (!confirm(`Delete faculty member ${name}?`)) return;
    try {
      const res = await fetch(`/api/teachers?id=${selectedId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess("Teacher deleted!");
      handleClear();
      fetchTeachers();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error deleting teacher");
    }
  };

  return (
    <div className="space-y-6">
      <div className="hidden print:block text-center border-b pb-4 mb-4">
        <h1 className="text-xl font-black uppercase">SMART EXAM SEATING ARRANGEMENT SYSTEM</h1>
        <h2 className="text-sm font-bold uppercase mt-1">FACULTY & INVIGILATOR MASTER LIST</h2>
        <p className="text-xs text-gray-500 mt-1">Generated: {new Date().toLocaleString()}</p>
      </div>

      <div className="flex items-center justify-between no-print">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Teacher / Invigilator Management</h1>
          <p className="text-xs text-slate-500">Manage teaching faculty and examination hall invigilator availability</p>
        </div>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-xl bg-[#ec912d] hover:bg-[#d47f22] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider"
        >
          <Printer className="h-4 w-4" /> Print Teacher List
        </button>
      </div>

      {error && <div className="no-print p-3 rounded-xl bg-rose-50 text-xs text-rose-700">{error}</div>}
      {success && <div className="no-print p-3 rounded-xl bg-emerald-50 text-xs text-emerald-700">{success}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs space-y-4 no-print">
          <h2 className="text-sm font-bold uppercase text-slate-700">{selectedId ? "Edit Faculty" : "Add Faculty"}</h2>
          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Teacher Name</label>
              <input
                type="text"
                placeholder="e.g. Anil Kumar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Department</label>
              <select
                value={departmentCode}
                onChange={(e) => setDepartmentCode(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 font-semibold"
              >
                {departments.map((d) => (
                  <option key={d.code} value={d.code}>{d.code}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Designation</label>
              <input
                type="text"
                placeholder="Assistant Professor"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                placeholder="9876500001"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Invigilation Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 font-bold"
              >
                <option value="AVAILABLE">AVAILABLE (Eligible for invigilation)</option>
                <option value="UNAVAILABLE">UNAVAILABLE (Excluded from invigilation)</option>
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
                <th className="py-2.5 px-3">Faculty Name</th>
                <th className="py-2.5 px-3">Dept</th>
                <th className="py-2.5 px-3">Designation</th>
                <th className="py-2.5 px-3">Phone</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {teachers.map((t) => (
                <tr
                  key={t.id}
                  onClick={() => handleSelect(t)}
                  className={`cursor-pointer hover:bg-blue-50/80 transition ${selectedId === t.id ? "bg-blue-100/70 font-semibold" : ""}`}
                >
                  <td className="py-2.5 px-3 font-bold text-slate-900">{t.name}</td>
                  <td className="py-2.5 px-3">
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-700">
                      {t.departmentCode}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">{t.designation}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-600">{t.phone}</td>
                  <td className="py-2.5 px-3">
                    <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                      t.status === "AVAILABLE" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                    }`}>
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Total Faculty: {teachers.length}</span>
            <span className="font-bold text-emerald-700">
              Available for Invigilation: {teachers.filter(t => t.status === "AVAILABLE").length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
