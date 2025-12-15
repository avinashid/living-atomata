import { useCallback, useEffect, useRef, useState } from "react";
import { v4 } from "uuid";
import { TimeUtils, type TimeString } from "~/utils/time";
type UseTimerOptions = {
  startAt?: number;
  endAt?: number;
  interval?: TimeString;
  autoStart?: boolean;
  direction?: "up" | "down";
  onTick?: (time: number) => void;
  onEnd?: (time: number) => void;
};

export function useTimer({
  startAt = 0,
  endAt,
  interval = "10:sec",
  autoStart = true,
  direction = "up",
  onTick,
  onEnd,
}: UseTimerOptions = {}) {
  const [time, setTime] = useState(startAt);
  const [ended, setEnded] = useState<boolean | null>(
    autoStart === true ? false : null
  );
  const timerRef = useRef<number | null>(null);
  const id = v4();
  const pause = useCallback(() => {
    if (timerRef.current !== null) {
      setEnded(true);
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    console.log(`Timer:${id} stopped`);
    pause();
    if (endAt !== undefined) {
      setTime(endAt);
      onEnd?.(endAt);
    }
  }, [endAt, onEnd, pause]);
  const start = useCallback(() => {
    console.log(`Timer:${id} started`);
    if (timerRef.current) return;
    setEnded(false);
    if (timerRef.current !== null) return;

    timerRef.current = window.setInterval(() => {
      setTime((prev) => {
        const next = direction === "up" ? prev + 1 : prev - 1;
        if (
          endAt !== undefined &&
          ((direction === "up" && next >= endAt) ||
            (direction === "down" && next <= endAt))
        ) {
          stop();
          onTick?.(endAt);
          return endAt;
        }

        onTick?.(next);
        return next;
      });
    }, TimeUtils.getTime(interval));
  }, [direction, endAt, interval, onEnd]);

  const reset = useCallback(() => {
    pause();
    setTime(startAt);
  }, [startAt, pause]);

  useEffect(() => {
    if (autoStart) {
      console.log(`Timer:${id} auto-started`);
      start();
    }
    return pause;
  }, [autoStart]);

  return {
    time,
    start,
    pause,
    stop,
    reset,
    running: timerRef !== undefined && ended === false,
  };
}
