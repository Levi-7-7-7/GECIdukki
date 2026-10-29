"use client";

import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  Layers, 
  RotateCcw, 
  Printer, 
  CheckCircle2, 
  AlertTriangle, 
  Check, 
  Trash2,
  Users,
  DoorClosed
} from "lucide-react";

interface Exam {
  id: number;
  name: string;
  type: string;
  date: string;
  time: string;
  subject: string;
  departments: string[];
  semesters: string[];
}

interface Room {
  id: number;
  roomNumber: string;
  building: string;
  floorNo: number;
  rowsCount: number;
  columnsCount: number;
  capacity: number;
  status: string;
}

const SHUFFLE_OPTIONS = [
  "No Shuffle",
  "Random Shuffle",
  "Register Number Ascending",
  "Register Number Descending",
  "Department-wise",
  "Semester-wise",
  "Department + Register Number",
  "Department Mixing",
  "Custom Shuffle"
];

interface GenerateSeatingViewProps {
  userRole: string;
  onSeatingGenerated: (examId: number) => void;
  preselectedExamId?: number | null;
}

export function GenerateSeatingView({ userRole, onSeatingGenerated, preselectedExamId }: GenerateSeatingViewProps) {
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<number | null>(preselectedExamId || null);
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [selectedRoomIds, setSelectedRoomIds] = useState<number[]>([]);
  const [shuffleOrder, setShuffleOrder] = useState<string>("Department Mixing");
  const [roomMode, setRoomMode] = useState<"AUTOMATIC" | "MANUAL">("AUTOMATIC");

  // Exam stats
  const [matchingStudentCount, setMatchingStudentCount] = useState<number>(0);
  const [examDepts, setExamDepts] = useState<string[]>([]);
  const [examSems, setExamSems] = useState<string[]>([]);
  const [existingSeatingCount, setExistingSeatingCount] = useState<number>(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isAdmin = userRole === "ADMIN";

  // Fetch exams and rooms
  useEffect(() => {
    const init = async () => {
      try {
        const [eRes, rRes] = await Promise.all([fetch("/api/exams"), fetch("/api/rooms")]);
        const eData = await eRes.json();
        const rData = await rRes.json();
        if (eData.exams) {
          setExams(eData.exams);
          if (!selectedExamId && eData.exams.length > 0) {
            setSelectedExamId(eData.exams[0].id);
          }
        }
        if (rData.rooms) {
          const avail = rData.rooms.filter((r: Room) => r.status === "AVAILABLE");
          setAvailableRooms(avail);
        }
      } catch {
        setError("Error loading exams and rooms");
      }
    };
    init();
  }, []);

  // When selected exam changes, fetch matching students
  useEffect(() => {
    if (!selectedExamId) return;
    const fetchExamStudents = async () => {
      try {
        const res = await fetch(`/api/seating/exam-students?examId=${selectedExamId}`);
        const data = await res.json();
        if (data.count !== undefined) {
          setMatchingStudentCount(data.count);
          setExamDepts(data.departments || []);
          setExamSems(data.semesters || []);
          setExistingSeatingCount(data.existingSeatingCount || 0);
        }
      } catch {
        // ignore
      }
    };
    fetchExamStudents();
  }, [selectedExamId]);

  // Calculations
  const selectedRoomsList = availableRooms.filter(r => selectedRoomIds.includes(r.id));
  const manualCapacity = selectedRoomsList.reduce((s, r) => s + r.capacity, 0);

  // Automatic allocation calculation:
  // Sort rooms ascending and pick until capacity >= students
  let autoRoomsUsed: Room[] = [];
  let autoCapacity = 0;
  for (const r of availableRooms) {
    autoRoomsUsed.push(r);
    autoCapacity += r.capacity;
    if (autoCapacity >= matchingStudentCount) break;
  }
  const autoEmptySeats = Math.max(0, autoCapacity - matchingStudentCount);
  const isAutoOk = autoCapacity >= matchingStudentCount && matchingStudentCount > 0;

  const currentCapacity = roomMode === "AUTOMATIC" ? autoCapacity : manualCapacity;
  const currentRoomsUsedCount = roomMode === "AUTOMATIC" ? autoRoomsUsed.length : selectedRoomsList.length;
  const isCapacityOk = roomMode === "AUTOMATIC" ? isAutoOk : manualCapacity >= matchingStudentCount;
  const emptySeats = Math.max(0, currentCapacity - matchingStudentCount);

  const toggleRoom = (id: number) => {
    setSelectedRoomIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleGenerate = async () => {
    setError(null);
    setSuccess(null);

    if (!selectedExamId) {
      setError("Please select an examination first");
      return;
    }
    if (matchingStudentCount === 0) {
      setError("No students match the selected exam departments and semesters.");
      return;
    }
    if (!isCapacityOk) {
      setError("Selected room capacity is insufficient for the selected students.");
      return;
    }

    if (existingSeatingCount > 0) {
      if (!confirm(`A seating arrangement already exists (${existingSeatingCount} seats). Regenerate new seating with "${shuffleOrder}"?`)) {
        return;
      }
    }

    setLoading(true);
    try {
      const res = await fetch("/api/seating/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examId: selectedExamId,
          shuffleOrder,
          roomSelectionMode: roomMode,
          selectedRoomIds: roomMode === "MANUAL" ? selectedRoomIds : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess(`Seating generated successfully! ${data.studentsCount} students seated across ${data.roomsUsedCount} rooms.`);
      setTimeout(() => {
        onSeatingGenerated(selectedExamId);
      }, 700);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error generating seating");
    } finally {
      setLoading(false);
    }
  };

  const handleClearExisting = async () => {
    if (!selectedExamId) return;
    if (!confirm("Are you sure you want to delete the existing seating arrangement for this examination? This will not delete students or exams.")) {
      return;
    }
    setError(null);
    try {
      const res = await fetch(`/api/seating/clear?examId=${selectedExamId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess("Seating arrangement cleared!");
      setExistingSeatingCount(0);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error clearing seating");
    }
  };

  const selectedExam = exams.find(e => e.id === selectedExamId);

  return (
    <div className="space-y-6">
      {/* Printable Capacity Status */}
      <div className="hidden print:block text-center border-b pb-4 mb-4">
        <h1 className="text-xl font-black uppercase">SMART EXAM SEATING ARRANGEMENT SYSTEM</h1>
        <h2 className="text-sm font-bold uppercase mt-1">SEATING GENERATION & CAPACITY REPORT</h2>
        <p className="text-xs text-gray-500 mt-1">Generated: {new Date().toLocaleString()}</p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Generate Seating Arrangement</h1>
          <p className="text-xs text-slate-500">
            Automated college examination seating allocation with multi-department shuffling
          </p>
        </div>
        <div className="flex items-center gap-2">
          {existingSeatingCount > 0 && (
            <button
              onClick={() => onSeatingGenerated(selectedExamId!)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#2463b4] text-white px-3.5 py-2 text-xs font-bold uppercase tracking-wider hover:bg-blue-700"
            >
              View Existing Seating ({existingSeatingCount})
            </button>
          )}
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-xl bg-[#ec912d] hover:bg-[#d47f22] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider"
          >
            <Printer className="h-4 w-4" /> Print Capacity
          </button>
        </div>
      </div>

      {error && <div className="no-print p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2"><AlertTriangle className="h-4 w-4 shrink-0" /> {error}</div>}
      {success && <div className="no-print p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0" /> {success}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-6 rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">Allocation Configuration</h2>

          <div className="space-y-4 text-xs">
            {/* Select Exam */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Select Examination</label>
              <select
                value={selectedExamId || ""}
                onChange={(e) => setSelectedExamId(parseInt(e.target.value))}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-bold text-slate-800 focus:border-[#2463b4] focus:outline-none"
              >
                {exams.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name} ({e.type}) — {e.subject} [{e.date}]
                  </option>
                ))}
              </select>
            </div>

            {/* Exam Details Preview Card */}
            {selectedExam && (
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">{selectedExam.name}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    selectedExam.type === "INTERNAL" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                  }`}>
                    {selectedExam.type}
                  </span>
                </div>
                <p className="text-slate-600">Subject: <strong className="text-slate-800">{selectedExam.subject}</strong></p>
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1">
                  <span>Date: <strong>{selectedExam.date}</strong></span>
                  <span>Time: <strong>{selectedExam.time}</strong></span>
                  <span>Departments: <strong>{examDepts.join(", ") || "None"}</strong></span>
                  <span>Semesters: <strong>{examSems.join(", ") || "None"}</strong></span>
                </div>
              </div>
            )}

            {/* Shuffle Order */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Shuffle Order (Algorithm)
              </label>
              <select
                value={shuffleOrder}
                onChange={(e) => setShuffleOrder(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs font-bold text-[#2463b4] bg-blue-50/40 focus:border-[#2463b4] focus:outline-none"
              >
                {SHUFFLE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500 mt-1">
                {shuffleOrder === "Department Mixing" && (
                  <span className="text-[#147d79] font-semibold">
                    ★ Interleaves students from different departments (CSE, ECE, EEE...) row-by-row alternately.
                  </span>
                )}
                {shuffleOrder === "Random Shuffle" && "Randomizes all selected candidates across rooms."}
                {shuffleOrder === "Register Number Ascending" && "Sorts candidates sequentially by register number."}
              </p>
            </div>

            {/* Room Selection Mode */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Room Selection Mode</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRoomMode("AUTOMATIC")}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold uppercase transition flex items-center justify-center gap-2 ${
                    roomMode === "AUTOMATIC"
                      ? "bg-[#10284c] text-white border-[#10284c] shadow-sm"
                      : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <Sparkles className="h-4 w-4 text-[#69d2ce]" /> Automatic
                </button>
                <button
                  type="button"
                  onClick={() => setRoomMode("MANUAL")}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold uppercase transition flex items-center justify-center gap-2 ${
                    roomMode === "MANUAL"
                      ? "bg-[#10284c] text-white border-[#10284c] shadow-sm"
                      : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <DoorClosed className="h-4 w-4 text-[#69d2ce]" /> Manual
                </button>
              </div>
            </div>

            {/* Manual Room Selector */}
            {roomMode === "MANUAL" && (
              <div className="space-y-2 pt-1">
                <label className="block font-bold text-slate-700">
                  Select Examination Rooms ({selectedRoomIds.length} rooms selected)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 border border-slate-200 rounded-xl bg-slate-50">
                  {availableRooms.map((r) => {
                    const isSelected = selectedRoomIds.includes(r.id);
                    return (
                      <button
                        type="button"
                        key={r.id}
                        onClick={() => toggleRoom(r.id)}
                        className={`p-2 rounded-lg border text-left text-xs transition ${
                          isSelected
                            ? "bg-[#2463b4] text-white border-[#2463b4]"
                            : "bg-white text-slate-700 border-slate-200 hover:border-blue-300"
                        }`}
                      >
                        <p className="font-mono font-bold">Room {r.roomNumber}</p>
                        <p className="text-[10px] opacity-80">{r.capacity} seats ({r.rowsCount}×{r.columnsCount})</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Capacity Status & Actions */}
        <div className="lg:col-span-6 rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-6 flex flex-col justify-between">
          <div className="space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">Capacity & Allocation Summary</h2>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3.5">
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200">
                <p className="text-[11px] font-bold uppercase text-slate-500">Students Selected</p>
                <p className="text-2xl font-black text-[#2463b4] mt-1">{matchingStudentCount}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Active candidates matching depts & sems</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <p className="text-[11px] font-bold uppercase text-slate-500">Selected Capacity</p>
                <p className="text-2xl font-black text-slate-900 mt-1">{currentCapacity} seats</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{currentRoomsUsedCount} examination room(s)</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <p className="text-[11px] font-bold uppercase text-slate-500">Required Rooms</p>
                <p className="text-2xl font-black text-slate-900 mt-1">{currentRoomsUsedCount}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {roomMode === "AUTOMATIC" ? "Optimal allocation" : "Manual selection"}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <p className="text-[11px] font-bold uppercase text-slate-500">Empty Seats</p>
                <p className="text-2xl font-black text-emerald-700 mt-1">{emptySeats}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Surplus buffer capacity</p>
              </div>
            </div>

            {/* Capacity Status Pill */}
            <div className={`p-4 rounded-xl border flex items-center justify-between ${
              isCapacityOk
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-rose-50 border-rose-200 text-rose-800"
            }`}>
              <div className="flex items-center gap-2.5">
                {isCapacityOk ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-rose-600" />
                )}
                <div>
                  <p className="text-xs font-black uppercase tracking-wider">
                    {isCapacityOk ? "STATUS: CAPACITY OK" : "STATUS: CAPACITY LOW"}
                  </p>
                  <p className="text-[11px] opacity-90">
                    {isCapacityOk
                      ? `All ${matchingStudentCount} candidates will receive a seat with ${emptySeats} extra seats remaining.`
                      : `Selected room capacity (${currentCapacity}) is insufficient for ${matchingStudentCount} students.`}
                  </p>
                </div>
              </div>
            </div>

            {/* Room list preview in automatic mode */}
            {roomMode === "AUTOMATIC" && (
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs">
                <p className="font-bold text-slate-700 mb-1">Automatic Allocation Plan:</p>
                <p className="text-slate-600">
                  Rooms automatically utilized ({autoRoomsUsed.length}):{" "}
                  <strong className="text-slate-900">{autoRoomsUsed.map(r => r.roomNumber).join(", ")}</strong>
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-4 border-t border-slate-100">
            <button
              onClick={handleGenerate}
              disabled={loading || !isCapacityOk || matchingStudentCount === 0}
              className="w-full rounded-xl bg-[#147d79] hover:bg-[#0f6663] disabled:opacity-50 text-white py-3.5 text-xs font-black uppercase tracking-wider shadow-md transition flex items-center justify-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              {loading ? "Generating Seating..." : existingSeatingCount > 0 ? "Regenerate Seating Arrangement" : "Generate Seating Arrangement"}
            </button>

            {existingSeatingCount > 0 && (
              <button
                onClick={handleClearExisting}
                className="w-full rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 py-2.5 text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-1.5"
              >
                <Trash2 className="h-4 w-4" /> Clear Existing Seating
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
