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
  savedAnswer?: string | null;
  studentName: string;
  rollNumber: string;
  currentQuestionIndex: number;
}

const QUESTION_TIME = 26; // Exactly 26 seconds per question

// Safe storage helper with fallback for Safari Private Mode / blocked storage
const safeStorage = {
  get: (key: string): string | null => {
    try {
      return localStorage.getItem(key) || sessionStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set: (key: string, value: string) => {
    try { localStorage.setItem(key, value); } catch {}
    try { sessionStorage.setItem(key, value); } catch {}
  },
  remove: (key: string) => {
    try { localStorage.removeItem(key); } catch {}
    try { sessionStorage.removeItem(key); } catch {}
  },
};

// Automatic retry helper with exponential backoff for mobile network resilience
async function fetchWithRetry(url: string, options: RequestInit = {}, maxRetries = 3): Promise<Response> {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      const res = await fetch(url, options);
      // Return immediately on client-handled status codes
      if (res.ok || res.status === 403 || res.status === 404 || res.status === 409 || res.status === 400) {
        return res;
      }
      throw new Error(`Server status ${res.status}`);
    } catch (err) {
      attempt++;
      if (attempt >= maxRetries) throw err;
      await new Promise((r) => setTimeout(r, attempt * 600));
    }
  }
  throw new Error('Network request failed');
}

