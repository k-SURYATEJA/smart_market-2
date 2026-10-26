
/**
 * alertService.ts
 *
 * Persists price alerts to Oracle via the Java backend.
 * All calls go through Vite proxy → /smart-market/api/alerts on Tomcat.
 */

import { PriceAlert } from '../types/market';

const API_BASE = '/api/alerts';

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/alerts?userId=X  →  list all alerts for user
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchAlerts(userId: string): Promise<PriceAlert[]> {
  try {
    const res = await fetch(`${API_BASE}?userId=${encodeURIComponent(userId)}`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.alerts ?? []) as PriceAlert[];
  } catch (err) {
    console.error('[alertService] fetchAlerts error:', err);
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/alerts  →  create a new alert, return the saved alert
// ─────────────────────────────────────────────────────────────────────────────

export async function saveAlert(
  userId: string,
  alert: Omit<PriceAlert, 'id' | 'createdAt' | 'triggered'>,
): Promise<PriceAlert | null> {
  try {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, ...alert }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.alert as PriceAlert ?? null;
  } catch (err) {
    console.error('[alertService] saveAlert error:', err);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/alerts/{id}?userId=X
// ─────────────────────────────────────────────────────────────────────────────

export async function deleteAlert(alertId: string, userId: string): Promise<boolean> {
  try {
    const res = await fetch(
      `${API_BASE}/${encodeURIComponent(alertId)}?userId=${encodeURIComponent(userId)}`,
      { method: 'DELETE' },
    );
    if (!res.ok) return false;
    const data = await res.json();
    return data.success === true;
  } catch (err) {
    console.error('[alertService] deleteAlert error:', err);
    return false;
  }
}
