
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
const PBKDF2_ITERATIONS = 210_000;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HASH_PATTERN = /^pbkdf2\$(\d+)\$([0-9a-f]{32})\$([0-9a-f]{64})$/i;

function getCrypto(): Crypto {
  if (!globalThis.crypto?.subtle || !globalThis.crypto?.getRandomValues) {
    throw new Error('Secure cryptography is unavailable.');
  }

  return globalThis.crypto;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function getRegisteredUsers(): Record<string, StoredUser> {
  try {
    const raw = globalThis.localStorage.getItem(REGISTERED_USERS_KEY);

    if (!raw) return {};

    const parsed: unknown = JSON.parse(raw);

    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {};
    }

    const users: Record<string, StoredUser> = {};

    for (const [email, value] of Object.entries(parsed)) {
      if (!value || typeof value !== 'object') continue;

      const candidate = value as Partial<StoredUser>;
      const profile = candidate.profile;

      if (
        typeof candidate.passwordHash !== 'string' ||
        !profile ||
        typeof profile !== 'object' ||
        typeof profile.id !== 'string' ||
        typeof profile.name !== 'string' ||
        typeof profile.email !== 'string' ||
        profile.email.trim().toLowerCase() !== email
      ) {
        continue;
      }

      users[email] = {
        profile,
        passwordHash: candidate.passwordHash,
      };
    }

    return users;
  } catch {
    return {};
  }
}

function saveRegisteredUsers(
  users: Record<string, StoredUser>,
): boolean {
  try {
    globalThis.localStorage.setItem(
      REGISTERED_USERS_KEY,
      JSON.stringify(users),
    );

    return true;
  } catch {
    return false;
  }
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, byte =>
    byte.toString(16).padStart(2, '0'),
  ).join('');
}

function hexToBytes(hex: string): Uint8Array {
  if (!/^(?:[0-9a-f]{2})+$/i.test(hex)) {
    throw new Error('Invalid cryptographic data.');
  }

  const result = new Uint8Array(hex.length / 2);

  for (let i = 0; i < result.length; i++) {
    result[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }

  return result;
}

/**
 * Copy bytes into a standalone ArrayBuffer.
 * This avoids ArrayBufferLike / SharedArrayBuffer incompatibilities
 * in TypeScript versions with generic typed arrays.
 */
function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  return buffer;
}

async function derivePasswordHash(
  password: string,
  salt: Uint8Array,
  iterations: number,
): Promise<Uint8Array> {
  const cryptoApi = getCrypto();

  const passwordBytes = new TextEncoder().encode(password);
  const passwordBuffer = toArrayBuffer(passwordBytes);
  const saltBuffer = toArrayBuffer(salt);

  const key = await cryptoApi.subtle.importKey(
    'raw',
    passwordBuffer,
    'PBKDF2',
    false,
    ['deriveBits'],
  );

  const bits = await cryptoApi.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBuffer,
      iterations,
      hash: 'SHA-256',
    },
    key,
    256,
  );

  return new Uint8Array(bits);
}

async function hashPassword(password: string): Promise<string> {
  const cryptoApi = getCrypto();
  const salt = cryptoApi.getRandomValues(new Uint8Array(16));

  const hash = await derivePasswordHash(
    password,
    salt,
    PBKDF2_ITERATIONS,
  );

  return `pbkdf2$${PBKDF2_ITERATIONS}$${bytesToHex(salt)}$${bytesToHex(hash)}`;
}

async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const match = HASH_PATTERN.exec(stored);

  // Reject plaintext or malformed password records.
  if (!match) return false;

  const iterations = Number(match[1]);

  if (
    !Number.isSafeInteger(iterations) ||
    iterations < 100_000 ||
    iterations > 1_000_000
  ) {
    return false;
  }

  const salt = hexToBytes(match[2]);
  const expected = hexToBytes(match[3]);

  const actual = await derivePasswordHash(
    password,
    salt,
    iterations,
  );

  if (actual.length !== expected.length) return false;

  let difference = 0;

  for (let i = 0; i < actual.length; i++) {
    difference |= actual[i] ^ expected[i];
  }

  return difference === 0;
}

export function getPasswordStrength(password: string): number {
  if (!password) return 0;

  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (password.length < MIN_PASSWORD_LENGTH) return 1;
  if (score <= 2) return 1;
  if (score <= 3) return 2;

  return 3;
}

function createProfile(
  name: string,
  email: string,
  specialty = 'Equities & Swing Technicals',
): UserProfile {
  const cryptoApi = getCrypto();

  return {
    id: `usr_${cryptoApi.randomUUID()}`,
    name,
    email,
    role: 'Market Analyst',
    specialty,
    plan: 'PRO TERMINAL',
    joinedDate: new Date().toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    }),
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
  };
}

export async function loginUser(
  email: string,
  password: string,
): Promise<AuthResult> {
  await new Promise(resolve => setTimeout(resolve, 200));

  const normalizedEmail = normalizeEmail(email);

  if (!EMAIL_PATTERN.test(normalizedEmail)) {
    return {
      success: false,
      errorMessage: 'Please enter a valid email address.',
    };
  }

  if (!password) {
    return {
      success: false,
      errorMessage: 'Please enter your password.',
    };
  }

  const users = getRegisteredUsers();
  const existing = users[normalizedEmail];

  if (!existing) {
    return {
      success: false,
      errorMessage: 'Invalid email or password.',
    };
  }

  try {
    const valid = await verifyPassword(
      password,
      existing.passwordHash,
    );

    if (!valid) {
      return {
        success: false,
        errorMessage: 'Invalid email or password.',
      };
    }

    return {
      success: true,
      profile: existing.profile,
    };
  } catch {
    return {
      success: false,
      errorMessage: 'Authentication could not be completed. Please try again.',
    };
  }
}

export async function registerUser(
  name: string,
  email: string,
  password: string,
  specialty = 'Equities & Swing Technicals',
): Promise<AuthResult> {
  await new Promise(resolve => setTimeout(resolve, 200));

  const trimmedName = name.trim();
  const normalizedEmail = normalizeEmail(email);

  if (trimmedName.length < 2 || trimmedName.length > 100) {
    return {
      success: false,
      errorMessage: 'Name must contain between 2 and 100 characters.',
    };
  }

  if (!EMAIL_PATTERN.test(normalizedEmail)) {
    return {
      success: false,
      errorMessage: 'Please provide a valid email address.',
    };
  }

  if (
    password.length < MIN_PASSWORD_LENGTH ||
    password.length > MAX_PASSWORD_LENGTH
  ) {
    return {
      success: false,
      errorMessage: 'Password must contain between 8 and 128 characters.',
    };
  }

  const users = getRegisteredUsers();

  if (users[normalizedEmail]) {
    return {
      success: false,
      errorMessage: 'An account with this email already exists. Please sign in.',
    };
  }

  try {
    const profile = createProfile(
      trimmedName,
      normalizedEmail,
      specialty.trim() || 'Equities & Swing Technicals',
    );

    const passwordHash = await hashPassword(password);

    users[normalizedEmail] = {
      profile,
      passwordHash,
    };

    if (!saveRegisteredUsers(users)) {
      return {
        success: false,
        errorMessage: 'Unable to save your account. Check browser storage settings.',
      };
    }

    return {
      success: true,
      profile,
    };
  } catch {
    return {
      success: false,
      errorMessage: 'Unable to create your account. Please try again.',
    };
  }
}
