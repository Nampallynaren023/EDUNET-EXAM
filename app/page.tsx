'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LandingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = [
    { label: 'Questions', value: '50', icon: '📋' },
    { label: 'Marks', value: '50', icon: '🏆' },
    { label: 'Per Question', value: '26s', icon: '⏱️' },
    { label: 'Target', value: 'B.Tech 3rd Year', icon: '🎓' },
  ];

  return (
    <div
      className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center"
      style={{ background: '#0a0a1a' }}
    >
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-grid opacity-50" />

      {/* Floating orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 animate-floatSlow"
        style={{
          background: 'radial-gradient(circle, #22d3ee, #3b82f6)',
          animationDelay: '0s',
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-15 animate-floatSlow"
        style={{
          background: 'radial-gradient(circle, #a855f7, #ec4899)',
          animationDelay: '-4s',
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full blur-3xl opacity-10 animate-floatSlow"
        style={{
          background: 'radial-gradient(circle, #3b82f6, #22d3ee)',
          animationDelay: '-2s',
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Top Navigation Bar with Clear Options */}
      <header className="absolute top-0 left-0 right-0 z-30 px-4 sm:px-8 py-4 flex items-center justify-between border-b border-white/10 backdrop-blur-md" style={{ background: 'rgba(10,10,26,0.7)' }}>
        <div className="flex items-center gap-3">
          <span className="text-xl sm:text-2xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            EduNet
          </span>
          <span className="text-gray-400 text-xs hidden md:inline border-l border-white/10 pl-3">
            Soft Skills Assessment Platform
          </span>
        </div>

        <nav className="flex items-center gap-1 sm:gap-3">
          <button
            onClick={() => router.push('/')}
            className="text-xs sm:text-sm text-cyan-400 font-semibold px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            🏠 Home
          </button>
          <button
            onClick={() => router.push('/register')}
            className="text-xs sm:text-sm text-gray-300 hover:text-white font-medium px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            📝 Student Examination
          </button>
          <button
            onClick={() => router.push('/check-result')}
            className="text-xs sm:text-sm text-gray-300 hover:text-white font-medium px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer hidden sm:inline-block"
          >
            🔍 Check Result
          </button>
          <button
            onClick={() => router.push('/admin')}
            className="text-xs sm:text-sm text-white font-bold px-3 py-1.5 rounded-lg border border-cyan-500/40 bg-cyan-500/15 hover:bg-cyan-500/25 transition-all cursor-pointer shadow-sm"
          >
            🔐 Admin Login
          </button>
        </nav>
      </header>

      {/* Decorative corner elements */}
      <div className="absolute top-8 left-8 w-24 h-24 border border-cyan-500/20 rounded-lg animate-float" style={{ animationDelay: '0s' }} />
      <div className="absolute top-12 left-12 w-16 h-16 border border-cyan-500/10 rounded-lg animate-float" style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-8 right-8 w-24 h-24 border border-purple-500/20 rounded-lg animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-12 right-12 w-16 h-16 border border-purple-500/10 rounded-lg animate-float" style={{ animationDelay: '1.5s' }} />

      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Logo badge */}
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 border border-cyan-500/30 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{
            background: 'rgba(6, 182, 212, 0.1)',
            transitionDelay: '0ms',
          }}
        >
          <span className="text-cyan-400 text-sm font-medium tracking-widest uppercase">
            ✦ EduNet Platform
          </span>
        </div>

        {/* Main title */}
        <div
          className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionDelay: '100ms' }}
        >
          <h1
            className="text-7xl md:text-9xl font-black tracking-tighter mb-2 leading-none"
            style={{
              fontFamily: 'var(--font-space-grotesk)',
              background: 'linear-gradient(135deg, #22d3ee 0%, #3b82f6 50%, #a855f7 100%)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            EDUNET
          </h1>
        </div>

        {/* Subtitle */}
        <div
          className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionDelay: '200ms' }}
        >
          <h2
            className="text-xl md:text-2xl font-semibold tracking-[0.3em] text-cyan-400 uppercase mb-4"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            Smart Soft Skills Assessment
          </h2>
        </div>

        {/* Tagline */}
        <div
          className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionDelay: '300ms' }}
        >
          <p className="text-gray-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
            Evaluate Your Professional Readiness
          </p>
        </div>

        {/* Stats */}
        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionDelay: '400ms' }}
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              className="glass-card glass-card-hover p-4 md:p-6 text-center"
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div
                className="text-2xl md:text-3xl font-bold mb-1"
                style={{
                  background: 'linear-gradient(135deg, #22d3ee, #3b82f6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontFamily: 'var(--font-space-grotesk)',
                }}
              >
                {stat.value}
              </div>
              <div className="text-gray-400 text-xs md:text-sm font-medium uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionDelay: '500ms' }}
        >
          <button
            onClick={() => router.push('/register')}
            className="relative group inline-flex items-center gap-3 px-9 py-4 rounded-2xl text-white font-bold text-lg tracking-wide overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, #22d3ee, #3b82f6)',
              boxShadow: '0 0 30px rgba(34, 211, 238, 0.3)',
              fontFamily: 'var(--font-space-grotesk)',
            }}
          >
            <span>START EXAMINATION</span>
            <span className="text-xl transition-transform duration-300 group-hover:translate-x-1">→</span>
          </button>

          <button
            onClick={() => router.push('/check-result')}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-cyan-400 font-bold text-lg border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-500/10 transition-all duration-300 cursor-pointer backdrop-blur-sm"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            <span>🔍 CHECK RESULT</span>
          </button>
        </div>

        {/* Workflows Overview */}
        <div
          className={`mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 text-left transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionDelay: '550ms' }}
        >
          {/* Student Workflow */}
          <div className="glass-card p-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5">
            <div className="flex items-center gap-2 mb-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
              <span>🎓</span>
              <span>Student Examination Workflow</span>
            </div>
            <p className="text-gray-300 text-xs leading-relaxed">
              Open Website → Enter Student Details → Read Instructions → Start Exam (50 Questions) → Submit Exam → View Instant Personal Result Card & Meme Dialogue.
            </p>
          </div>

          {/* Admin Workflow */}
          <div className="glass-card p-4 rounded-xl border border-purple-500/20 bg-purple-500/5">
            <div className="flex items-center gap-2 mb-2 text-purple-400 font-bold text-xs uppercase tracking-wider">
              <span>🔐</span>
              <span>Administrator Workflow</span>
            </div>
            <p className="text-gray-300 text-xs leading-relaxed">
              Open Website → Click Admin Login → Authenticate Credentials → Access Admin Dashboard → Real-Time Analytics, Student Filtering & Excel/CSV Exports.
            </p>
          </div>
        </div>

        {/* Info pill */}
        <div
          className={`mt-6 mb-16 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionDelay: '600ms' }}
        >
          <p className="text-gray-500 text-xs">
            ⚡ High-performance engine enabled · Wall-clock precision timer · Multi-device resilience
          </p>
        </div>
      </div>

      {/* Footer */}
      <div
        className={`relative z-10 py-6 text-center border-t border-white/5 transition-all duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}
        style={{ transitionDelay: '700ms' }}
      >
        <p className="text-gray-500 text-sm">
          Examination Conducted by{' '}
          <span className="text-cyan-400 font-semibold">Mr. Sainath</span>
          {' '}|{' '}
          <span className="text-purple-400">EduNet – Soft Skills Department</span>
        </p>
      </div>
    </div>
  );
}
