"use client";

import React, { useState, useEffect } from "react";
import { Printer, FileCheck } from "lucide-react";

interface Exam {
  id: number;
  name: string;
  type: string;
  date: string;
  time: string;
  subject: string;
}

export function AttendanceView({ defaultExamId }: { defaultExamId?: number }) {
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<number | null>(defaultExamId || null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/exams")
      .then(res => res.json())
      .then(d => {
        if (d.exams) {
          setExams(d.exams);
          if (!selectedExamId && d.exams.length > 0) {
            setSelectedExamId(d.exams[0].id);
          }
        }
      });
  }, []);

  useEffect(() => {
    if (!selectedExamId) return;
    setLoading(true);
    fetch(`/api/seating/result?examId=${selectedExamId}`)
      .then(res => res.json())
      .then(d => setData(d))
      .finally(() => setLoading(false));
  }, [selectedExamId]);

  return (
    <div className="space-y-6">
      <div className="hidden print:block text-center border-b pb-4 mb-4">
        <h1 className="text-xl font-black uppercase">SMART EXAM SEATING ARRANGEMENT SYSTEM</h1>
        <h2 className="text-sm font-bold uppercase mt-1">OFFICIAL EXAMINATION ATTENDANCE SHEET</h2>
        <p className="text-xs text-gray-500 mt-1">Generated: {new Date().toLocaleString()}</p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Room-Wise Attendance Sheet</h1>
          <p className="text-xs text-slate-500">Official candidate sign-in register with invigilator verification</p>
        </div>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-xl bg-[#ec912d] hover:bg-[#d47f22] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider"
        >
          <Printer className="h-4 w-4" /> Print Attendance Sheet
        </button>
      </div>

      {/* Exam Selector */}
      <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs no-print">
        <label className="block text-xs font-bold text-slate-700 mb-1">Select Examination</label>
        <select
          value={selectedExamId || ""}
          onChange={(e) => setSelectedExamId(parseInt(e.target.value))}
          className="w-full sm:w-96 rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-bold text-slate-800"
        >
          {exams.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name} ({e.type}) — {e.date}
            </option>
          ))}
        </select>
      </div>

      {loading && <div className="p-8 text-center text-slate-400">Loading attendance data...</div>}

      {data && data.rooms && data.rooms.length > 0 ? (
        <div className="space-y-8">
          {data.rooms.map((room: any) => (
            <div key={room.roomNumber} className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-4 page-break">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 text-xs">
                <div>
                  <h3 className="text-base font-black text-slate-900">EXAMINATION ROOM {room.roomNumber}</h3>
                  <p className="text-slate-600 mt-0.5">Invigilator Faculty: <strong className="text-slate-900">{room.invigilatorName}</strong> ({room.invigilatorDesignation})</p>
                </div>
                <div className="text-right">
                  <p>Candidates Assigned: <strong>{room.seats.length}</strong> / {room.capacity}</p>
                  <p className="text-slate-500">Exam: {data.exam?.name} [{data.exam?.date}]</p>
                </div>
              </div>

              <table className="w-full text-left text-xs">
                <thead className="bg-[#0f2343] text-white uppercase text-[11px]">
                  <tr>
                    <th className="py-2 px-3 w-12">Sl No</th>
                    <th className="py-2 px-3 w-20">Seat</th>
                    <th className="py-2 px-3 w-36">Register No</th>
                    <th className="py-2 px-3">Candidate Name</th>
                    <th className="py-2 px-3 w-20">Dept</th>
                    <th className="py-2 px-3 w-48 text-center">Candidate Signature</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {room.seats.map((s: any, idx: number) => (
                    <tr key={s.id}>
                      <td className="py-2 px-3 text-slate-500 font-semibold">{idx + 1}</td>
                      <td className="py-2 px-3 font-mono font-bold text-[#2463b4]">{s.seatNumber}</td>
                      <td className="py-2 px-3 font-mono font-bold text-slate-900">{s.registerNumber}</td>
                      <td className="py-2 px-3 text-slate-800">{s.studentName}</td>
                      <td className="py-2 px-3 text-slate-600">{s.departmentCode}</td>
                      <td className="py-2 px-3 text-center border-b border-dashed border-slate-300">
                        <span className="text-[10px] text-slate-300 print:invisible">____________________</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="pt-6 mt-6 border-t border-slate-200 flex justify-between items-end text-xs">
                <div>
                  <p className="text-slate-600">Present Candidates: _______ / {room.seats.length}</p>
                  <p className="text-slate-600 mt-1">Absent Candidates: _______</p>
                </div>
                <div className="text-right">
                  <p className="border-t border-slate-400 pt-1 font-bold text-slate-800">
                    Invigilator Signature: _______________________
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{room.invigilatorName}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && (
          <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border">
            No seating arrangement has been generated yet for this examination. Go to <strong>Generate Seating</strong> to create one.
          </div>
        )
      )}
    </div>
  );
}
