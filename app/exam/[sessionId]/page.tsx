'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useRef, useState, useCallback } from 'react';

interface QuestionData {
  questionIndex: number;
  totalQuestions: number;
  section: string;
  sectionName: string;
  topic: string;
  questionId: string;
  questionText: string;
  options: Array<{ id: string; text: string }>;
  studentName: string;
  rollNumber: string;
  currentQuestionIndex: number;
}

const QUESTION_TIME = 26; // Exactly 26 seconds per question

export default function ExamPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.sessionId as string;

  const [question, setQuestion] = useState<QuestionData | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [warnings, setWarnings] = useState(0);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  const [mounted, setMounted] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const submittedRef = useRef(false);
  const selectedAnswerRef = useRef<string | null>(null);
  const questionRef = useRef<QuestionData | null>(null);
  const currentIndexRef = useRef(0);

  useEffect(() => {
    selectedAnswerRef.current = selectedAnswer;
  }, [selectedAnswer]);

  useEffect(() => {
    questionRef.current = question;
  }, [question]);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  const submitExam = useCallback(async () => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setSubmitting(true);
    if (timerRef.current) clearInterval(timerRef.current);
    try {
      if (selectedAnswerRef.current !== null && questionRef.current) {
        await fetch('/api/session/answer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            questionIndex: questionRef.current.questionIndex,
            selectedAnswer: selectedAnswerRef.current,
          }),
        });
      }
      await fetch('/api/session/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });
      router.push(`/result/${sessionId}`);
    } catch {
      router.push(`/result/${sessionId}`);
    }
  }, [sessionId, router]);

  // Start exam session
  const startExam = useCallback(async () => {
    try {
      await fetch('/api/session/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });
    } catch {}
    setExamStarted(true);
  }, [sessionId]);

  // Fetch question
  const fetchQuestion = useCallback(async (index: number) => {
    setLoading(true);
    setSelectedAnswer(null);
    setError('');
    setTimeLeft(QUESTION_TIME);
    try {
      const res = await fetch(`/api/session/question?sessionId=${sessionId}&index=${index}`);
      if (res.status === 403) {
        setError('Session invalid. The exam may have been closed.');
        setLoading(false);
        return;
      }
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || 'Failed to load question.');
        setLoading(false);
        return;
      }
      const data = await res.json();
      setQuestion(data);
      setCurrentIndex(index);
      setTimeLeft(QUESTION_TIME);
    } catch {
      setError('Network error. Please refresh.');
    }
    setLoading(false);
  }, [sessionId]);

  const handleNext = useCallback(async () => {
    const curQ = questionRef.current;
    const curAns = selectedAnswerRef.current;
    const curIdx = currentIndexRef.current;

    if (curQ) {
      try {
        await fetch('/api/session/answer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            questionIndex: curQ.questionIndex,
            selectedAnswer: curAns,
          }),
        });
      } catch {}
    }

    const nextIndex = curIdx + 1;
    if (nextIndex >= 50) {
      await submitExam();
    } else {
      await fetchQuestion(nextIndex);
    }
  }, [sessionId, submitExam, fetchQuestion]);

  // Initialize
  useEffect(() => {
    setMounted(true);
    if (!sessionId) return;

    const init = async () => {
      await startExam();
      await fetchQuestion(0);
    };
    init();
  }, [sessionId, startExam, fetchQuestion]);

  // 26-second countdown timer for each individual question
  useEffect(() => {
    if (!examStarted || submitting || loading) return;

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // 26 seconds up! Auto-advance to the next question
          handleNext();
          return QUESTION_TIME;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [examStarted, submitting, loading, currentIndex, handleNext]);

  // Tab visibility security
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && examStarted && !submitting) {
        setWarnings((prev) => {
          const next = prev + 1;
          if (next >= 5) {
            submitExam();
          } else if (next >= 2) {
            setShowWarningModal(true);
          }
          return next;
        });
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [examStarted, submitting, submitExam]);

  const isUrgent = timeLeft <= 6;
  const overallProgress = (currentIndex / 50) * 100;
  const questionTimePercent = (timeLeft / QUESTION_TIME) * 100;

  if (!mounted) return null;

  if (submitting) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a1a' }}>
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">📤</div>
          <h2 className="text-2xl font-bold text-cyan-400 mb-2">Submitting Your Exam...</h2>
          <p className="text-gray-400">Please wait, do not close this page.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#0a0a1a' }}>
        <div className="text-center glass-card p-8 max-w-md">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-red-400 mb-3">Error</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button onClick={() => fetchQuestion(currentIndex)} className="px-6 py-3 rounded-xl font-semibold text-white cursor-pointer" style={{ background: 'linear-gradient(135deg, #22d3ee, #3b82f6)' }}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (loading || !question) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a1a' }}>
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">⏳</div>
          <p className="text-cyan-400">Loading question {currentIndex + 1}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0a0a1a' }}>
      <div className="absolute inset-0 bg-grid opacity-30" />

      {/* Warning Modal */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="glass-card p-8 max-w-sm mx-4 text-center border border-yellow-500/40">
            <div className="text-5xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-yellow-400 mb-3">Warning!</h3>
            <p className="text-gray-300 mb-2">Tab switching detected! ({warnings}/5)</p>
            <p className="text-gray-400 text-sm mb-6">Your exam will be auto-submitted after 5 violations.</p>
            <button onClick={() => setShowWarningModal(false)} className="px-6 py-3 rounded-xl font-semibold text-white cursor-pointer" style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}>
              I Understand — Continue
            </button>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <div className="relative z-10 sticky top-0 border-b border-white/5" style={{ background: 'rgba(10,10,26,0.95)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div>
            <div className="text-cyan-400 font-bold text-sm">{question.studentName}</div>
            <div className="text-gray-500 text-xs">{question.rollNumber}</div>
          </div>

          {/* Overall Exam Progress */}
          <div className="flex-1 max-w-xs">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Question {currentIndex + 1} of 50</span>
              <span>{Math.round(overallProgress)}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/10">
              <div className="h-2 rounded-full transition-all duration-300" style={{ width: `${overallProgress}%`, background: 'linear-gradient(90deg, #22d3ee, #3b82f6)' }} />
            </div>
          </div>

          {/* 26s Per-Question Countdown Timer Badge */}
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-wider text-gray-400">Time Left</div>
              <div
                className={`text-2xl font-black font-mono transition-colors duration-200 ${
                  isUrgent ? 'text-red-400 animate-pulse' : 'text-cyan-400'
                }`}
              >
                {timeLeft}s
              </div>
            </div>
          </div>
        </div>

        {/* 26-second progress bar underneath top header */}
        <div className="w-full h-1 bg-white/5">
          <div
            className="h-full transition-all duration-1000 ease-linear"
            style={{
              width: `${questionTimePercent}%`,
              background: isUrgent ? '#ef4444' : 'linear-gradient(90deg, #22d3ee, #3b82f6)',
            }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 py-8">
        {/* Section Badge & Question Timer reminder */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border border-cyan-500/30" style={{ background: 'rgba(6,182,212,0.1)', color: '#22d3ee' }}>
              {question.sectionName}
            </span>
            <span className="text-gray-500 text-xs">{question.topic}</span>
          </div>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            ⏱️ 26s per question
          </span>
        </div>

        {/* Question */}
        <div className="glass-card p-6 md:p-8 mb-6">
          <div className="flex gap-3 items-start">
            <span className="text-cyan-400 font-black text-xl min-w-[2rem]">{currentIndex + 1}.</span>
            <p className="text-white text-lg leading-relaxed font-medium">{question.questionText}</p>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-8">
          {question.options.map((opt) => {
            const isSelected = selectedAnswer === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setSelectedAnswer(opt.id)}
                className="w-full text-left p-4 md:p-5 rounded-xl border transition-all duration-200 cursor-pointer"
                style={{
                  background: isSelected ? 'rgba(34,211,238,0.15)' : 'rgba(255,255,255,0.03)',
                  borderColor: isSelected ? 'rgba(34,211,238,0.6)' : 'rgba(255,255,255,0.08)',
                  transform: isSelected ? 'scale(1.01)' : 'scale(1)',
                  boxShadow: isSelected ? '0 0 20px rgba(34,211,238,0.15)' : 'none',
                }}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 transition-all ${
                      isSelected ? 'text-white' : 'text-gray-400'
                    }`}
                    style={{
                      background: isSelected ? 'linear-gradient(135deg, #22d3ee, #3b82f6)' : 'rgba(255,255,255,0.08)',
                    }}
                  >
                    {opt.id.toUpperCase()}
                  </span>
                  <span className={`text-sm md:text-base leading-relaxed ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                    {opt.text}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <div className="text-gray-500 text-sm">
            {selectedAnswer ? '✓ Answer selected' : 'Auto-advances when 26s expires'}
          </div>
          <button
            onClick={handleNext}
            className="px-8 py-3 rounded-xl font-bold text-white cursor-pointer transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #22d3ee, #3b82f6)',
              boxShadow: '0 0 20px rgba(34,211,238,0.2)',
            }}
          >
            {currentIndex >= 49 ? '🏁 Submit Exam' : 'Next Question →'}
          </button>
        </div>
      </div>
    </div>
  );
}
