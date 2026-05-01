import { ApiStempelzeit } from '../models/ApiStempelzeit';
import { ApiProdukt } from '../models/ApiProdukt';

/**
 * Mock detail data for the first 5 mock persons in the Stempelzeiten list
 * (ids m1..m5). Lets the detail page show a populated tree with both
 * months (current + previous) and a mix of Arbeitszeit / Remotezeit
 * entries — without going to the backend.
 *
 * The component filters incoming Stempelzeiten by enum KEY (not value)
 * so `zeitTyp` here uses the keys 'ARBEITSZEIT' / 'REMOTEZEIT'.
 */

/** Build an ISO datetime string at hour:minute on the given y/m/d. */
function iso(year: number, month: number, day: number, hour: number, minute: number): string {
  const d = new Date(year, month - 1, day, hour, minute, 0, 0);
  return d.toISOString();
}

interface MockEntry {
  year: number;
  month: number; // 1-12
  day: number;
  loginH: number;
  loginM: number;
  logoffH: number;
  logoffM: number;
  zeitTyp: 'ARBEITSZEIT' | 'REMOTEZEIT';
  anmerkung?: string;
}

function buildStempelzeiten(personId: string, entries: MockEntry[]): ApiStempelzeit[] {
  return entries.map((e, idx) => ({
    id: `${personId}-sz-${idx + 1}`,
    login: iso(e.year, e.month, e.day, e.loginH, e.loginM),
    logoff: iso(e.year, e.month, e.day, e.logoffH, e.logoffM),
    zeitTyp: e.zeitTyp as any,
    anmerkung: e.anmerkung ?? '',
    marker: [],
    poKorrektur: false,
  }));
}

