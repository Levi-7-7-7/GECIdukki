"use client";

import React, { useState, useEffect } from "react";
import { BookmarkPlus, Download, Trash2, Printer, AlertCircle, CheckCircle } from "lucide-react";

interface Template {
  id: number;
  templateName: string;
  startingRoom: string;
  numberOfRooms: number;
  rowsCount: number;
  columnsCount: number;
  building: string;
  floorNo: number;
}

export function RoomTemplateView({ userRole, onApplyTemplate }: { userRole: string; onApplyTemplate?: (t: Template) => void }) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [templateName, setTemplateName] = useState("Main Block - 40 Seats");
  const [startingRoom, setStartingRoom] = useState("101");
  const [numberOfRooms, setNumberOfRooms] = useState("20");
  const [rowsCount, setRowsCount] = useState("5");
  const [columnsCount, setColumnsCount] = useState("8");
  const [building, setBuilding] = useState("Main Block");
  const [floorNo, setFloorNo] = useState("1");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isTeacher = userRole === "TEACHER";

  const fetchTemplates = async () => {
    try {
      const res = await fetch("/api/room-templates");
      const data = await res.json();
      if (data.templates) setTemplates(data.templates);
    } catch {
      setError("Failed to fetch templates");
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleSelect = (t: Template) => {
    setSelectedId(t.id);
    setTemplateName(t.templateName);
    setStartingRoom(t.startingRoom);
    setNumberOfRooms(String(t.numberOfRooms));
    setRowsCount(String(t.rowsCount));
    setColumnsCount(String(t.columnsCount));
    setBuilding(t.building);
    setFloorNo(String(t.floorNo));
    setError(null);
  };

  const handleSave = async () => {
    setError(null);
    if (!templateName.trim() || !startingRoom.trim()) {
      setError("Template name and starting room required");
      return;
    }
    try {
      const res = await fetch("/api/room-templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateName,
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
      setSuccess(`Template "${templateName}" saved successfully!`);
      fetchTemplates();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error saving template");
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    if (!confirm(`Delete template "${templateName}"?`)) return;
    try {
      const res = await fetch(`/api/room-templates?id=${selectedId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess("Template deleted!");
      setSelectedId(null);
      fetchTemplates();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error deleting template");
    }
  };

  return (
    <div className="space-y-6">
      <div className="hidden print:block text-center border-b pb-4 mb-4">
        <h1 className="text-xl font-black uppercase">SMART EXAM SEATING ARRANGEMENT SYSTEM</h1>
        <h2 className="text-sm font-bold uppercase mt-1">SAVED ROOM CONFIGURATION TEMPLATES</h2>
        <p className="text-xs text-gray-500 mt-1">Generated: {new Date().toLocaleString()}</p>
      </div>

      <div className="flex items-center justify-between no-print">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Room Templates</h1>
          <p className="text-xs text-slate-500">Save and load commonly used examination block configurations</p>
        </div>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-xl bg-[#ec912d] hover:bg-[#d47f22] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider"
        >
          <Printer className="h-4 w-4" /> Print Templates
        </button>
      </div>

      {error && <div className="no-print p-3 rounded-xl bg-rose-50 text-xs text-rose-700 flex items-center gap-2"><AlertCircle className="h-4 w-4" /> {error}</div>}
      {success && <div className="no-print p-3 rounded-xl bg-emerald-50 text-xs text-emerald-700 flex items-center gap-2"><CheckCircle className="h-4 w-4" /> {success}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs space-y-4 no-print">
          <h2 className="text-sm font-bold uppercase text-slate-700">Template Details</h2>
          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Template Name</label>
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="e.g. Main Block - 40 Seats"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 font-semibold"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Starting Room</label>
                <input
                  type="text"
                  value={startingRoom}
                  onChange={(e) => setStartingRoom(e.target.value)}
                  placeholder="101"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Number of Rooms</label>
                <input
                  type="number"
                  value={numberOfRooms}
                  onChange={(e) => setNumberOfRooms(e.target.value)}
                  placeholder="20"
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
                  placeholder="5"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Columns</label>
                <input
                  type="number"
                  value={columnsCount}
                  onChange={(e) => setColumnsCount(e.target.value)}
                  placeholder="8"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
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

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-xs font-medium text-slate-600">Calculated Seats Per Room:</p>
              <p className="text-base font-black text-[#2463b4]">
                {(parseInt(rowsCount) || 0) * (parseInt(columnsCount) || 0)} seats
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={handleSave}
                disabled={isTeacher}
                className="w-full rounded-lg bg-[#147d79] hover:bg-[#0f6663] disabled:opacity-50 text-white py-2 font-bold uppercase transition flex items-center justify-center gap-1.5"
              >
                <BookmarkPlus className="h-4 w-4" /> Save Template
              </button>
              {selectedId && (
                <button
                  onClick={handleDelete}
                  disabled={isTeacher}
                  className="w-full rounded-lg bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white py-2 font-bold uppercase transition flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="h-4 w-4" /> Delete Template
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs space-y-4">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0f2343] text-white uppercase text-[11px]">
              <tr>
                <th className="py-2.5 px-3">Template Name</th>
                <th className="py-2.5 px-3">Start Room</th>
                <th className="py-2.5 px-3">Rooms</th>
                <th className="py-2.5 px-3">Dimensions</th>
                <th className="py-2.5 px-3">Seats/Room</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {templates.map((t) => (
                <tr
                  key={t.id}
                  onClick={() => handleSelect(t)}
                  className={`cursor-pointer hover:bg-blue-50 transition ${selectedId === t.id ? "bg-blue-100 font-semibold" : ""}`}
                >
                  <td className="py-3 px-3 font-bold text-slate-900">{t.templateName}</td>
                  <td className="py-3 px-3 font-mono">{t.startingRoom}</td>
                  <td className="py-3 px-3">{t.numberOfRooms} rooms</td>
                  <td className="py-3 px-3 text-slate-600">{t.rowsCount}r × {t.columnsCount}c</td>
                  <td className="py-3 px-3 font-bold text-[#2463b4]">{t.rowsCount * t.columnsCount}</td>
                  <td className="py-3 px-3 text-right">
                    <span className="text-xs text-[#2463b4] font-semibold hover:underline">Select & Load</span>
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
