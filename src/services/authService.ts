
import { UserProfile } from '../types/market';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface AuthResult {
  success: boolean;
  profile?: UserProfile;
  errorMessage?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// API base — all requests go through Vite proxy → Tomcat :8080/smart-market
// ─────────────────────────────────────────────────────────────────────────────

const API_BASE = '/api/auth';

// ─────────────────────────────────────────────────────────────────────────────
// localStorage session helpers (profile only — no passwords stored client-side)
// ─────────────────────────────────────────────────────────────────────────────

const SESSION_KEY = 'marketpulse_user';

function saveSession(profile: UserProfile): void {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(profile));
  } catch {
    // ignore storage errors
  }
}

export function getActiveSession(): UserProfile | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // ignore
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Register — POST /api/auth/register
// ─────────────────────────────────────────────────────────────────────────────

export async function registerUser(
  name: string,
  email: string,
  password: string,
  specialty = 'Equities & Swing Technicals',
): Promise<AuthResult> {
  try {
    const res = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, specialty }),
    });

    const data: AuthResult = await res.json();

    if (data.success && data.profile) {
      saveSession(data.profile);
    }

    return data;
  } catch (err) {
    console.error('[authService] registerUser network error:', err);
    return {
      success: false,
      errorMessage:
        'Cannot reach the server. Make sure the Java backend is running on port 8080.',
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Login — POST /api/auth/login
// ─────────────────────────────────────────────────────────────────────────────

export async function loginUser(
  email: string,
  password: string,
): Promise<AuthResult> {
  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data: AuthResult = await res.json();

    if (data.success && data.profile) {
      saveSession(data.profile);
    }

    return data;
  } catch (err) {
    console.error('[authService] loginUser network error:', err);
    return {
      success: false,
      errorMessage:
        'Cannot reach the server. Make sure the Java backend is running on port 8080.',
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Password strength helper (kept for RegisterPage UI)
// ─────────────────────────────────────────────────────────────────────────────

export function getPasswordStrength(password: string): number {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8)  score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password))          score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (password.length < 8) return 1;
  if (score <= 2) return 1;
  if (score <= 3) return 2;
  return 3;
}
