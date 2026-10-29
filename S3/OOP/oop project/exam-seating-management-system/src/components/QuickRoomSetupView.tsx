"use client";

import React, { useState } from "react";
import { Zap, Eye, Check, Printer, X, AlertCircle, CheckCircle } from "lucide-react";

interface PreviewRoom {
  roomNumber: string;
  building: string;
  floorNo: number;
  rowsCount: number;
  columnsCount: number;
  capacity: number;
}

export function QuickRoomSetupView({ onDone }: { onDone: () => void }) {
  const [startingRoom, setStartingRoom] = useState("101");
  const [numberOfRooms, setNumberOfRooms] = useState("10");
  const [rowsCount, setRowsCount] = useState("5");
  const [columnsCount, setColumnsCount] = useState("6");
  const [building, setBuilding] = useState("Main Block");
  const [floorNo, setFloorNo] = useState("1");

  const [previewRooms, setPreviewRooms] = useState<PreviewRoom[]>([]);
  const [calculated, setCalculated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const rows = parseInt(rowsCount) || 0;
  const cols = parseInt(columnsCount) || 0;
  const numRooms = parseInt(numberOfRooms) || 0;
  const seatsPerRoom = rows * cols;
  const totalCapacity = numRooms * seatsPerRoom;

  const handleCalculate = () => {
    setError(null);
    if (rows <= 0 || cols <= 0 || numRooms <= 0) {
      setError("Rows, columns, and number of rooms must be greater than 0");
      return;
    }
    setCalculated(true);
  };

  const handlePreview = () => {
    handleCalculate();
    const start = parseInt(startingRoom);
    if (isNaN(start)) {
      setError("Starting room number must be a valid number");
      return;
    }
    const list: PreviewRoom[] = [];
    for (let i = 0; i < numRooms; i++) {
      list.push({
        roomNumber: String(start + i),
        building,
        floorNo: parseInt(floorNo) || 1,
        rowsCount: rows,
        columnsCount: cols,
        capacity: seatsPerRoom,
      });
    }
    setPreviewRooms(list);
  };

  const handleAddAllRooms = async () => {
    setError(null);
    setSuccess(null);
    if (previewRooms.length === 0) {
      handlePreview();
    }
    setLoading(true);
    try {
      const res = await fetch("/api/rooms/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startingRoom,
          numberOfRooms,
          rowsCount,
          columnsCount,
          building,
          floorNo,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess(`Successfully created ${data.createdCount} rooms! Total capacity: ${data.totalCapacity} seats.`);
      setPreviewRooms([]);
      setTimeout(() => onDone(), 1500);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error creating bulk rooms");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="hidden print:block text-center border-b pb-4 mb-4">
        <h1 className="text-xl font-black uppercase">SMART EXAM SEATING ARRANGEMENT SYSTEM</h1>
        <h2 className="text-sm font-bold uppercase mt-1">QUICK ROOM SETUP PREVIEW</h2>
        <p className="text-xs text-gray-500 mt-1">Generated: {new Date().toLocaleString()}</p>
      </div>

      <div className="flex items-center justify-between no-print">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 text-amber-800 px-3 py-0.5 text-xs font-bold uppercase tracking-wider mb-1">
            <Zap className="h-3 w-3" /> Special Feature
          </div>
          <h1 className="text-xl font-bold text-slate-900">Quick Room Setup • Bulk Room Creation</h1>
          <p className="text-xs text-slate-500">Rapidly generate sequential examination halls with uniform dimensions</p>
        </div>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-xl bg-[#ec912d] hover:bg-[#d47f22] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider"
        >
          <Printer className="h-4 w-4" /> Print Setup
        </button>
      </div>

      {error && <div className="no-print p-3 rounded-xl bg-rose-50 text-xs text-rose-700 flex items-center gap-2"><AlertCircle className="h-4 w-4 shrink-0" /> {error}</div>}
      {success && <div className="no-print p-3 rounded-xl bg-emerald-50 text-xs text-emerald-700 flex items-center gap-2"><CheckCircle className="h-4 w-4 shrink-0" /> {success}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form */}
        <div className="lg:col-span-5 rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs space-y-4 no-print">
          <h2 className="text-sm font-bold uppercase text-slate-700">Setup Parameters</h2>
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Starting Room No</label>
                <input
                  type="number"
                  value={startingRoom}
                  onChange={(e) => setStartingRoom(e.target.value)}
                  placeholder="101"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono font-bold"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Number of Rooms</label>
                <input
                  type="number"
                  value={numberOfRooms}
                  onChange={(e) => setNumberOfRooms(e.target.value)}
                  placeholder="10"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Rows</label>
                <input
                  type="number"
                  value={rowsCount}
                  onChange={(e) => setRowsCount(e.target.value)}
                  placeholder="5"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 font-bold"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Columns</label>
                <input
                  type="number"
                  value={columnsCount}
                  onChange={(e) => setColumnsCount(e.target.value)}
                  placeholder="6"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Building</label>
                <input
                  type="text"
                  value={building}
                  onChange={(e) => setBuilding(e.target.value)}
                  placeholder="Main Block"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Floor</label>
                <input
                  type="number"
                  value={floorNo}
                  onChange={(e) => setFloorNo(e.target.value)}
                  placeholder="1"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </div>
            </div>

            {/* Calculations Card */}
            <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">Seats Per Room:</span>
                <span className="font-bold text-slate-900">{rows} × {cols} = <span className="text-[#2463b4] font-black">{seatsPerRoom} seats</span></span>
              </div>
              <div className="flex items-center justify-between text-xs border-t border-blue-200/60 pt-2">
                <span className="text-slate-600 font-medium">Total Capacity:</span>
                <span className="font-bold text-slate-900">{numRooms} × {seatsPerRoom} = <span className="text-emerald-700 font-black">{totalCapacity} students</span></span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>Rooms Generated:</span>
                <span className="font-mono">{startingRoom} ... {parseInt(startingRoom) + numRooms - 1 || ""}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={handleCalculate}
                className="rounded-lg bg-[#2463b4] text-white py-2 font-bold uppercase hover:bg-blue-700 transition"
              >
                Calculate
              </button>
              <button
                onClick={handlePreview}
                className="rounded-lg bg-[#147d79] text-white py-2 font-bold uppercase hover:bg-[#0f6663] transition flex items-center justify-center gap-1.5"
              >
                <Eye className="h-4 w-4" /> Preview
              </button>
            </div>

            <button
              onClick={handleAddAllRooms}
              disabled={loading}
              className="w-full rounded-lg bg-[#ec912d] hover:bg-[#d47f22] disabled:opacity-50 text-white py-2.5 font-bold uppercase transition flex items-center justify-center gap-2 shadow-sm"
            >
              <Check className="h-4 w-4" /> Add All Rooms
            </button>

            <button
              onClick={onDone}
              className="w-full rounded-lg bg-slate-200 text-slate-700 py-2 font-bold uppercase hover:bg-slate-300 transition"
            >
              Cancel / Back to Rooms
            </button>
          </div>
        </div>

        {/* Preview Table */}
        <div className="lg:col-span-7 rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase text-slate-700 flex items-center gap-2">
              <Eye className="h-4 w-4 text-[#147d79]" /> Generated Rooms Preview ({previewRooms.length})
            </h2>
            {previewRooms.length > 0 && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Ready to save {previewRooms.length} rooms ({totalCapacity} seats)
              </span>
            )}
          </div>

          <div className="overflow-x-auto max-h-[460px]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0f2343] text-white uppercase text-[11px] sticky top-0">
                <tr>
                  <th className="py-2.5 px-3">Room</th>
                  <th className="py-2.5 px-3">Building</th>
                  <th className="py-2.5 px-3">Floor</th>
                  <th className="py-2.5 px-3">Rows</th>
                  <th className="py-2.5 px-3">Cols</th>
                  <th className="py-2.5 px-3">Capacity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {previewRooms.map((r) => (
                  <tr key={r.roomNumber} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{r.roomNumber}</td>
                    <td className="py-2.5 px-3 text-slate-800">{r.building}</td>
                    <td className="py-2.5 px-3 text-slate-600">Floor {r.floorNo}</td>
                    <td className="py-2.5 px-3 text-slate-600">{r.rowsCount}</td>
                    <td className="py-2.5 px-3 text-slate-600">{r.columnsCount}</td>
                    <td className="py-2.5 px-3 font-bold text-[#2463b4]">{r.capacity} seats</td>
                  </tr>
                ))}
                {previewRooms.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      Click <strong className="text-slate-600">PREVIEW</strong> to view the list of generated rooms before saving.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
