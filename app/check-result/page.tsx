'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { getMemePerformance } from '@/lib/performance';

interface ResultData {
  studentName: string;
  rollNumber: string;
  department: string;
  score: number;
  total: number;
  percentage: string;
  performance: string;
  correct: number;
  incorrect: number;
  unanswered: number;
  submittedAt: string;
}

export default function CheckResultPage() {
  const router = useRouter();
  const [rollNumber, setRollNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<ResultData | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);

    const clean = rollNumber.trim().toUpperCase();
    if (!clean) {
      setError('Please enter your Roll Number.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/results/lookup?rollNumber=${encodeURIComponent(clean)}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to fetch result.');
        setLoading(false);
        return;
      }
      setResult(data);
    } catch {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center py-12 px-4" style={{ background: '#0a0a1a' }}>
      <div className="absolute inset-0 bg-grid opacity-40" />

      <div className="relative z-10 w-full max-w-xl">
        {/* Navigation */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm cursor-pointer transition-colors"
          >
            ← Back to Home
          </button>
          <button
            onClick={() => router.push('/admin')}
            className="text-xs text-gray-500 hover:text-gray-400 cursor-pointer transition-colors"
          >
            Admin Portal →
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 border border-cyan-500/30" style={{ background: 'rgba(6, 182, 212, 0.1)' }}>
            <span className="text-cyan-400 text-sm font-medium tracking-widest uppercase">✦ Student Portal</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-2" style={{ background: 'linear-gradient(135deg, #22d3ee, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Check Examination Result
          </h1>
          <p className="text-gray-400 text-sm">Enter your Roll Number to view your marks and performance assessment</p>
        </div>

        {/* Search Card */}
        <div className="glass-card p-6 md:p-8 mb-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Student Roll Number</label>
              <input
                type="text"
                required
                placeholder="e.g. 21B81A0501"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 border border-white/10 focus:border-cyan-500/50 focus:outline-none transition-colors font-mono uppercase text-lg"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl font-bold text-white cursor-pointer transition-all duration-300 hover:scale-[1.02] disabled:opacity-60"
              style={{
                background: 'linear-gradient(135deg, #22d3ee, #3b82f6)',
                boxShadow: '0 0 20px rgba(34, 211, 238, 0.2)',
              }}
            >
              {loading ? '🔍 Searching Results...' : '🔍 Check My Result'}
            </button>
          </form>
        </div>

        {/* Result Card Display */}
        {result && (() => {
          const perf = getMemePerformance(result.score);
          return (
            <div className="glass-card p-6 md:p-8 border animate-scale-in" style={{ borderColor: `${perf.color}40` }}>
              <div className="text-center mb-6">
                {perf.isLegendary && (
                  <div className="mb-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black text-xs uppercase tracking-widest shadow-md">
                    <span>👑</span>
                    <span>PERFECT SCORE · 50/50</span>
                    <span>👑</span>
                  </div>
                )}
                <div className="text-6xl mb-2 animate-success-bounce">{perf.emoji}</div>
                <div className="text-4xl md:text-5xl font-black mb-1" style={{ background: perf.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  {result.score}/50
                </div>
                <div className="mb-2">
                  <span
                    className="inline-block px-3.5 py-1 rounded-full text-sm font-black uppercase tracking-wider"
                    style={{ color: perf.color, background: perf.badgeBg, border: `1.5px solid ${perf.badgeBorder}` }}
                  >
                    {perf.label}
                  </span>
                </div>
                <div className="text-gray-300 font-semibold text-sm mb-3">{result.percentage}% Overall Score</div>
                <div className="text-white text-sm px-4 py-3 rounded-xl inline-block text-left border" style={{ background: 'rgba(255,255,255,0.04)', borderColor: `${perf.color}35` }}>
                  <span className="text-gray-400 text-xs block font-bold uppercase tracking-wider mb-0.5">Assessment Feedback</span>
                  <span className="italic font-medium">&ldquo;{perf.message}&rdquo;</span>
                </div>
              </div>

              {/* Student Details */}
              <div className="border-t border-b border-white/10 py-4 my-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-400 text-xs block">Student Name</span>
                  <span className="text-white font-medium">{result.studentName}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-xs block">Roll Number</span>
                  <span className="text-cyan-400 font-mono font-medium">{result.rollNumber}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-xs block">Department</span>
                  <span className="text-gray-300">{result.department}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-xs block">Submitted On</span>
                  <span className="text-gray-400 text-xs">
                    {result.submittedAt ? new Date(result.submittedAt).toLocaleDateString() : 'Recorded'}
                  </span>
                </div>
              </div>

              {/* Stats Breakdown */}
              <div className="grid grid-cols-3 gap-3 text-center my-4">
                <div className="p-3 rounded-lg bg-white/5">
                  <div className="text-lg font-bold text-green-400">{result.correct}</div>
                  <div className="text-[10px] text-gray-400 uppercase">Correct</div>
                </div>
                <div className="p-3 rounded-lg bg-white/5">
                  <div className="text-lg font-bold text-red-400">{result.incorrect}</div>
                  <div className="text-[10px] text-gray-400 uppercase">Incorrect</div>
                </div>
                <div className="p-3 rounded-lg bg-white/5">
                  <div className="text-lg font-bold text-gray-400">{result.unanswered}</div>
                  <div className="text-[10px] text-gray-400 uppercase">Unanswered</div>
                </div>
              </div>

              <div className="text-center mt-6">
                <button
                  onClick={() => window.print()}
                  className="px-6 py-2 rounded-xl text-sm font-semibold text-gray-300 border border-white/20 hover:text-white hover:border-white/40 cursor-pointer transition-colors"
                >
                  🖨️ Print / Save Result
                </button>
              </div>

              {/* Creators Tribute - Unique Classic & Attractive Tribute */}
              <div className="mt-8 pt-6 border-t border-white/10 text-center relative">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-400/40 bg-amber-400/10 mb-2 shadow-[0_0_15px_rgba(251,191,36,0.15)]">
                  <span className="text-amber-400 text-xs">✦</span>
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-amber-300">
                    Honorary Tribute · The Masterminds
                  </span>
                  <span className="text-amber-400 text-xs">✦</span>
                </div>

                <h4 className="text-base md:text-lg font-black text-white tracking-wide mb-1">
                  Heartfelt Gratitude to the Creators
                </h4>

                <p className="text-gray-400 text-[11px] max-w-md mx-auto mb-4 leading-relaxed font-light">
                  Architected, crafted, and engineered with exceptional vision and dedication:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-left">
                  {[
                    {
                      name: 'NAREN',
                      badge: 'Lead Architect',
                      badgeIcon: '⚡',
                      role: 'Architect & Lead Dev',
                      tagline: 'High-Concurrency Engine · Architecture',
                      border: 'border-cyan-500/30 hover:border-cyan-400/70',
                      glow: 'hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]',
                      bgGradient: 'from-cyan-950/40 to-slate-900/60',
                      crestGradient: 'from-cyan-400 to-blue-600',
                      textGradient: 'from-cyan-300 via-sky-100 to-blue-400',
                      pillBg: 'bg-cyan-500/15 border-cyan-400/30 text-cyan-300',
                      monogram: 'N',
                    },
                    {
                      name: 'UDAY',
                      badge: 'Creative Director',
                      badgeIcon: '🎨',
                      role: 'Core Engineer & UI/UX',
                      tagline: 'Aesthetic Ergonomics · Kinetic UX',
                      border: 'border-fuchsia-500/30 hover:border-fuchsia-400/70',
                      glow: 'hover:shadow-[0_0_20px_rgba(217,70,239,0.2)]',
                      bgGradient: 'from-fuchsia-950/40 to-slate-900/60',
                      crestGradient: 'from-fuchsia-400 to-purple-600',
                      textGradient: 'from-fuchsia-300 via-pink-100 to-purple-400',
                      pillBg: 'bg-fuchsia-500/15 border-fuchsia-400/30 text-fuchsia-300',
                      monogram: 'U',
                    },
                    {
                      name: 'VARSHITH',
                      badge: 'Systems Specialist',
                      badgeIcon: '⚙️',
                      role: 'Systems & QA Specialist',
                      tagline: 'Multi-Device Resilience · Failover Sync',
                      border: 'border-amber-500/30 hover:border-amber-400/70',
                      glow: 'hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]',
                      bgGradient: 'from-amber-950/40 to-slate-900/60',
                      crestGradient: 'from-amber-400 to-orange-600',
                      textGradient: 'from-amber-300 via-yellow-100 to-orange-400',
                      pillBg: 'bg-amber-500/15 border-amber-400/30 text-amber-300',
                      monogram: 'V',
                    },
                  ].map((creator) => (
                    <div
                      key={creator.name}
                      className={`group p-3.5 rounded-xl border ${creator.border} ${creator.glow} bg-gradient-to-b ${creator.bgGradient} backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${creator.crestGradient} p-[1px] shadow-sm`}>
                          <div className="w-full h-full rounded-[7px] bg-[#0c0d1e] flex items-center justify-center font-black text-white text-xs tracking-wider">
                            {creator.monogram}
                          </div>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold border ${creator.pillBg}`}>
                          <span>{creator.badgeIcon}</span>
                          <span>{creator.badge}</span>
                        </span>
                      </div>
                      <div className={`font-black text-sm tracking-[0.2em] uppercase bg-gradient-to-r ${creator.textGradient} bg-clip-text text-transparent mb-0.5`}>
                        {creator.name}
                      </div>
                      <div className="text-[11px] font-medium text-gray-200 tracking-wide mb-1">
                        {creator.role}
                      </div>
                      <p className="text-[10px] text-gray-400 leading-snug line-clamp-1">
                        {creator.tagline}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-center gap-2 text-[10px] text-amber-300/80 tracking-wider">
                  <span>💎</span>
                  <span>CRAFTED WITH PRECISION & INTEGRITY</span>
                </div>
              </div>
            </div>
          );
        })()}

        <p className="text-center text-gray-600 text-xs mt-8">
          EduNet – Soft Skills Assessment · Conducted by Mr. Sainath
        </p>
      </div>
    </div>
  );
}
