"use client";

import React, { useState } from "react";
import { Search, Printer, CheckCircle2, AlertCircle, Building2, Calendar, Clock, UserCheck, Sparkles } from "lucide-react";

interface SeatingSearchResponse {
  seating?: {
    id: number;
    seatNumber: string;
    rowLabel: string;
    columnNumber: number;
    registerNumber: string;
    studentName: string;
    departmentCode: string;
    semesterNumber: string;
    roomNumber: string;
    building: string;
    floorNo: number;
    examId: number;
    examName: string;
    examType: string;
    examDate: string;
    examTime: string;
    subject: string;
    invigilatorName: string;
    invigilatorDesignation: string;
  };
  student?: {
    registerNumber: string;
    name: string;
    departmentCode: string;
    semesterNumber: string;
  };
  message?: string;
  error?: string;
}

export function StudentSeatSearchView() {
  const [registerNumber, setRegisterNumber] = useState("24CS023");
  const [result, setResult] = useState<SeatingSearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (regToSearch?: string) => {
    const reg = (regToSearch || registerNumber).trim();
    if (!reg) {
      setError("Please enter a register number");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/seating/search?registerNumber=${encodeURIComponent(reg)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Student not found");
      setResult(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error searching student seat");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Official Slip for Printing */}
      <div className="hidden print:block text-center border-b pb-4 mb-4">
        <h1 className="text-xl font-black uppercase">SMART EXAM SEATING ARRANGEMENT SYSTEM</h1>
        <h2 className="text-sm font-bold uppercase mt-1">OFFICIAL EXAMINATION SEAT ALLOCATION SLIP</h2>
        <p className="text-xs text-gray-500 mt-1">Generated: {new Date().toLocaleString()}</p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Student Seat Search</h1>
          <p className="text-xs text-slate-500">Quickly locate assigned examination hall, desk seat number, and invigilator</p>
        </div>
        {result?.seating && (
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-xl bg-[#ec912d] hover:bg-[#d47f22] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider"
          >
            <Printer className="h-4 w-4" /> Print Student Seat
          </button>
        )}
      </div>

      {/* Search Input Box */}
      <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-4 no-print">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Enter Student Register Number (e.g. 24CS023)..."
              value={registerNumber}
              onChange={(e) => setRegisterNumber(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2.5 text-sm font-mono font-bold uppercase text-slate-800 focus:border-[#2463b4] focus:outline-none"
            />
          </div>
          <button
            onClick={() => handleSearch()}
            disabled={loading}
            className="rounded-xl bg-[#2463b4] hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition shadow-sm"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {/* Quick Demo Buttons */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 pt-1">
          <span className="font-semibold text-slate-700">Quick demo candidates:</span>
          {["24CS023", "24CS001", "24EC001", "24EE001"].map((reg) => (
            <button
              key={reg}
              onClick={() => { setRegisterNumber(reg); handleSearch(reg); }}
              className="rounded-lg bg-blue-50 hover:bg-blue-100 text-[#2463b4] px-2.5 py-1 font-mono font-bold text-xs border border-blue-200 transition"
            >
              {reg}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2 no-print">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      {/* Result Card */}
      {result?.seating && (
        <div className="max-w-2xl mx-auto rounded-3xl bg-white border-2 border-[#10284c]/20 p-8 shadow-lg space-y-6">
          {/* Header */}
          <div className="border-b pb-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2463b4]">EXAMINATION HALL TICKET</p>
              <h2 className="text-xl font-black text-[#0f2343] mt-0.5">EXAM SEAT DETAILS</h2>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
              SEAT CONFIRMED
            </span>
          </div>

          {/* Candidate Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-slate-500 font-bold uppercase text-[10px]">Register Number</span>
              <p className="font-mono text-base font-black text-slate-900 mt-0.5">{result.seating.registerNumber}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-slate-500 font-bold uppercase text-[10px]">Candidate Name</span>
              <p className="text-base font-bold text-slate-900 mt-0.5">{result.seating.studentName}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-slate-500 font-bold uppercase text-[10px]">Department</span>
              <p className="text-sm font-bold text-slate-800 mt-0.5">{result.seating.departmentCode}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-slate-500 font-bold uppercase text-[10px]">Semester</span>
              <p className="text-sm font-bold text-slate-800 mt-0.5">{result.seating.semesterNumber}</p>
            </div>
          </div>

          {/* Exam & Allocation Highlight */}
          <div className="rounded-2xl bg-gradient-to-r from-[#0f2343] to-[#1e3a68] text-white p-6 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-blue-200 font-semibold">{result.seating.examName}</p>
                <p className="text-lg font-bold text-white mt-0.5">{result.seating.subject}</p>
              </div>
              <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-bold text-[#69d2ce]">
                {result.seating.examType}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-300">Examination Hall</p>
                <p className="text-3xl font-black text-white mt-1">Room {result.seating.roomNumber}</p>
                <p className="text-[11px] text-slate-300 mt-0.5">{result.seating.building} • Floor {result.seating.floorNo}</p>
              </div>

              <div className="border-l border-white/10 pl-4">
                <p className="text-[10px] font-bold uppercase text-slate-300">Allocated Desk</p>
                <p className="text-3xl font-black text-[#69d2ce] mt-1">{result.seating.seatNumber}</p>
                <p className="text-[11px] text-slate-300 mt-0.5">Row {result.seating.rowLabel} • Column {result.seating.columnNumber}</p>
              </div>
            </div>
          </div>

          {/* Schedule & Faculty in-charge */}
          <div className="space-y-2 text-xs text-slate-600 border-t pt-4">
            <div className="flex items-center justify-between">
              <span>Date & Time:</span>
              <strong className="text-slate-900">{result.seating.examDate} at {result.seating.examTime}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>Invigilator In-charge:</span>
              <strong className="text-slate-900">{result.seating.invigilatorName} ({result.seating.invigilatorDesignation || "Faculty"})</strong>
            </div>
          </div>

          {/* Signature Footer */}
          <div className="pt-6 border-t border-dashed border-slate-300 flex justify-between items-end text-[11px] text-slate-500">
            <span>Candidate must bring valid College ID</span>
            <span className="text-right">Authorized Seal / Signature</span>
          </div>

          {/* Print Button inside card */}
          <div className="no-print pt-2">
            <button
              onClick={handlePrint}
              className="w-full rounded-xl bg-[#ec912d] hover:bg-[#d47f22] text-white py-3 text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-sm"
            >
              <Printer className="h-4 w-4" /> Print Student Seat Ticket
            </button>
          </div>
        </div>
      )}

      {result?.student && !result.seating && (
        <div className="max-w-xl mx-auto rounded-2xl bg-amber-50 border border-amber-200 p-6 text-center space-y-2 no-print">
          <p className="text-sm font-bold text-amber-900">Student Found, but Seating Not Yet Generated</p>
          <p className="text-xs text-amber-700">
            {result.student.name} ({result.student.registerNumber}) is registered in {result.student.departmentCode} - {result.student.semesterNumber}.
          </p>
          <p className="text-xs text-slate-600 mt-2">
            Please run <strong>Generate Seating</strong> for an examination matching this student&apos;s department and semester.
          </p>
        </div>
      )}
    </div>
  );
}
