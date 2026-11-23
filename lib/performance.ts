export interface PerformanceTier {
  minScore: number;
  maxScore: number;
  label: string;
  emoji: string;
  message: string;
  color: string;
  gradient: string;
  badgeBg: string;
  badgeBorder: string;
  isLegendary?: boolean;
}

/**
 * Returns the exact creative, friendly meme-style performance category
 * based on the student's score out of 50.
 *
 * 50/50: 🏆 LEGENDARY MODE
 * 45–49: 🔥 MAIN CHARACTER
 * 40–44: 😎 PRO PLAYER
 * 35–39: 🚀 RISING STAR
 * 30–34: 🎯 ALMOST THERE
 * 20–29: 😂 LOADING GENIUS
 * 0–19:  🥲 COMEBACK PENDING
 */
export function getMemePerformance(score: number): PerformanceTier {
  const s = Math.round(Number(score) || 0);

  if (s >= 50) {
    return {
      minScore: 50,
      maxScore: 50,
      label: 'LEGENDARY MODE',
      emoji: '🏆',
      message: "Bro didn't take the exam. Bro conquered it. Even Google wants your answers!",
      color: '#fbbf24',
      gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #ef4444 100%)',
      badgeBg: 'rgba(251, 191, 36, 0.15)',
      badgeBorder: 'rgba(251, 191, 36, 0.4)',
      isLegendary: true,
    };
  }
  if (s >= 45) {
    return {
      minScore: 45,
      maxScore: 49,
      label: 'MAIN CHARACTER',
      emoji: '🔥',
      message: "The exam was tough, but apparently you weren't. Absolute cinema!",
      color: '#f97316',
      gradient: 'linear-gradient(135deg, #fb923c 0%, #f97316 50%, #dc2626 100%)',
      badgeBg: 'rgba(249, 115, 22, 0.15)',
      badgeBorder: 'rgba(249, 115, 22, 0.4)',
    };
  }
  if (s >= 40) {
    return {
      minScore: 40,
      maxScore: 44,
      label: 'PRO PLAYER',
      emoji: '😎',
      message: 'Not luck, not magic. Just pure brain power. Keep cooking!',
      color: '#22d3ee',
      gradient: 'linear-gradient(135deg, #22d3ee 0%, #0284c7 100%)',
      badgeBg: 'rgba(34, 211, 238, 0.15)',
      badgeBorder: 'rgba(34, 211, 238, 0.4)',
    };
  }
  if (s >= 35) {
    return {
      minScore: 35,
      maxScore: 39,
      label: 'RISING STAR',
      emoji: '🚀',
      message: "You're getting dangerous! One more push and you'll enter legendary territory.",
      color: '#34d399',
      gradient: 'linear-gradient(135deg, #34d399 0%, #059669 100%)',
      badgeBg: 'rgba(52, 211, 153, 0.15)',
      badgeBorder: 'rgba(52, 211, 153, 0.4)',
    };
  }
  if (s >= 30) {
    return {
      minScore: 30,
      maxScore: 34,
      label: 'ALMOST THERE',
      emoji: '🎯',
      message: 'The comeback story has officially started. Next time, make the questions nervous!',
      color: '#a78bfa',
      gradient: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)',
      badgeBg: 'rgba(167, 139, 250, 0.15)',
      badgeBorder: 'rgba(167, 139, 250, 0.4)',
    };
  }
  if (s >= 20) {
    return {
      minScore: 20,
      maxScore: 29,
      label: 'LOADING GENIUS',
      emoji: '😂',
      message: 'Brain.exe is loading... Please wait. Your upgrade is on the way!',
      color: '#60a5fa',
      gradient: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)',
      badgeBg: 'rgba(96, 165, 250, 0.15)',
      badgeBorder: 'rgba(96, 165, 250, 0.4)',
    };
  }
  return {
    minScore: 0,
    maxScore: 19,
    label: 'COMEBACK PENDING',
    emoji: '🥲',
    message: "This exam was just a trailer. The real comeback is yet to come. Don't give up!",
    color: '#f87171',
    gradient: 'linear-gradient(135deg, #f87171 0%, #dc2626 100%)',
    badgeBg: 'rgba(248, 113, 113, 0.15)',
    badgeBorder: 'rgba(248, 113, 113, 0.4)',
  };
}

export function getStatusBadgeStyle(label: string) {
  const map: Record<string, { color: string; bg: string; border: string }> = {
    'LEGENDARY MODE': { color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.15)', border: 'rgba(251, 191, 36, 0.4)' },
    'MAIN CHARACTER': { color: '#f97316', bg: 'rgba(249, 115, 22, 0.15)', border: 'rgba(249, 115, 22, 0.4)' },
    'PRO PLAYER': { color: '#22d3ee', bg: 'rgba(34, 211, 238, 0.15)', border: 'rgba(34, 211, 238, 0.4)' },
    'RISING STAR': { color: '#34d399', bg: 'rgba(52, 211, 153, 0.15)', border: 'rgba(52, 211, 153, 0.4)' },
    'ALMOST THERE': { color: '#a78bfa', bg: 'rgba(167, 139, 250, 0.15)', border: 'rgba(167, 139, 250, 0.4)' },
    'LOADING GENIUS': { color: '#60a5fa', bg: 'rgba(96, 165, 250, 0.15)', border: 'rgba(96, 165, 250, 0.4)' },
    'COMEBACK PENDING': { color: '#f87171', bg: 'rgba(248, 113, 113, 0.15)', border: 'rgba(248, 113, 113, 0.4)' },
  };
  return map[label] || { color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.15)', border: 'rgba(148, 163, 184, 0.3)' };
}
