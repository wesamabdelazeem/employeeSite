import { PersonHistoryEntry } from '../models/PersonHistoryEntry';

/**
 * Mock audit-log for the Produkte detail's "Logbuch" dialog.
 *
 * The existing LogbuchDialogComponent is built around the
 * `PersonHistoryEntry` shape (used for the personen Logbuch). Rather
 * than fork the dialog, we map produkt history into the same shape
 * and reuse the dialog as-is — only the fields the dialog actually
 * displays (`bearbeitungszeit`, `bearbeiter`, `vorgang`, `name` via
 * `vorname`+`nachname`, `aktiv`, `anmerkung`, …) need meaningful
 * values; the rest stay empty strings.
 */

const EMPTY: Omit<PersonHistoryEntry,
  'bearbeitungszeit' | 'bearbeiter' | 'bearbeiterId' | 'vorgang'
  | 'vorname' | 'nachname' | 'aktiv' | 'anmerkung'
> = {
  titel: '',
  emailGeschaeftlich: '',
  geburtsdatum: '',
  geschlecht: '',
  funktion: '',
  personalnr: '',
  emailPrivat: '',
  eintrittsDatum: '',
  austrittsDatum: '',
  svnr: '',
  emailExtern: '',
  staatsangehoerigkeit: '',
  rolle: '',
  bucher: '',
  rechte: '',
  funktionen: '',
  firma: '',
  selbststaendig: '',
  windowsBenutzerkonto: '',
  stundensatz: '',
  bereitschaftsStundensatz: '',
  dienstverwendung: '',
  mitarbeiterart: '',
  geprueft: '',
  stundenkontingentJaehrlich: '',
  stundenkontingentJaehrlichVertrag: '',
  mobilNummerBmi: '',
  mobilNummerExtern: '',
  zimmerNummer: '',
  leerPdf: '',
  leistungskategorie: '',
  personenverantwortlicher: '',
  teamleiter: '',
  teamzuordnung: '',
  organisationseinheit: '',
  freigabegruppe: '',
  letzteBearbeitung: '',
};

function entry(
  bearbeitungszeit: string,
  bearbeiter: string,
  vorgang: string,
  produktname: string,
  aktiv: string,
  anmerkung: string,
): PersonHistoryEntry {
  return {
    bearbeitungszeit,
    bearbeiter,
    bearbeiterId: bearbeiter.replace(/\s+/g, '.').toLowerCase(),
    vorgang,
    // Produktname is stored in vorname so it appears in the dialog's
    // "Name" column without needing dialog changes; nachname empty.
    vorname: produktname,
    nachname: '',
    aktiv,
    anmerkung,
    ...EMPTY,
  };
}

const HISTORY_GET_IT: PersonHistoryEntry[] = [
  entry('2025-01-15 09:14', 'Maria Neumann',  'Anlage',           'Get-IT — Modernisierung', 'true',  'Initiale Anlage des Programms.'),
  entry('2025-03-04 11:20', 'Hassan Terab',   'Position add',     'Get-IT — Modernisierung', 'true',  'Position "Frontend-Refactoring" hinzugefügt.'),
  entry('2025-04-02 16:42', 'Clara Fischer',  'Position add',     'Get-IT — Modernisierung', 'true',  'Position "Backend-API Konsolidierung" hinzugefügt.'),
  entry('2025-06-12 08:55', 'Felix Becker',   'Position add',     'Get-IT — Modernisierung', 'true',  'Position "Test & QA" hinzugefügt.'),
  entry('2025-09-01 14:08', 'Hassan Terab',   'Buchungspunkt',    'Get-IT — Modernisierung', 'true',  '"Validators & Mocks" deaktiviert für Reorganisation.'),
  entry('2026-02-21 10:33', 'Maria Neumann',  'Update Anmerkung', 'Get-IT — Modernisierung', 'true',  'Anmerkung präzisiert.'),
  entry('2026-04-30 17:02', 'Hassan Terab',   'Update',           'Get-IT — Modernisierung', 'true',  'Buchungsfreigabe für QA aktualisiert.'),
];

const HISTORY_RZM: PersonHistoryEntry[] = [
  entry('2026-01-08 09:00', 'Greta Hoffmann', 'Anlage',         'Rechenzentrum-Migration 2026', 'true',  'Programm angelegt.'),
  entry('2026-01-15 13:24', 'Iris Koch',      'Position add',   'Rechenzentrum-Migration 2026', 'true',  '"Hardware-Beschaffung" hinzugefügt.'),
  entry('2026-03-22 11:50', 'Jakob Richter',  'Buchungspunkt',  'Rechenzentrum-Migration 2026', 'false', '"Server-Bestellung Phase 2" auf inaktiv gesetzt.'),
  entry('2026-04-10 15:17', 'Karin Klein',    'Position add',   'Rechenzentrum-Migration 2026', 'true',  '"Migration & Cutover" hinzugefügt.'),
];

export const MOCK_PRODUKT_HISTORY: Record<string, PersonHistoryEntry[]> = {
  mp1: HISTORY_GET_IT,
  mp2: HISTORY_RZM,
  '1':  HISTORY_GET_IT,
  '2':  HISTORY_RZM,
};

export function getMockProduktHistory(produktId: string | null | undefined): PersonHistoryEntry[] {
  if (produktId && produktId in MOCK_PRODUKT_HISTORY) {
    return MOCK_PRODUKT_HISTORY[produktId];
  }
  // Fallback so the Logbuch always has something to show.
  return HISTORY_GET_IT;
}
