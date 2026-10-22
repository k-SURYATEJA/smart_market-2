import { UserProfile } from '../types/market';

export interface AuthResult {
  success: boolean;
  profile?: UserProfile;
  errorMessage?: string;
}

interface StoredUser {
  profile: UserProfile;
  passwordHash: string;
}

const REGISTERED_USERS_KEY = 'marketpulse_registered_users';

const DEMO_USER: UserProfile = {
  id: 'usr_demo_terminal',
  name: 'Alex Vance',
  email: 'analyst@smartmarket.com',
  role: 'Senior Market Analyst',
  specialty: 'Equities & Swing Technicals',
  plan: 'PRO TERMINAL',
  joinedDate: 'Jan 2025',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
};

function getRegisteredUsers(): Record<string, StoredUser> {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = localStorage.getItem(REGISTERED_USERS_KEY);
      if (raw) return JSON.parse(raw);
    }
  } catch {
    // Ignore storage errors
  }
  return {};
}

function saveRegisteredUsers(users: Record<string, StoredUser>): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
    }
  } catch {
    // Ignore storage errors
  }
}

/**
 * Calculates password strength on a scale of 0 to 3:
 * 0 = None / Empty
 * 1 = Weak
 * 2 = Fair / Medium
 * 3 = Strong
 */
export function getPasswordStrength(password: string): number {
  if (!password || password.length === 0) return 0;
  if (password.length < 6) return 1;

  let score = 0;
  if (password.length >= 8) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score >= 3 && password.length >= 8) return 3;
  if (score >= 1) return 2;
  return 1;
}

/**
 * Authenticates user by email and password.
 */
export async function loginUser(email: string, password: string): Promise<AuthResult> {
  await new Promise(resolve => setTimeout(resolve, 350));

  const trimmedEmail = email.trim().toLowerCase();

  if (!trimmedEmail || !trimmedEmail.includes('@')) {
    return { success: false, errorMessage: 'Please enter a valid email address.' };
  }
  if (!password) {
    return { success: false, errorMessage: 'Please enter your password.' };
  }

  // Pre-configured demo credentials
  if (
    (trimmedEmail === 'analyst@smartmarket.com' || trimmedEmail === 'demo@smartmarket.com') &&
    (password === 'password' || password === 'password123' || password === 'admin123' || password.length >= 6)
  ) {
    return { success: true, profile: DEMO_USER };
  }

  // Check locally registered accounts
  const users = getRegisteredUsers();
  const existing = users[trimmedEmail];

  if (existing) {
    if (existing.passwordHash === password) {
      return { success: true, profile: existing.profile };
    }
    return { success: false, errorMessage: 'Invalid password. Please check your credentials.' };
  }

  // Fallback demo authentication for seamless testing
  if (password.length >= 6) {
    const fallbackName = trimmedEmail.split('@')[0];
    const formattedName = fallbackName.charAt(0).toUpperCase() + fallbackName.slice(1);
    const fallbackProfile: UserProfile = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: formattedName,
      email: trimmedEmail,
      role: 'Market Analyst',
      specialty: 'Equities & Swing Technicals',
      plan: 'PRO TERMINAL',
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(formattedName)}`,
    };
    return { success: true, profile: fallbackProfile };
  }

  return { success: false, errorMessage: 'Password must be at least 6 characters.' };
}

/**
 * Registers a new user and persists in localStorage.
 */
export async function registerUser(
  name: string,
  email: string,
  password: string,
  specialty: string = 'Equities & Swing Technicals'
): Promise<AuthResult> {
  await new Promise(resolve => setTimeout(resolve, 450));

  const trimmedName = name.trim();
  const trimmedEmail = email.trim().toLowerCase();

  if (!trimmedName) {
    return { success: false, errorMessage: 'Please provide your full name.' };
  }
  if (!trimmedEmail || !trimmedEmail.includes('@')) {
    return { success: false, errorMessage: 'Please provide a valid email address.' };
  }
  if (!password || password.length < 8) {
    return { success: false, errorMessage: 'Password must be at least 8 characters long.' };
  }

  const users = getRegisteredUsers();
  if (users[trimmedEmail]) {
    return { success: false, errorMessage: 'An account with this email already exists. Please sign in.' };
  }

  const newProfile: UserProfile = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: trimmedName,
    email: trimmedEmail,
    role: 'Senior Market Analyst',
    specialty: specialty || 'Equities & Swing Technicals',
    plan: 'PRO TERMINAL',
    joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(trimmedName)}`,
  };

  users[trimmedEmail] = {
    profile: newProfile,
    passwordHash: password,
  };
  saveRegisteredUsers(users);

  return { success: true, profile: newProfile };
}
