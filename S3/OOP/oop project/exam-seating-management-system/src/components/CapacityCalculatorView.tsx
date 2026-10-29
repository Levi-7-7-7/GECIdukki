"use client";

import React, { useState } from "react";
import { Calculator, Printer, CheckCircle2, AlertTriangle } from "lucide-react";

export function CapacityCalculatorView() {
  const [numberOfRooms, setNumberOfRooms] = useState("10");
  const [seatsPerRoom, setSeatsPerRoom] = useState("30");
  const [totalStudents, setTotalStudents] = useState("267");

  const rooms = parseInt(numberOfRooms) || 0;
  const seats = parseInt(seatsPerRoom) || 0;
  const students = parseInt(totalStudents) || 0;

  const totalCapacity = rooms * seats;
  const requiredRooms = seats > 0 ? Math.ceil(students / seats) : 0;
  const remainingSeats = Math.max(0, totalCapacity - students);
  const isCapacityOk = totalCapacity >= students;
  const additionalRoomsNeeded = Math.max(0, requiredRooms - rooms);
  const extraCapacity = isCapacityOk ? totalCapacity - students : 0;

  return (
    <div className="space-y-6">
      {/* Printable Report Header */}
      <div className="hidden print:block text-center border-b pb-4 mb-4">
        <h1 className="text-xl font-black uppercase">SMART EXAM SEATING ARRANGEMENT SYSTEM</h1>
        <h2 className="text-sm font-bold uppercase mt-1">ROOM CAPACITY AUDIT & CALCULATION REPORT</h2>
        <p className="text-xs text-gray-500 mt-1">Generated: {new Date().toLocaleString()}</p>
      </div>

      <div className="flex items-center justify-between no-print">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Room Capacity Calculator</h1>
          <p className="text-xs text-slate-500">
            Formulas: Total Capacity = Rooms × Seats/Room | Required Rooms = ceil(Students / Seats/Room)
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-xl bg-[#ec912d] hover:bg-[#d47f22] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider"
        >
          <Printer className="h-4 w-4" /> Print Capacity Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Form */}
        <div className="lg:col-span-5 rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-4 no-print">
          <h2 className="text-sm font-bold uppercase text-slate-700 flex items-center gap-2">
            <Calculator className="h-4 w-4 text-[#2463b4]" /> Input Parameters
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Number of Rooms</label>
              <input
                type="number"
                value={numberOfRooms}
                onChange={(e) => setNumberOfRooms(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Seats Per Room</label>
              <input
                type="number"
                value={seatsPerRoom}
                onChange={(e) => setSeatsPerRoom(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Total Students</label>
              <input
                type="number"
                value={totalStudents}
                onChange={(e) => setTotalStudents(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-bold"
              />
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => { setNumberOfRooms("10"); setSeatsPerRoom("30"); setTotalStudents("143"); }}
                className="flex-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 py-2 text-xs font-bold uppercase transition"
              >
                143-Student Demo
              </button>
              <button
                onClick={() => { setNumberOfRooms("10"); setSeatsPerRoom("30"); setTotalStudents("267"); }}
                className="flex-1 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 py-2 text-xs font-bold uppercase transition"
              >
                267-Student Demo
              </button>
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="lg:col-span-7 rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-sm font-bold uppercase text-slate-700">Calculation Results</h2>
            <div>
              {isCapacityOk ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 text-emerald-800 px-3.5 py-1 text-xs font-black uppercase tracking-wider">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> CAPACITY OK
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 text-rose-800 px-3.5 py-1 text-xs font-black uppercase tracking-wider">
                  <AlertTriangle className="h-4 w-4 text-rose-600" /> CAPACITY LOW
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <p className="text-[11px] font-bold text-slate-500 uppercase">Total Capacity</p>
              <p className="text-xl font-black text-slate-900 mt-1">{totalCapacity} seats</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <p className="text-[11px] font-bold text-slate-500 uppercase">Required Rooms</p>
              <p className="text-xl font-black text-[#2463b4] mt-1">{requiredRooms} rooms</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <p className="text-[11px] font-bold text-slate-500 uppercase">Remaining Seats</p>
              <p className="text-xl font-black text-emerald-700 mt-1">{remainingSeats} seats</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <p className="text-[11px] font-bold text-slate-500 uppercase">Extra Capacity</p>
              <p className="text-xl font-black text-slate-700 mt-1">{extraCapacity} seats</p>
            </div>
          </div>

          {!isCapacityOk && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-rose-600" /> Insufficient Examination Room Capacity!
              </p>
              <p>
                Current rooms ({rooms}) provide {totalCapacity} seats for {students} students.
              </p>
              <p className="font-bold text-rose-900 text-sm mt-1">
                Additional rooms required: <span className="underline">{additionalRoomsNeeded} more room(s)</span>
              </p>
            </div>
          )}

          {isCapacityOk && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Sufficient Capacity Confirmed
              </p>
              <p>
                Allocating {requiredRooms} out of {rooms} rooms will seat all {students} students with {remainingSeats} surplus seats.
              </p>
            </div>
          )}

          <div className="text-xs text-slate-500 space-y-1 border-t pt-4">
            <p className="font-semibold text-slate-700">Detailed Mathematical Breakdown:</p>
            <p>• Total Capacity = {rooms} rooms × {seats} seats = {totalCapacity}</p>
            <p>• Required Rooms = ceil({students} / {seats}) = {requiredRooms}</p>
            <p>• Remaining Capacity = {totalCapacity} - {students} = {totalCapacity - students}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
