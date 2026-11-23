'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { getStatusBadgeStyle } from '@/lib/performance';

interface StudentResult {
  sno: number;
  session_id: string;
  student_name: string;
  department: string;
  roll_number: string;
  email: string;
  total_questions: number;
  correct: number;
  incorrect: number;
  unanswered: number;
  marks: number;
  percentage: string;
  status: string;
  meme_message: string;
  submission_time: string;
}

interface DashboardStats {
  totalRegistered: number;
  totalSubmissions: number;
  completedExams: number;
  avgMarks: string;
  highestMarks: number;
  lowestMarks: number;
}

export default function AdminPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [adminName, setAdminName] = useState('');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [examEnabled, setExamEnabled] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [results, setResults] = useState<StudentResult[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalRegistered: 0,
    totalSubmissions: 0,
    completedExams: 0,
    avgMarks: '0',
    highestMarks: 0,
    lowestMarks: 0,
  });
  const [resultsLoading, setResultsLoading] = useState(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStudent, setSelectedStudent] = useState<StudentResult | null>(null);

  const fetchExamStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/exam-status');
      const d = await res.json();
      setExamEnabled(Boolean(d.enabled));
    } catch {}
  }, []);

  const fetchResults = useCallback(async (tok: string) => {
    setResultsLoading(true);
    try {
      const res = await fetch('/api/admin/export?format=json', {
        headers: { Authorization: `Bearer ${tok}` },
      });
      if (res.status === 401) {
        localStorage.removeItem('edunet_admin_token');
        localStorage.removeItem('edunet_admin_name');
        setToken(null);
        setResultsLoading(false);
        return;
      }
      const d = await res.json();
      setResults(d.data ?? []);
      if (d.stats) {
        setStats(d.stats);
      }
    } catch {}
    setResultsLoading(false);
  }, []);

  useEffect(() => {
    setMounted(true);
    const savedToken = typeof window !== 'undefined' ? localStorage.getItem('edunet_admin_token') : null;
    const savedName = typeof window !== 'undefined' ? localStorage.getItem('edunet_admin_name') : null;
    if (savedToken && savedName) {
      setToken(savedToken);
      setAdminName(savedName);
      fetchExamStatus();
      fetchResults(savedToken);
    }
  }, [fetchExamStatus, fetchResults]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginForm.email.trim(), password: loginForm.password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || 'Invalid credentials.');
        setLoginLoading(false);
        return;
      }
      localStorage.setItem('edunet_admin_token', data.token);
      localStorage.setItem('edunet_admin_name', data.name);
      setToken(data.token);
      setAdminName(data.name);
      fetchExamStatus();
      fetchResults(data.token);
    } catch {
      setLoginError('Network error. Please try again.');
    }
    setLoginLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('edunet_admin_token');
    localStorage.removeItem('edunet_admin_name');
    setToken(null);
    setAdminName('');
    setResults([]);
  };

  const toggleExam = async () => {
    if (!token) return;
    setToggling(true);
    try {
      const res = await fetch('/api/admin/exam-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ enabled: !examEnabled }),
      });
      const d = await res.json();
      setExamEnabled(d.enabled);
    } catch {}
    setToggling(false);
  };

  const downloadCSV = async () => {
    if (!token) return;
    const res = await fetch('/api/admin/export?format=csv', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `edunet-results-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadExcel = async () => {
    if (!token) return;
    const res = await fetch('/api/admin/export?format=xlsx', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `edunet-results-${new Date().toISOString().slice(0, 10)}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Unique departments for filter dropdown
  const departments = useMemo(() => {
    const set = new Set<string>();
    results.forEach((r) => {
      if (r.department) set.add(r.department.trim());
    });
    return Array.from(set).sort();
  }, [results]);

  // Filtered results based on search and filters
  const filteredResults = useMemo(() => {
    return results.filter((r) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        r.student_name.toLowerCase().includes(q) ||
        r.roll_number.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.department.toLowerCase().includes(q);

      const matchesDept = selectedDept === 'ALL' || r.department.trim() === selectedDept;
      const matchesCategory = selectedCategory === 'ALL' || r.status === selectedCategory;

      return matchesSearch && matchesDept && matchesCategory;
    });
  }, [results, searchQuery, selectedDept, selectedCategory]);

  if (!mounted) return null;

  // Screen 1: Admin Login
  if (!token) {
    return (
      <div className="relative min-h-screen flex items-center justify-center px-4 py-12" style={{ background: '#0a0a1a' }}>
        <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />

        <div className="relative z-10 w-full max-w-md">
          {/* Back Link */}
          <div className="mb-6 flex justify-between items-center">
            <button
              onClick={() => router.push('/')}
              className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              ← Back to Main Site
            </button>
            <button
              onClick={() => router.push('/check-result')}
              className="text-xs text-gray-500 hover:text-gray-400 transition-colors cursor-pointer"
            >
              Student Portal →
            </button>
          </div>

          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-3 border border-cyan-500/30 bg-cyan-500/10">
              <span className="text-cyan-400 text-xs font-semibold tracking-widest uppercase">🔐 Restricted Access</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              Administrator Login
            </h1>
            <p className="text-gray-400 text-sm mt-1.5">EduNet Examination Management System</p>
          </div>

          <div className="glass-card p-8 border border-white/10 shadow-2xl">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Admin Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. nampallynaren16@gmail.com"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 border border-white/10 focus:border-cyan-500/60 focus:outline-none transition-colors text-sm"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Admin Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 border border-white/10 focus:border-cyan-500/60 focus:outline-none transition-colors text-sm"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                />
              </div>

              {loginError && (
                <div className="p-3 rounded-xl border border-red-500/40 bg-red-500/10 text-red-400 text-xs font-medium">
                  ⚠️ {loginError}
                </div>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3.5 rounded-xl font-bold text-white cursor-pointer transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 shadow-lg text-sm"
                style={{
                  background: 'linear-gradient(135deg, #22d3ee, #3b82f6)',
                  boxShadow: '0 0 20px rgba(34, 211, 238, 0.25)',
                }}
              >
                {loginLoading ? '⏳ Authenticating...' : '🔐 Sign In to Admin Dashboard'}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-white/10 text-center">
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Authorized for <span className="text-cyan-400 font-medium">Naren</span> and <span className="text-purple-400 font-medium">Mr. Sainath</span>.
                <br />
                Credentials are encrypted and validated server-side.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Screen 2: Complete Admin Dashboard
  return (
    <div className="min-h-screen pb-16" style={{ background: '#0a0a1a' }}>
      <div className="fixed inset-0 bg-grid opacity-30 pointer-events-none" />

      {/* Top Navbar */}
      <nav className="relative z-20 sticky top-0 border-b border-white/10" style={{ background: 'rgba(10,10,26,0.96)', backdropFilter: 'blur(16px)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              EduNet
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Admin Dashboard
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/')}
              className="text-xs text-gray-400 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 transition-colors"
            >
              🌐 View Site
            </button>
            <div className="text-xs text-gray-300 font-medium hidden sm:block">
              👤 <span className="text-white font-bold">{adminName}</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-red-400 hover:text-white hover:bg-red-500/20 border border-red-500/30 transition-all cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* Header Title & Quick Actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Examination Overview & Analytics
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">
              Live monitoring of student submissions, score distributions, and performance tiers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => fetchResults(token)}
              disabled={resultsLoading}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-cyan-400 border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>🔄</span>
              <span>{resultsLoading ? 'Refreshing...' : 'Refresh Results'}</span>
            </button>
            <button
              onClick={downloadCSV}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-white border border-white/20 bg-white/5 hover:bg-white/10 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>⬇️</span>
              <span>Export CSV</span>
            </button>
            <button
              onClick={downloadExcel}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 transition-all cursor-pointer shadow-lg flex items-center gap-1.5"
            >
              <span>📊</span>
              <span>Export Excel</span>
            </button>
          </div>
        </div>

        {/* 6 Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {[
            { label: 'Registered Students', val: stats.totalRegistered, icon: '🎓', color: 'from-blue-500 to-cyan-500' },
            { label: 'Total Submissions', val: stats.totalSubmissions, icon: '📝', color: 'from-cyan-400 to-teal-400' },
            { label: 'Completed Exams', val: stats.completedExams, icon: '✅', color: 'from-emerald-400 to-green-500' },
            { label: 'Average Marks', val: `${stats.avgMarks}/50`, icon: '📈', color: 'from-purple-400 to-pink-500' },
            { label: 'Highest Marks', val: `${stats.highestMarks}/50`, icon: '🏆', color: 'from-amber-400 to-yellow-500' },
            { label: 'Lowest Marks', val: `${stats.lowestMarks}/50`, icon: '📉', color: 'from-orange-400 to-red-500' },
          ].map((item, i) => (
            <div key={i} className="glass-card p-4 rounded-2xl border border-white/10 hover:border-white/20 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl">{item.icon}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Metrics</span>
              </div>
              <div className={`text-2xl sm:text-3xl font-black bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                {item.val}
              </div>
              <div className="text-[11px] text-gray-300 font-medium mt-1 leading-snug">
                {item.label}
              </div>
            </div>
          ))}
        </div>

        {/* Exam Status Toggle Card */}
        <div className="glass-card p-5 rounded-2xl border border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base">🎛️</span>
              <h3 className="text-white font-bold text-sm sm:text-base">Examination Portal Status</h3>
            </div>
            <p className="text-gray-400 text-xs">
              When disabled, new student registrations are locked. Active exams can still submit safely.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${examEnabled ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-red-500/10 text-red-400 border-red-500/30'}`}
            >
              {examEnabled ? '● ACTIVE FOR STUDENTS' : '○ EXAM PORTAL LOCKED'}
            </div>
            <button
              onClick={toggleExam}
              disabled={toggling}
              className={`px-4 py-2 rounded-xl text-xs font-bold text-white transition-all cursor-pointer shadow-md ${examEnabled ? 'bg-red-600 hover:bg-red-500' : 'bg-emerald-600 hover:bg-emerald-500'}`}
            >
              {toggling ? 'Updating...' : examEnabled ? '🔒 Lock Portal' : '✅ Open Portal'}
            </button>
          </div>
        </div>

        {/* Results Section with Live Filter and Search */}
        <div className="glass-card p-5 sm:p-6 rounded-2xl border border-white/10 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-white font-bold text-lg sm:text-xl">
                Student Examination Records ({filteredResults.length} of {results.length})
              </h3>
              <p className="text-gray-400 text-xs mt-0.5">
                Real-time synchronized records from the database. Click any student for detailed analysis.
              </p>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Search Bar */}
              <div className="relative min-w-[200px] flex-1 sm:flex-none">
                <input
                  type="text"
                  placeholder="🔍 Search name, roll, dept..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-xs text-white placeholder-gray-500 border border-white/10 focus:border-cyan-500/50 focus:outline-none"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Department Dropdown */}
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="px-3 py-2 rounded-xl text-xs text-gray-200 border border-white/10 focus:border-cyan-500/50 focus:outline-none"
                style={{ background: '#121326' }}
              >
                <option value="ALL">All Departments</option>
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>

              {/* Meme Category Dropdown */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 rounded-xl text-xs text-gray-200 border border-white/10 focus:border-cyan-500/50 focus:outline-none"
                style={{ background: '#121326' }}
              >
                <option value="ALL">All Categories</option>
                <option value="LEGENDARY MODE">🏆 LEGENDARY MODE (50)</option>
                <option value="MAIN CHARACTER">🔥 MAIN CHARACTER (45-49)</option>
                <option value="PRO PLAYER">😎 PRO PLAYER (40-44)</option>
                <option value="RISING STAR">🚀 RISING STAR (35-39)</option>
                <option value="ALMOST THERE">🎯 ALMOST THERE (30-34)</option>
                <option value="LOADING GENIUS">😂 LOADING GENIUS (20-29)</option>
                <option value="COMEBACK PENDING">🥲 COMEBACK PENDING (0-19)</option>
              </select>
            </div>
          </div>

          {/* Table */}
          {resultsLoading ? (
            <div className="py-16 text-center text-cyan-400 text-sm animate-pulse">
              ⏳ Fetching real-time records from database...
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="py-16 text-center">
              <div className="text-4xl mb-2">📭</div>
              <p className="text-gray-300 font-semibold text-sm">No student records match your query.</p>
              <p className="text-gray-500 text-xs mt-1">Try clearing filters or search query.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-white/5">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02]">
                    <th className="text-left text-gray-400 font-semibold py-3 px-3">#</th>
                    <th className="text-left text-gray-400 font-semibold py-3 px-3">Student Name</th>
                    <th className="text-left text-gray-400 font-semibold py-3 px-3">Roll Number</th>
                    <th className="text-left text-gray-400 font-semibold py-3 px-3">Department</th>
                    <th className="text-left text-gray-400 font-semibold py-3 px-3">Marks</th>
                    <th className="text-left text-gray-400 font-semibold py-3 px-3">Accuracy</th>
                    <th className="text-left text-gray-400 font-semibold py-3 px-3">Performance Category</th>
                    <th className="text-left text-gray-400 font-semibold py-3 px-3">Submission Time</th>
                    <th className="text-center text-gray-400 font-semibold py-3 px-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredResults.map((r) => {
                    const badge = getStatusBadgeStyle(r.status);
                    return (
                      <tr key={r.sno} className="hover:bg-white/[0.03] transition-colors">
                        <td className="py-3 px-3 text-gray-500 font-mono">{r.sno}</td>
                        <td className="py-3 px-3 text-white font-bold">{r.student_name}</td>
                        <td className="py-3 px-3 text-cyan-400 font-mono font-medium">{r.roll_number}</td>
                        <td className="py-3 px-3 text-gray-300">{r.department}</td>
                        <td className="py-3 px-3 font-black text-white text-sm">
                          {r.marks}<span className="text-gray-500 font-normal text-xs">/50</span>
                        </td>
                        <td className="py-3 px-3 text-gray-300">
                          <span className="text-emerald-400 font-semibold">{r.correct}C</span> ·{' '}
                          <span className="text-red-400 font-semibold">{r.incorrect}I</span> ·{' '}
                          <span className="text-gray-400">{r.unanswered}U</span>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider"
                            style={{
                              color: badge.color,
                              background: badge.bg,
                              border: `1px solid ${badge.border}`,
                            }}
                          >
                            {r.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-gray-400 text-[11px] whitespace-nowrap">
                          {r.submission_time}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() => setSelectedStudent(r)}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/10 transition-colors cursor-pointer"
                          >
                            Analysis →
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="glass-card max-w-lg w-full p-6 sm:p-7 rounded-2xl border border-white/20 relative shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-xl font-black text-white">{selectedStudent.student_name}</h3>
                <p className="text-xs text-cyan-400 font-mono mt-0.5">{selectedStudent.roll_number} · {selectedStudent.department}</p>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center text-sm transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Score & Category */}
            <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-4xl font-black text-white mb-1">
                {selectedStudent.marks}/50
              </div>
              <div className="mb-2">
                <span
                  className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider"
                  style={{
                    color: getStatusBadgeStyle(selectedStudent.status).color,
                    background: getStatusBadgeStyle(selectedStudent.status).bg,
                    border: `1px solid ${getStatusBadgeStyle(selectedStudent.status).border}`,
                  }}
                >
                  {selectedStudent.status}
                </span>
              </div>
              <p className="text-gray-300 text-xs italic">
                &ldquo;{selectedStudent.meme_message}&rdquo;
              </p>
            </div>

            {/* Details Breakdown */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="text-lg font-black text-green-400">{selectedStudent.correct}</div>
                <div className="text-[10px] text-gray-400 uppercase">Correct</div>
              </div>
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <div className="text-lg font-black text-red-400">{selectedStudent.incorrect}</div>
                <div className="text-[10px] text-gray-400 uppercase">Incorrect</div>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="text-lg font-black text-gray-400">{selectedStudent.unanswered}</div>
                <div className="text-[10px] text-gray-400 uppercase">Unanswered</div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-3 text-[11px] text-gray-400 space-y-1">
              <div><strong className="text-gray-300">Email:</strong> {selectedStudent.email || 'N/A'}</div>
              <div><strong className="text-gray-300">Submitted At:</strong> {selectedStudent.submission_time}</div>
              <div><strong className="text-gray-300">Session ID:</strong> <span className="font-mono text-[10px]">{selectedStudent.session_id}</span></div>
            </div>

            <button
              onClick={() => setSelectedStudent(null)}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
            >
              Close Analysis
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
