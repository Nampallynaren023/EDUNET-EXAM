'use client';

import { useEffect, useState, useCallback } from 'react';

interface StudentResult {
  sno: number;
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
  submission_time: string;
}

function getStatusColor(status: string) {
  if (status === 'Outstanding') return '#fbbf24';
  if (status === 'Excellent') return '#22d3ee';
  if (status === 'Very Good') return '#34d399';
  if (status === 'Good') return '#a78bfa';
  if (status === 'Average') return '#60a5fa';
  if (status === 'Below Average') return '#fb923c';
  return '#f87171';
}

export default function AdminPage() {
  const [mounted, setMounted] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [adminName, setAdminName] = useState('');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [examEnabled, setExamEnabled] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [results, setResults] = useState<StudentResult[]>([]);
  const [resultsLoading, setResultsLoading] = useState(false);

  const fetchExamStatus = useCallback(async () => {
    const res = await fetch('/api/admin/exam-status');
    const d = await res.json();
    setExamEnabled(d.enabled);
  }, []);

  const fetchResults = useCallback(async (tok: string) => {
    setResultsLoading(true);
    try {
      const res = await fetch('/api/admin/export?format=json', {
        headers: { Authorization: `Bearer ${tok}` },
      });
      const d = await res.json();
      setResults(d.data ?? []);
    } catch {}
    setResultsLoading(false);
  }, []);

  useEffect(() => {
    setMounted(true);
    const savedToken = localStorage.getItem('edunet_admin_token');
    const savedName = localStorage.getItem('edunet_admin_name');
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
        setLoginError(data.error || 'Login failed.');
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

  if (!mounted) return null;

  // Login Screen
  if (!token) {
    return (
      <div className="relative min-h-screen flex items-center justify-center px-4" style={{ background: '#0a0a1a' }}>
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="relative z-10 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 border border-cyan-500/30" style={{ background: 'rgba(6,182,212,0.1)' }}>
              <span className="text-cyan-400 text-sm font-medium tracking-widest uppercase">🔐 Admin Portal</span>
            </div>
            <h1 className="text-3xl font-black" style={{ background: 'linear-gradient(135deg, #22d3ee, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Administrator Login
            </h1>
            <p className="text-gray-400 text-sm mt-2">EduNet Exam Management System</p>
          </div>
          <div className="glass-card p-8">
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="admin@edunet.com"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 border border-white/10 focus:border-cyan-500/50 focus:outline-none transition-colors"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 border border-white/10 focus:border-cyan-500/50 focus:outline-none transition-colors"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                />
              </div>
              {loginError && (
                <div className="p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
                  ⚠️ {loginError}
                </div>
              )}
              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 rounded-xl font-bold text-white cursor-pointer transition-all duration-300 hover:scale-[1.02] disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #22d3ee, #3b82f6)' }}
              >
                {loginLoading ? '⏳ Signing in...' : '🔐 Sign In'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard
  return (
    <div className="min-h-screen" style={{ background: '#0a0a1a' }}>
      <div className="absolute inset-0 bg-grid opacity-30" />

      {/* Top Nav */}
      <nav className="relative z-10 sticky top-0 border-b border-white/5" style={{ background: 'rgba(10,10,26,0.95)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <span className="text-cyan-400 font-black text-xl">EduNet</span>
            <span className="text-gray-500 text-sm ml-3">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm">👋 {adminName}</span>
            <button onClick={handleLogout} className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white border border-white/10 hover:border-white/20 cursor-pointer transition-all">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Controls Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Exam Toggle */}
          <div className="glass-card p-6">
            <h3 className="text-white font-bold text-lg mb-2">🎛️ Examination Control</h3>
            <p className="text-gray-400 text-sm mb-4">Enable or disable student registration and exam access.</p>
            <div className="flex items-center gap-4">
              <div
                className={`flex-1 py-3 px-4 rounded-xl text-center font-semibold text-sm ${examEnabled ? 'text-green-400 border border-green-500/30' : 'text-red-400 border border-red-500/30'}`}
                style={{ background: examEnabled ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)' }}
              >
                {examEnabled ? '✅ Exam is ACTIVE' : '🔒 Exam is DISABLED'}
              </div>
              <button
                onClick={toggleExam}
                disabled={toggling}
                className="px-6 py-3 rounded-xl font-bold text-white cursor-pointer transition-all duration-300 hover:scale-105 disabled:opacity-60"
                style={{ background: examEnabled ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #22d3ee, #3b82f6)' }}
              >
                {toggling ? '...' : examEnabled ? '🔒 Disable' : '✅ Enable'}
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="glass-card p-6">
            <h3 className="text-white font-bold text-lg mb-2">📊 Quick Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-3xl font-black text-cyan-400">{results.length}</div>
                <div className="text-gray-400 text-xs mt-1">Total Submissions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-purple-400">
                  {results.length > 0 ? (results.reduce((s, r) => s + r.marks, 0) / results.length).toFixed(1) : '—'}
                </div>
                <div className="text-gray-400 text-xs mt-1">Avg Score / 50</div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white font-bold text-xl">📋 Student Results</h3>
            <div className="flex gap-3">
              <button
                onClick={() => fetchResults(token)}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/10 cursor-pointer transition-all"
              >
                🔄 Refresh
              </button>
              <button
                onClick={downloadCSV}
                className="px-4 py-2 rounded-lg text-sm font-bold text-white cursor-pointer transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #22d3ee, #3b82f6)' }}
              >
                ⬇️ Export CSV
              </button>
            </div>
          </div>

          {resultsLoading ? (
            <div className="text-center py-12 text-gray-400 animate-pulse">Loading results...</div>
          ) : results.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-gray-400">No exam submissions yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    {['#', 'Name', 'Roll No', 'Department', 'Score', 'Correct', 'Incorrect', 'Unanswered', 'Performance', 'Time'].map((h) => (
                      <th key={h} className="text-left text-gray-400 font-medium py-3 px-3 text-xs uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((r) => (
                    <tr key={r.sno} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-3 text-gray-500">{r.sno}</td>
                      <td className="py-3 px-3 text-white font-medium">{r.student_name}</td>
                      <td className="py-3 px-3 text-cyan-400 font-mono text-xs">{r.roll_number}</td>
                      <td className="py-3 px-3 text-gray-300">{r.department}</td>
                      <td className="py-3 px-3 text-white font-bold">{r.marks}/50</td>
                      <td className="py-3 px-3 text-green-400">{r.correct}</td>
                      <td className="py-3 px-3 text-red-400">{r.incorrect}</td>
                      <td className="py-3 px-3 text-gray-400">{r.unanswered}</td>
                      <td className="py-3 px-3">
                        <span
                          className="px-2 py-1 rounded-full text-xs font-semibold"
                          style={{ color: getStatusColor(r.status), background: `${getStatusColor(r.status)}20`, border: `1px solid ${getStatusColor(r.status)}40` }}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-gray-500 text-xs">{r.submission_time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