export default function ExamPage() {
  const router = useRouter();
  const params = useParams();
  const sessionId = ((params.sessionId as string) || '').trim();

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
  const [isOnline, setIsOnline] = useState(true);
  const [reconnecting, setReconnecting] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const submittedRef = useRef(false);
  const selectedAnswerRef = useRef<string | null>(null);
  const questionRef = useRef<QuestionData | null>(null);
  const currentIndexRef = useRef(0);
  const allAnswersRef = useRef<Record<number, string | null>>({});
  const questionEndTimeRef = useRef<number>(0);
  const isAdvancingRef = useRef(false);
  const hiddenStartTimeRef = useRef<number | null>(null);
  const pendingAnswerQueue = useRef<Array<{ index: number; answer: string | null }>>([]);
  const questionsCacheRef = useRef<Record<number, QuestionData>>({});

  // Flush queued offline answers
  const flushAnswerQueue = useCallback(async () => {
    if (pendingAnswerQueue.current.length === 0 || !sessionId) return;
    const queue = [...pendingAnswerQueue.current];
    pendingAnswerQueue.current = [];
    for (const item of queue) {
      try {
        await fetchWithRetry('/api/session/answer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            questionIndex: item.index,
            selectedAnswer: item.answer,
          }),
        }, 2);
      } catch {
        // Re-queue if still failing
        pendingAnswerQueue.current.push(item);
      }
    }
  }, [sessionId]);

  // Background preload all 50 questions for instant 0ms transitions
  const preloadAllQuestions = useCallback(async () => {
    if (!sessionId) return;
    try {
      const res = await fetchWithRetry(`/api/session/question?sessionId=${sessionId}&index=all`, {}, 2);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.questions)) {
          data.questions.forEach((q: QuestionData) => {
            questionsCacheRef.current[q.questionIndex] = q;
          });
        }
      }
    } catch {
      // Non-fatal, single-question fallback remains active
    }
  }, [sessionId]);

  // Network online/offline event listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setReconnecting(false);
      // Flush any queued offline answers
      flushAnswerQueue();
    };
    const handleOffline = () => {
      setIsOnline(false);
    };

    setIsOnline(typeof navigator !== 'undefined' ? navigator.onLine : true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [flushAnswerQueue]);

  // Final Exam Submission (bulletproof with full answer payload)
  const submitExam = useCallback(async () => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setSubmitting(true);
    if (timerRef.current) clearInterval(timerRef.current);

    // Save final selected answer if present
    if (selectedAnswerRef.current !== null && questionRef.current) {
      allAnswersRef.current[questionRef.current.questionIndex] = selectedAnswerRef.current;
    }

    try {
      await fetchWithRetry('/api/session/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          answers: allAnswersRef.current,
        }),
      }, 4);
      // Clear session progress
      safeStorage.remove(`edunet_last_q_${sessionId}`);
      router.push(`/result/${sessionId}`);
    } catch {
      // Even if network drops on final click, redirect to result (result page auto-syncs)
      router.push(`/result/${sessionId}`);
    }
  }, [sessionId, router]);

  // Fetch question with retry and resume support
  const fetchQuestion = useCallback(async (index: number) => {
    // If question is already in memory cache, display it instantly with 0ms delay!
    const cachedQ = questionsCacheRef.current[index];
    if (cachedQ) {
      setQuestion(cachedQ);
      setCurrentIndex(index);
      currentIndexRef.current = index;
      safeStorage.set(`edunet_last_q_${sessionId}`, String(index));
      const existingAnswer = allAnswersRef.current[index] !== undefined ? allAnswersRef.current[index] : (cachedQ.savedAnswer ?? null);
      setSelectedAnswer(existingAnswer);
      selectedAnswerRef.current = existingAnswer;
      questionEndTimeRef.current = Date.now() + QUESTION_TIME * 1000;
      setTimeLeft(QUESTION_TIME);
      setLoading(false);
      isAdvancingRef.current = false;
      return;
    }

    setLoading(true);
    setError('');
    isAdvancingRef.current = false;

    // Check if we already have an answer cached locally
    const existingCached = allAnswersRef.current[index];
    setSelectedAnswer(existingCached !== undefined ? existingCached : null);

    try {
      const res = await fetchWithRetry(`/api/session/question?sessionId=${sessionId}&index=${index}`, {}, 3);
      
      if (res.status === 403) {
        const d = await res.json().catch(() => ({}));
        if (d.status === 'submitted') {
          router.push(`/result/${sessionId}`);
          return;
        }
        setError('Session closed. The exam may have already been submitted.');
        setLoading(false);
        return;
      }

      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError(d.error || 'Failed to load question. Tap Try Again.');
        setLoading(false);
        return;
      }

      const data: QuestionData = await res.json();
      questionsCacheRef.current[index] = data; // Cache in memory
      setQuestion(data);
      setCurrentIndex(index);
      currentIndexRef.current = index;
      safeStorage.set(`edunet_last_q_${sessionId}`, String(index));

      // Prefer local cached answer, fallback to server savedAnswer
      if (allAnswersRef.current[index] !== undefined && allAnswersRef.current[index] !== null) {
        setSelectedAnswer(allAnswersRef.current[index]);
      } else if (data.savedAnswer) {
        setSelectedAnswer(data.savedAnswer);
        allAnswersRef.current[index] = data.savedAnswer;
      } else {
        setSelectedAnswer(null);
      }

      // Reset wall-clock timer for exactly 26 seconds
      questionEndTimeRef.current = Date.now() + QUESTION_TIME * 1000;
      setTimeLeft(QUESTION_TIME);
    } catch {
      setError('Network connection error. Please tap Try Again.');
    }
    setLoading(false);
  }, [sessionId, router]);

  // Advance to Next Question - Instant 0ms transition with background sync
  const handleNext = useCallback(async () => {
    if (isAdvancingRef.current) return;
    isAdvancingRef.current = true;

    const curQ = questionRef.current;
    const curAns = selectedAnswerRef.current;
    const curIdx = currentIndexRef.current;

    if (curQ) {
      allAnswersRef.current[curQ.questionIndex] = curAns;
      safeStorage.set(`edunet_ans_${sessionId}`, JSON.stringify(allAnswersRef.current));

      // Asynchronous non-blocking background save to backend
      fetch('/api/session/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          questionIndex: curQ.questionIndex,
          selectedAnswer: curAns,
        }),
      }).catch(() => {
        // Queue for background retry if cellular network glitched
        pendingAnswerQueue.current.push({ index: curQ.questionIndex, answer: curAns });
      });
    }

    const nextIndex = curIdx + 1;
    if (nextIndex >= 50) {
      await submitExam();
      return;
    }

    // Instant 0ms switch if already preloaded
    const nextCached = questionsCacheRef.current[nextIndex];
    if (nextCached) {
      setQuestion(nextCached);
      setCurrentIndex(nextIndex);
      currentIndexRef.current = nextIndex;
      safeStorage.set(`edunet_last_q_${sessionId}`, String(nextIndex));

      const existingAns = allAnswersRef.current[nextIndex] !== undefined ? allAnswersRef.current[nextIndex] : (nextCached.savedAnswer ?? null);
      setSelectedAnswer(existingAns);
      selectedAnswerRef.current = existingAns;

      // Reset wall-clock timer for exactly 26 seconds
      questionEndTimeRef.current = Date.now() + QUESTION_TIME * 1000;
      setTimeLeft(QUESTION_TIME);
      isAdvancingRef.current = false;
      return;
    }

    // Fallback if network batch preload was still in-flight
    await fetchQuestion(nextIndex);
  }, [sessionId, submitExam, fetchQuestion]);

  // Start exam session & resume last question
  const startExamAndResume = useCallback(async () => {
    try {
      // Trigger background preload of all 50 questions immediately
      preloadAllQuestions();

      const res = await fetchWithRetry('/api/session/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      }, 3);

      const data = await res.json().catch(() => ({}));

      if (data.alreadySubmitted) {
        router.push(`/result/${sessionId}`);
        return;
      }

      // Determine starting question: check server progress vs local storage progress
      const localLastQStr = safeStorage.get(`edunet_last_q_${sessionId}`);
      const localLastQ = localLastQStr ? parseInt(localLastQStr, 10) : 0;
      const serverQ = typeof data.currentQuestionIndex === 'number' ? data.currentQuestionIndex : 0;
      const resumeIndex = Math.min(49, Math.max(0, isNaN(localLastQ) ? 0 : localLastQ, serverQ));

      setExamStarted(true);
      await fetchQuestion(resumeIndex);
    } catch {
      // If start failed, attempt to load question 0 directly
      setExamStarted(true);
      await fetchQuestion(0);
    }
  }, [sessionId, router, fetchQuestion, preloadAllQuestions]);

  // Initialize
  useEffect(() => {
    setMounted(true);
    if (!sessionId) return;
    startExamAndResume();
  }, [sessionId, startExamAndResume]);

  // Wall-Clock High-Precision Timer (Resistant to mobile screen sleep and tab throttling)
  useEffect(() => {
    if (!examStarted || submitting || loading) return;

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      const now = Date.now();
      const remainingMs = questionEndTimeRef.current - now;
      const remainingSeconds = Math.max(0, Math.ceil(remainingMs / 1000));

      setTimeLeft(remainingSeconds);

      if (remainingSeconds <= 0 && !isAdvancingRef.current) {
        handleNext();
      }
    }, 250);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [examStarted, submitting, loading, currentIndex, handleNext]);

  // Smart Mobile Visibility & Tab Switching Detection
  // Avoids false triggers from brief notification pulls, screen dims, or keyboard popups
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        hiddenStartTimeRef.current = Date.now();
      } else {
        const awayDuration = Date.now() - (hiddenStartTimeRef.current || Date.now());
        hiddenStartTimeRef.current = null;

        // Only count as intentional violation if away for more than 3.5 seconds
        if (awayDuration >= 3500 && examStarted && !submitting) {
          setWarnings((prev) => {
            const next = prev + 1;
            if (next >= 6) {
              submitExam();
            } else if (next >= 2) {
              setShowWarningModal(true);
            }
            return next;
          });
        }
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
        <div className="text-center p-6">
          <div className="text-6xl mb-4 animate-bounce">📤</div>
          <h2 className="text-2xl font-bold text-cyan-400 mb-2">Submitting Your Exam...</h2>
          <p className="text-gray-400">Securing your answers, please do not close this window.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#0a0a1a' }}>
        <div className="text-center glass-card p-8 max-w-md w-full">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-red-400 mb-3">Notice</h2>
          <p className="text-gray-300 mb-6 leading-relaxed text-sm">{error}</p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => fetchQuestion(currentIndex)}
              className="w-full py-3 rounded-xl font-semibold text-white cursor-pointer transition-all duration-300 hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg, #22d3ee, #3b82f6)' }}
            >
              🔄 Try Again
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full py-2.5 rounded-xl font-semibold text-gray-400 hover:text-white border border-white/10 text-sm"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading || !question) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a1a' }}>
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">⏳</div>
          <p className="text-cyan-400 font-medium">Loading question {currentIndex + 1} of 50...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col select-none" style={{ background: '#0a0a1a' }}>
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

      {/* Network Connectivity Status Alert Banner */}
      {(!isOnline || reconnecting) && (
        <div className="relative z-50 bg-amber-500/90 text-black px-4 py-2 text-center text-xs font-bold tracking-wide flex items-center justify-center gap-2 animate-pulse">
          <span>⚡</span>
          <span>Connection unstable. Retrying automatically... Your answers are saved.</span>
        </div>
      )}

      {/* Warning Modal */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
          <div className="glass-card p-6 md:p-8 max-w-sm w-full text-center border border-yellow-500/40">
            <div className="text-5xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-yellow-400 mb-3">Focus Warning</h3>
            <p className="text-gray-300 text-sm mb-2">Switching apps or tabs is recorded ({warnings}/6 warnings).</p>
            <p className="text-gray-400 text-xs mb-6">Repeated tab switching will automatically finalize your examination.</p>
            <button
              onClick={() => setShowWarningModal(false)}
              className="w-full py-3 rounded-xl font-semibold text-white cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}
            >
              I Understand — Return to Exam
            </button>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <div className="relative z-10 sticky top-0 border-b border-white/5" style={{ background: 'rgba(10,10,26,0.95)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="text-cyan-400 font-bold text-sm truncate">{question.studentName}</div>
            <div className="text-gray-500 text-xs font-mono">{question.rollNumber}</div>
          </div>

          {/* Overall Exam Progress */}
          <div className="flex-1 max-w-xs px-2">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Question {currentIndex + 1}/50</span>
              <span>{Math.round(overallProgress)}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-2 rounded-full transition-all duration-300"
                style={{ width: `${overallProgress}%`, background: 'linear-gradient(90deg, #22d3ee, #3b82f6)' }}
              />
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
        <div className="w-full h-1 bg-white/5 overflow-hidden">
          <div
            className="h-full transition-all duration-200 ease-linear"
            style={{
              width: `${questionTimePercent}%`,
              background: isUrgent ? '#ef4444' : 'linear-gradient(90deg, #22d3ee, #3b82f6)',
            }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 py-6 md:py-8">
        {/* Section Badge & Question Timer reminder */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border border-cyan-500/30" style={{ background: 'rgba(6,182,212,0.1)', color: '#22d3ee' }}>
              {question.sectionName}
            </span>
            <span className="text-gray-500 text-xs">{question.topic}</span>
          </div>
          <span className="text-xs text-gray-400 flex items-center gap-1 font-mono">
            ⏱️ 26s per question
          </span>
        </div>

        {/* Question */}
        <div className="glass-card p-5 md:p-8 mb-6">
          <div className="flex gap-3 items-start">
            <span className="text-cyan-400 font-black text-lg md:text-xl min-w-[2rem]">{currentIndex + 1}.</span>
            <p className="text-white text-base md:text-lg leading-relaxed font-medium">{question.questionText}</p>
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
                className="w-full text-left p-4 md:p-5 rounded-xl border transition-all duration-200 cursor-pointer active:scale-[0.99]"
                style={{
                  background: isSelected ? 'rgba(34,211,238,0.15)' : 'rgba(255,255,255,0.03)',
                  borderColor: isSelected ? 'rgba(34,211,238,0.6)' : 'rgba(255,255,255,0.08)',
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
        <div className="flex items-center justify-between mt-auto pt-4">
          <div className="text-gray-500 text-xs md:text-sm">
            {selectedAnswer ? '✓ Answer recorded' : 'Auto-advances when timer ends'}
          </div>
          <button
            onClick={handleNext}
            className="px-6 md:px-8 py-3 rounded-xl font-bold text-white cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95"
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
