import { useState, useEffect, useCallback } from 'react';
import { AuthState, LoginCredentials, SignupCredentials, AuthResponse } from '../types/auth';
import { User } from '../types/user';
import { getStorageItem, setStorageItem, removeStorageItem } from '../utils/helpers';
import { TOKEN_KEY, USER_KEY, REFRESH_TOKEN_KEY } from '../utils/constants';
import { useRateLimit } from './useRateLimit';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  const rateLimit = useRateLimit('login', {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    blockDurationMs: 30 * 60 * 1000, // 30 minutes
  });

  // Initialize auth state from localStorage
  useEffect(() => {
    const token = getStorageItem<string>(TOKEN_KEY);
    const user = getStorageItem<User>(USER_KEY);

    if (token && user) {
      setAuthState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    // Check rate limiting
    if (!rateLimit.canAttempt()) {
      const timeRemaining = Math.ceil(rateLimit.timeUntilReset / 1000 / 60);
      const errorMessage = rateLimit.isBlocked 
        ? `Too many login attempts. Please try again in ${timeRemaining} minutes.`
        : `Too many login attempts. Please wait ${timeRemaining} minutes before trying again.`;
      
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }

    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        // Record failed attempt
        rateLimit.recordAttempt();
        throw new Error('Login failed');
      }

      const data: AuthResponse = await response.json();

      // Reset rate limit on successful login
      rateLimit.reset();

      setStorageItem(TOKEN_KEY, data.token);
      setStorageItem(USER_KEY, data.user);
      setStorageItem(REFRESH_TOKEN_KEY, data.refreshToken);

      setAuthState({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  }, [rateLimit]);

  const signup = useCallback(async (credentials: SignupCredentials) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Signup failed');
      }

      const data: AuthResponse = await response.json();

      setStorageItem(TOKEN_KEY, data.token);
      setStorageItem(USER_KEY, data.user);
      setStorageItem(REFRESH_TOKEN_KEY, data.refreshToken);

      setAuthState({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Signup failed';
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  }, []);

  const logout = useCallback(() => {
    removeStorageItem(TOKEN_KEY);
    removeStorageItem(USER_KEY);
    removeStorageItem(REFRESH_TOKEN_KEY);

    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  }, []);

  const updateUser = useCallback((userData: Partial<User>) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, ...userData };
      setStorageItem(USER_KEY, updatedUser);
      setAuthState(prev => ({ ...prev, user: updatedUser }));
    }
  }, [authState.user]);

  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...authState,
    login,
    signup,
    logout,
    updateUser,
    clearError,
    rateLimit: {
      isBlocked: rateLimit.isBlocked,
      remainingAttempts: rateLimit.remainingAttempts,
      timeUntilReset: rateLimit.timeUntilReset,
    },
  };
};
