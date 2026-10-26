
/**
 * journalService.ts
 *
 * Persists research notes to Oracle via the Java backend.
 * All calls go through Vite proxy → /smart-market/api/journal on Tomcat.
 */

const API_BASE = '/api/journal';

// ─────────────────────────────────────────────────────────────────────────────
// Types (mirrors ResearchNote in TradingJournalView + Java model)
// ─────────────────────────────────────────────────────────────────────────────

export interface ResearchNote {
  id: string;
  date: string;
  symbol: string;
  category: 'Technical Pattern' | 'Fundamental Catalyst' | 'Macro Policy' | 'Earnings Breakdown';
  setupType: string;
  keyLevel: string;
  targetOutlook: string;
  timeframe: 'Intraday' | 'Swing' | 'Multi-Month';
  thesis: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/journal?userId=X  →  list all research notes
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchNotes(userId: string): Promise<ResearchNote[]> {
  try {
    const res = await fetch(`${API_BASE}?userId=${encodeURIComponent(userId)}`);
    if (!res.ok) return [];
    const data = await res.json();
    // Backend returns { success, notes: [...] }
    // The notes have a userId field — strip it for the frontend type
    return (data.notes ?? []) as ResearchNote[];
  } catch (err) {
    console.error('[journalService] fetchNotes error:', err);
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/journal  →  save a new note, return the saved note
// ─────────────────────────────────────────────────────────────────────────────

export async function saveNote(
  userId: string,
  note: Omit<ResearchNote, 'id' | 'date'>,
): Promise<ResearchNote | null> {
  try {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, ...note }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.note as ResearchNote ?? null;
  } catch (err) {
    console.error('[journalService] saveNote error:', err);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/journal/{id}?userId=X
// ─────────────────────────────────────────────────────────────────────────────

export async function deleteNote(noteId: string, userId: string): Promise<boolean> {
  try {
    const res = await fetch(
      `${API_BASE}/${encodeURIComponent(noteId)}?userId=${encodeURIComponent(userId)}`,
      { method: 'DELETE' },
    );
    if (!res.ok) return false;
    const data = await res.json();
    return data.success === true;
  } catch (err) {
    console.error('[journalService] deleteNote error:', err);
    return false;
  }
}
