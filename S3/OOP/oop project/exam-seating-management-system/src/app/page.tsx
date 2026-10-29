"use client";

import React, { useState, useEffect } from "react";
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
  Layers,
  Settings,
  LogOut,
  Zap,
  BookmarkPlus,
  Calculator,
  ListOrdered,
  FileCheck,
  ShieldCheck,
  Menu,
  X
} from "lucide-react";

import { DashboardView } from "@/components/DashboardView";
import { StudentView } from "@/components/StudentView";
import { DepartmentView } from "@/components/DepartmentView";
import { SemesterView } from "@/components/SemesterView";
import { RoomView } from "@/components/RoomView";
import { QuickRoomSetupView } from "@/components/QuickRoomSetupView";
import { RoomTemplateView } from "@/components/RoomTemplateView";
import { TeacherView } from "@/components/TeacherView";
import { ExamView } from "@/components/ExamView";
import { GenerateSeatingView } from "@/components/GenerateSeatingView";
import { SeatingResultView } from "@/components/SeatingResultView";
import { StudentSeatSearchView } from "@/components/StudentSeatSearchView";
import { AttendanceView } from "@/components/AttendanceView";
import { InvigilatorView } from "@/components/InvigilatorView";
import { CapacityCalculatorView } from "@/components/CapacityCalculatorView";
import { ReportsFilterView } from "@/components/ReportsFilterView";
import { UserManagementView } from "@/components/UserManagementView";
import { SettingsView } from "@/components/SettingsView";

