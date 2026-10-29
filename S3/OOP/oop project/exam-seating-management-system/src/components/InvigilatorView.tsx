"use client";

import React, { useState, useEffect } from "react";
import { Printer, UserCheck } from "lucide-react";

interface Exam {
  id: number;
  name: string;
  type: string;
  date: string;
  time: string;
}

export function InvigilatorView({ defaultExamId }: { defaultExamId?: number }) {
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
        <h2 className="text-sm font-bold uppercase mt-1">INVIGILATOR EXAMINATION DUTY ALLOCATION LIST</h2>
        <p className="text-xs text-gray-500 mt-1">Generated: {new Date().toLocaleString()}</p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Invigilator Duty List</h1>
          <p className="text-xs text-slate-500">Hall-wise assigned faculty invigilation schedule</p>
        </div>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-xl bg-[#ec912d] hover:bg-[#d47f22] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider"
        >
          <Printer className="h-4 w-4" /> Print Invigilator List
        </button>
      </div>

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

      {loading && <div className="p-8 text-center text-slate-400">Loading duty assignments...</div>}

      {data && data.invigilators && data.invigilators.length > 0 ? (
        <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div>
              <p className="text-base font-black text-slate-900">{data.exam?.name}</p>
              <p className="text-slate-600">Subject: {data.exam?.subject} | Schedule: {data.exam?.date} at {data.exam?.time}</p>
            </div>
            <span className="font-bold text-slate-600">
              Total Duty Halls: {data.invigilators.length}
            </span>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-[#0f2343] text-white uppercase text-[11px]">
              <tr>
                <th className="py-2.5 px-3">Room</th>
                <th className="py-2.5 px-3">Assigned Faculty</th>
                <th className="py-2.5 px-3">Designation</th>
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3 text-center">Faculty Signature</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {data.invigilators.map((inv: any) => (
                <tr key={inv.roomNumber} className="hover:bg-slate-50">
                  <td className="py-3.5 px-3 font-mono font-black text-slate-900">Room {inv.roomNumber}</td>
                  <td className="py-3.5 px-3 font-bold text-slate-800">{inv.teacherName}</td>
                  <td className="py-3.5 px-3 text-slate-600">{inv.designation}</td>
                  <td className="py-3.5 px-3">
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-700">
                      {inv.departmentCode}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-center border-b border-dashed border-slate-300">
                    <span className="text-[10px] text-slate-300 print:invisible">____________________</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pt-8 mt-6 border-t border-slate-200 flex justify-between items-end text-xs">
            <p className="text-slate-500">Official Exam Control Office</p>
            <p className="border-t border-slate-400 pt-1 font-bold text-slate-800">
              Chief Superintendent Signature: _______________________
            </p>
          </div>
        </div>
      ) : (
        !loading && (
          <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border">
            No invigilator assignments found for this examination.
          </div>
        )
      )}
    </div>
  );
}
