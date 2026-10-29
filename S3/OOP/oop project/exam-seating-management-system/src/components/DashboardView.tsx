"use client";

import React from "react";
import { 
  Building2, 
  GraduationCap, 
  DoorClosed, 
  UserCheck, 
  Calendar, 
  Users, 
  Printer, 
  Search, 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  Layers
} from "lucide-react";

interface StatsProps {
  stats: {
    totalStudents: number;
    totalDepartments: number;
    totalTeachers: number;
    totalRooms: number;
    totalCapacity: number;
    upcomingExamsCount: number;
    totalSeatedStudents: number;
    upcomingExams: Array<{
      id: number;
      name: string;
      type: string;
      date: string;
      time: string;
      subject: string;
    }>;
  } | null;
  onNavigate: (view: string) => void;
  onRunDemo: () => void;
}

export function DashboardView({ stats, onNavigate, onRunDemo }: StatsProps) {
  const cards = [
    { label: "Total Students", value: stats?.totalStudents ?? "—", icon: GraduationCap, color: "text-blue-600 bg-blue-50 border-blue-100", view: "STUDENTS" },
    { label: "Departments", value: stats?.totalDepartments ?? "—", icon: Building2, color: "text-emerald-600 bg-emerald-50 border-emerald-100", view: "DEPARTMENTS" },
    { label: "Faculty / Invigilators", value: stats?.totalTeachers ?? "—", icon: UserCheck, color: "text-purple-600 bg-purple-50 border-purple-100", view: "TEACHERS" },
    { label: "Active Rooms", value: stats?.totalRooms ?? "—", icon: DoorClosed, color: "text-amber-600 bg-amber-50 border-amber-100", view: "ROOMS" },
    { label: "Total Room Capacity", value: stats?.totalCapacity ?? "—", icon: Layers, color: "text-cyan-600 bg-cyan-50 border-cyan-100", view: "CAPACITY REPORT" },
    { label: "Upcoming Exams", value: stats?.upcomingExamsCount ?? "—", icon: Calendar, color: "text-rose-600 bg-rose-50 border-rose-100", view: "EXAMS" },
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#0f2343] via-[#1a3867] to-[#1e4e8c] p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-[#69d2ce] backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" /> Examination Control System • Java 24 MVC Architecture
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight">Smart Exam Seating Arrangement System</h1>
            <p className="mt-1 text-sm text-blue-100/80">
              Automated allocation, department interleaving, room capacity management, and official printable charts.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onRunDemo}
              className="inline-flex items-center gap-2 rounded-xl bg-[#147d79] hover:bg-[#0f6663] text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider shadow-md transition"
            >
              <Sparkles className="h-4 w-4" /> Run 143-Student Demo
            </button>
            <button
              onClick={() => onNavigate("GENERATE SEATING")}
              className="inline-flex items-center gap-2 rounded-xl bg-white text-[#0f2343] hover:bg-slate-100 px-4 py-2.5 text-xs font-bold uppercase tracking-wider shadow-md transition"
            >
              Generate Seating
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.label}
              onClick={() => onNavigate(c.view)}
              className="cursor-pointer rounded-xl bg-white p-4 border border-slate-200/80 shadow-xs hover:border-[#2463b4] hover:shadow-md transition group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{c.label}</span>
                <div className={`p-2 rounded-lg ${c.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-3 text-2xl font-black text-slate-900 group-hover:text-[#2463b4] transition">
                {c.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Two columns: Quick Actions & Upcoming Exams */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions Panel */}
        <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[#147d79]" /> Quick Actions
          </h2>
          <div className="grid grid-cols-1 gap-2.5">
            <button
              onClick={() => onNavigate("SEARCH SEAT")}
              className="w-full flex items-center justify-between rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 px-4 py-3 text-left transition group"
            >
              <div className="flex items-center gap-3">
                <Search className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-xs font-bold text-slate-800 group-hover:text-blue-700">Search Student Seat</p>
                  <p className="text-[11px] text-slate-500">Quick register number lookup (e.g. 24CS023)</p>
                </div>
              </div>
              <span className="text-xs text-slate-400 group-hover:text-blue-600">→</span>
            </button>

            <button
              onClick={() => onNavigate("QUICK ROOM SETUP")}
              className="w-full flex items-center justify-between rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 px-4 py-3 text-left transition group"
            >
              <div className="flex items-center gap-3">
                <Building2 className="h-4 w-4 text-emerald-600" />
                <div>
                  <p className="text-xs font-bold text-slate-800 group-hover:text-emerald-700">Quick Room Setup</p>
                  <p className="text-[11px] text-slate-500">Bulk create multiple rooms with automatic capacity</p>
                </div>
              </div>
              <span className="text-xs text-slate-400 group-hover:text-emerald-600">→</span>
            </button>

            <button
              onClick={() => onNavigate("CAPACITY REPORT")}
              className="w-full flex items-center justify-between rounded-xl bg-slate-50 hover:bg-purple-50 border border-slate-200 px-4 py-3 text-left transition group"
            >
              <div className="flex items-center gap-3">
                <Layers className="h-4 w-4 text-purple-600" />
                <div>
                  <p className="text-xs font-bold text-slate-800 group-hover:text-purple-700">Room Capacity Calculator</p>
                  <p className="text-[11px] text-slate-500">Compute required rooms, capacity OK/LOW status</p>
                </div>
              </div>
              <span className="text-xs text-slate-400 group-hover:text-purple-600">→</span>
            </button>

            <button
              onClick={() => onNavigate("PRINT REPORTS")}
              className="w-full flex items-center justify-between rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 px-4 py-3 text-left transition group"
            >
              <div className="flex items-center gap-3">
                <Printer className="h-4 w-4 text-amber-600" />
                <div>
                  <p className="text-xs font-bold text-slate-800 group-hover:text-amber-700">Print Examination Reports</p>
                  <p className="text-[11px] text-slate-500">Attendance, room charts, invigilator duty list</p>
                </div>
              </div>
              <span className="text-xs text-slate-400 group-hover:text-amber-600">→</span>
            </button>
          </div>
        </div>

        {/* Scheduled Examinations */}
        <div className="lg:col-span-2 rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#2463b4]" /> Scheduled Examinations
            </h2>
            <button
              onClick={() => onNavigate("EXAMS")}
              className="text-xs font-semibold text-[#2463b4] hover:underline"
            >
              Manage all exams →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 uppercase font-semibold">
                <tr>
                  <th className="py-2.5 px-3 rounded-l-lg">Exam Name</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Subject</th>
                  <th className="py-2.5 px-3">Date & Time</th>
                  <th className="py-2.5 px-3 rounded-r-lg text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {stats?.upcomingExams && stats.upcomingExams.length > 0 ? (
                  stats.upcomingExams.map((e) => (
                    <tr key={e.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-3 font-semibold text-slate-900">{e.name}</td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                          e.type === "INTERNAL" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                        }`}>
                          {e.type}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600">{e.subject}</td>
                      <td className="py-3 px-3 text-slate-600">{e.date} at {e.time}</td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => onNavigate("GENERATE SEATING")}
                          className="inline-flex items-center gap-1 rounded-md bg-[#2463b4] text-white px-2.5 py-1 text-[11px] font-semibold hover:bg-blue-700 transition"
                        >
                          Generate
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-400">
                      No examinations scheduled. Click Exam Management to add.
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
