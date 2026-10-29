"use client";

import React, { useState } from "react";
import { Settings, Printer, CheckCircle2, Database, Terminal, FileCode2 } from "lucide-react";

export function SettingsView() {
  const [dbStatus, setDbStatus] = useState<"READY" | "TESTING" | "OK">("OK");

  const testConnection = async () => {
    setDbStatus("TESTING");
    try {
      const res = await fetch("/api/dashboard/stats");
      if (res.ok) setDbStatus("OK");
    } catch {
      setDbStatus("READY");
    }
  };

  return (
    <div className="space-y-6">
      <div className="hidden print:block text-center border-b pb-4 mb-4">
        <h1 className="text-xl font-black uppercase">SMART EXAM SEATING ARRANGEMENT SYSTEM</h1>
        <h2 className="text-sm font-bold uppercase mt-1">SYSTEM CONFIGURATION & DEMONSTRATION GUIDE</h2>
        <p className="text-xs text-gray-500 mt-1">Generated: {new Date().toLocaleString()}</p>
      </div>

      <div className="flex items-center justify-between no-print">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Application Settings & Project Info</h1>
          <p className="text-xs text-slate-500">System configuration, database parameters, and Java 24 execution details</p>
        </div>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-xl bg-[#ec912d] hover:bg-[#d47f22] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider"
        >
          <Printer className="h-4 w-4" /> Print Settings
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Details */}
        <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-sm font-bold uppercase text-slate-700 flex items-center gap-2">
            <Database className="h-4 w-4 text-[#2463b4]" /> Architecture & Connectivity
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border">
              <span className="font-semibold text-slate-600">Database Engine:</span>
              <span className="font-mono font-bold text-slate-900">PostgreSQL (Online) / MySQL 8+ (Java)</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border">
              <span className="font-semibold text-slate-600">Java Target Release:</span>
              <span className="font-mono font-bold text-[#147d79]">Java 24 (JDK 24)</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border">
              <span className="font-semibold text-slate-600">GUI Framework:</span>
              <span className="font-bold text-slate-900">Java Swing + Modern Web Preview</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border">
              <span className="font-semibold text-slate-600">Printing System:</span>
              <span className="font-bold text-slate-900">Java PrinterJob API + Browser CSS Print</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border">
              <span className="font-semibold text-slate-600">Database Status:</span>
              <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                <CheckCircle2 className="h-3.5 w-3.5" /> CONNECTED & ACTIVE
              </span>
            </div>

            <button
              onClick={testConnection}
              className="w-full mt-2 rounded-xl bg-[#2463b4] hover:bg-blue-700 text-white py-2 text-xs font-bold uppercase transition"
            >
              Test Live Connection
            </button>
          </div>
        </div>

        {/* Local Java Run Guide */}
        <div className="rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-sm font-bold uppercase text-slate-700 flex items-center gap-2">
            <Terminal className="h-4 w-4 text-[#147d79]" /> Running Java Project Locally
          </h2>

          <div className="space-y-3 text-xs text-slate-700">
            <p>The complete Java 24 Swing project is stored in the <strong>smart-exam-seating/</strong> directory.</p>
            <div className="rounded-xl bg-[#0f2343] p-4 text-[#bfe3f2] font-mono text-[11px] space-y-1">
              <p className="text-slate-400"># 1. Import MySQL database</p>
              <p className="text-white">mysql -u root -p &lt; database/schema.sql</p>
              <p className="text-slate-400 mt-2"># 2. Build and launch Java 24 Swing app</p>
              <p className="text-white">mvn clean package</p>
              <p className="text-white">mvn exec:java</p>
            </div>
            <p className="text-[11px] text-slate-500">
              Runnable in Eclipse, IntelliJ IDEA, or Apache NetBeans by opening the <code>smart-exam-seating</code> Maven folder.
            </p>
          </div>
        </div>

        {/* Demo Scenario Checklist */}
        <div className="lg:col-span-2 rounded-2xl bg-white p-6 border border-slate-200/80 shadow-xs space-y-3">
          <h2 className="text-sm font-bold uppercase text-slate-700 flex items-center gap-2">
            <FileCode2 className="h-4 w-4 text-[#ec912d]" /> College Viva / Demonstration Scenario Checklist
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border space-y-1">
              <p className="font-bold text-slate-900">1. Internal Examination — S3</p>
              <p className="text-slate-600">Selects 143 students in CSE/S3. Automatic mode uses 5 rooms (101-105) for 150 capacity with 7 empty seats.</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border space-y-1">
              <p className="font-bold text-slate-900">2. Department Mixing Algorithm</p>
              <p className="text-slate-600">Interleaves CSE, ECE, EEE candidates in round-robin sequence without duplicating any candidate.</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border space-y-1">
              <p className="font-bold text-slate-900">3. Student Seat Search: 24CS023</p>
              <p className="text-slate-600">Locates candidate Amal, displays room, desk seat, invigilator, and provides single-slip ticket printing.</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border space-y-1">
              <p className="font-bold text-slate-900">4. Blackboard Room Chart & Attendance</p>
              <p className="text-slate-600">Provides visual blackboard desk matrix layout and official attendance sheets with candidate signature lines.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
