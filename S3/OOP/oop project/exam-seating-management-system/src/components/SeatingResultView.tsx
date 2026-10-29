"use client";

import React, { useState, useEffect } from "react";
import { 
  Printer, 
  ArrowLeft, 
  LayoutGrid, 
  ListOrdered, 
  FileCheck, 
  UserCheck, 
  FileText,
  Building2,
  Calendar,
  Clock,
  Download
} from "lucide-react";

interface SeatRecord {
  id: number;
  seatNumber: string;
  rowLabel: string;
  columnNumber: number;
  registerNumber: string;
  studentName: string;
  departmentCode: string;
  semesterNumber: string;
  roomNumber: string;
  invigilatorName: string;
  invigilatorDesignation: string;
}

interface RoomGroup {
  roomNumber: string;
  capacity: number;
  rowsCount: number;
  columnsCount: number;
  invigilatorName: string;
  invigilatorDesignation: string;
  seats: SeatRecord[];
}

interface InvigilatorDuty {
  roomNumber: string;
  teacherName: string;
  designation: string;
  departmentCode: string;
}

interface SeatingResultViewProps {
  examId: number;
  onBack: () => void;
}

export function SeatingResultView({ examId, onBack }: SeatingResultViewProps) {
  const [data, setData] = useState<{
    exam: {
      id: number;
      name: string;
      type: string;
      date: string;
      time: string;
      duration: number;
      subject: string;
      academicYear: string;
    };
    totalStudentsSeated: number;
    rooms: RoomGroup[];
    invigilators: InvigilatorDuty[];
    allSeats: SeatRecord[];
  } | null>(null);

  const [activeTab, setActiveTab] = useState<"arrangement" | "chart" | "attendance" | "invigilators" | "complete">("arrangement");
  const [activeRoomIndex, setActiveRoomIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await fetch(`/api/seating/result?examId=${examId}`);
        const json = await res.json();
        setData(json);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [examId]);

  if (loading || !data) {
    return (
      <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border">
        Loading generated examination seating arrangement...
      </div>
    );
  }

  const { exam, rooms, invigilators, allSeats } = data;
  const currentRoom = rooms[activeRoomIndex] || rooms[0];

  const handlePrint = () => {
    window.print();
  };

  const handleExportText = () => {
    let text = `================================================\n`;
    text += `SMART EXAM SEATING ARRANGEMENT SYSTEM\n`;
    text += `================================================\n`;
    text += `Exam: ${exam.name}\nType: ${exam.type}\nSubject: ${exam.subject}\nDate: ${exam.date} | Time: ${exam.time}\n\n`;

    for (const r of rooms) {
      text += `------------------------------------------------\n`;
      text += `ROOM ${r.roomNumber} (Invigilator: ${r.invigilatorName} - ${r.invigilatorDesignation})\n`;
      text += `Seat       Register No       Name                 Dept\n`;
      for (const s of r.seats) {
        text += `${s.seatNumber.padEnd(10)} ${s.registerNumber.padEnd(17)} ${s.studentName.padEnd(20)} ${s.departmentCode}\n`;
      }
      text += `Total Students: ${r.seats.length} / Capacity: ${r.capacity}\n\n`;
    }

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Seating-Arrangement-${exam.name.replace(/\s+/g, "_")}.txt`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Official Printable Header */}
      <div className="hidden print:block text-center border-b pb-4 mb-4">
        <h1 className="text-xl font-black uppercase">SMART EXAM SEATING ARRANGEMENT SYSTEM</h1>
        <h2 className="text-sm font-bold uppercase mt-1">
          {activeTab === "arrangement" && "OFFICIAL SEATING ARRANGEMENT"}
          {activeTab === "chart" && `ROOM SEATING CHART — ROOM ${currentRoom?.roomNumber || ""}`}
          {activeTab === "attendance" && "ROOM-WISE EXAMINATION ATTENDANCE SHEET"}
          {activeTab === "invigilators" && "INVIGILATOR DUTY ALLOCATION LIST"}
          {activeTab === "complete" && "COMPLETE EXAMINATION REPORT"}
        </h2>
        <p className="text-xs text-gray-700 mt-1">
          Exam: <strong>{exam.name}</strong> | Type: <strong>{exam.type}</strong> | Subject: <strong>{exam.subject}</strong> | Date: <strong>{exam.date}</strong> | Time: <strong>{exam.time}</strong>
        </p>
      </div>

      {/* Top Banner & Control Bar */}
      <div className="rounded-2xl bg-[#0f2343] p-5 text-white shadow-md no-print space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                exam.type === "INTERNAL" ? "bg-blue-500/30 text-blue-200" : "bg-purple-500/30 text-purple-200"
              }`}>
                {exam.type} EXAMINATION
              </span>
              <span className="text-xs text-slate-300">Academic Year: {exam.academicYear}</span>
            </div>
            <h1 className="text-2xl font-black mt-1">{exam.name}</h1>
            <p className="text-xs text-blue-200/80 mt-0.5 flex flex-wrap items-center gap-3">
              <span>Subject: <strong>{exam.subject}</strong></span>
              <span>Date: <strong>{exam.date}</strong></span>
              <span>Time: <strong>{exam.time}</strong></span>
              <span>Total Seated: <strong>{data.totalStudentsSeated} candidates</strong></span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#ec912d] hover:bg-[#d47f22] text-white px-3.5 py-2 text-xs font-bold uppercase tracking-wider shadow-sm transition"
            >
              <Printer className="h-4 w-4" /> Print Current View
            </button>
            <button
              onClick={handleExportText}
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white px-3.5 py-2 text-xs font-bold uppercase tracking-wider border border-white/20 transition"
            >
              <Download className="h-4 w-4" /> Export Text
            </button>
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white px-3.5 py-2 text-xs font-bold uppercase tracking-wider border border-white/20 transition"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 border-t border-white/10 pt-3">
          {[
            { id: "arrangement", label: "Seating Arrangement", icon: ListOrdered },
            { id: "chart", label: "Room Seating Chart", icon: LayoutGrid },
            { id: "attendance", label: "Attendance Sheet", icon: FileCheck },
            { id: "invigilators", label: "Invigilator Duty List", icon: UserCheck },
            { id: "complete", label: "Complete Exam Report", icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                  active
                    ? "bg-[#2463b4] text-white shadow-xs"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon className="h-3.5 w-3.5" /> {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: SEATING ARRANGEMENT LIST */}
      {activeTab === "arrangement" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between no-print">
            <h2 className="text-sm font-bold uppercase text-slate-700">Room-Wise Candidate Allocation</h2>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#2463b4] text-white px-3 py-1.5 text-xs font-bold uppercase hover:bg-blue-700"
            >
              <Printer className="h-3.5 w-3.5" /> Print Seating Arrangement
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {rooms.map((room) => (
              <div key={room.roomNumber} className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs space-y-4 page-break">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
                  <div>
                    <h3 className="text-base font-black text-[#0f2343]">ROOM {room.roomNumber}</h3>
                    <p className="text-xs text-slate-500">
                      Invigilator: <strong className="text-slate-800">{room.invigilatorName}</strong> ({room.invigilatorDesignation || "Faculty"})
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-semibold">
                    <span className="text-slate-600">Students: <strong className="text-slate-900">{room.seats.length}</strong></span>
                    <span className="text-slate-400">|</span>
                    <span className="text-slate-600">Capacity: <strong className="text-slate-900">{room.capacity}</strong></span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0f2343] text-white uppercase text-[11px]">
                      <tr>
                        <th className="py-2 px-3">Seat</th>
                        <th className="py-2 px-3">Register Number</th>
                        <th className="py-2 px-3">Student Name</th>
                        <th className="py-2 px-3">Department</th>
                        <th className="py-2 px-3">Semester</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {room.seats.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50">
                          <td className="py-2 px-3 font-mono font-black text-[#2463b4]">{s.seatNumber}</td>
                          <td className="py-2 px-3 font-mono font-bold text-slate-900">{s.registerNumber}</td>
                          <td className="py-2 px-3 text-slate-800">{s.studentName}</td>
                          <td className="py-2 px-3">
                            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-700">
                              {s.departmentCode}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-slate-600">{s.semesterNumber}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ROOM-WISE SEATING CHART (VISUAL BLACKBOARD LAYOUT) */}
      {activeTab === "chart" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">Select Room:</span>
              <div className="flex flex-wrap gap-1">
                {rooms.map((r, i) => (
                  <button
                    key={r.roomNumber}
                    onClick={() => setActiveRoomIndex(i)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      activeRoomIndex === i
                        ? "bg-[#10284c] text-white shadow-xs"
                        : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    Room {r.roomNumber}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#147d79] text-white px-3 py-1.5 text-xs font-bold uppercase hover:bg-[#0f6663]"
            >
              <Printer className="h-3.5 w-3.5" /> Print Room Chart
            </button>
          </div>

          {currentRoom && (
            <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-6">
              {/* Room Meta */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4">
                <div>
                  <h2 className="text-xl font-black text-[#0f2343]">EXAMINATION ROOM {currentRoom.roomNumber}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Invigilator: <strong className="text-slate-800">{currentRoom.invigilatorName}</strong> ({currentRoom.invigilatorDesignation})
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <span className="rounded-lg bg-blue-50 text-[#2463b4] px-2.5 py-1 border border-blue-200">
                    Seated: <strong>{currentRoom.seats.length}</strong> / {currentRoom.capacity} seats
                  </span>
                  <span className="text-slate-500">
                    Layout: {currentRoom.rowsCount} rows × {currentRoom.columnsCount} columns
                  </span>
                </div>
              </div>

              {/* VISUAL BLACKBOARD */}
              <div className="relative mx-auto max-w-xl rounded-xl bg-gradient-to-b from-[#1b3d2f] to-[#12281f] p-3 text-center text-white shadow-md border-2 border-[#2b5945]">
                <p className="text-xs font-black uppercase tracking-[0.3em] text-[#86efac]">BLACKBOARD / FRONT OF HALL</p>
                <p className="text-[10px] text-emerald-200/70">Invigilator Desk & Stage</p>
              </div>

              {/* Grid Desks */}
              <div className="overflow-x-auto pt-2">
                <div className="inline-block min-w-full space-y-3">
                  {/* Column numbers header */}
                  <div className="flex items-center gap-3 pl-8 text-center text-xs font-bold text-slate-400">
                    {Array.from({ length: currentRoom.columnsCount }, (_, ci) => (
                      <div key={ci} className="w-32">
                        Col {ci + 1}
                      </div>
                    ))}
                  </div>

                  {/* Rows A, B, C, D, E */}
                  {Array.from({ length: currentRoom.rowsCount }, (_, ri) => {
                    const rowLabel = String.fromCharCode(65 + ri);
                    return (
                      <div key={rowLabel} className="flex items-center gap-3">
                        <span className="w-5 text-center font-black text-sm text-slate-700">{rowLabel}</span>
                        <div className="flex gap-3">
                          {Array.from({ length: currentRoom.columnsCount }, (_, ci) => {
                            const colNum = ci + 1;
                            const seatNumber = `${rowLabel}${colNum}`;
                            const seat = currentRoom.seats.find(s => s.rowLabel === rowLabel && s.columnNumber === colNum);

                            return (
                              <div
                                key={seatNumber}
                                className={`w-32 rounded-xl p-2.5 border text-xs transition ${
                                  seat
                                    ? "bg-slate-50 border-slate-300 hover:border-blue-400 hover:shadow-xs"
                                    : "bg-slate-100/50 border-dashed border-slate-300 text-slate-400"
                                }`}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-mono font-bold text-[11px] text-[#2463b4]">{seatNumber}</span>
                                  {seat && (
                                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                                      seat.departmentCode === "CSE" ? "bg-blue-100 text-blue-700" :
                                      seat.departmentCode === "ECE" ? "bg-purple-100 text-purple-700" :
                                      seat.departmentCode === "EEE" ? "bg-emerald-100 text-emerald-700" :
                                      "bg-amber-100 text-amber-700"
                                    }`}>
                                      {seat.departmentCode}
                                    </span>
                                  )}
                                </div>
                                {seat ? (
                                  <div>
                                    <p className="font-mono font-black text-slate-900 text-[11px]">{seat.registerNumber}</p>
                                    <p className="text-[10px] text-slate-600 truncate">{seat.studentName}</p>
                                  </div>
                                ) : (
                                  <p className="text-[10px] italic py-2 text-center">Empty</p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ATTENDANCE SHEET */}
      {activeTab === "attendance" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between no-print">
            <h2 className="text-sm font-bold uppercase text-slate-700">Room-Wise Examination Attendance Sheets</h2>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#2463b4] text-white px-3 py-1.5 text-xs font-bold uppercase hover:bg-blue-700"
            >
              <Printer className="h-3.5 w-3.5" /> Print Attendance Sheet
            </button>
          </div>

          <div className="space-y-8">
            {rooms.map((room) => (
              <div key={room.roomNumber} className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-4 page-break">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 text-xs">
                  <div>
                    <h3 className="text-base font-black text-slate-900">ROOM {room.roomNumber} — ATTENDANCE SHEET</h3>
                    <p className="text-slate-600 mt-0.5">Invigilator: <strong className="text-slate-900">{room.invigilatorName}</strong></p>
                  </div>
                  <div className="text-right">
                    <p>Total Candidates: <strong>{room.seats.length}</strong></p>
                    <p className="text-slate-500">Date: {exam.date} | Time: {exam.time}</p>
                  </div>
                </div>

                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0f2343] text-white uppercase text-[11px]">
                    <tr>
                      <th className="py-2 px-3 w-12">Sl No</th>
                      <th className="py-2 px-3 w-20">Seat</th>
                      <th className="py-2 px-3 w-36">Register No</th>
                      <th className="py-2 px-3">Student Name</th>
                      <th className="py-2 px-3 w-20">Dept</th>
                      <th className="py-2 px-3 w-48 text-center">Candidate Signature</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {room.seats.map((s, idx) => (
                      <tr key={s.id}>
                        <td className="py-2 px-3 font-semibold text-slate-500">{idx + 1}</td>
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

                {/* Signatures Footer */}
                <div className="pt-6 mt-6 border-t border-slate-200 flex justify-between items-end text-xs">
                  <div>
                    <p className="text-slate-600">Total Students Present: _______ / {room.seats.length}</p>
                    <p className="text-slate-600 mt-1">Total Students Absent: _______</p>
                  </div>
                  <div className="text-right">
                    <p className="border-t border-slate-400 pt-1 font-bold text-slate-800">
                      Invigilator Signature: _______________________
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Faculty In-charge ({room.invigilatorName})</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: INVIGILATOR DUTY LIST */}
      {activeTab === "invigilators" && (
        <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between no-print">
            <h2 className="text-sm font-bold uppercase text-slate-700">Invigilator Duty Allocation List</h2>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#2463b4] text-white px-3 py-1.5 text-xs font-bold uppercase hover:bg-blue-700"
            >
              <Printer className="h-3.5 w-3.5" /> Print Invigilator List
            </button>
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-[#0f2343] text-white uppercase text-[11px]">
              <tr>
                <th className="py-2.5 px-3">Room</th>
                <th className="py-2.5 px-3">Invigilator Faculty</th>
                <th className="py-2.5 px-3">Designation</th>
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3 text-center">Faculty Signature</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {invigilators.map((inv) => (
                <tr key={inv.roomNumber} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-mono font-black text-slate-900">Room {inv.roomNumber}</td>
                  <td className="py-3 px-3 font-bold text-slate-800">{inv.teacherName}</td>
                  <td className="py-3 px-3 text-slate-600">{inv.designation}</td>
                  <td className="py-3 px-3">
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-700">
                      {inv.departmentCode}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center border-b border-dashed border-slate-300">
                    <span className="text-[10px] text-slate-300 print:invisible">____________________</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pt-8 mt-6 border-t border-slate-200 flex justify-between items-end text-xs">
            <p className="text-slate-500">Report Generated: {new Date().toLocaleString()}</p>
            <p className="border-t border-slate-400 pt-1 font-bold text-slate-800">
              Chief Superintendent / Principal Signature: _______________________
            </p>
          </div>
        </div>
      )}

      {/* TAB 5: COMPLETE REPORT */}
      {activeTab === "complete" && (
        <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between no-print">
            <h2 className="text-sm font-bold uppercase text-slate-700">Complete Examination Report</h2>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#2463b4] text-white px-3 py-1.5 text-xs font-bold uppercase hover:bg-blue-700"
            >
              <Printer className="h-3.5 w-3.5" /> Print Complete Report
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border">
              <span className="text-slate-500 font-bold uppercase text-[10px]">Total Candidates</span>
              <p className="text-lg font-black text-slate-900 mt-1">{data.totalStudentsSeated}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border">
              <span className="text-slate-500 font-bold uppercase text-[10px]">Halls Utilized</span>
              <p className="text-lg font-black text-[#2463b4] mt-1">{rooms.length} rooms</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border">
              <span className="text-slate-500 font-bold uppercase text-[10px]">Total Hall Capacity</span>
              <p className="text-lg font-black text-slate-900 mt-1">{rooms.reduce((s, r) => s + r.capacity, 0)} seats</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border">
              <span className="text-slate-500 font-bold uppercase text-[10px]">Invigilators Assigned</span>
              <p className="text-lg font-black text-purple-700 mt-1">{invigilators.length} faculty</p>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-700 border-t pt-4">
            <p><strong>Examination Name:</strong> {exam.name}</p>
            <p><strong>Type:</strong> {exam.type} | <strong>Subject:</strong> {exam.subject}</p>
            <p><strong>Date & Time:</strong> {exam.date} from {exam.time} ({exam.duration} minutes)</p>
            <p><strong>Rooms Utilized:</strong> {rooms.map(r => r.roomNumber).join(", ")}</p>
          </div>

          <div className="overflow-x-auto max-h-[400px]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0f2343] text-white uppercase text-[11px] sticky top-0">
                <tr>
                  <th className="py-2 px-3">Room</th>
                  <th className="py-2 px-3">Seat</th>
                  <th className="py-2 px-3">Register No</th>
                  <th className="py-2 px-3">Candidate Name</th>
                  <th className="py-2 px-3">Dept</th>
                  <th className="py-2 px-3">Invigilator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {allSeats.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-mono font-bold text-slate-900">Room {s.roomNumber}</td>
                    <td className="py-2 px-3 font-mono font-black text-[#2463b4]">{s.seatNumber}</td>
                    <td className="py-2 px-3 font-mono font-bold text-slate-900">{s.registerNumber}</td>
                    <td className="py-2 px-3 text-slate-800">{s.studentName}</td>
                    <td className="py-2 px-3 text-slate-600">{s.departmentCode}</td>
                    <td className="py-2 px-3 text-slate-600">{s.invigilatorName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
