'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

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

function getPerformanceDetails(score: number) {
  if (score >= 45) return { label: 'Outstanding', emoji: '🏆', message: 'Exceptional performance! You are truly exam-ready.', color: '#fbbf24', gradient: 'linear-gradient(135deg, #fbbf24, #f59e0b)' };
  if (score >= 40) return { label: 'Excellent', emoji: '🌟', message: 'Great work! You have strong professional skills.', color: '#22d3ee', gradient: 'linear-gradient(135deg, #22d3ee, #3b82f6)' };
  if (score >= 35) return { label: 'Very Good', emoji: '👍', message: "Well done! You're on the right track.", color: '#34d399', gradient: 'linear-gradient(135deg, #34d399, #10b981)' };
  if (score >= 30) return { label: 'Good', emoji: '😊', message: 'Good effort! Keep building your skills.', color: '#a78bfa', gradient: 'linear-gradient(135deg, #a78bfa, #8b5cf6)' };
  if (score >= 20) return { label: 'Average', emoji: '📚', message: "You're making progress. Keep practicing!", color: '#60a5fa', gradient: 'linear-gradient(135deg, #60a5fa, #3b82f6)' };
  if (score >= 10) return { label: 'Below Average', emoji: '💪', message: "Don't give up! Every expert was once a beginner.", color: '#fb923c', gradient: 'linear-gradient(135deg, #fb923c, #f97316)' };
  return { label: 'Needs Improvement', emoji: '🌱', message: 'This is just the beginning of your journey. Keep going!', color: '#f87171', gradient: 'linear-gradient(135deg, #f87171, #ef4444)' };
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
          const perf = getPerformanceDetails(result.score);
          return (
            <div className="glass-card p-6 md:p-8 border animate-scale-in" style={{ borderColor: `${perf.color}40` }}>
              <div className="text-center mb-6">
                <div className="text-6xl mb-3 animate-success-bounce">{perf.emoji}</div>
                <div className="text-4xl md:text-5xl font-black mb-1" style={{ background: perf.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  {result.score}/50
                </div>
                <div className="text-xl font-bold mb-1" style={{ color: perf.color }}>{perf.label}</div>
                <div className="text-gray-400 text-sm mb-3">{result.percentage}% Overall Score</div>
                <div className="text-white text-sm px-4 py-2 rounded-xl inline-block" style={{ background: `${perf.color}15`, border: `1px solid ${perf.color}30` }}>
                  {perf.message}
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
