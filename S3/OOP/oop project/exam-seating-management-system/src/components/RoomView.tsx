"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Printer, Search, Zap, AlertCircle, CheckCircle } from "lucide-react";

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

interface RoomViewProps {
  userRole: string;
  onNavigateToQuickSetup: () => void;
}

export function RoomView({ userRole, onNavigateToQuickSetup }: RoomViewProps) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [roomNumber, setRoomNumber] = useState("");
  const [building, setBuilding] = useState("Main Block");
  const [floorNo, setFloorNo] = useState("1");
  const [rowsCount, setRowsCount] = useState("5");
  const [columnsCount, setColumnsCount] = useState("6");
  const [status, setStatus] = useState("AVAILABLE");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isTeacher = userRole === "TEACHER";

  // Auto-calculated capacity = Rows x Columns
  const calculatedCapacity = (parseInt(rowsCount) || 0) * (parseInt(columnsCount) || 0);

  const fetchRooms = async () => {
    try {
      const res = await fetch("/api/rooms");
      const data = await res.json();
      if (data.rooms) setRooms(data.rooms);
    } catch {
      setError("Failed to fetch rooms");
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleSelect = (r: Room) => {
    setSelectedId(r.id);
    setRoomNumber(r.roomNumber);
    setBuilding(r.building);
    setFloorNo(String(r.floorNo));
    setRowsCount(String(r.rowsCount));
    setColumnsCount(String(r.columnsCount));
    setStatus(r.status);
    setError(null);
  };

  const handleClear = () => {
    setSelectedId(null);
    setRoomNumber("");
    setBuilding("Main Block");
    setFloorNo("1");
    setRowsCount("5");
    setColumnsCount("6");
    setStatus("AVAILABLE");
    setError(null);
    setSuccess(null);
  };

  const handleAdd = async () => {
    setError(null);
    if (!roomNumber.trim()) {
      setError("Room number is required");
      return;
    }
    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomNumber, building, floorNo, rowsCount, columnsCount, status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess(`Room ${roomNumber} added with capacity ${calculatedCapacity}!`);
      handleClear();
      fetchRooms();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error adding room");
    }
  };

  const handleUpdate = async () => {
    if (!selectedId) return;
    setError(null);
    try {
      const res = await fetch("/api/rooms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedId, roomNumber, building, floorNo, rowsCount, columnsCount, status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess("Room updated successfully!");
      handleClear();
      fetchRooms();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error updating room");
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    if (!confirm(`Delete room ${roomNumber}? This will remove any seating mapped to this room.`)) return;
    try {
      const res = await fetch(`/api/rooms?id=${selectedId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess("Room deleted!");
      handleClear();
      fetchRooms();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error deleting room");
    }
  };

  return (
    <div className="space-y-6">
      <div className="hidden print:block text-center border-b pb-4 mb-4">
        <h1 className="text-xl font-black uppercase">SMART EXAM SEATING ARRANGEMENT SYSTEM</h1>
        <h2 className="text-sm font-bold uppercase mt-1">EXAMINATION ROOMS MASTER LIST</h2>
        <p className="text-xs text-gray-500 mt-1">Generated: {new Date().toLocaleString()}</p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Room Management</h1>
          <p className="text-xs text-slate-500">Configure examination halls, layout dimensions (rows × columns), and capacities</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToQuickSetup}
            className="inline-flex items-center gap-2 rounded-xl bg-[#147d79] hover:bg-[#0f6663] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider"
          >
            <Zap className="h-4 w-4" /> Quick Room Setup
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-xl bg-[#ec912d] hover:bg-[#d47f22] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider"
          >
            <Printer className="h-4 w-4" /> Print Room List
          </button>
        </div>
      </div>

      {error && <div className="no-print p-3 rounded-xl bg-rose-50 text-xs text-rose-700">{error}</div>}
      {success && <div className="no-print p-3 rounded-xl bg-emerald-50 text-xs text-emerald-700">{success}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs space-y-4 no-print">
          <h2 className="text-sm font-bold uppercase text-slate-700">{selectedId ? "Edit Room" : "Add Room"}</h2>
          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Room Number</label>
              <input
                type="text"
                placeholder="e.g. 101"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Building</label>
                <input
                  type="text"
                  value={building}
                  onChange={(e) => setBuilding(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Floor</label>
                <input
                  type="number"
                  value={floorNo}
                  onChange={(e) => setFloorNo(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
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
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Columns</label>
                <input
                  type="number"
                  value={columnsCount}
                  onChange={(e) => setColumnsCount(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </div>
            </div>

            <div className="rounded-xl bg-blue-50/70 border border-blue-200 p-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">Calculated Capacity:</span>
                <span className="text-lg font-black text-[#2463b4]">{calculatedCapacity} seats</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Formula: Rows ({rowsCount || 0}) × Columns ({columnsCount || 0})</p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              >
                <option value="AVAILABLE">AVAILABLE</option>
                <option value="UNAVAILABLE">UNAVAILABLE</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button onClick={handleAdd} disabled={isTeacher} className="rounded-lg bg-[#147d79] text-white py-2 font-bold uppercase hover:bg-[#0f6663] disabled:opacity-50">Add Room</button>
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
                <th className="py-2.5 px-3">Room</th>
                <th className="py-2.5 px-3">Building</th>
                <th className="py-2.5 px-3">Floor</th>
                <th className="py-2.5 px-3">Dimensions</th>
                <th className="py-2.5 px-3">Capacity</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {rooms.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => handleSelect(r)}
                  className={`cursor-pointer hover:bg-blue-50/80 transition ${selectedId === r.id ? "bg-blue-100/70 font-semibold" : ""}`}
                >
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{r.roomNumber}</td>
                  <td className="py-2.5 px-3 text-slate-800">{r.building}</td>
                  <td className="py-2.5 px-3 text-slate-600">Floor {r.floorNo}</td>
                  <td className="py-2.5 px-3 text-slate-600">{r.rowsCount} rows × {r.columnsCount} cols</td>
                  <td className="py-2.5 px-3 font-bold text-[#2463b4]">{r.capacity} seats</td>
                  <td className="py-2.5 px-3">
                    <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                      r.status === "AVAILABLE" ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"
                    }`}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Total Rooms: {rooms.length}</span>
            <span className="font-bold text-slate-700">Total Capacity: {rooms.reduce((s, r) => s + r.capacity, 0)} students</span>
          </div>
        </div>
      </div>
    </div>
  );
}
