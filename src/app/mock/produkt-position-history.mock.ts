import { ProduktPositionHistoryEntry } from '../models/ProduktPositionHistoryEntry';

/**
 * Mock audit-log for the Produktposition's "Logbuch" dialog.
 * Mirrors the back-end CSV columns — see
 * `ProduktPositionHistoryEntry` and `PRODUKT_POSITION_LOGBUCH_COLUMNS`.
 *
 * The two seed entries below come straight from the user's sample
 * CSV: an initial create (`ProduktePO`) followed by a deactivation
 * (`ResetProduktPosition`).
 */

const HISTORY_TEST_1: ProduktPositionHistoryEntry[] = [
  {
    bearbeitungszeit: '2026-05-05 15:43:54',
    bearbeiter: 'Terab Hassan',
    bearbeiterId: 'terab01@bmi.gv.at',
    vorgang: 'ProduktePO',
    produktposition: 'TEST-1',
    durchfuehrungsverantwortlicher: 'Achter Erich',
    servicemanager: 'Achretx Brig-XXXX',
    start: '2026-05-01',
    ende: '9999-12-31',
    aktiv: '1',
    anmerkung: '',
    positionstyp: 'ADMINISTRATION',
    auftraggeber: 'Test',
    organisationseinheit: 'TEST',
    buchungsfreigabe: '1',
  },
  {
    bearbeitungszeit: '2026-05-05 15:44:14',
    bearbeiter: 'Terab Hassan',
    bearbeiterId: 'terab01@bmi.gv.at',
    vorgang: 'ResetProduktPosition',
    produktposition: 'TEST-1',
    durchfuehrungsverantwortlicher: 'Achter Erich',
    servicemanager: 'Achretx Brig-XXXX',
    start: '2026-05-01',
    ende: '2026-05-05',
    aktiv: '0',
    anmerkung: '',
    positionstyp: 'ADMINISTRATION',
    auftraggeber: 'Test',
    organisationseinheit: 'TEST',
    buchungsfreigabe: '1',
  },
];

export const MOCK_PRODUKT_POSITION_HISTORY: Record<string, ProduktPositionHistoryEntry[]> = {
  // Keyed by produktposition.id used in produkt-detail.mock.ts (or a name).
  'TEST-1': HISTORY_TEST_1,
  'mp1-pos-1': HISTORY_TEST_1,
  'mp1-pos-2': HISTORY_TEST_1,
  'mp1-pos-3': HISTORY_TEST_1,
  'mp2-pos-1': HISTORY_TEST_1,
  'mp2-pos-2': HISTORY_TEST_1,
};

export function getMockProduktPositionHistory(
  positionId: string | null | undefined,
  positionName?: string | null
): ProduktPositionHistoryEntry[] {
  if (positionId && positionId in MOCK_PRODUKT_POSITION_HISTORY) {
    return MOCK_PRODUKT_POSITION_HISTORY[positionId];
  }
  if (positionName && positionName in MOCK_PRODUKT_POSITION_HISTORY) {
    return MOCK_PRODUKT_POSITION_HISTORY[positionName];
  }
  // Fallback so the dialog always has data to show.
  return HISTORY_TEST_1;
}
