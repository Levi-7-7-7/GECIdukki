"use client";

import React, { useState, useEffect } from "react";
import { Printer, Download, Filter, Search } from "lucide-react";

interface Exam {
  id: number;
  name: string;
  type: string;
  date: string;
  time: string;
  subject: string;
}

export function ReportsFilterView() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");
  const [roomFilter, setRoomFilter] = useState("");
  const [teacherFilter, setTeacherFilter] = useState("");

  const [data, setData] = useState<any>(null);
  const [filteredSeats, setFilteredSeats] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/exams")
      .then(r => r.json())
      .then(d => {
        if (d.exams) {
          setExams(d.exams);
          if (d.exams.length > 0) setSelectedExamId(d.exams[0].id);
        }
      });
  }, []);

  const loadReport = () => {
    if (!selectedExamId) return;
    setLoading(true);
    fetch(`/api/seating/result?examId=${selectedExamId}`)
      .then(r => r.json())
      .then(d => {
        setData(d);
        applyFilter(d.allSeats || []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (selectedExamId) loadReport();
  }, [selectedExamId]);

  const applyFilter = (seats: any[]) => {
    let list = [...seats];
    if (departmentFilter.trim()) {
      const term = departmentFilter.trim().toLowerCase();
      list = list.filter(s => s.departmentCode?.toLowerCase().includes(term));
    }
    if (semesterFilter.trim()) {
      const term = semesterFilter.trim().toLowerCase();
      list = list.filter(s => s.semesterNumber?.toLowerCase().includes(term));
    }
    if (roomFilter.trim()) {
      const term = roomFilter.trim().toLowerCase();
      list = list.filter(s => s.roomNumber?.toLowerCase().includes(term));
    }
    if (teacherFilter.trim()) {
      const term = teacherFilter.trim().toLowerCase();
      list = list.filter(s => s.invigilatorName?.toLowerCase().includes(term));
    }
    setFilteredSeats(list);
  };

  const handleApplyFilterClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (data?.allSeats) applyFilter(data.allSeats);
  };

  const handleExport = () => {
    if (filteredSeats.length === 0) return;
    let text = `SMART EXAM SEATING ARRANGEMENT SYSTEM - FILTERED REPORT\n`;
    text += `Exam: ${data?.exam?.name || ""}\n`;
    text += `Generated: ${new Date().toLocaleString()}\n`;
    text += `Filtered Candidates Count: ${filteredSeats.length}\n\n`;
    text += `Room       Seat       Register No       Student Name              Dept   Sem   Invigilator\n`;
    text += `-----------------------------------------------------------------------------------------------------\n`;
    for (const s of filteredSeats) {
      text += `${s.roomNumber.padEnd(10)} ${s.seatNumber.padEnd(10)} ${s.registerNumber.padEnd(17)} ${s.studentName.padEnd(25)} ${s.departmentCode.padEnd(6)} ${s.semesterNumber.padEnd(5)} ${s.invigilatorName}\n`;
    }

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Filtered-Exam-Report-${data?.exam?.name || "Exam"}.txt`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="hidden print:block text-center border-b pb-4 mb-4">
        <h1 className="text-xl font-black uppercase">SMART EXAM SEATING ARRANGEMENT SYSTEM</h1>
        <h2 className="text-sm font-bold uppercase mt-1">COMPREHENSIVE FILTERED EXAMINATION REPORT</h2>
        <p className="text-xs text-gray-500 mt-1">
          Exam: {data?.exam?.name} | Generated: {new Date().toLocaleString()} | Filtered Count: {filteredSeats.length}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Reports & Filtered Seating</h1>
          <p className="text-xs text-slate-500">Filter candidate seating by examination, department, semester, room, or faculty</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-xl bg-[#ec912d] hover:bg-[#d47f22] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider shadow-sm"
          >
            <Printer className="h-4 w-4" /> Print Filtered Report
          </button>
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-xl bg-[#147d79] hover:bg-[#0f6663] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider shadow-sm"
          >
            <Download className="h-4 w-4" /> Export Text (.txt)
          </button>
        </div>
      </div>

      {/* Filter Form */}
      <form onSubmit={handleApplyFilterClick} className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs space-y-4 no-print">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Select Examination</label>
            <select
              value={selectedExamId || ""}
              onChange={(e) => setSelectedExamId(parseInt(e.target.value))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 font-semibold text-slate-800"
            >
              {exams.map((e) => (
                <option key={e.id} value={e.id}>{e.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Department</label>
            <input
              type="text"
              placeholder="e.g. CSE"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 uppercase font-mono"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Semester</label>
            <input
              type="text"
              placeholder="e.g. S3"
              value={semesterFilter}
              onChange={(e) => setSemesterFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 uppercase font-mono"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Room</label>
            <input
              type="text"
              placeholder="e.g. 101"
              value={roomFilter}
              onChange={(e) => setRoomFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Teacher / Invigilator</label>
            <input
              type="text"
              placeholder="e.g. Anil"
              value={teacherFilter}
              onChange={(e) => setTeacherFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <span className="text-xs text-slate-500">
            Matching candidates: <strong>{filteredSeats.length}</strong>
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setDepartmentFilter("");
                setSemesterFilter("");
                setRoomFilter("");
                setTeacherFilter("");
                if (data?.allSeats) setFilteredSeats(data.allSeats);
              }}
              className="rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 text-xs font-bold uppercase"
            >
              Reset Filters
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#2463b4] hover:bg-blue-700 text-white px-4 py-1.5 text-xs font-bold uppercase flex items-center gap-1.5"
            >
              <Filter className="h-3.5 w-3.5" /> Apply Filters
            </button>
          </div>
        </div>
      </form>

      {/* Table Results */}
      <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="overflow-x-auto max-h-[500px]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0f2343] text-white uppercase text-[11px] sticky top-0">
              <tr>
                <th className="py-2.5 px-3">Room</th>
                <th className="py-2.5 px-3">Seat</th>
                <th className="py-2.5 px-3">Register No</th>
                <th className="py-2.5 px-3">Candidate Name</th>
                <th className="py-2.5 px-3">Dept</th>
                <th className="py-2.5 px-3">Sem</th>
                <th className="py-2.5 px-3">Invigilator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredSeats.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="py-2 px-3 font-mono font-bold text-slate-900">Room {s.roomNumber}</td>
                  <td className="py-2 px-3 font-mono font-black text-[#2463b4]">{s.seatNumber}</td>
                  <td className="py-2 px-3 font-mono font-bold text-slate-900">{s.registerNumber}</td>
                  <td className="py-2 px-3 text-slate-800">{s.studentName}</td>
                  <td className="py-2 px-3">
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-700">
                      {s.departmentCode}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-slate-600">{s.semesterNumber}</td>
                  <td className="py-2 px-3 text-slate-600">{s.invigilatorName}</td>
                </tr>
              ))}
              {filteredSeats.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    {loading ? "Loading records..." : "No candidates match the specified filters."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
