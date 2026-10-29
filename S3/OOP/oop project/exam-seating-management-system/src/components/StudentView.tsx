"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Printer, Search, RotateCcw, AlertCircle, CheckCircle } from "lucide-react";

interface Student {
  id: number;
  registerNumber: string;
  name: string;
  departmentCode: string;
  semesterNumber: string;
  division: string;
  status: string;
}

interface Department {
  code: string;
  name: string;
}

interface Semester {
  semesterNumber: string;
}

interface StudentViewProps {
  userRole: string;
}

export function StudentView({ userRole }: StudentViewProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [registerNumber, setRegisterNumber] = useState("");
  const [name, setName] = useState("");
  const [departmentCode, setDepartmentCode] = useState("CSE");
  const [semesterNumber, setSemesterNumber] = useState("S3");
  const [division, setDivision] = useState("A");
  const [status, setStatus] = useState("ACTIVE");

  const isTeacher = userRole === "TEACHER";

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/students?search=${encodeURIComponent(search)}`);
      const data = await res.json();
      if (data.students) setStudents(data.students);
    } catch {
      setError("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  const fetchMeta = async () => {
    try {
      const [dRes, sRes] = await Promise.all([fetch("/api/departments"), fetch("/api/semesters")]);
      const dData = await dRes.json();
      const sData = await sRes.json();
      if (dData.departments) setDepartments(dData.departments);
      if (sData.semesters) setSemesters(sData.semesters);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchMeta();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStudents();
  };

  const handleSelectRow = (s: Student) => {
    setSelectedId(s.id);
    setRegisterNumber(s.registerNumber);
    setName(s.name);
    setDepartmentCode(s.departmentCode);
    setSemesterNumber(s.semesterNumber);
    setDivision(s.division);
    setStatus(s.status);
    setError(null);
  };

  const handleClear = () => {
    setSelectedId(null);
    setRegisterNumber("");
    setName("");
    setDivision("A");
    setStatus("ACTIVE");
    setError(null);
    setSuccess(null);
  };

  const handleAdd = async () => {
    setError(null);
    setSuccess(null);
    if (!registerNumber.trim() || !name.trim()) {
      setError("Register number and student name are required");
      return;
    }
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registerNumber, name, departmentCode, semesterNumber, division, status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add student");
      setSuccess("Student added successfully!");
      handleClear();
      fetchStudents();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error saving student");
    }
  };

  const handleUpdate = async () => {
    setError(null);
    setSuccess(null);
    if (!selectedId) {
      setError("Please select a student from the table first");
      return;
    }
    try {
      const res = await fetch("/api/students", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedId, registerNumber, name, departmentCode, semesterNumber, division, status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update student");
      setSuccess("Student updated successfully!");
      handleClear();
      fetchStudents();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error updating student");
    }
  };

  const handleDelete = async () => {
    setError(null);
    setSuccess(null);
    if (!selectedId) {
      setError("Please select a student from the table first");
      return;
    }
    if (!confirm(`Are you sure you want to delete student ${registerNumber}?`)) return;
    try {
      const res = await fetch(`/api/students?id=${selectedId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete student");
      setSuccess("Student deleted successfully!");
      handleClear();
      fetchStudents();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error deleting student");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Printable Header */}
      <div className="hidden print:block text-center border-b pb-4 mb-4">
        <h1 className="text-xl font-black uppercase tracking-wider">SMART EXAM SEATING ARRANGEMENT SYSTEM</h1>
        <h2 className="text-sm font-bold uppercase mt-1">STUDENT MASTER LIST</h2>
        <p className="text-xs text-gray-500 mt-1">Generated: {new Date().toLocaleString()}</p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Student Management</h1>
          <p className="text-xs text-slate-500">Add, edit, search, and manage registered examination candidates</p>
        </div>
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 rounded-xl bg-[#ec912d] hover:bg-[#d47f22] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider shadow-sm transition"
        >
          <Printer className="h-4 w-4" /> Print Student List
        </button>
      </div>

      {error && (
        <div className="no-print p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}
      {success && (
        <div className="no-print p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 flex items-center gap-2">
          <CheckCircle className="h-4 w-4 shrink-0" /> {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Panel */}
        <div className="lg:col-span-4 rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs space-y-4 no-print">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
            {selectedId ? "Edit Student Record" : "Add New Student"}
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Register Number</label>
              <input
                type="text"
                placeholder="e.g. 24CS001"
                value={registerNumber}
                onChange={(e) => setRegisterNumber(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 font-mono focus:border-[#2463b4] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Student Name</label>
              <input
                type="text"
                placeholder="e.g. Arun Kumar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-[#2463b4] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Department</label>
                <select
                  value={departmentCode}
                  onChange={(e) => setDepartmentCode(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-[#2463b4] focus:outline-none font-semibold"
                >
                  {departments.map((d) => (
                    <option key={d.code} value={d.code}>{d.code} - {d.name}</option>
                  ))}
                  {departments.length === 0 && <option value="CSE">CSE</option>}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Semester</label>
                <select
                  value={semesterNumber}
                  onChange={(e) => setSemesterNumber(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-[#2463b4] focus:outline-none font-semibold"
                >
                  {semesters.map((s) => (
                    <option key={s.semesterNumber} value={s.semesterNumber}>{s.semesterNumber}</option>
                  ))}
                  {semesters.length === 0 && ["S1","S2","S3","S4","S5","S6","S7","S8"].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Division</label>
                <input
                  type="text"
                  placeholder="A"
                  value={division}
                  onChange={(e) => setDivision(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-[#2463b4] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 focus:border-[#2463b4] focus:outline-none"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={handleAdd}
                disabled={isTeacher}
                className="w-full rounded-lg bg-[#147d79] hover:bg-[#0f6663] disabled:opacity-50 text-white py-2 font-bold uppercase transition"
              >
                Add
              </button>
              <button
                onClick={handleUpdate}
                disabled={isTeacher || !selectedId}
                className="w-full rounded-lg bg-[#2463b4] hover:bg-blue-700 disabled:opacity-50 text-white py-2 font-bold uppercase transition"
              >
                Update
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleDelete}
                disabled={isTeacher || !selectedId}
                className="w-full rounded-lg bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white py-2 font-bold uppercase transition"
              >
                Delete
              </button>
              <button
                onClick={handleClear}
                className="w-full rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 py-2 font-bold uppercase transition"
              >
                Clear
              </button>
            </div>
            {isTeacher && (
              <p className="text-[11px] text-amber-600 font-medium text-center">
                * Logged in as Teacher: View and search permissions enabled.
              </p>
            )}
          </div>
        </div>

        {/* Table Panel */}
        <div className="lg:col-span-8 rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs space-y-4">
          <form onSubmit={handleSearch} className="flex gap-2 no-print">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by Register Number, Name, Department (CSE), or Semester (S3)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-2 text-xs text-slate-800 focus:border-[#2463b4] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-[#2463b4] text-white px-4 py-2 text-xs font-bold uppercase transition hover:bg-blue-700"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => { setSearch(""); fetchStudents(); }}
              className="rounded-xl bg-slate-100 text-slate-600 px-3 py-2 text-xs font-bold hover:bg-slate-200"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </form>

          <div className="overflow-x-auto max-h-[500px]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0f2343] text-white uppercase text-[11px] sticky top-0">
                <tr>
                  <th className="py-2.5 px-3">Reg No</th>
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">Dept</th>
                  <th className="py-2.5 px-3">Sem</th>
                  <th className="py-2.5 px-3">Div</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {students.map((s) => (
                  <tr
                    key={s.id}
                    onClick={() => handleSelectRow(s)}
                    className={`cursor-pointer transition hover:bg-blue-50/80 ${
                      selectedId === s.id ? "bg-blue-100/70 font-semibold" : ""
                    }`}
                  >
                    <td className="py-2 px-3 font-mono font-bold text-slate-900">{s.registerNumber}</td>
                    <td className="py-2 px-3 text-slate-800">{s.name}</td>
                    <td className="py-2 px-3">
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-700">
                        {s.departmentCode}
                      </span>
                    </td>
                    <td className="py-2 px-3 font-semibold text-slate-600">{s.semesterNumber}</td>
                    <td className="py-2 px-3 text-slate-600">{s.division}</td>
                    <td className="py-2 px-3">
                      <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        s.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"
                      }`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      {loading ? "Loading students..." : "No student records found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>Showing {students.length} student candidate(s)</span>
            <span className="hidden sm:inline">Tip: Click any row to select for edit or delete</span>
          </div>
        </div>
      </div>
    </div>
  );
}