const ENTRIES_BY_PERSON: Record<string, MockEntry[]> = {
  m1: [
    { year: 2026, month: 4, day: 6,  loginH: 8,  loginM: 0,  logoffH: 16, logoffM: 30, zeitTyp: 'ARBEITSZEIT' },
    { year: 2026, month: 4, day: 7,  loginH: 8,  loginM: 5,  logoffH: 16, logoffM: 45, zeitTyp: 'ARBEITSZEIT' },
    { year: 2026, month: 4, day: 9,  loginH: 9,  loginM: 0,  logoffH: 17, logoffM: 0,  zeitTyp: 'REMOTEZEIT', anmerkung: 'Homeoffice' },
    { year: 2026, month: 4, day: 13, loginH: 8,  loginM: 0,  logoffH: 16, logoffM: 0,  zeitTyp: 'ARBEITSZEIT' },
    { year: 2026, month: 4, day: 20, loginH: 8,  loginM: 30, logoffH: 17, logoffM: 0,  zeitTyp: 'ARBEITSZEIT' },
    { year: 2026, month: 4, day: 27, loginH: 8,  loginM: 0,  logoffH: 16, logoffM: 30, zeitTyp: 'ARBEITSZEIT' },
    { year: 2026, month: 5, day: 4,  loginH: 8,  loginM: 0,  logoffH: 16, logoffM: 30, zeitTyp: 'ARBEITSZEIT' },
    { year: 2026, month: 5, day: 5,  loginH: 8,  loginM: 0,  logoffH: 16, logoffM: 30, zeitTyp: 'ARBEITSZEIT' },
  ],
  m2: [
    { year: 2026, month: 4, day: 2,  loginH: 7,  loginM: 30, logoffH: 16, logoffM: 0,  zeitTyp: 'ARBEITSZEIT' },
    { year: 2026, month: 4, day: 8,  loginH: 8,  loginM: 0,  logoffH: 16, logoffM: 30, zeitTyp: 'ARBEITSZEIT' },
    { year: 2026, month: 4, day: 14, loginH: 9,  loginM: 0,  logoffH: 17, logoffM: 30, zeitTyp: 'REMOTEZEIT', anmerkung: 'WFH' },
    { year: 2026, month: 4, day: 21, loginH: 8,  loginM: 0,  logoffH: 16, logoffM: 0,  zeitTyp: 'ARBEITSZEIT' },
    { year: 2026, month: 4, day: 28, loginH: 8,  loginM: 0,  logoffH: 16, logoffM: 30, zeitTyp: 'ARBEITSZEIT' },
    { year: 2026, month: 5, day: 4,  loginH: 8,  loginM: 0,  logoffH: 16, logoffM: 30, zeitTyp: 'ARBEITSZEIT' },
  ],
  m3: [
    { year: 2026, month: 4, day: 1,  loginH: 9,  loginM: 0,  logoffH: 17, logoffM: 0,  zeitTyp: 'REMOTEZEIT', anmerkung: 'Telearbeit' },
    { year: 2026, month: 4, day: 3,  loginH: 9,  loginM: 0,  logoffH: 17, logoffM: 0,  zeitTyp: 'REMOTEZEIT' },
    { year: 2026, month: 4, day: 7,  loginH: 9,  loginM: 0,  logoffH: 17, logoffM: 30, zeitTyp: 'REMOTEZEIT' },
    { year: 2026, month: 4, day: 10, loginH: 8,  loginM: 30, logoffH: 16, logoffM: 30, zeitTyp: 'ARBEITSZEIT' },
    { year: 2026, month: 4, day: 15, loginH: 9,  loginM: 0,  logoffH: 17, logoffM: 0,  zeitTyp: 'REMOTEZEIT' },
    { year: 2026, month: 4, day: 17, loginH: 9,  loginM: 0,  logoffH: 17, logoffM: 0,  zeitTyp: 'REMOTEZEIT' },
    { year: 2026, month: 4, day: 22, loginH: 8,  loginM: 0,  logoffH: 16, logoffM: 30, zeitTyp: 'ARBEITSZEIT' },
    { year: 2026, month: 4, day: 24, loginH: 9,  loginM: 0,  logoffH: 17, logoffM: 0,  zeitTyp: 'REMOTEZEIT' },
    { year: 2026, month: 4, day: 30, loginH: 9,  loginM: 0,  logoffH: 17, logoffM: 0,  zeitTyp: 'REMOTEZEIT' },
    { year: 2026, month: 5, day: 4,  loginH: 9,  loginM: 0,  logoffH: 17, logoffM: 0,  zeitTyp: 'REMOTEZEIT' },
  ],
  m4: [
    { year: 2026, month: 4, day: 6,  loginH: 8,  loginM: 0,  logoffH: 16, logoffM: 0,  zeitTyp: 'ARBEITSZEIT' },
    { year: 2026, month: 4, day: 13, loginH: 8,  loginM: 0,  logoffH: 16, logoffM: 30, zeitTyp: 'ARBEITSZEIT' },
    { year: 2026, month: 4, day: 20, loginH: 8,  loginM: 0,  logoffH: 16, logoffM: 0,  zeitTyp: 'ARBEITSZEIT' },
    { year: 2026, month: 4, day: 27, loginH: 8,  loginM: 0,  logoffH: 16, logoffM: 30, zeitTyp: 'ARBEITSZEIT' },
    { year: 2026, month: 5, day: 4,  loginH: 8,  loginM: 0,  logoffH: 16, logoffM: 0,  zeitTyp: 'ARBEITSZEIT' },
  ],
  m5: [
    { year: 2026, month: 4, day: 2,  loginH: 8,  loginM: 0,  logoffH: 16, logoffM: 30, zeitTyp: 'ARBEITSZEIT' },
    { year: 2026, month: 4, day: 9,  loginH: 8,  loginM: 0,  logoffH: 16, logoffM: 30, zeitTyp: 'ARBEITSZEIT' },
    { year: 2026, month: 4, day: 16, loginH: 9,  loginM: 0,  logoffH: 17, logoffM: 0,  zeitTyp: 'REMOTEZEIT' },
    { year: 2026, month: 4, day: 23, loginH: 8,  loginM: 30, logoffH: 16, logoffM: 30, zeitTyp: 'ARBEITSZEIT' },
    { year: 2026, month: 4, day: 29, loginH: 8,  loginM: 0,  logoffH: 16, logoffM: 0,  zeitTyp: 'ARBEITSZEIT' },
    { year: 2026, month: 5, day: 4,  loginH: 8,  loginM: 0,  logoffH: 16, logoffM: 30, zeitTyp: 'ARBEITSZEIT' },
    { year: 2026, month: 5, day: 5,  loginH: 9,  loginM: 0,  logoffH: 17, logoffM: 0,  zeitTyp: 'REMOTEZEIT' },
  ],

  // m26 = Zacharias Braun (per the deterministic mock-list generator)
  m26: [
    { year: 2026, month: 4, day: 1,  loginH: 8,  loginM: 0,  logoffH: 16, logoffM: 30, zeitTyp: 'ARBEITSZEIT' },
    { year: 2026, month: 4, day: 8,  loginH: 8,  loginM: 15, logoffH: 16, logoffM: 45, zeitTyp: 'ARBEITSZEIT' },
    { year: 2026, month: 4, day: 14, loginH: 9,  loginM: 0,  logoffH: 17, logoffM: 30, zeitTyp: 'REMOTEZEIT', anmerkung: 'Telearbeit' },
    { year: 2026, month: 4, day: 20, loginH: 8,  loginM: 0,  logoffH: 16, logoffM: 0,  zeitTyp: 'ARBEITSZEIT' },
    { year: 2026, month: 4, day: 27, loginH: 8,  loginM: 30, logoffH: 17, logoffM: 0,  zeitTyp: 'ARBEITSZEIT' },
    { year: 2026, month: 5, day: 4,  loginH: 8,  loginM: 0,  logoffH: 16, logoffM: 30, zeitTyp: 'ARBEITSZEIT' },
  ],

  // m36 = Johannes Becker (per the deterministic mock-list generator)
  m36: [
    { year: 2026, month: 4, day: 2,  loginH: 7,  loginM: 45, logoffH: 16, logoffM: 15, zeitTyp: 'ARBEITSZEIT' },
    { year: 2026, month: 4, day: 7,  loginH: 9,  loginM: 0,  logoffH: 17, logoffM: 0,  zeitTyp: 'REMOTEZEIT' },
    { year: 2026, month: 4, day: 13, loginH: 8,  loginM: 0,  logoffH: 16, logoffM: 30, zeitTyp: 'ARBEITSZEIT' },
    { year: 2026, month: 4, day: 16, loginH: 9,  loginM: 0,  logoffH: 17, logoffM: 30, zeitTyp: 'REMOTEZEIT', anmerkung: 'WFH' },
    { year: 2026, month: 4, day: 22, loginH: 8,  loginM: 0,  logoffH: 16, logoffM: 0,  zeitTyp: 'ARBEITSZEIT' },
    { year: 2026, month: 4, day: 28, loginH: 8,  loginM: 0,  logoffH: 16, logoffM: 30, zeitTyp: 'ARBEITSZEIT' },
    { year: 2026, month: 5, day: 5,  loginH: 8,  loginM: 0,  logoffH: 16, logoffM: 30, zeitTyp: 'ARBEITSZEIT' },
  ],

  // m76 = Zacharias Becker (per the deterministic mock-list generator)
  m76: [
    { year: 2026, month: 4, day: 3,  loginH: 8,  loginM: 0,  logoffH: 16, logoffM: 30, zeitTyp: 'ARBEITSZEIT' },
    { year: 2026, month: 4, day: 9,  loginH: 9,  loginM: 0,  logoffH: 17, logoffM: 0,  zeitTyp: 'REMOTEZEIT' },
    { year: 2026, month: 4, day: 15, loginH: 8,  loginM: 30, logoffH: 17, logoffM: 0,  zeitTyp: 'ARBEITSZEIT' },
    { year: 2026, month: 4, day: 21, loginH: 9,  loginM: 0,  logoffH: 17, logoffM: 30, zeitTyp: 'REMOTEZEIT', anmerkung: 'Homeoffice' },
    { year: 2026, month: 4, day: 24, loginH: 8,  loginM: 0,  logoffH: 16, logoffM: 30, zeitTyp: 'ARBEITSZEIT' },
    { year: 2026, month: 4, day: 30, loginH: 8,  loginM: 0,  logoffH: 16, logoffM: 0,  zeitTyp: 'ARBEITSZEIT' },
    { year: 2026, month: 5, day: 4,  loginH: 8,  loginM: 0,  logoffH: 16, logoffM: 30, zeitTyp: 'ARBEITSZEIT' },
  ],
};

export const MOCK_STEMPELZEITEN_BY_PERSON: Record<string, ApiStempelzeit[]> =
  Object.fromEntries(
    Object.entries(ENTRIES_BY_PERSON).map(([id, entries]) => [
      id,
      buildStempelzeiten(id, entries),
    ])
  );

/** Minimal mock products. The detail's `tap` over the response just
 *  collects `taetigkeitsbuchung` — an empty product list is enough to
 *  satisfy the pipeline without affecting tree rendering. */
export const MOCK_PRODUKTE_BY_PERSON: Record<string, ApiProdukt[]> = {
  m1: [],
  m2: [],
  m3: [],
  m4: [],
  m5: [],
  m26: [], // Zacharias Braun
  m36: [], // Johannes Becker
  m76: [], // Zacharias Becker
};

export function hasMockDetailData(personId: string | undefined): boolean {
  return !!personId && personId in MOCK_STEMPELZEITEN_BY_PERSON;
}
