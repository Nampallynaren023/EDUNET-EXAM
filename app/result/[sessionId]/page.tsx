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
        const studentName = localStorage.getItem('edunet_student') || '';
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
          <p className="text-gray-600 text-xs">
            EduNet – Soft Skills Department · Conducted by Mr. Sainath
          </p>
        </div>
      </div>
    </div>
  );
}
