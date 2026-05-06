/**
 * Mock data for the Stundenplanung dialog (Vertrag detail).
 *
 * Source rows: the JSON the user pasted, used verbatim as the
 * "Verbraucher für Stundenumplanung" (left) table. Each row also
 * carries an explicit `verbraucherName` so the table can show a
 * human name without a separate person-by-id lookup.
 *
 * The right-hand "Ziel der Stundenumplanung" list is derived from a
 * small set of additional target positions so the dialog mirrors
 * the screenshot.
 */

export interface VertragVerbraucherStundenplanungEntry {
  produktName: string;
  produktKurzName: string;
  produktPosition: string;
  produktPositionId: number;
  verbraucherId: number;
  personId: number;
  stundenplanungId: number;
  stundenGeplant: string;
  stundenGebucht: string;
  position: string;
  planungsjahr: number;
  vertragsname: string;

  /** Display-only — the full name of the verbraucher (person), not
   *  part of the back-end JSON shape; added so the dialog can show
   *  "Hofstetter Walter" without a separate person-by-id lookup. */
  verbraucherName?: string;

  stundenplanung: {
    id: string;
    version: number;
    deleted: boolean;
    stundenGeplant: string;
  };

  vertragPositionVerbraucher: {
    id: string;
    version: number;
    deleted: boolean;
    volumenStunden: string;
    stundenpreis: string;
    volumenEuro: string;
    verbraucherTyp: string;
    aktiv: boolean;
    lkKennung: boolean;
    stundenplanung: any[];
    trigger: any[];
  };
}

export interface VertragStundenplanungZielEntry {
  produktKurzName: string;
  position: string;
  produktPositionId: string;
  stundenGeplant: string;
  stundenGebucht: string;
}

export const MOCK_VERTRAG_STUNDENPLANUNG: VertragVerbraucherStundenplanungEntry[] = [
  {
    produktName: 'Zentrales Melderegister',
    produktKurzName: 'ZMR',
    produktPosition: 'TEST_POSITION_HASSAN',
    produktPositionId: 420100000000103,
    verbraucherId: 465300000000423,
    personId: 1500000000579,
    stundenplanungId: 501900000002005,
    stundenGeplant: '4',
    stundenGebucht: '0.00',
    position: 'Betrieb',
    planungsjahr: 2026,
    vertragsname: 'BMI/IBM Leistungspartnerschaft 2019',
    verbraucherName: 'Hofstetter Walter',
    stundenplanung: {
      id: '501900000002005',
      version: 3,
      deleted: false,
      stundenGeplant: '4',
    },
    vertragPositionVerbraucher: {
      id: '465300000000423',
      version: 1,
      deleted: false,
      volumenStunden: '200',
      stundenpreis: '154.44',
      volumenEuro: '30888.00',
      verbraucherTyp: 'PERSONAL',
      aktiv: true,
      lkKennung: false,
      stundenplanung: [],
      trigger: [],
    },
  },
  {
    produktName: 'Zentrales Melderegister',
    produktKurzName: 'ZMR',
    produktPosition: 'TEST_POSITION_HASSAN',
    produktPositionId: 420100000000103,
    verbraucherId: 494900000000850,
    personId: 1500000000667,
    stundenplanungId: 503100000000548,
    stundenGeplant: '1',
    stundenGebucht: '0.00',
    position: 'Anwendungen',
    planungsjahr: 2026,
    vertragsname: 'BMI/IBM Leistungspartnerschaft 2019',
    verbraucherName: 'Iby Johannes',
    stundenplanung: {
      id: '503100000000548',
      version: 1,
      deleted: false,
      stundenGeplant: '1',
    },
    vertragPositionVerbraucher: {
      id: '494900000000850',
      version: 1,
      deleted: false,
      volumenStunden: '40',
      stundenpreis: '83.77',
      volumenEuro: '3350.80',
      verbraucherTyp: 'PERSONAL',
      aktiv: true,
      lkKennung: false,
      stundenplanung: [],
      trigger: [],
    },
  },
];

/** Default targets for "Ziel der Stundenumplanung" — kept as a
 *  fallback for callers that don't pass a per-verbraucher resolver. */
export const MOCK_VERTRAG_STUNDENPLANUNG_ZIEL: VertragStundenplanungZielEntry[] = [
  {
    produktKurzName: 'ZMR',
    position: 'Infobrige 2.0_P',
    produktPositionId: '420100000000201',
    stundenGeplant: '20',
    stundenGebucht: '0:00',
  },
  {
    produktKurzName: 'ZMR',
    position: 'LVR - Leistungsverrechnung',
    produktPositionId: '420100000000202',
    stundenGeplant: '2',
    stundenGebucht: '1:01',
  },
  {
    produktKurzName: 'ZMR',
    position: 'TEST_POSITION_HASSAN',
    produktPositionId: '420100000000103',
    stundenGeplant: '0',
    stundenGebucht: '0:00',
  },
];

/** Per-verbraucher target lists keyed by verbraucherId so the right
 *  table can change when the user selects a different source row.
 *  Each row gets a slightly different set so the change is visible. */
const ZIELE_BY_VERBRAUCHER_ID: Record<string, VertragStundenplanungZielEntry[]> = {
  // Hofstetter Walter — Betrieb
  '465300000000423': [
    {
      produktKurzName: 'ZMR',
      position: 'Infobrige 2.0_P',
      produktPositionId: '420100000000201',
      stundenGeplant: '20',
      stundenGebucht: '0:00',
    },
    {
      produktKurzName: 'ZMR',
      position: 'LVR - Leistungsverrechnung',
      produktPositionId: '420100000000202',
      stundenGeplant: '2',
      stundenGebucht: '1:01',
    },
  ],
  // Iby Johannes — Anwendungen
  '494900000000850': [
    {
      produktKurzName: 'ZMR',
      position: 'TEST_POSITION_HASSAN',
      produktPositionId: '420100000000103',
      stundenGeplant: '0',
      stundenGebucht: '0:00',
    },
    {
      produktKurzName: 'ZMR',
      position: 'Infobrige 2.0_P',
      produktPositionId: '420100000000201',
      stundenGeplant: '20',
      stundenGebucht: '0:00',
    },
    {
      produktKurzName: 'ZMR',
      position: 'EAS - Schulungen',
      produktPositionId: '420100000000301',
      stundenGeplant: '8',
      stundenGebucht: '4:30',
    },
  ],
};

/** Lookup helper used by the Stundenplanung dialog. Returns the
 *  per-verbraucher list when known, the default list otherwise. */
export function getMockZieleForVerbraucher(
  verbraucher: VertragVerbraucherStundenplanungEntry | null | undefined
): VertragStundenplanungZielEntry[] {
  if (!verbraucher) return [];
  const id = String(verbraucher.verbraucherId ?? '');
  return ZIELE_BY_VERBRAUCHER_ID[id] ?? MOCK_VERTRAG_STUNDENPLANUNG_ZIEL;
}
