import { ApiProdukt } from '../models/ApiProdukt';

/**
 * Mock detail data for the Produkte detail page. Lets the
 * produktposition tree render without going to the backend.
 *
 * Activated by ID — see ProduktService.getProduktById; any ID listed
 * in MOCK_PRODUKT_DETAILS short-circuits to the mock here, anything
 * else falls through to the real REST call.
 *
 * The component (`loadProduktData` in produkte-details.component.ts)
 * walks: produkt.produktPosition[*].produktPositionBuchungspunkt[*]
 * and reads these fields off each level — so the mock mirrors that
 * exact shape with realistic values.
 */

function iso(year: number, month: number, day: number): string {
  return new Date(year, month - 1, day).toISOString();
}

const PRODUKT_GET_IT: ApiProdukt = {
  id: 'mp1',
  produktname: 'Get-IT — Modernisierung',
  kurzName: 'Get-IT',
  start: iso(2025, 1, 1),
  ende:  iso(2027, 12, 31),
  aktiv: true,
  anmerkung: 'Modernisierungs- und Konsolidierungsprogramm der internen IT-Plattform.',
  auftraggeber: 'BMI',
  auftraggeberOrganisation: 'BMI / Abt. III/1',
  ergebnisverantwortlicher: { vorname: 'Maria', nachname: 'Neumann' } as any,
  produktTyp: 'Programm' as any,
  produktPosition: [
    {
      id: 'mp1-pos-1',
      produktPositionname: 'Frontend-Refactoring',
      start: iso(2025, 3, 1),
      ende:  iso(2026, 12, 31),
      aktiv: true,
      anmerkung: 'Material 18 → MDC components, dark mode, accessibility.',
      auftraggeber: 'BMI / Abt. III/1',
      auftraggeberOrganisation: 'Get-IT FE-Team',
      durchfuehrungsverantwortlicher: { vorname: 'Hassan', nachname: 'Terab' } as any,
      produktPositionTyp: 'Entwicklung' as any,
      buchungsfreigabe: true,
      produktPositionBuchungspunkt: [
        {
          id: 'mp1-pos-1-b1',
          buchungspunkt: 'Personen-Modul UI',
          aktiv: true,
          anmerkung: 'Form alignment + dark mode preview.',
          start: iso(2025, 3, 15),
          ende:  iso(2026, 6, 30),
          auftraggeber: 'BMI / Abt. III/1',
          organisationseinheit: 'Get-IT FE-Team',
          durchfuehrungsverantwortlicher: { vorname: 'Hassan', nachname: 'Terab' } as any,
          positionstyp: 'Entwicklung',
          buchungsfreigabe: true,
        } as any,
        {
          id: 'mp1-pos-1-b2',
          buchungspunkt: 'Stempelzeit-Detailansicht',
          aktiv: true,
          anmerkung: 'Tree-View, Zeittyp-Filter, Editmode.',
          start: iso(2025, 6, 1),
          ende:  iso(2026, 12, 31),
          auftraggeber: 'BMI / Abt. III/1',
          organisationseinheit: 'Get-IT FE-Team',
          durchfuehrungsverantwortlicher: { vorname: 'Anna', nachname: 'Müller' } as any,
          positionstyp: 'Entwicklung',
          buchungsfreigabe: true,
        } as any,
        {
          id: 'mp1-pos-1-b3',
          buchungspunkt: 'Validators & Mocks',
          aktiv: false,
          anmerkung: 'Konsolidierung der client-seitigen Validatoren.',
          start: iso(2025, 9, 1),
          ende:  iso(2026, 3, 31),
          auftraggeber: 'BMI / Abt. III/1',
          organisationseinheit: 'Get-IT FE-Team',
          durchfuehrungsverantwortlicher: { vorname: 'Bernd', nachname: 'Schmidt' } as any,
          positionstyp: 'Entwicklung',
          buchungsfreigabe: false,
        } as any,
      ],
    },
    {
      id: 'mp1-pos-2',
      produktPositionname: 'Backend-API Konsolidierung',
      start: iso(2025, 4, 1),
      ende:  iso(2027, 6, 30),
      aktiv: true,
      anmerkung: 'Spring-Boot Service-Layer + REST v1 → v2 Migration.',
      auftraggeber: 'BMI / Abt. III/1',
      auftraggeberOrganisation: 'Get-IT BE-Team',
      durchfuehrungsverantwortlicher: { vorname: 'Clara', nachname: 'Fischer' } as any,
      produktPositionTyp: 'Entwicklung' as any,
      buchungsfreigabe: true,
      produktPositionBuchungspunkt: [
        {
          id: 'mp1-pos-2-b1',
          buchungspunkt: 'Personen-Endpoint v2',
          aktiv: true,
          anmerkung: '',
          start: iso(2025, 5, 1),
          ende:  iso(2026, 4, 30),
          auftraggeber: 'BMI / Abt. III/1',
          organisationseinheit: 'Get-IT BE-Team',
          durchfuehrungsverantwortlicher: { vorname: 'Clara', nachname: 'Fischer' } as any,
          positionstyp: 'Entwicklung',
          buchungsfreigabe: true,
        } as any,
        {
          id: 'mp1-pos-2-b2',
          buchungspunkt: 'Stempelzeit-Endpoint v2',
          aktiv: true,
          anmerkung: '',
          start: iso(2025, 7, 1),
          ende:  iso(2026, 12, 31),
          auftraggeber: 'BMI / Abt. III/1',
          organisationseinheit: 'Get-IT BE-Team',
          durchfuehrungsverantwortlicher: { vorname: 'David', nachname: 'Weber' } as any,
          positionstyp: 'Entwicklung',
          buchungsfreigabe: true,
        } as any,
      ],
    },
    {
      id: 'mp1-pos-3',
      produktPositionname: 'Test & Quality Assurance',
      start: iso(2025, 6, 1),
      ende:  iso(2027, 12, 31),
      aktiv: true,
      anmerkung: 'E2E + Unit + Visual Regression Testing.',
      auftraggeber: 'BMI / Abt. III/1',
      auftraggeberOrganisation: 'Get-IT QA',
      durchfuehrungsverantwortlicher: { vorname: 'Felix', nachname: 'Becker' } as any,
      produktPositionTyp: 'Test' as any,
      buchungsfreigabe: false,
      produktPositionBuchungspunkt: [
        {
          id: 'mp1-pos-3-b1',
          buchungspunkt: 'Cypress E2E Setup',
          aktiv: true,
          anmerkung: 'Smoke-Tests für die kritischsten Flows.',
          start: iso(2025, 8, 1),
          ende:  iso(2026, 6, 30),
          auftraggeber: 'BMI / Abt. III/1',
          organisationseinheit: 'Get-IT QA',
          durchfuehrungsverantwortlicher: { vorname: 'Felix', nachname: 'Becker' } as any,
          positionstyp: 'Test',
          buchungsfreigabe: true,
        } as any,
      ],
    },
  ] as any,
};

