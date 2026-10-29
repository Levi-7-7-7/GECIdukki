"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Printer, Calendar, AlertCircle, CheckCircle, Sparkles } from "lucide-react";

interface Exam {
  id: number;
  name: string;
  type: string;
  date: string;
  time: string;
  duration: number;
  subject: string;
  academicYear: string;
  status: string;
  departments: string[];
  semesters: string[];
  seatingCount?: number;
}

interface Department {
  code: string;
  name: string;
}

interface Semester {
  semesterNumber: string;
}

export function ExamView({ userRole, onGenerateForExam }: { userRole: string; onGenerateForExam?: (examId: number) => void }) {
  const [exams, setExams] = useState<Exam[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [name, setName] = useState("Internal Examination - S3");
  const [type, setType] = useState<"INTERNAL" | "EXTERNAL">("INTERNAL");
  const [date, setDate] = useState("2026-09-20");
  const [time, setTime] = useState("10:00");
  const [duration, setDuration] = useState("120");
  const [subject, setSubject] = useState("Data Structures");
  const [academicYear, setAcademicYear] = useState("2025-26");
  const [status, setStatus] = useState("SCHEDULED");
  const [selectedDepts, setSelectedDepts] = useState<string[]>(["CSE"]);
  const [selectedSems, setSelectedSems] = useState<string[]>(["S3"]);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isTeacher = userRole === "TEACHER";

  const fetchExams = async () => {
    try {
      const res = await fetch("/api/exams");
      const data = await res.json();
      if (data.exams) setExams(data.exams);
    } catch {
      setError("Failed to fetch exams");
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
    fetchExams();
    fetchMeta();
  }, []);

  const handleSelect = (e: Exam) => {
    setSelectedId(e.id);
    setName(e.name);
    setType(e.type as "INTERNAL" | "EXTERNAL");
    setDate(e.date);
    setTime(e.time);
    setDuration(String(e.duration));
    setSubject(e.subject);
    setAcademicYear(e.academicYear);
    setStatus(e.status);
    setSelectedDepts(e.departments || []);
    setSelectedSems(e.semesters || []);
    setError(null);
  };

  const handleClear = () => {
    setSelectedId(null);
    setName("");
    setType("INTERNAL");
    setDate("2026-09-20");
    setTime("10:00");
    setDuration("120");
    setSubject("");
    setAcademicYear("2025-26");
    setStatus("SCHEDULED");
    setSelectedDepts(["CSE"]);
    setSelectedSems(["S3"]);
    setError(null);
    setSuccess(null);
  };

  const toggleDept = (code: string) => {
    setSelectedDepts(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const toggleSem = (num: string) => {
    setSelectedSems(prev =>
      prev.includes(num) ? prev.filter(n => n !== num) : [...prev, num]
    );
  };

  const handleAdd = async () => {
    setError(null);
    if (!name.trim() || !subject.trim() || selectedDepts.length === 0 || selectedSems.length === 0) {
      setError("Exam Name, Subject, at least one Department, and one Semester are required");
      return;
    }
    try {
      const res = await fetch("/api/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          type,
          date,
          time,
          duration,
          subject,
          academicYear,
          status,
          departments: selectedDepts,
          semesters: selectedSems,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess("Exam created successfully!");
      handleClear();
      fetchExams();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error creating exam");
    }
  };

  const handleUpdate = async () => {
    if (!selectedId) return;
    setError(null);
    try {
      const res = await fetch("/api/exams", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedId,
          name,
          type,
          date,
          time,
          duration,
          subject,
          academicYear,
          status,
          departments: selectedDepts,
          semesters: selectedSems,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess("Exam updated successfully!");
      handleClear();
      fetchExams();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error updating exam");
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    if (!confirm(`Delete exam "${name}"? This will delete all generated seating for this exam.`)) return;
    try {
      const res = await fetch(`/api/exams?id=${selectedId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess("Exam deleted!");
      handleClear();
      fetchExams();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error deleting exam");
    }
  };

  return (
    <div className="space-y-6">
      <div className="hidden print:block text-center border-b pb-4 mb-4">
        <h1 className="text-xl font-black uppercase">SMART EXAM SEATING ARRANGEMENT SYSTEM</h1>
        <h2 className="text-sm font-bold uppercase mt-1">SCHEDULED EXAMINATIONS MASTER LIST</h2>
        <p className="text-xs text-gray-500 mt-1">Generated: {new Date().toLocaleString()}</p>
      </div>

      <div className="flex items-center justify-between no-print">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Examination Management</h1>
          <p className="text-xs text-slate-500">Configure Internal and External examinations with department and semester filters</p>
        </div>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-xl bg-[#ec912d] hover:bg-[#d47f22] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider"
        >
          <Printer className="h-4 w-4" /> Print Exam Details
        </button>
      </div>

      {error && <div className="no-print p-3 rounded-xl bg-rose-50 text-xs text-rose-700 flex items-center gap-2"><AlertCircle className="h-4 w-4" /> {error}</div>}
      {success && <div className="no-print p-3 rounded-xl bg-emerald-50 text-xs text-emerald-700 flex items-center gap-2"><CheckCircle className="h-4 w-4" /> {success}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form */}
        <div className="lg:col-span-5 rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs space-y-4 no-print">
          <h2 className="text-sm font-bold uppercase text-slate-700">{selectedId ? "Edit Examination" : "Create New Examination"}</h2>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Exam Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Internal Examination - S3"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Exam Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as "INTERNAL" | "EXTERNAL")}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 font-bold text-[#2463b4]"
                >
                  <option value="INTERNAL">INTERNAL</option>
                  <option value="EXTERNAL">EXTERNAL</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Data Structures"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-2 py-2"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Start Time</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-2 py-2"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Duration (min)</label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-2 py-2"
                />
              </div>
            </div>

            {/* Department Multi-Selection */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Participating Departments ({selectedDepts.length} selected)
              </label>
              <div className="flex flex-wrap gap-1.5 p-2 rounded-lg bg-slate-50 border border-slate-200">
                {departments.map((d) => {
                  const active = selectedDepts.includes(d.code);
                  return (
                    <button
                      type="button"
                      key={d.code}
                      onClick={() => toggleDept(d.code)}
                      className={`px-2.5 py-1 rounded text-xs font-bold transition ${
                        active
                          ? "bg-[#2463b4] text-white shadow-xs"
                          : "bg-white text-slate-600 border border-slate-300 hover:bg-slate-100"
                      }`}
                    >
                      {active ? "☑ " : "☐ "} {d.code}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Semester Multi-Selection */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Participating Semesters ({selectedSems.length} selected)
              </label>
              <div className="flex flex-wrap gap-1.5 p-2 rounded-lg bg-slate-50 border border-slate-200">
                {semesters.map((s) => {
                  const active = selectedSems.includes(s.semesterNumber);
                  return (
                    <button
                      type="button"
                      key={s.semesterNumber}
                      onClick={() => toggleSem(s.semesterNumber)}
                      className={`px-2.5 py-1 rounded text-xs font-bold transition ${
                        active
                          ? "bg-[#147d79] text-white shadow-xs"
                          : "bg-white text-slate-600 border border-slate-300 hover:bg-slate-100"
                      }`}
                    >
                      {active ? "☑ " : "☐ "} {s.semesterNumber}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button onClick={handleAdd} className="rounded-lg bg-[#147d79] text-white py-2 font-bold uppercase hover:bg-[#0f6663]">
                Add Exam
              </button>
              <button onClick={handleUpdate} disabled={!selectedId} className="rounded-lg bg-[#2463b4] text-white py-2 font-bold uppercase hover:bg-blue-700 disabled:opacity-50">
                Update
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={handleDelete} disabled={!selectedId} className="rounded-lg bg-rose-600 text-white py-2 font-bold uppercase hover:bg-rose-700 disabled:opacity-50">
                Delete
              </button>
              <button onClick={handleClear} className="rounded-lg bg-slate-200 text-slate-700 py-2 font-bold uppercase hover:bg-slate-300">
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Exams Table */}
        <div className="lg:col-span-7 rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs space-y-4">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0f2343] text-white uppercase text-[11px]">
              <tr>
                <th className="py-2.5 px-3">Exam Name</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Subject</th>
                <th className="py-2.5 px-3">Schedule</th>
                <th className="py-2.5 px-3">Depts & Sems</th>
                <th className="py-2.5 px-3 text-right">Seating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {exams.map((e) => (
                <tr
                  key={e.id}
                  onClick={() => handleSelect(e)}
                  className={`cursor-pointer hover:bg-blue-50/80 transition ${selectedId === e.id ? "bg-blue-100/70 font-semibold" : ""}`}
                >
                  <td className="py-3 px-3 font-bold text-slate-900">{e.name}</td>
                  <td className="py-3 px-3">
                    <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                      e.type === "INTERNAL" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                    }`}>
                      {e.type}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-700">{e.subject}</td>
                  <td className="py-3 px-3 text-slate-600">{e.date} {e.time}</td>
                  <td className="py-3 px-3">
                    <p className="font-semibold text-slate-700">{e.departments?.join(", ")}</p>
                    <p className="text-[10px] text-slate-500">{e.semesters?.join(", ")}</p>
                  </td>
                  <td className="py-3 px-3 text-right">
                    {e.seatingCount && e.seatingCount > 0 ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        ✓ {e.seatingCount} seated
                      </span>
                    ) : (
                      <span className="text-[11px] text-amber-600 font-semibold">Pending</span>
                    )}
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
