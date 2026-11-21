'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function RegisterPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [examEnabled, setExamEnabled] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    fullName: '',
    rollNumber: '',
    email: '',
    department: '',
  });

  useEffect(() => {
    setMounted(true);
    // Check exam status
    fetch('/api/admin/exam-status')
      .then((r) => r.json())
      .then((d) => setExamEnabled(d.enabled))
      .catch(() => setExamEnabled(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          rollNumber: form.rollNumber.trim().toUpperCase(),
          email: form.email.trim().toLowerCase(),
          department: form.department.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Registration failed. Please try again.');
        setLoading(false);
        return;
      }
      localStorage.setItem('edunet_session', data.sessionId);
      localStorage.setItem('edunet_student', data.studentName);
      router.push(`/exam/${data.sessionId}`);
    } catch {
      setError('Network error. Please check your connection and try again.');
      setLoading(false);
    }
  };

  if (!mounted || examEnabled === null) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a1a' }}>
        <div className="text-cyan-400 text-lg animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!examEnabled) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: '#0a0a1a' }}>
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="relative z-10 text-center max-w-md">
          <div className="text-6xl mb-6">🔒</div>
          <h1 className="text-3xl font-bold mb-4" style={{ background: 'linear-gradient(135deg, #22d3ee, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Exam Not Available
          </h1>
          <p className="text-gray-400 mb-8 text-lg leading-relaxed">
            The examination is currently not active. Please wait for your administrator to enable it, then refresh this page.
          </p>
          <button onClick={() => window.location.reload()} className="px-6 py-3 rounded-xl font-semibold text-white cursor-pointer transition-all duration-300 hover:scale-105" style={{ background: 'linear-gradient(135deg, #22d3ee, #3b82f6)' }}>
            🔄 Check Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center py-12 px-4" style={{ background: '#0a0a1a' }}>
      <div className="absolute inset-0 bg-grid opacity-50" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-15 animate-floatSlow" style={{ background: 'radial-gradient(circle, #22d3ee, #3b82f6)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-10 animate-floatSlow" style={{ background: 'radial-gradient(circle, #a855f7, #ec4899)', animationDelay: '-4s' }} />

      <div className="relative z-10 w-full max-w-lg">
        {/* Header */}
        <div className={`text-center mb-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <button onClick={() => router.push('/')} className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm mb-6 cursor-pointer transition-colors">
            ← Back to Home
          </button>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 border border-cyan-500/30" style={{ background: 'rgba(6, 182, 212, 0.1)' }}>
            <span className="text-cyan-400 text-sm font-medium tracking-widest uppercase">✦ Student Registration</span>
          </div>
          <h1 className="text-4xl font-black mb-2" style={{ background: 'linear-gradient(135deg, #22d3ee 0%, #3b82f6 50%, #a855f7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Register for Exam
          </h1>
          <p className="text-gray-400 text-sm">50 Questions · 26s per Question · Soft Skills Assessment</p>
        </div>

        {/* Form Card */}
        <div className={`glass-card p-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '100ms' }}>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
              <input
                type="text"
                required
                minLength={2}
                placeholder="Enter your full name"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 border border-white/10 focus:border-cyan-500/50 focus:outline-none transition-colors"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              />
            </div>

            {/* Roll Number */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Roll Number *</label>
              <input
                type="text"
                required
                placeholder="e.g. 21B81A05XX"
                value={form.rollNumber}
                onChange={(e) => setForm({ ...form, rollNumber: e.target.value.toUpperCase() })}
                className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 border border-white/10 focus:border-cyan-500/50 focus:outline-none transition-colors font-mono"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Address *</label>
              <input
                type="email"
                required
                placeholder="your.email@college.edu"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 border border-white/10 focus:border-cyan-500/50 focus:outline-none transition-colors"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              />
            </div>

            {/* Department — FREE TEXT */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Department *</label>
              <input
                type="text"
                required
                placeholder="e.g. Computer Science, ECE, Mechanical..."
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 border border-white/10 focus:border-cyan-500/50 focus:outline-none transition-colors"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              />
              <p className="text-xs text-gray-500 mt-1">Type your department name</p>
            </div>

            {/* Error */}
            {error && (
              <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
                ⚠️ {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl font-bold text-lg text-white cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
              style={{ background: loading ? 'rgba(34,211,238,0.4)' : 'linear-gradient(135deg, #22d3ee, #3b82f6)', boxShadow: '0 0 20px rgba(34, 211, 238, 0.2)' }}
            >
              {loading ? '⏳ Registering...' : '🚀 Start Examination'}
            </button>
          </form>

          {/* Warning */}
          <div className="mt-6 p-4 rounded-xl border border-yellow-500/20" style={{ background: 'rgba(234,179,8,0.05)' }}>
            <p className="text-yellow-400 text-xs font-medium mb-1">⚠️ Important Notes</p>
            <ul className="text-gray-400 text-xs space-y-1">
              <li>• Each Roll Number can only be used once</li>
              <li>• Do not close the browser during the exam</li>
              <li>• Switching tabs may flag your session</li>
              <li>• Ensure stable internet before starting</li>
            </ul>
          </div>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          EduNet – Soft Skills Department · Conducted by Mr. Sainath
        </p>
      </div>
    </div>
  );
}
