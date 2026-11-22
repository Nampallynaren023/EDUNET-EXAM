'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ResultData {
  score: number;
  correct: number;
  incorrect: number;
  unanswered: number;
  total: number;
  studentName?: string;
}

function getPerformance(score: number) {
  if (score >= 45) return { label: 'Outstanding', emoji: '🏆', message: 'Exceptional performance! You are truly exam-ready.', color: '#fbbf24', gradient: 'linear-gradient(135deg, #fbbf24, #f59e0b)' };
  if (score >= 40) return { label: 'Excellent', emoji: '🌟', message: 'Great work! You have strong professional skills.', color: '#22d3ee', gradient: 'linear-gradient(135deg, #22d3ee, #3b82f6)' };
  if (score >= 35) return { label: 'Very Good', emoji: '👍', message: "Well done! You're on the right track.", color: '#34d399', gradient: 'linear-gradient(135deg, #34d399, #10b981)' };
  if (score >= 30) return { label: 'Good', emoji: '😊', message: 'Good effort! Keep building your skills.', color: '#a78bfa', gradient: 'linear-gradient(135deg, #a78bfa, #8b5cf6)' };
  if (score >= 20) return { label: 'Average', emoji: '📚', message: "You're making progress. Keep practicing!", color: '#60a5fa', gradient: 'linear-gradient(135deg, #60a5fa, #3b82f6)' };
  if (score >= 10) return { label: 'Below Average', emoji: '💪', message: "Don't give up! Every expert was once a beginner.", color: '#fb923c', gradient: 'linear-gradient(135deg, #fb923c, #f97316)' };
  return { label: 'Needs Improvement', emoji: '🌱', message: 'This is just the beginning of your journey. Keep going!', color: '#f87171', gradient: 'linear-gradient(135deg, #f87171, #ef4444)' };
}