const PRODUKT_INFRASTRUKTUR: ApiProdukt = {
  id: 'mp2',
  produktname: 'Rechenzentrum-Migration 2026',
  kurzName: 'RZM-2026',
  start: iso(2026, 1, 1),
  ende:  iso(2026, 12, 31),
  aktiv: true,
  anmerkung: 'Migration von RZ-Wien-Süd → RZ-Wien-Nord, Hardware-Refresh.',
  auftraggeber: 'BMI',
  auftraggeberOrganisation: 'BMI / Abt. III/2',
  ergebnisverantwortlicher: { vorname: 'Greta', nachname: 'Hoffmann' } as any,
  produktTyp: 'Infrastruktur' as any,
  produktPosition: [
    {
      id: 'mp2-pos-1',
      produktPositionname: 'Hardware-Beschaffung',
      start: iso(2026, 1, 1),
      ende:  iso(2026, 6, 30),
      aktiv: true,
      anmerkung: '',
      auftraggeber: 'BMI / Abt. III/2',
      auftraggeberOrganisation: 'Infra-Team',
      durchfuehrungsverantwortlicher: { vorname: 'Iris', nachname: 'Koch' } as any,
      produktPositionTyp: 'Beschaffung' as any,
      buchungsfreigabe: true,
      produktPositionBuchungspunkt: [
        {
          id: 'mp2-pos-1-b1',
          buchungspunkt: 'Server-Bestellung Phase 1',
          aktiv: true,
          start: iso(2026, 1, 15),
          ende:  iso(2026, 3, 31),
          auftraggeber: 'BMI / Abt. III/2',
          organisationseinheit: 'Infra-Team',
          durchfuehrungsverantwortlicher: { vorname: 'Iris', nachname: 'Koch' } as any,
          positionstyp: 'Beschaffung',
          buchungsfreigabe: true,
        } as any,
        {
          id: 'mp2-pos-1-b2',
          buchungspunkt: 'Server-Bestellung Phase 2',
          aktiv: false,
          start: iso(2026, 4, 1),
          ende:  iso(2026, 6, 30),
          auftraggeber: 'BMI / Abt. III/2',
          organisationseinheit: 'Infra-Team',
          durchfuehrungsverantwortlicher: { vorname: 'Jakob', nachname: 'Richter' } as any,
          positionstyp: 'Beschaffung',
          buchungsfreigabe: false,
        } as any,
      ],
    },
    {
      id: 'mp2-pos-2',
      produktPositionname: 'Migration & Cutover',
      start: iso(2026, 7, 1),
      ende:  iso(2026, 12, 31),
      aktiv: true,
      anmerkung: 'Wochenend-Cutover mit Rollback-Plan.',
      auftraggeber: 'BMI / Abt. III/2',
      auftraggeberOrganisation: 'Infra-Team',
      durchfuehrungsverantwortlicher: { vorname: 'Karin', nachname: 'Klein' } as any,
      produktPositionTyp: 'Migration' as any,
      buchungsfreigabe: true,
      produktPositionBuchungspunkt: [
        {
          id: 'mp2-pos-2-b1',
          buchungspunkt: 'Test-Cutover (Sandbox)',
          aktiv: true,
          start: iso(2026, 7, 1),
          ende:  iso(2026, 8, 31),
          auftraggeber: 'BMI / Abt. III/2',
          organisationseinheit: 'Infra-Team',
          durchfuehrungsverantwortlicher: { vorname: 'Lukas', nachname: 'Wolf' } as any,
          positionstyp: 'Migration',
          buchungsfreigabe: true,
        } as any,
        {
          id: 'mp2-pos-2-b2',
          buchungspunkt: 'Produktiv-Cutover',
          aktiv: true,
          start: iso(2026, 11, 1),
          ende:  iso(2026, 12, 15),
          auftraggeber: 'BMI / Abt. III/2',
          organisationseinheit: 'Infra-Team',
          durchfuehrungsverantwortlicher: { vorname: 'Maria', nachname: 'Neumann' } as any,
          positionstyp: 'Migration',
          buchungsfreigabe: false,
        } as any,
      ],
    },
  ] as any,
};

export const MOCK_PRODUKT_DETAILS: Record<string, ApiProdukt> = {
  mp1: PRODUKT_GET_IT,
  mp2: PRODUKT_INFRASTRUKTUR,
  // Aliases so any of the mock product-list IDs '1' / '2' also resolve.
  '1': PRODUKT_GET_IT,
  '2': PRODUKT_INFRASTRUKTUR,
};

export function hasMockProduktDetail(id: string | null | undefined): boolean {
  return !!id && id in MOCK_PRODUKT_DETAILS;
}
