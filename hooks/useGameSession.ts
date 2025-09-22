import { useEffect, useMemo, useRef, useState } from 'react';

export type GameStatus = 'idle' | 'running' | 'finished';

export function useGameSession(totalTime = 60) {
  const [status, setStatus] = useState<GameStatus>('idle');
  const [score, setScore] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (status !== 'running') {
      return;
    }

    timerRef.current = setInterval(() => {
      setElapsed(prev => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [status]);

  useEffect(() => {
    if (status === 'running' && elapsed >= totalTime) {
      finish();
    }
  }, [elapsed, status, totalTime]);

  const remaining = useMemo(() => Math.max(totalTime - elapsed, 0), [elapsed, totalTime]);

  function start() {
    setScore(0);
    setElapsed(0);
    setStatus('running');
  }

  function finish() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setStatus('finished');
  }

  function increment(points: number) {
    setScore(prev => prev + points);
  }

  function reset() {
    setStatus('idle');
    setScore(0);
    setElapsed(0);
  }

  return {
    status,
    score,
    elapsed,
    remaining,
    start,
    finish,
    increment,
    reset
  };
}
