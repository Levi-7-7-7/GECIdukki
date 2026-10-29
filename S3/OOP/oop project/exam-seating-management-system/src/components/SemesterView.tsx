"use client";

import React, { useState, useEffect } from "react";
import { Printer, AlertCircle, CheckCircle } from "lucide-react";

interface Semester {
  id: number;
  semesterNumber: string;
  academicYear: string;
  status: string;
}

export function SemesterView({ userRole }: { userRole: string }) {
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [semesterNumber, setSemesterNumber] = useState("S1");
  const [academicYear, setAcademicYear] = useState("2025-26");
  const [status, setStatus] = useState("ACTIVE");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isTeacher = userRole === "TEACHER";

  const fetchSemesters = async () => {
    try {
      const res = await fetch("/api/semesters");
      const data = await res.json();
      if (data.semesters) setSemesters(data.semesters);
    } catch {
      setError("Failed to fetch semesters");
    }
  };

  useEffect(() => {
    fetchSemesters();
  }, []);

  const handleSelect = (s: Semester) => {
    setSelectedId(s.id);
    setSemesterNumber(s.semesterNumber);
    setAcademicYear(s.academicYear);
    setStatus(s.status);
    setError(null);
  };

  const handleClear = () => {
    setSelectedId(null);
    setSemesterNumber("S1");
    setAcademicYear("2025-26");
    setStatus("ACTIVE");
    setError(null);
    setSuccess(null);
  };

  const handleAdd = async () => {
    setError(null);
    try {
      const res = await fetch("/api/semesters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ semesterNumber, academicYear, status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess("Semester added!");
      handleClear();
      fetchSemesters();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error saving semester");
    }
  };

  const handleUpdate = async () => {
    if (!selectedId) return;
    setError(null);
    try {
      const res = await fetch("/api/semesters", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedId, semesterNumber, academicYear, status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess("Semester updated!");
      handleClear();
      fetchSemesters();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error updating semester");
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    if (!confirm(`Delete semester ${semesterNumber}?`)) return;
    try {
      const res = await fetch(`/api/semesters?id=${selectedId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess("Semester deleted!");
      handleClear();
      fetchSemesters();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error deleting semester");
    }
  };

  return (
    <div className="space-y-6">
      <div className="hidden print:block text-center border-b pb-4 mb-4">
        <h1 className="text-xl font-black uppercase">SMART EXAM SEATING ARRANGEMENT SYSTEM</h1>
        <h2 className="text-sm font-bold uppercase mt-1">SEMESTER MASTER LIST</h2>
        <p className="text-xs text-gray-500 mt-1">Generated: {new Date().toLocaleString()}</p>
      </div>

      <div className="flex items-center justify-between no-print">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Semester Management</h1>
          <p className="text-xs text-slate-500">Configure academic semesters (S1 to S8)</p>
        </div>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-xl bg-[#ec912d] hover:bg-[#d47f22] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider"
        >
          <Printer className="h-4 w-4" /> Print Semester List
        </button>
      </div>

      {error && <div className="no-print p-3 rounded-xl bg-rose-50 text-xs text-rose-700">{error}</div>}
      {success && <div className="no-print p-3 rounded-xl bg-emerald-50 text-xs text-emerald-700">{success}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs space-y-4 no-print">
          <h2 className="text-sm font-bold uppercase text-slate-700">{selectedId ? "Edit Semester" : "Add Semester"}</h2>
          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Semester Number</label>
              <select
                value={semesterNumber}
                onChange={(e) => setSemesterNumber(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 font-semibold"
              >
                {["S1","S2","S3","S4","S5","S6","S7","S8"].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Academic Year</label>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                placeholder="2025-26"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
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
                <th className="py-2.5 px-3">Semester</th>
                <th className="py-2.5 px-3">Academic Year</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {semesters.map((s) => (
                <tr
                  key={s.id}
                  onClick={() => handleSelect(s)}
                  className={`cursor-pointer hover:bg-blue-50/80 transition ${selectedId === s.id ? "bg-blue-100/70 font-semibold" : ""}`}
                >
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{s.semesterNumber}</td>
                  <td className="py-2.5 px-3 text-slate-800">{s.academicYear}</td>
                  <td className="py-2.5 px-3">
                    <span className="rounded bg-emerald-100 text-emerald-700 px-2 py-0.5 text-[10px] font-bold">{s.status}</span>
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
