import { useState, useCallback, useRef } from 'react';

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  blockDurationMs: number;
}

interface RateLimitState {
  attempts: number;
  lastAttempt: number;
  blockedUntil: number;
  isBlocked: boolean;
  remainingAttempts: number;
  timeUntilReset: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
  blockDurationMs: 30 * 60 * 1000, // 30 minutes
};

export const useRateLimit = (key: string, config: Partial<RateLimitConfig> = {}) => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const [state, setState] = useState<RateLimitState>(() => {
    const stored = localStorage.getItem(`rateLimit_${key}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      const now = Date.now();
      
      // Check if still blocked
      if (parsed.blockedUntil && now < parsed.blockedUntil) {
        return {
          ...parsed,
          isBlocked: true,
          remainingAttempts: 0,
          timeUntilReset: parsed.blockedUntil - now,
        };
      }
      
      // Check if window has reset
      if (now - parsed.lastAttempt > finalConfig.windowMs) {
        return {
          attempts: 0,
          lastAttempt: 0,
          blockedUntil: 0,
          isBlocked: false,
          remainingAttempts: finalConfig.maxAttempts,
          timeUntilReset: 0,
        };
      }
      
      return {
        ...parsed,
        isBlocked: false,
        remainingAttempts: Math.max(0, finalConfig.maxAttempts - parsed.attempts),
        timeUntilReset: finalConfig.windowMs - (now - parsed.lastAttempt),
      };
    }
    
    return {
      attempts: 0,
      lastAttempt: 0,
      blockedUntil: 0,
      isBlocked: false,
      remainingAttempts: finalConfig.maxAttempts,
      timeUntilReset: 0,
    };
  });

  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const updateState = useCallback((newState: Partial<RateLimitState>) => {
    setState(prev => {
      const updated = { ...prev, ...newState };
      localStorage.setItem(`rateLimit_${key}`, JSON.stringify(updated));
      return updated;
    });
  }, [key]);

  const recordAttempt = useCallback(() => {
    const now = Date.now();
    const newAttempts = state.attempts + 1;
    
    if (newAttempts >= finalConfig.maxAttempts) {
      const blockedUntil = now + finalConfig.blockDurationMs;
      updateState({
        attempts: newAttempts,
        lastAttempt: now,
        blockedUntil,
        isBlocked: true,
        remainingAttempts: 0,
        timeUntilReset: finalConfig.blockDurationMs,
      });
      
      // Set up timer to unblock
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = setTimeout(() => {
        updateState({
          attempts: 0,
          lastAttempt: 0,
          blockedUntil: 0,
          isBlocked: false,
          remainingAttempts: finalConfig.maxAttempts,
          timeUntilReset: 0,
        });
      }, finalConfig.blockDurationMs);
      
      return false;
    }
    
    updateState({
      attempts: newAttempts,
      lastAttempt: now,
      remainingAttempts: finalConfig.maxAttempts - newAttempts,
      timeUntilReset: finalConfig.windowMs,
    });
    
    return true;
  }, [state.attempts, finalConfig, updateState]);

  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    updateState({
      attempts: 0,
      lastAttempt: 0,
      blockedUntil: 0,
      isBlocked: false,
      remainingAttempts: finalConfig.maxAttempts,
      timeUntilReset: 0,
    });
  }, [finalConfig.maxAttempts, updateState]);

  const canAttempt = useCallback(() => {
    return !state.isBlocked && state.remainingAttempts > 0;
  }, [state.isBlocked, state.remainingAttempts]);

  return {
    ...state,
    recordAttempt,
    reset,
    canAttempt,
  };
};