export default function ResultPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.sessionId as string;

  const [result, setResult] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!sessionId) return;

    const fetchResult = async () => {
      try {
        const res = await fetch('/api/session/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });
        const data = await res.json();
        let studentName = '';
        try {
          studentName = localStorage.getItem('edunet_student') || sessionStorage.getItem('edunet_student') || '';
        } catch {}
        setResult({
          score: data.score ?? 0,
          correct: data.correct ?? 0,
          incorrect: data.incorrect ?? 0,
          unanswered: data.unanswered ?? 0,
          total: 50,
          studentName,
        });
      } catch {
        setResult({ score: 0, correct: 0, incorrect: 0, unanswered: 0, total: 50 });
      }
      setLoading(false);
    };

    fetchResult();
  }, [sessionId]);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a1a' }}>
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">📊</div>
          <p className="text-cyan-400">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a1a' }}>
        <p className="text-red-400">Unable to load results. Please contact administrator.</p>
      </div>
    );
  }

  const perf = getPerformance(result.score);
  const percentage = ((result.score / 50) * 100).toFixed(1);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center py-12 px-4" style={{ background: '#0a0a1a' }}>
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10 animate-floatSlow" style={{ background: `radial-gradient(circle, ${perf.color}, transparent)` }} />

      <div className="relative z-10 w-full max-w-2xl">
        {/* Header */}
        <div className={`text-center mb-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 border border-cyan-500/30" style={{ background: 'rgba(6,182,212,0.1)' }}>
            <span className="text-cyan-400 text-sm font-medium tracking-widest uppercase">✦ Exam Complete</span>
          </div>
          {result.studentName && (
            <p className="text-gray-400 text-lg">Well done, <span className="text-white font-semibold">{result.studentName}</span>!</p>
          )}
        </div>

        {/* Score Card */}
        <div className={`glass-card p-8 md:p-10 text-center mb-6 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '100ms', borderColor: `${perf.color}33` }}>
          <div className="text-7xl mb-4">{perf.emoji}</div>
          <div className="text-5xl md:text-7xl font-black mb-2" style={{ background: perf.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            {result.score}/50
          </div>
          <div className="text-2xl font-bold mb-2" style={{ color: perf.color }}>{perf.label}</div>
          <div className="text-gray-400 text-lg mb-4">{percentage}% Score</div>
          <div className="text-white text-base leading-relaxed px-4 py-3 rounded-xl" style={{ background: `${perf.color}15`, border: `1px solid ${perf.color}30` }}>
            {perf.message}
          </div>
        </div>

        {/* Stats Grid */}
        <div className={`grid grid-cols-3 gap-4 mb-6 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '200ms' }}>
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-black text-green-400 mb-1">{result.correct}</div>
            <div className="text-gray-400 text-xs uppercase tracking-wider">Correct</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-black text-red-400 mb-1">{result.incorrect}</div>
            <div className="text-gray-400 text-xs uppercase tracking-wider">Incorrect</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-black text-gray-400 mb-1">{result.unanswered}</div>
            <div className="text-gray-400 text-xs uppercase tracking-wider">Unanswered</div>
          </div>
        </div>

        {/* Footer message */}
        <div className={`text-center transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '300ms' }}>
          <div className="glass-card p-4 mb-6">
            <p className="text-gray-400 text-sm">📋 Your results have been recorded. The administrator will share detailed feedback.</p>
          </div>

          {/* Creators Appreciation Card - Unique Classic & Attractive Tribute */}
          <div className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-amber-500/30 bg-gradient-to-b from-[#15162c] via-[#0d0e22] to-[#0a0a18] p-6 md:p-8 text-center shadow-[0_0_50px_rgba(245,158,11,0.12)] mb-6">
            {/* Ambient Lighting Accents */}
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-72 h-36 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Crest Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 mb-3 shadow-[0_0_15px_rgba(251,191,36,0.2)]">
              <span className="text-amber-400 text-xs">✦</span>
              <span className="text-[11px] font-bold tracking-[0.22em] uppercase text-amber-300">
                Honorary Tribute · The Masterminds
              </span>
              <span className="text-amber-400 text-xs">✦</span>
            </div>

            <h3 className="text-xl md:text-2xl font-black text-white tracking-wide mb-2">
              Heartfelt Gratitude to the Creators
            </h3>

            <p className="text-gray-300/80 text-xs md:text-sm max-w-lg mx-auto mb-6 leading-relaxed font-light">
              This intelligent examination platform was architected, crafted, and engineered with exceptional vision and dedication by:
            </p>

            {/* Distinctive Classic Creator Triptych Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              {[
                {
                  name: 'NAREN',
                  badge: 'Lead Architect',
                  badgeIcon: '⚡',
                  role: 'Architect & Lead Dev',
                  tagline: 'High-Concurrency Engine · Platform Architecture · Data Integrity',
                  border: 'border-cyan-500/30 hover:border-cyan-400/70',
                  glow: 'hover:shadow-[0_0_25px_rgba(34,211,238,0.25)]',
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
                  tagline: 'Aesthetic Ergonomics · Kinetic Experience · Responsive Design',
                  border: 'border-fuchsia-500/30 hover:border-fuchsia-400/70',
                  glow: 'hover:shadow-[0_0_25px_rgba(217,70,239,0.25)]',
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
                  tagline: 'Multi-Device Resilience · Failover Sync · Quality Benchmark',
                  border: 'border-amber-500/30 hover:border-amber-400/70',
                  glow: 'hover:shadow-[0_0_25px_rgba(245,158,11,0.25)]',
                  bgGradient: 'from-amber-950/40 to-slate-900/60',
                  crestGradient: 'from-amber-400 to-orange-600',
                  textGradient: 'from-amber-300 via-yellow-100 to-orange-400',
                  pillBg: 'bg-amber-500/15 border-amber-400/30 text-amber-300',
                  monogram: 'V',
                },
              ].map((creator) => (
                <div
                  key={creator.name}
                  className={`group relative p-4 md:p-5 rounded-2xl border ${creator.border} ${creator.glow} bg-gradient-to-b ${creator.bgGradient} backdrop-blur-md transition-all duration-300 hover:-translate-y-1`}
                >
                  {/* Top Row: Monogram Insignia & Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${creator.crestGradient} p-[1.5px] shadow-md`}>
                      <div className="w-full h-full rounded-[10px] bg-[#0c0d1e] flex items-center justify-center font-black text-white text-base tracking-wider group-hover:scale-105 transition-transform">
                        {creator.monogram}
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide border ${creator.pillBg}`}>
                      <span>{creator.badgeIcon}</span>
                      <span>{creator.badge}</span>
                    </span>
                  </div>

                  {/* Creator Name Styled in Unique Classic Luxury */}
                  <div className={`font-black text-lg md:text-xl tracking-[0.22em] uppercase bg-gradient-to-r ${creator.textGradient} bg-clip-text text-transparent drop-shadow-sm mb-1`}>
                    {creator.name}
                  </div>

                  {/* Role Title */}
                  <div className="text-xs font-semibold text-gray-200 tracking-wide mb-2">
                    {creator.role}
                  </div>

                  {/* Tagline / Contribution */}
                  <p className="text-[11px] text-gray-400 leading-snug line-clamp-2">
                    {creator.tagline}
                  </p>
                </div>
              ))}
            </div>

            {/* Classic Bottom Ribbon */}
            <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-amber-300/90 font-medium tracking-wider text-[11px]">
                <span>💎</span>
                <span>CRAFTED WITH PRECISION & INTEGRITY</span>
              </div>
              <p className="text-[11px] text-gray-400 italic">
                &ldquo;Empowering students through modern, fair, and high-performance skill assessment.&rdquo;
              </p>
            </div>
          </div>

          <p className="text-gray-600 text-xs">
            EduNet – Soft Skills Department · Conducted by Mr. Sainath
          </p>
        </div>
      </div>
    </div>
  );
}