export default function Home() {
  const [currentUser, setCurrentUser] = useState<{
    id: number;
    username: string;
    role: "ADMIN" | "TEACHER";
    fullName: string;
  } | null>({
    id: 1,
    username: "admin",
    role: "ADMIN",
    fullName: "System Administrator",
  });

  const [activeNav, setActiveNav] = useState<string>("DASHBOARD");
  const [generatedExamId, setGeneratedExamId] = useState<number | null>(null);
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Login form state
  const [loginUser, setLoginUser] = useState("admin");
  const [loginPass, setLoginPass] = useState("admin123");
  const [loginError, setLoginError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/dashboard/stats");
      const data = await res.json();
      setDashboardStats(data);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchStats();
    }
  }, [currentUser, activeNav]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loginUser, password: loginPass }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      setCurrentUser(data.user);
      setActiveNav("DASHBOARD");
    } catch (err: unknown) {
      setLoginError(err instanceof Error ? err.message : "Failed to sign in");
    }
  };

  const handleQuickRoleSwitch = (role: "ADMIN" | "TEACHER") => {
    if (role === "ADMIN") {
      setCurrentUser({
        id: 1,
        username: "admin",
        role: "ADMIN",
        fullName: "System Administrator",
      });
    } else {
      setCurrentUser({
        id: 2,
        username: "teacher",
        role: "TEACHER",
        fullName: "Examination Coordinator",
      });
    }
  };

  const handleRunDemoScenario = async () => {
    // Demo scenario: Run seating for exam 1 (Internal Exam - S3, 143 students, Automatic rooms, Department Mixing)
    try {
      const examRes = await fetch("/api/exams");
      const examData = await examRes.json();
      const demoExam = examData.exams?.find((e: any) => e.name.includes("Internal") || e.id === 1) || examData.exams?.[0];
      if (!demoExam) return;

      const genRes = await fetch("/api/seating/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examId: demoExam.id,
          shuffleOrder: "Department Mixing",
          roomSelectionMode: "AUTOMATIC",
        }),
      });
      const genData = await genRes.json();
      if (genData.success) {
        setGeneratedExamId(demoExam.id);
        setActiveNav("SEATING REPORT");
      }
    } catch {
      // ignore
    }
  };

  const menuItems = [
    { id: "DASHBOARD", label: "Dashboard", icon: Sparkles },
    { id: "STUDENTS", label: "Students", icon: GraduationCap },
    { id: "DEPARTMENTS", label: "Departments", icon: Building2 },
    { id: "SEMESTERS", label: "Semesters", icon: Calendar },
    { id: "ROOMS", label: "Rooms", icon: DoorClosed },
    { id: "QUICK ROOM SETUP", label: "Quick Room Setup", icon: Zap, adminOnly: true },
    { id: "ROOM TEMPLATES", label: "Room Templates", icon: BookmarkPlus, adminOnly: true },
    { id: "TEACHERS", label: "Teachers", icon: UserCheck },
    { id: "EXAMS", label: "Exams", icon: Calendar },
    { id: "GENERATE SEATING", label: "Generate Seating", icon: Sparkles },
    { id: "SEARCH SEAT", label: "Search Seat", icon: Search },
    { id: "SEATING REPORT", label: "Seating Report", icon: ListOrdered },
    { id: "ATTENDANCE", label: "Attendance", icon: FileCheck },
    { id: "INVIGILATOR DUTY", label: "Invigilator Duty", icon: UserCheck },
    { id: "CAPACITY REPORT", label: "Capacity Report", icon: Calculator },
    { id: "PRINT REPORTS", label: "Print Reports", icon: Printer },
    { id: "USERS", label: "User Management", icon: Users, adminOnly: true },
    { id: "SETTINGS", label: "Settings", icon: Settings },
  ];

  // LOGIN SCREEN
  if (!currentUser) {
    return (
      <main className="min-h-screen bg-[#f4f7fb] flex items-center justify-center p-4">
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 rounded-3xl bg-white shadow-2xl border border-slate-200/80 overflow-hidden">
          {/* Left Hero Brand */}
          <div className="bg-[#0f2343] p-10 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-xl bg-[#69d2ce]/15 px-3 py-1 text-xs font-bold text-[#69d2ce]">
                ▦ College Examination Control
              </div>
              <h1 className="text-3xl font-black leading-tight">
                SMART EXAM <br />
                <span className="text-[#69d2ce]">SEATING SYSTEM</span>
              </h1>
              <p className="text-xs text-blue-200/80 leading-relaxed">
                Automated examination seating generator, multi-department candidate mixing, capacity validation, and official print charts.
              </p>
            </div>

            <div className="space-y-3 pt-8 border-t border-white/10 text-xs">
              <p className="font-bold text-slate-300">Quick Test Credentials:</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setLoginUser("admin"); setLoginPass("admin123"); }}
                  className="rounded-lg bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 font-mono text-xs transition border border-white/10"
                >
                  admin / admin123
                </button>
                <button
                  type="button"
                  onClick={() => { setLoginUser("teacher"); setLoginPass("teacher123"); }}
                  className="rounded-lg bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 font-mono text-xs transition border border-white/10"
                >
                  teacher / teacher123
                </button>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="p-10 flex flex-col justify-center space-y-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Sign In</h2>
              <p className="text-xs text-slate-500 mt-1">Access administrator or coordinator examination portal</p>
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Username</label>
                <input
                  type="text"
                  value={loginUser}
                  onChange={(e) => setLoginUser(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-900 font-medium focus:border-[#2463b4] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-900 font-medium focus:border-[#2463b4] focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-[#2463b4] hover:bg-blue-700 text-white py-3 font-bold uppercase tracking-wider text-xs shadow-md transition"
              >
                Login to System
              </button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  // MAIN AUTHENTICATED DASHBOARD & SYSTEM PORTAL
  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-800 flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-[#0f2343] text-white shadow-md border-b border-white/10 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#69d2ce]/20 text-lg font-black text-[#69d2ce]">
              ▦
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#69d2ce]">SMART SEATING SYSTEM</p>
              <p className="text-[10px] text-slate-300 uppercase tracking-wider hidden sm:block">College Examination Seating Control</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Demo Button */}
            <button
              onClick={handleRunDemoScenario}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-[#147d79] hover:bg-[#0f6663] text-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider shadow-sm transition"
              title="Runs the required 143-candidate 5-room test scenario"
            >
              <Sparkles className="h-3.5 w-3.5" /> 143-Student Demo
            </button>

            {/* Quick Role Switcher Pill */}
            <div className="flex items-center bg-white/10 p-0.5 rounded-lg text-[10px] font-bold">
              <button
                onClick={() => handleQuickRoleSwitch("ADMIN")}
                className={`px-2 py-1 rounded transition ${
                  currentUser.role === "ADMIN" ? "bg-[#2463b4] text-white shadow-xs" : "text-slate-300 hover:text-white"
                }`}
              >
                ADMIN
              </button>
              <button
                onClick={() => handleQuickRoleSwitch("TEACHER")}
                className={`px-2 py-1 rounded transition ${
                  currentUser.role === "TEACHER" ? "bg-[#2463b4] text-white shadow-xs" : "text-slate-300 hover:text-white"
                }`}
              >
                TEACHER
              </button>
            </div>

            {/* User badge */}
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs font-bold text-white">{currentUser.fullName}</span>
              <span className="text-[10px] text-slate-300">{currentUser.role} ROLE</span>
            </div>

            <button
              onClick={() => setCurrentUser(null)}
              className="p-2 rounded-lg text-slate-300 hover:text-rose-400 hover:bg-white/10 transition"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex gap-6">
        {/* Left Sidebar Navigation */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0f2343] p-4 text-white shadow-2xl transition-transform lg:static lg:block lg:w-60 lg:shadow-none lg:bg-transparent lg:p-0 no-print ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="rounded-2xl lg:bg-[#0f2343] p-3 text-white space-y-1 shadow-sm">
            <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              Navigation Menu
            </p>
            {menuItems.map((item) => {
              if (item.adminOnly && currentUser.role !== "ADMIN") return null;
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveNav(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition text-left ${
                    isActive
                      ? "bg-[#2463b4] text-white shadow-sm"
                      : "text-slate-300 hover:text-white hover:bg-white/8"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0 text-[#69d2ce]" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 p-3 rounded-2xl bg-white border border-slate-200 text-xs text-slate-600 space-y-1.5 hidden lg:block">
            <p className="font-bold text-slate-800 text-[11px] uppercase flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> System Active
            </p>
            <p className="text-[10px] text-slate-500">
              Role: <strong className="text-slate-700">{currentUser.role}</strong>
            </p>
            <p className="text-[10px] text-slate-500">
              Java: <strong className="text-slate-700">JDK 24 Ready</strong>
            </p>
          </div>
        </aside>

        {/* Center Content View Area */}
        <main className="flex-1 min-w-0">
          {activeNav === "DASHBOARD" && (
            <DashboardView
              stats={dashboardStats}
              onNavigate={(v) => setActiveNav(v)}
              onRunDemo={handleRunDemoScenario}
            />
          )}

          {activeNav === "STUDENTS" && <StudentView userRole={currentUser.role} />}
          {activeNav === "DEPARTMENTS" && <DepartmentView userRole={currentUser.role} />}
          {activeNav === "SEMESTERS" && <SemesterView userRole={currentUser.role} />}
          {activeNav === "ROOMS" && (
            <RoomView
              userRole={currentUser.role}
              onNavigateToQuickSetup={() => setActiveNav("QUICK ROOM SETUP")}
            />
          )}
          {activeNav === "QUICK ROOM SETUP" && (
            <QuickRoomSetupView onDone={() => setActiveNav("ROOMS")} />
          )}
          {activeNav === "ROOM TEMPLATES" && (
            <RoomTemplateView userRole={currentUser.role} />
          )}
          {activeNav === "TEACHERS" && <TeacherView userRole={currentUser.role} />}
          {activeNav === "EXAMS" && (
            <ExamView
              userRole={currentUser.role}
              onGenerateForExam={(id) => {
                setGeneratedExamId(id);
                setActiveNav("GENERATE SEATING");
              }}
            />
          )}
          {activeNav === "GENERATE SEATING" && (
            <GenerateSeatingView
              userRole={currentUser.role}
              preselectedExamId={generatedExamId}
              onSeatingGenerated={(id) => {
                setGeneratedExamId(id);
                setActiveNav("SEATING REPORT");
              }}
            />
          )}
          {activeNav === "SEATING REPORT" && (
            <SeatingResultView
              examId={generatedExamId || 1}
              onBack={() => setActiveNav("GENERATE SEATING")}
            />
          )}
          {activeNav === "SEARCH SEAT" && <StudentSeatSearchView />}
          {activeNav === "ATTENDANCE" && <AttendanceView defaultExamId={generatedExamId || 1} />}
          {activeNav === "INVIGILATOR DUTY" && <InvigilatorView defaultExamId={generatedExamId || 1} />}
          {activeNav === "CAPACITY REPORT" && <CapacityCalculatorView />}
          {activeNav === "PRINT REPORTS" && <ReportsFilterView />}
          {activeNav === "USERS" && <UserManagementView currentUsername={currentUser.username} />}
          {activeNav === "SETTINGS" && <SettingsView />}
        </main>
      </div>
    </div>
  );
}
