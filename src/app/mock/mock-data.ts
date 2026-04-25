/**
 * Mock data set used by MockBackendInterceptor to simulate the BMI/GETIT
 * backend during local development when no real API is available.
 *
 * Every array mirrors the structure of the matching Api* model.
 */

import { ApiPerson } from '../models/ApiPerson';
import { ApiPersonAnwesenheit } from '../models/ApiPersonAnwesenheit';
import { ApiOrganisationseinheit } from '../models/ApiOrganisationseinheit';
import { ApiProdukt } from '../models/ApiProdukt';
import { ApiVertrag } from '../models/ApiVertrag';
import { ApiStempelzeit } from '../models/ApiStempelzeit';
import { ApiMitarbeiterart } from '../models/ApiMitarbeiterart';
import { ApiGeschlecht } from '../models/ApiGeschlecht';
import { ApiAnwesendStatus } from '../models/ApiAnwesendStatus';
import { ApiState } from '../models/ApiState';
import { ApiRolle } from '../models/ApiRolle';
import { ApiZeitTyp } from '../models/ApiZeitTyp';
import { ApiProduktTyp } from '../models/ApiProduktTyp';
import { ApiVertragsTyp } from '../models/ApiVertragsTyp';
import { ApiMussPdfLesen } from '../models/ApiMussPdfLesen';
import { ApiStempelzeitMarker } from '../models/ApiStempelzeitMarker';
import { ApiStempelzeitEintragungsart } from '../models/ApiStempelzeitEintragungsart';
import { ApiVerbraucherTyp } from '../models/ApiVerbraucherTyp';

// ─────────────────────────────────────────────────────────────────────────────
// Organisationseinheiten
// ─────────────────────────────────────────────────────────────────────────────
export const MOCK_ORGANISATIONSEINHEITEN: ApiOrganisationseinheit[] = [
  {
    id: 'oe-1',
    version: 1,
    deleted: false,
    state: ApiState.READ,
    bezeichnung: 'IT-Entwicklung',
    kurzBezeichnung: 'IT-ENT',
    gueltigVon: '2020-01-01',
    gueltigBis: '2099-12-31',
    email: ['it-entwicklung@example.at'],
  },
  {
    id: 'oe-2',
    version: 1,
    deleted: false,
    state: ApiState.READ,
    bezeichnung: 'IT-Betrieb',
    kurzBezeichnung: 'IT-BTR',
    gueltigVon: '2020-01-01',
    gueltigBis: '2099-12-31',
    email: ['it-betrieb@example.at'],
  },
  {
    id: 'oe-3',
    version: 1,
    deleted: false,
    state: ApiState.READ,
    bezeichnung: 'Projektmanagement',
    kurzBezeichnung: 'PM',
    gueltigVon: '2021-06-01',
    gueltigBis: '2099-12-31',
    email: ['pm@example.at'],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Personen
// ─────────────────────────────────────────────────────────────────────────────
export const MOCK_LOGGED_IN_PERSON: ApiPerson = {
  id: 'p-me',
  version: 1,
  deleted: false,
  state: ApiState.READ,
  titel: 'Mag.',
  vorname: 'Hassan',
  nachname: 'Adam',
  geschlecht: ApiGeschlecht.MAENNLICH,
  persnr: '100001',
  portalUser: 'hadam',
  email: 'hassan.adam@example.at',
  eintrittsDatum: '2022-03-01',
  aktiv: true,
  telefonNummer: '+43 1 234 5678',
  zimmerNummer: 'A 3.14',
  organisationseinheit: MOCK_ORGANISATIONSEINHEITEN[0],
  rolle: ApiRolle.ADMIN_LEITER,
  mitarbeiterart: ApiMitarbeiterart.INTERN,
  leistungskategorie: 'LK1',
  stundensatz: '85.00',
  stundenkontingentJaehrlich: '1760',
  geprueft: true,
};

export const MOCK_PERSONEN: ApiPerson[] = [
  MOCK_LOGGED_IN_PERSON,
  {
    id: 'p-2',
    version: 2,
    deleted: false,
    state: ApiState.READ,
    vorname: 'Anna',
    nachname: 'Müller',
    geschlecht: ApiGeschlecht.WEIBLICH,
    persnr: '100002',
    portalUser: 'amueller',
    email: 'anna.mueller@example.at',
    eintrittsDatum: '2019-09-15',
    aktiv: true,
    organisationseinheit: MOCK_ORGANISATIONSEINHEITEN[0],
    rolle: ApiRolle.PROJECT_OFFICE,
    mitarbeiterart: ApiMitarbeiterart.INTERN,
  },
  {
    id: 'p-3',
    version: 1,
    deleted: false,
    state: ApiState.READ,
    vorname: 'Peter',
    nachname: 'Schmidt',
    geschlecht: ApiGeschlecht.MAENNLICH,
    persnr: '100003',
    portalUser: 'pschmidt',
    email: 'peter.schmidt@example.at',
    eintrittsDatum: '2018-04-10',
    aktiv: true,
    organisationseinheit: MOCK_ORGANISATIONSEINHEITEN[1],
    rolle: ApiRolle.DEFAULT,
    mitarbeiterart: ApiMitarbeiterart.EXTERN,
    firma: 'ACME Consulting GmbH',
  },
  {
    id: 'p-4',
    version: 3,
    deleted: false,
    state: ApiState.READ,
    vorname: 'Julia',
    nachname: 'Huber',
    geschlecht: ApiGeschlecht.WEIBLICH,
    persnr: '100004',
    portalUser: 'jhuber',
    email: 'julia.huber@example.at',
    eintrittsDatum: '2023-01-02',
    aktiv: true,
    organisationseinheit: MOCK_ORGANISATIONSEINHEITEN[2],
    rolle: ApiRolle.PROJECT_OFFICE_READ_ONLY,
    mitarbeiterart: ApiMitarbeiterart.INTERN,
  },
  {
    id: 'p-5',
    version: 1,
    deleted: false,
    state: ApiState.READ,
    vorname: 'Max',
    nachname: 'Gruber',
    geschlecht: ApiGeschlecht.MAENNLICH,
    persnr: '100005',
    portalUser: 'mgruber',
    email: 'max.gruber@example.at',
    eintrittsDatum: '2024-05-20',
    aktiv: true,
    organisationseinheit: MOCK_ORGANISATIONSEINHEITEN[1],
    rolle: ApiRolle.DEFAULT,
    mitarbeiterart: ApiMitarbeiterart.ZIVILDIENSTLEISTENDER,
  },
];

// Generate 95 additional persons so lists (e.g. /abwesenheit-korrigieren) have
// a realistic 100-row dataset to scroll through.
(() => {
  const vornamen = [
    'Lukas', 'Sophie', 'Michael', 'Laura', 'Daniel', 'Nina', 'Thomas', 'Sarah',
    'Markus', 'Lisa', 'Stefan', 'Elena', 'Christoph', 'Katharina', 'Alexander',
    'Marlene', 'Florian', 'Valentina', 'Martin', 'Theresa', 'Simon', 'Hannah',
    'Philipp', 'Magdalena', 'Tobias', 'Leonie', 'Jakob', 'Isabella', 'David',
    'Charlotte', 'Manuel', 'Amelie', 'Patrick', 'Emma', 'Sebastian', 'Mia',
    'Fabian', 'Clara', 'Andreas', 'Victoria', 'Jonas', 'Marie', 'Maximilian',
    'Johanna', 'Benedikt', 'Lena', 'Raphael', 'Paula', 'Moritz'
  ];
  const nachnamen = [
    'Wagner', 'Bauer', 'Fischer', 'Weber', 'Hofer', 'Schneider', 'Mayer',
    'Lehmann', 'Winkler', 'Steiner', 'Egger', 'Lang', 'Brunner', 'Reiter',
    'Berger', 'Koller', 'Pichler', 'Moser', 'Schuster', 'Haas', 'Wimmer',
    'Lechner', 'Mayr', 'Fuchs', 'Schwarz', 'Böhm', 'Gruber', 'Maier', 'Horvath',
    'Leitner', 'Kainz', 'Wallner', 'Wieser', 'Auer', 'Pfeiffer', 'Schober',
    'Stadler', 'Zeller', 'Binder', 'Jäger', 'Klein', 'Hoffmann', 'Kohler',
    'Neumann', 'Graf', 'Bader', 'Stocker', 'Baumgartner', 'Eder', 'Ortner'
  ];
  const mitarbeiterarten = [
    ApiMitarbeiterart.INTERN,
    ApiMitarbeiterart.EXTERN,
    ApiMitarbeiterart.ZIVILDIENSTLEISTENDER,
  ];
  const rollen = [
    ApiRolle.DEFAULT,
    ApiRolle.PROJECT_OFFICE,
    ApiRolle.PROJECT_OFFICE_READ_ONLY,
  ];

  for (let i = 6; i <= 100; i++) {
    const vor = vornamen[(i * 7) % vornamen.length];
    const nach = nachnamen[(i * 13) % nachnamen.length];
    const maart = mitarbeiterarten[i % mitarbeiterarten.length];
    const rolle = rollen[i % rollen.length];
    const geschlecht = i % 2 === 0 ? ApiGeschlecht.WEIBLICH : ApiGeschlecht.MAENNLICH;
    const oe = MOCK_ORGANISATIONSEINHEITEN[i % MOCK_ORGANISATIONSEINHEITEN.length];
    const year = 2015 + (i % 11);
    const month = String((i % 12) + 1).padStart(2, '0');
    const day = String((i % 27) + 1).padStart(2, '0');

    MOCK_PERSONEN.push({
      id: `p-${i}`,
      version: 1,
      deleted: false,
      state: ApiState.READ,
      vorname: vor,
      nachname: nach,
      geschlecht,
      persnr: String(100000 + i),
      portalUser: `${vor[0].toLowerCase()}${nach.toLowerCase()}${i}`,
      email: `${vor.toLowerCase()}.${nach.toLowerCase()}@example.at`,
      eintrittsDatum: `${year}-${month}-${day}`,
      aktiv: i % 13 !== 0, // every 13th is inactive
      organisationseinheit: oe,
      rolle,
      mitarbeiterart: maart,
      firma: maart === ApiMitarbeiterart.EXTERN ? 'ACME Consulting GmbH' : undefined,
    });
  }
})();

// ─────────────────────────────────────────────────────────────────────────────
// Anwesenheit (presence list) — shape is ApiPersonAnwesenheit
// ─────────────────────────────────────────────────────────────────────────────
export const MOCK_ANWESEND_PERSONEN: ApiPersonAnwesenheit[] = MOCK_PERSONEN.map(
  (p, idx) => ({
    vorname: p.vorname,
    nachname: p.nachname,
    portalUser: p.portalUser,
    personId: p.id,
    mitarbeiterart: p.mitarbeiterart,
    logoff: idx % 2 === 0 ? undefined : '2026-04-19T16:30:00',
    anwesend:
      idx === 0
        ? ApiAnwesendStatus.ANWESEND
        : idx === 1
        ? ApiAnwesendStatus.ANWESEND_HOMEOFFICE
        : idx === 2
        ? ApiAnwesendStatus.WAR_HEUTE_ANWESEND
        : idx === 3
        ? ApiAnwesendStatus.URLAUB
        : ApiAnwesendStatus.ABWESEND,
    abwesenheitVorhanden: idx >= 3,
  })
);

// ─────────────────────────────────────────────────────────────────────────────
// Produkte
// ─────────────────────────────────────────────────────────────────────────────
export const MOCK_PRODUKTE: ApiProdukt[] = [
  {
    id: 'prod-1',
    version: 1,
    deleted: false,
    state: ApiState.READ,
    produktname: 'GETIT Portal',
    kurzName: 'GETIT',
    start: '2020-01-01',
    ende: '2099-12-31',
    aktiv: true,
    auftraggeber: 'Bundesministerium',
    auftraggeberOrganisation: 'BMI',
    ergebnisverantwortlicher: MOCK_PERSONEN[1],
    produktTyp: ApiProduktTyp.ANWENDUNG,
  },
  {
    id: 'prod-2',
    version: 1,
    deleted: false,
    state: ApiState.READ,
    produktname: 'SAP Basis',
    kurzName: 'SAP-B',
    start: '2018-01-01',
    ende: '2099-12-31',
    aktiv: true,
    auftraggeber: 'Bundesministerium',
    auftraggeberOrganisation: 'BMI',
    ergebnisverantwortlicher: MOCK_PERSONEN[2],
    produktTyp: ApiProduktTyp.ADMINISTRATION,
  },
  {
    id: 'prod-3',
    version: 1,
    deleted: false,
    state: ApiState.READ,
    produktname: 'Identity Platform',
    kurzName: 'IDP',
    start: '2021-06-01',
    ende: '2099-12-31',
    aktiv: true,
    produktTyp: ApiProduktTyp.ZENTRALE_KOMPONENTE,
    ergebnisverantwortlicher: MOCK_PERSONEN[0],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Verträge
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Generates additional vertragPosition entries for a vertrag so the tree in
 * /vertraege/:id (vertrag-detail-2) has enough rows to test scrolling and
 * alignment of varied-length names.
 */
function buildExtraVertragPositionen(count: number, parentId: string): any[] {
  const namesLong = [
    'Cloud-Migration Produktionssysteme (AWS EU-Central & Fallback AT-Vienna)',
    'Sicherheitsaudit & Penetration-Testing der extern erreichbaren Schnittstellen',
    'End-to-End Monitoring + Alerting Rollout (Prometheus, Grafana, PagerDuty)',
    'Einführung Continuous Delivery Pipeline mit GitLab Runner und ArgoCD',
    'DSGVO-Konformitätsprüfung und Anpassung Datenhaltung personenbezogener Daten',
  ];
  const namesMed = [
    'Mobile App Modernisierung',
    'API Gateway Rollout',
    'Schulung Entwicklerteam',
    'Barrierefreiheit WCAG 2.2',
    'Performance Tuning',
    'Legacy Refactoring',
    'Observability Dashboards',
    'Disaster Recovery',
  ];
  const namesShort = ['UX', 'DB', 'CI', 'QA', 'Ops', 'Sec', 'Doc'];

  const produkte = [
    { produktname: 'GETIT Portal', kurzName: 'GETIT' },
    { produktname: 'Personen-Service', kurzName: 'PERS' },
    { produktname: 'Reporting Engine', kurzName: 'RPT' },
    { produktname: 'Identity Platform', kurzName: 'IDP' },
    { produktname: 'Datenbank-Plattform', kurzName: 'DB' },
    { produktname: 'Observability Stack', kurzName: 'OBS' },
    { produktname: 'Code Quality Gate', kurzName: 'CQ' },
  ];
  const verbraucherNames = [
    'Hassan Adam Terab',
    'Anna Müller',
    'Dr. Peter Friedrich Schmidt-Hohenberg',
    'Max Gruber',
    'Julia Huber',
    'HA',
    'Stefan Breitner – Externer Berater (ACME GmbH)',
  ];

  const pickName = (i: number) => {
    const m = i % 5;
    if (m === 0) return namesLong[i % namesLong.length];
    if (m === 4) return namesShort[i % namesShort.length];
    return namesMed[i % namesMed.length];
  };

  const out: any[] = [];
  for (let i = 0; i < count; i++) {
    const idx = i + 5; // start after manually authored vp-1a..vp-1d
    const aktiv = i % 7 !== 0;
    const volStd = 200 + ((i * 173) % 2400);
    const volEuro = volStd * (100 + (i % 3) * 25);
    const geplant = Math.floor(volStd * 0.9);
    const verbraucher1 = verbraucherNames[i % verbraucherNames.length];
    const verbraucher2 = verbraucherNames[(i + 3) % verbraucherNames.length];
    const produktA = produkte[i % produkte.length];
    const produktB = produkte[(i + 2) % produkte.length];

    out.push({
      id: `vp-${parentId}-ext-${idx}`,
      version: 1, deleted: false, state: ApiState.READ,
      position: pickName(i),
      volumenStunden: String(volStd),
      volumenEuro: volEuro.toFixed(2),
      aktiv, planungsjahr: '2026',
      stundenGeplant: String(geplant), stundenGebucht: String(Math.floor(geplant / 3)),
      vertragPositionVerbraucher: [
        {
          id: `vpv-${parentId}-ext-${idx}-1`,
          version: 1, deleted: false, state: ApiState.READ,
          verbraucher: verbraucher1, verbraucherTyp: ApiVerbraucherTyp.PERSONAL,
          volumenStunden: String(Math.floor(volStd * 0.6)),
          volumenEuro: (volEuro * 0.6).toFixed(2),
          stundenpreis: '120.00',
          aktiv, person: MOCK_PERSONEN[i % MOCK_PERSONEN.length],
          stundenGeplant: String(Math.floor(geplant * 0.6)),
          stundenGebucht: String(Math.floor(geplant * 0.2)),
          stundenplanung: [
            {
              id: `sp-${parentId}-ext-${idx}-1-1`, version: 1, state: ApiState.READ,
              stundenGeplant: String(Math.floor(geplant * 0.4)),
              produktPosition: {
                id: `pp-${parentId}-ext-${idx}-1-1`, aktiv: aktiv,
                produktPositionname: pickName(i + 1),
                produkt: produktA,
              },
            },
            {
              id: `sp-${parentId}-ext-${idx}-1-2`, version: 1, state: ApiState.READ,
              stundenGeplant: String(Math.floor(geplant * 0.2)),
              produktPosition: {
                id: `pp-${parentId}-ext-${idx}-1-2`, aktiv: true,
                produktPositionname: pickName(i + 2),
                produkt: produktB,
              },
            },
          ],
        },
        {
          id: `vpv-${parentId}-ext-${idx}-2`,
          version: 1, deleted: false, state: ApiState.READ,
          verbraucher: verbraucher2, verbraucherTyp: ApiVerbraucherTyp.PERSONAL,
          volumenStunden: String(Math.floor(volStd * 0.4)),
          volumenEuro: (volEuro * 0.4).toFixed(2),
          stundenpreis: '120.00',
          aktiv, person: MOCK_PERSONEN[(i + 2) % MOCK_PERSONEN.length],
          stundenGeplant: String(Math.floor(geplant * 0.4)),
          stundenGebucht: String(Math.floor(geplant * 0.15)),
          stundenplanung: [
            {
              id: `sp-${parentId}-ext-${idx}-2-1`, version: 1, state: ApiState.READ,
              stundenGeplant: String(Math.floor(geplant * 0.4)),
              produktPosition: {
                id: `pp-${parentId}-ext-${idx}-2-1`, aktiv: true,
                produktPositionname: pickName(i + 3),
                produkt: produktA,
              },
            },
          ],
        },
      ],
    });
  }
  return out;
}

export const MOCK_VERTRAEGE: ApiVertrag[] = [
  {
    id: 'v-1',
    version: 1,
    deleted: false,
    state: ApiState.READ,
    vertragsname: 'Rahmenvertrag Softwareentwicklung 2024',
    vertragspartner: 'ACME Consulting GmbH',
    gueltigVon: '2024-01-01',
    gueltigBis: '2026-12-31',
    aktiv: true,
    auftraggeber: 'BMI',
    vertragssumme: '1200000.00',
    vertragsTyp: ApiVertragsTyp.PROJEKT,
    vertragsverantwortlicher: MOCK_PERSONEN[0],
    stundenGeplant: '8000',
    stundenGebucht: '3240',
    vertragPosition: [
      {
        id: 'vp-1a', version: 1, deleted: false, state: ApiState.READ,
        position: 'FE-Entwicklung GETIT Portal – Angular 19 Migration & Redesign',
        volumenStunden: '4000', volumenEuro: '480000.00',
        aktiv: true, planungsjahr: '2026',
        stundenGeplant: '4000', stundenGebucht: '1850',
        vertragPositionVerbraucher: [
          {
            id: 'vpv-1a-1', version: 1, deleted: false, state: ApiState.READ,
            verbraucher: 'Hassan Adam Terab – Senior Frontend Engineer', verbraucherTyp: ApiVerbraucherTyp.PERSONAL,
            volumenStunden: '1200', volumenEuro: '144000.00', stundenpreis: '120.00',
            aktiv: true, person: MOCK_LOGGED_IN_PERSON,
            stundenGeplant: '1200', stundenGebucht: '620',
            stundenplanung: [
              {
                id: 'sp-1a-1-1', version: 1, state: ApiState.READ,
                stundenGeplant: '300',
                produktPosition: {
                  id: 'pp-1a-1-1', aktiv: true,
                  produktPositionname: 'Komponentenbibliothek Redesign',
                  produkt: { produktname: 'UI Component Library Angular', kurzName: 'UILIB' },
                },
              },
              {
                id: 'sp-1a-1-2', version: 1, state: ApiState.READ,
                stundenGeplant: '500',
                produktPosition: {
                  id: 'pp-1a-1-2', aktiv: true,
                  produktPositionname: 'Dashboard',
                  produkt: { produktname: 'Personen', kurzName: 'PERS' },
                },
              },
              {
                id: 'sp-1a-1-3', version: 1, state: ApiState.READ,
                stundenGeplant: '400',
                produktPosition: {
                  id: 'pp-1a-1-3', aktiv: false,
                  produktPositionname: 'Legacy Reports (abgekündigt)',
                  produkt: { produktname: 'Reporting Engine', kurzName: 'RPT' },
                },
              },
            ],
          },
          {
            id: 'vpv-1a-2', version: 1, deleted: false, state: ApiState.READ,
            verbraucher: 'Anna Müller', verbraucherTyp: ApiVerbraucherTyp.PERSONAL,
            volumenStunden: '800', volumenEuro: '96000.00', stundenpreis: '120.00',
            aktiv: true, person: MOCK_PERSONEN[1],
            stundenGeplant: '800', stundenGebucht: '350',
            stundenplanung: [
              {
                id: 'sp-1a-2-1', version: 1, state: ApiState.READ,
                stundenGeplant: '250',
                produktPosition: {
                  id: 'pp-1a-2-1', aktiv: true,
                  produktPositionname: 'Test',
                  produkt: { produktname: 'QA', kurzName: 'QA' },
                },
              },
              {
                id: 'sp-1a-2-2', version: 1, state: ApiState.READ,
                stundenGeplant: '550',
                produktPosition: {
                  id: 'pp-1a-2-2', aktiv: true,
                  produktPositionname: 'Internationale Lokalisierung – DE/EN/FR/IT/ES',
                  produkt: { produktname: 'Translation Service Framework', kurzName: 'TSF' },
                },
              },
            ],
          },
        ],
      },
      {
        id: 'vp-1b', version: 1, deleted: false, state: ApiState.READ,
        position: 'BE-Dev',
        volumenStunden: '3000', volumenEuro: '360000.00',
        aktiv: true, planungsjahr: '2026',
        stundenGeplant: '3000', stundenGebucht: '1070',
        vertragPositionVerbraucher: [
          {
            id: 'vpv-1b-1', version: 1, deleted: false, state: ApiState.READ,
            verbraucher: 'HA', verbraucherTyp: ApiVerbraucherTyp.PERSONAL,
            volumenStunden: '600', volumenEuro: '72000.00', stundenpreis: '120.00',
            aktiv: true, person: MOCK_LOGGED_IN_PERSON,
            stundenGeplant: '600', stundenGebucht: '260',
            stundenplanung: [
              {
                id: 'sp-1b-1-1', version: 1, state: ApiState.READ,
                stundenGeplant: '600',
                produktPosition: {
                  id: 'pp-1b-1-1', aktiv: true,
                  produktPositionname: 'Auth Service',
                  produkt: { produktname: 'Identity Platform', kurzName: 'IDP' },
                },
              },
            ],
          },
          {
            id: 'vpv-1b-2', version: 1, deleted: false, state: ApiState.READ,
            verbraucher: 'Dr. Peter Friedrich Schmidt-Hohenberg (extern, ACME Consulting GmbH, Standort Wien)',
            verbraucherTyp: ApiVerbraucherTyp.PERSONAL,
            volumenStunden: '1400', volumenEuro: '168000.00', stundenpreis: '120.00',
            aktiv: true, person: MOCK_PERSONEN[2],
            stundenGeplant: '1400', stundenGebucht: '810',
            stundenplanung: [
              {
                id: 'sp-1b-2-1', version: 1, state: ApiState.READ,
                stundenGeplant: '700',
                produktPosition: {
                  id: 'pp-1b-2-1', aktiv: true,
                  produktPositionname: 'Datenbankmigration Oracle → PostgreSQL (Gesamtsystem)',
                  produkt: { produktname: 'Datenbank-Plattform GETIT', kurzName: 'DB' },
                },
              },
              {
                id: 'sp-1b-2-2', version: 1, state: ApiState.READ,
                stundenGeplant: '400',
                produktPosition: {
                  id: 'pp-1b-2-2', aktiv: true,
                  produktPositionname: 'API',
                  produkt: { produktname: 'GW', kurzName: 'GW' },
                },
              },
              {
                id: 'sp-1b-2-3', version: 1, state: ApiState.READ,
                stundenGeplant: '300',
                produktPosition: {
                  id: 'pp-1b-2-3', aktiv: false,
                  produktPositionname: 'Monitoring Infrastruktur (eingestellt 01/2026)',
                  produkt: { produktname: 'Observability Stack', kurzName: 'OBS' },
                },
              },
            ],
          },
        ],
      },
      {
        id: 'vp-1c', version: 1, deleted: false, state: ApiState.READ,
        position: 'Architektur-Beratung & Review (Bewertung der aktuellen Systemlandschaft)',
        volumenStunden: '1000', volumenEuro: '150000.00',
        aktiv: true, planungsjahr: '2026',
        stundenGeplant: '1000', stundenGebucht: '320',
        vertragPositionVerbraucher: [
          {
            id: 'vpv-1c-1', version: 1, deleted: false, state: ApiState.READ,
            verbraucher: 'Peter Schmidt', verbraucherTyp: ApiVerbraucherTyp.PERSONAL,
            volumenStunden: '1000', volumenEuro: '150000.00', stundenpreis: '150.00',
            aktiv: true, person: MOCK_PERSONEN[2],
            stundenGeplant: '1000', stundenGebucht: '320',
            stundenplanung: [
              {
                id: 'sp-1c-1-1', version: 1, state: ApiState.READ,
                stundenGeplant: '600',
                produktPosition: {
                  id: 'pp-1c-1-1', aktiv: true,
                  produktPositionname: 'Architektur-Board & Governance Workshops Q1–Q4',
                  produkt: { produktname: 'Enterprise Architecture Office', kurzName: 'EA' },
                },
              },
              {
                id: 'sp-1c-1-2', version: 1, state: ApiState.READ,
                stundenGeplant: '400',
                produktPosition: {
                  id: 'pp-1c-1-2', aktiv: true,
                  produktPositionname: 'Review',
                  produkt: { produktname: 'Code Quality Gate', kurzName: 'CQ' },
                },
              },
            ],
          },
        ],
      },
      {
        id: 'vp-1d', version: 1, deleted: false, state: ApiState.READ,
        position: 'Kurz',
        volumenStunden: '500', volumenEuro: '60000.00',
        aktiv: false, planungsjahr: '2026',
        stundenGeplant: '500', stundenGebucht: '0',
        vertragPositionVerbraucher: [
          {
            id: 'vpv-1d-1', version: 1, deleted: false, state: ApiState.READ,
            verbraucher: 'X', verbraucherTyp: ApiVerbraucherTyp.PERSONAL,
            volumenStunden: '500', volumenEuro: '60000.00', stundenpreis: '120.00',
            aktiv: false, person: MOCK_PERSONEN[4],
            stundenGeplant: '500', stundenGebucht: '0',
            stundenplanung: [],
          },
        ],
      },
      ...buildExtraVertragPositionen(26, 'v-1'),
    ],
  },
  {
    id: 'v-2',
    version: 1,
    deleted: false,
    state: ApiState.READ,
    vertragsname: 'Betriebsvertrag Infrastruktur 2025',
    vertragspartner: 'TechOps Austria AG',
    gueltigVon: '2025-01-01',
    gueltigBis: '2028-12-31',
    aktiv: true,
    auftraggeber: 'BMI',
    vertragssumme: '3500000.00',
    vertragsTyp: ApiVertragsTyp.BETRIEB,
    vertragsverantwortlicher: MOCK_PERSONEN[1],
    stundenGeplant: '18000',
    stundenGebucht: '2050',
    vertragPosition: [
      {
        id: 'vp-2a', version: 1, deleted: false, state: ApiState.READ,
        position: 'Server Operations',
        volumenStunden: '8000', volumenEuro: '800000.00',
        aktiv: true, planungsjahr: '2026',
        stundenGeplant: '8000', stundenGebucht: '550',
        vertragPositionVerbraucher: [
          {
            id: 'vpv-2a-1', version: 1, deleted: false, state: ApiState.READ,
            verbraucher: 'Peter Schmidt', verbraucherTyp: ApiVerbraucherTyp.PERSONAL,
            volumenStunden: '3000', volumenEuro: '300000.00', stundenpreis: '100.00',
            aktiv: true, person: MOCK_PERSONEN[2],
            stundenGeplant: '3000', stundenGebucht: '400',
          },
          {
            id: 'vpv-2a-2', version: 1, deleted: false, state: ApiState.READ,
            verbraucher: 'Max Gruber', verbraucherTyp: ApiVerbraucherTyp.PERSONAL,
            volumenStunden: '500', volumenEuro: '50000.00', stundenpreis: '100.00',
            aktiv: true, person: MOCK_PERSONEN[4],
            stundenGeplant: '500', stundenGebucht: '150',
          },
        ],
      },
      {
        id: 'vp-2b', version: 1, deleted: false, state: ApiState.READ,
        position: 'Incident Response',
        volumenStunden: '5000', volumenEuro: '600000.00',
        aktiv: true, planungsjahr: '2026',
        stundenGeplant: '5000', stundenGebucht: '1160',
        vertragPositionVerbraucher: [
          {
            id: 'vpv-2b-1', version: 1, deleted: false, state: ApiState.READ,
            verbraucher: 'Hassan Adam', verbraucherTyp: ApiVerbraucherTyp.PERSONAL,
            volumenStunden: '500', volumenEuro: '60000.00', stundenpreis: '120.00',
            aktiv: true, person: MOCK_LOGGED_IN_PERSON,
            stundenGeplant: '500', stundenGebucht: '180',
          },
          {
            id: 'vpv-2b-2', version: 1, deleted: false, state: ApiState.READ,
            verbraucher: 'Peter Schmidt', verbraucherTyp: ApiVerbraucherTyp.PERSONAL,
            volumenStunden: '2500', volumenEuro: '300000.00', stundenpreis: '120.00',
            aktiv: true, person: MOCK_PERSONEN[2],
            stundenGeplant: '2500', stundenGebucht: '980',
          },
        ],
      },
      {
        id: 'vp-2c', version: 1, deleted: false, state: ApiState.READ,
        position: 'Monitoring & Support',
        volumenStunden: '5000', volumenEuro: '500000.00',
        aktiv: true, planungsjahr: '2026',
        stundenGeplant: '5000', stundenGebucht: '700',
        vertragPositionVerbraucher: [
          {
            id: 'vpv-2c-1', version: 1, deleted: false, state: ApiState.READ,
            verbraucher: 'Julia Huber', verbraucherTyp: ApiVerbraucherTyp.PERSONAL,
            volumenStunden: '2000', volumenEuro: '200000.00', stundenpreis: '100.00',
            aktiv: true, person: MOCK_PERSONEN[3],
            stundenGeplant: '2000', stundenGebucht: '700',
          },
        ],
      },
    ],
  },
  {
    id: 'v-3',
    version: 1,
    deleted: false,
    state: ApiState.READ,
    vertragsname: 'Digitale Akte 2026',
    vertragspartner: 'BMI-DigiServ GmbH',
    gueltigVon: '2026-01-01',
    gueltigBis: '2027-12-31',
    aktiv: true,
    auftraggeber: 'BMI',
    vertragssumme: '720000.00',
    vertragsTyp: ApiVertragsTyp.PROJEKT,
    vertragsverantwortlicher: MOCK_LOGGED_IN_PERSON,
    stundenGeplant: '5500',
    stundenGebucht: '920',
    vertragPosition: [
      {
        id: 'vp-3a', version: 1, deleted: false, state: ApiState.READ,
        position: 'Requirements Engineering',
        volumenStunden: '2000', volumenEuro: '300000.00',
        aktiv: true, planungsjahr: '2026',
        stundenGeplant: '2000', stundenGebucht: '320',
        vertragPositionVerbraucher: [
          {
            id: 'vpv-3a-1', version: 1, deleted: false, state: ApiState.READ,
            verbraucher: 'Anna Müller', verbraucherTyp: ApiVerbraucherTyp.PERSONAL,
            volumenStunden: '1200', volumenEuro: '180000.00', stundenpreis: '150.00',
            aktiv: true, person: MOCK_PERSONEN[1],
            stundenGeplant: '1200', stundenGebucht: '200',
          },
          {
            id: 'vpv-3a-2', version: 1, deleted: false, state: ApiState.READ,
            verbraucher: 'Hassan Adam', verbraucherTyp: ApiVerbraucherTyp.PERSONAL,
            volumenStunden: '500', volumenEuro: '75000.00', stundenpreis: '150.00',
            aktiv: true, person: MOCK_LOGGED_IN_PERSON,
            stundenGeplant: '500', stundenGebucht: '120',
          },
        ],
      },
      {
        id: 'vp-3b', version: 1, deleted: false, state: ApiState.READ,
        position: 'Implementation',
        volumenStunden: '3500', volumenEuro: '420000.00',
        aktiv: true, planungsjahr: '2026',
        stundenGeplant: '3500', stundenGebucht: '600',
        vertragPositionVerbraucher: [
          {
            id: 'vpv-3b-1', version: 1, deleted: false, state: ApiState.READ,
            verbraucher: 'Hassan Adam', verbraucherTyp: ApiVerbraucherTyp.PERSONAL,
            volumenStunden: '1000', volumenEuro: '120000.00', stundenpreis: '120.00',
            aktiv: true, person: MOCK_LOGGED_IN_PERSON,
            stundenGeplant: '1000', stundenGebucht: '340',
          },
          {
            id: 'vpv-3b-2', version: 1, deleted: false, state: ApiState.READ,
            verbraucher: 'Julia Huber', verbraucherTyp: ApiVerbraucherTyp.PERSONAL,
            volumenStunden: '800', volumenEuro: '96000.00', stundenpreis: '120.00',
            aktiv: true, person: MOCK_PERSONEN[3],
            stundenGeplant: '800', stundenGebucht: '260',
          },
        ],
      },
    ],
  },
  {
    id: 'v-4',
    version: 1,
    deleted: false,
    state: ApiState.READ,
    vertragsname: 'Altvertrag E-Government 2022 (ausgelaufen)',
    vertragspartner: 'OldTech Solutions GmbH',
    gueltigVon: '2022-01-01',
    gueltigBis: '2023-12-31',
    aktiv: false,
    auftraggeber: 'BMI',
    vertragssumme: '450000.00',
    vertragsTyp: ApiVertragsTyp.PROJEKT,
    vertragsverantwortlicher: MOCK_PERSONEN[2],
    stundenGeplant: '3200',
    stundenGebucht: '3200',
    vertragPosition: [
      {
        id: 'vp-4a', version: 1, deleted: false, state: ApiState.READ,
        position: 'Legacy Migration',
        volumenStunden: '3200', volumenEuro: '450000.00',
        aktiv: false, planungsjahr: '2023',
        stundenGeplant: '3200', stundenGebucht: '3200',
        vertragPositionVerbraucher: [
          {
            id: 'vpv-4a-1', version: 1, deleted: false, state: ApiState.READ,
            verbraucher: 'Hassan Adam', verbraucherTyp: ApiVerbraucherTyp.PERSONAL,
            volumenStunden: '1600', volumenEuro: '225000.00', stundenpreis: '140.00',
            aktiv: false, person: MOCK_LOGGED_IN_PERSON,
            stundenGeplant: '1600', stundenGebucht: '1600',
          },
        ],
      },
    ],
  },
  {
    id: 'v-5',
    version: 1,
    deleted: false,
    state: ApiState.READ,
    vertragsname: 'Pilotprojekt Dokumentenmanagement 2023',
    vertragspartner: 'DocuFlow Systems',
    gueltigVon: '2023-03-01',
    gueltigBis: '2024-02-28',
    aktiv: false,
    auftraggeber: 'BMI',
    vertragssumme: '180000.00',
    vertragsTyp: ApiVertragsTyp.PROJEKT,
    vertragsverantwortlicher: MOCK_PERSONEN[1],
    stundenGeplant: '1500',
    stundenGebucht: '1500',
    vertragPosition: [
      {
        id: 'vp-5a', version: 1, deleted: false, state: ApiState.READ,
        position: 'Pilot Implementation',
        volumenStunden: '1500', volumenEuro: '180000.00',
        aktiv: false, planungsjahr: '2023',
        stundenGeplant: '1500', stundenGebucht: '1500',
        vertragPositionVerbraucher: [
          {
            id: 'vpv-5a-1', version: 1, deleted: false, state: ApiState.READ,
            verbraucher: 'Anna Müller', verbraucherTyp: ApiVerbraucherTyp.PERSONAL,
            volumenStunden: '900', volumenEuro: '108000.00', stundenpreis: '120.00',
            aktiv: false, person: MOCK_PERSONEN[1],
            stundenGeplant: '900', stundenGebucht: '900',
          },
          {
            id: 'vpv-5a-2', version: 1, deleted: false, state: ApiState.READ,
            verbraucher: 'Peter Schmidt', verbraucherTyp: ApiVerbraucherTyp.PERSONAL,
            volumenStunden: '600', volumenEuro: '72000.00', stundenpreis: '120.00',
            aktiv: false, person: MOCK_PERSONEN[2],
            stundenGeplant: '600', stundenGebucht: '600',
          },
        ],
      },
    ],
  },
  {
    id: 'v-6',
    version: 1,
    deleted: false,
    state: ApiState.READ,
    vertragsname: 'Wartungsvertrag Ressort 2021',
    vertragspartner: 'MaintCorp Austria',
    gueltigVon: '2021-01-01',
    gueltigBis: '2022-12-31',
    aktiv: false,
    auftraggeber: 'BMI',
    vertragssumme: '290000.00',
    vertragsTyp: ApiVertragsTyp.BETRIEB,
    vertragsverantwortlicher: MOCK_PERSONEN[2],
    stundenGeplant: '2800',
    stundenGebucht: '2800',
    vertragPosition: [
      {
        id: 'vp-6a', version: 1, deleted: false, state: ApiState.READ,
        position: '2nd-Level Support',
        volumenStunden: '2800', volumenEuro: '290000.00',
        aktiv: false, planungsjahr: '2022',
        stundenGeplant: '2800', stundenGebucht: '2800',
        vertragPositionVerbraucher: [
          {
            id: 'vpv-6a-1', version: 1, deleted: false, state: ApiState.READ,
            verbraucher: 'Peter Schmidt', verbraucherTyp: ApiVerbraucherTyp.PERSONAL,
            volumenStunden: '1800', volumenEuro: '180000.00', stundenpreis: '100.00',
            aktiv: false, person: MOCK_PERSONEN[2],
            stundenGeplant: '1800', stundenGebucht: '1800',
          },
          {
            id: 'vpv-6a-2', version: 1, deleted: false, state: ApiState.READ,
            verbraucher: 'Julia Huber', verbraucherTyp: ApiVerbraucherTyp.PERSONAL,
            volumenStunden: '1000', volumenEuro: '110000.00', stundenpreis: '110.00',
            aktiv: false, person: MOCK_PERSONEN[3],
            stundenGeplant: '1000', stundenGebucht: '1000',
          },
        ],
      },
    ],
  },
];

// Assign contracts to each person (post-hoc to avoid circular initialization).
// v-1..v-3 are active; v-4..v-6 are inactive (shown in red when "inkl. inaktive" is checked).
MOCK_LOGGED_IN_PERSON.vertrag = [MOCK_VERTRAEGE[0], MOCK_VERTRAEGE[1], MOCK_VERTRAEGE[2], MOCK_VERTRAEGE[3]];
MOCK_PERSONEN[1].vertrag = [MOCK_VERTRAEGE[0], MOCK_VERTRAEGE[2], MOCK_VERTRAEGE[4]];
MOCK_PERSONEN[2].vertrag = [MOCK_VERTRAEGE[0], MOCK_VERTRAEGE[1], MOCK_VERTRAEGE[3], MOCK_VERTRAEGE[4], MOCK_VERTRAEGE[5]];
MOCK_PERSONEN[3].vertrag = [MOCK_VERTRAEGE[1], MOCK_VERTRAEGE[2], MOCK_VERTRAEGE[5]];
MOCK_PERSONEN[4].vertrag = [MOCK_VERTRAEGE[1]];

// ─────────────────────────────────────────────────────────────────────────────
// Stempelzeiten (time punches)
// ─────────────────────────────────────────────────────────────────────────────
function iso(date: string, time: string): string {
  return `${date}T${time}:00`;
}
export const MOCK_STEMPELZEITEN: ApiStempelzeit[] = [
  {
    id: 'sz-1',
    version: 1,
    deleted: false,
    state: ApiState.READ,
    person: MOCK_LOGGED_IN_PERSON,
    login: iso('2026-04-17', '08:00'),
    logoff: iso('2026-04-17', '16:30'),
    zeitTyp: ApiZeitTyp.ARBEITSZEIT,
    anmerkung: 'Regulärer Arbeitstag',
  },
  {
    id: 'sz-2',
    version: 1,
    deleted: false,
    state: ApiState.READ,
    person: MOCK_LOGGED_IN_PERSON,
    login: iso('2026-04-18', '09:00'),
    logoff: iso('2026-04-18', '17:15'),
    zeitTyp: ApiZeitTyp.TELEARBEIT,
  },
  {
    id: 'sz-3',
    version: 1,
    deleted: false,
    state: ApiState.READ,
    person: MOCK_LOGGED_IN_PERSON,
    login: iso('2026-04-19', '08:15'),
    logoff: iso('2026-04-19', '16:45'),
    zeitTyp: ApiZeitTyp.ARBEITSZEIT,
  },
  {
    id: 'sz-4',
    version: 1,
    deleted: false,
    state: ApiState.READ,
    person: MOCK_PERSONEN[1],
    login: iso('2026-04-19', '07:45'),
    logoff: iso('2026-04-19', '16:00'),
    zeitTyp: ApiZeitTyp.ARBEITSZEIT,
  },
  // ── Julia Huber (p-4) — 3 rows ──────────────────────────────────────────────
  { id: 'sz-5',  version: 1, deleted: false, state: ApiState.READ, person: MOCK_PERSONEN[3],
    login: iso('2026-04-28', '00:00'), logoff: iso('2026-05-02', '23:59'),
    zeitTyp: ApiZeitTyp.URLAUB, anmerkung: 'Genehmigter Urlaub' },
  { id: 'sz-6',  version: 1, deleted: false, state: ApiState.READ, person: MOCK_PERSONEN[3],
    login: iso('2026-06-15', '00:00'), logoff: iso('2026-06-19', '23:59'),
    zeitTyp: ApiZeitTyp.ZEITAUSGLEICH, anmerkung: 'Überstundenabbau' },
  { id: 'sz-7',  version: 1, deleted: false, state: ApiState.READ, person: MOCK_PERSONEN[3],
    login: iso('2026-12-21', '00:00'), logoff: iso('2026-12-31', '23:59'),
    zeitTyp: ApiZeitTyp.URLAUB, anmerkung: 'Weihnachtsurlaub' },

  // ── Max Gruber (p-5) — 20 rows ───────────────────────────────────────────────
  { id: 'sz-10', version: 1, deleted: false, state: ApiState.READ, person: MOCK_PERSONEN[4],
    login: iso('2026-04-27', '00:00'), logoff: iso('2026-04-28', '23:59'),
    zeitTyp: ApiZeitTyp.ZEITAUSGLEICH, anmerkung: 'Brückentag' },
  { id: 'sz-11', version: 1, deleted: false, state: ApiState.READ, person: MOCK_PERSONEN[4],
    login: iso('2026-05-06', '00:00'), logoff: iso('2026-05-08', '23:59'),
    zeitTyp: ApiZeitTyp.KRANKENSTAND, anmerkung: 'Krankenstand' },
  { id: 'sz-12', version: 1, deleted: false, state: ApiState.READ, person: MOCK_PERSONEN[4],
    login: iso('2026-05-18', '00:00'), logoff: iso('2026-05-22', '23:59'),
    zeitTyp: ApiZeitTyp.URLAUB, anmerkung: 'Pfingstferien' },
  { id: 'sz-13', version: 1, deleted: false, state: ApiState.READ, person: MOCK_PERSONEN[4],
    login: iso('2026-06-01', '00:00'), logoff: iso('2026-06-05', '23:59'),
    zeitTyp: ApiZeitTyp.URLAUB, anmerkung: 'Urlaub Juni' },
  { id: 'sz-14', version: 1, deleted: false, state: ApiState.READ, person: MOCK_PERSONEN[4],
    login: iso('2026-06-15', '00:00'), logoff: iso('2026-06-15', '23:59'),
    zeitTyp: ApiZeitTyp.ZEITAUSGLEICH, anmerkung: 'ZA' },
  { id: 'sz-15', version: 1, deleted: false, state: ApiState.READ, person: MOCK_PERSONEN[4],
    login: iso('2026-06-29', '00:00'), logoff: iso('2026-07-10', '23:59'),
    zeitTyp: ApiZeitTyp.URLAUB, anmerkung: 'Sommerurlaub Teil 1' },
  { id: 'sz-16', version: 1, deleted: false, state: ApiState.READ, person: MOCK_PERSONEN[4],
    login: iso('2026-07-20', '00:00'), logoff: iso('2026-07-31', '23:59'),
    zeitTyp: ApiZeitTyp.URLAUB, anmerkung: 'Sommerurlaub Teil 2' },
  { id: 'sz-17', version: 1, deleted: false, state: ApiState.READ, person: MOCK_PERSONEN[4],
    login: iso('2026-08-10', '00:00'), logoff: iso('2026-08-11', '23:59'),
    zeitTyp: ApiZeitTyp.KRANKENSTAND, anmerkung: 'Krankenstand' },
  { id: 'sz-18', version: 1, deleted: false, state: ApiState.READ, person: MOCK_PERSONEN[4],
    login: iso('2026-08-24', '00:00'), logoff: iso('2026-08-29', '23:59'),
    zeitTyp: ApiZeitTyp.URLAUB, anmerkung: 'Resturlaub August' },
  { id: 'sz-19', version: 1, deleted: false, state: ApiState.READ, person: MOCK_PERSONEN[4],
    login: iso('2026-09-07', '00:00'), logoff: iso('2026-09-07', '23:59'),
    zeitTyp: ApiZeitTyp.ZEITAUSGLEICH, anmerkung: 'Einzeltag ZA' },
  { id: 'sz-20', version: 1, deleted: false, state: ApiState.READ, person: MOCK_PERSONEN[4],
    login: iso('2026-09-21', '00:00'), logoff: iso('2026-09-25', '23:59'),
    zeitTyp: ApiZeitTyp.URLAUB, anmerkung: 'Herbsturlaub' },
  { id: 'sz-21', version: 1, deleted: false, state: ApiState.READ, person: MOCK_PERSONEN[4],
    login: iso('2026-10-05', '00:00'), logoff: iso('2026-10-09', '23:59'),
    zeitTyp: ApiZeitTyp.URLAUB, anmerkung: 'Oktober' },
  { id: 'sz-22', version: 1, deleted: false, state: ApiState.READ, person: MOCK_PERSONEN[4],
    login: iso('2026-10-26', '00:00'), logoff: iso('2026-10-27', '23:59'),
    zeitTyp: ApiZeitTyp.ZEITAUSGLEICH, anmerkung: 'Nationalfeiertag' },
  { id: 'sz-23', version: 1, deleted: false, state: ApiState.READ, person: MOCK_PERSONEN[4],
    login: iso('2026-11-02', '00:00'), logoff: iso('2026-11-02', '23:59'),
    zeitTyp: ApiZeitTyp.ZEITAUSGLEICH, anmerkung: 'Brückentag' },
  { id: 'sz-24', version: 1, deleted: false, state: ApiState.READ, person: MOCK_PERSONEN[4],
    login: iso('2026-11-16', '00:00'), logoff: iso('2026-11-20', '23:59'),
    zeitTyp: ApiZeitTyp.URLAUB, anmerkung: 'November Urlaub' },
  { id: 'sz-25', version: 1, deleted: false, state: ApiState.READ, person: MOCK_PERSONEN[4],
    login: iso('2026-12-07', '00:00'), logoff: iso('2026-12-11', '23:59'),
    zeitTyp: ApiZeitTyp.KRANKENSTAND, anmerkung: 'Krankenstand Dez.' },
  { id: 'sz-26', version: 1, deleted: false, state: ApiState.READ, person: MOCK_PERSONEN[4],
    login: iso('2026-12-21', '00:00'), logoff: iso('2026-12-31', '23:59'),
    zeitTyp: ApiZeitTyp.URLAUB, anmerkung: 'Weihnachtsurlaub' },
  { id: 'sz-27', version: 1, deleted: false, state: ApiState.READ, person: MOCK_PERSONEN[4],
    login: iso('2027-01-04', '00:00'), logoff: iso('2027-01-05', '23:59'),
    zeitTyp: ApiZeitTyp.ZEITAUSGLEICH, anmerkung: 'Nachfeier Neujahr' },
  { id: 'sz-28', version: 1, deleted: false, state: ApiState.READ, person: MOCK_PERSONEN[4],
    login: iso('2027-02-08', '00:00'), logoff: iso('2027-02-12', '23:59'),
    zeitTyp: ApiZeitTyp.URLAUB, anmerkung: 'Semesterferien' },
  { id: 'sz-29', version: 1, deleted: false, state: ApiState.READ, person: MOCK_PERSONEN[4],
    login: iso('2027-03-01', '00:00'), logoff: iso('2027-03-03', '23:59'),
    zeitTyp: ApiZeitTyp.KRANKENSTAND, anmerkung: 'Krankenstand März' },

  // ── Hassan Adam (p-me) — current week (Apr 13–20) ───────────────────────────
  { id: 'sz-30', version: 1, deleted: false, state: ApiState.READ, person: MOCK_LOGGED_IN_PERSON,
    login: iso('2026-04-20', '08:00'), logoff: iso('2026-04-20', '16:00'),
    zeitTyp: ApiZeitTyp.ARBEITSZEIT, anmerkung: 'Montag',
    marker: [ApiStempelzeitMarker.ONLINE_STEMPELN_ANMELDUNG, ApiStempelzeitMarker.ONLINE_STEMPELN_ABMELDUNG] },
  { id: 'sz-31', version: 1, deleted: false, state: ApiState.READ, person: MOCK_LOGGED_IN_PERSON,
    login: iso('2026-04-16', '08:30'), logoff: iso('2026-04-16', '17:00'),
    zeitTyp: ApiZeitTyp.REMOTEZEIT,
    marker: [ApiStempelzeitMarker.HOMEOFFICE_STEMPELN_ANMELDUNG, ApiStempelzeitMarker.HOMEOFFICE_STEMPELN_ABMELDUNG] },
  { id: 'sz-32', version: 1, deleted: false, state: ApiState.READ, person: MOCK_LOGGED_IN_PERSON,
    login: iso('2026-04-15', '09:00'), logoff: iso('2026-04-15', '17:30'),
    zeitTyp: ApiZeitTyp.TELEARBEIT, anmerkung: 'Nachgebucht',
    eintragungsart: ApiStempelzeitEintragungsart.SELBST },
  { id: 'sz-33', version: 1, deleted: false, state: ApiState.READ, person: MOCK_LOGGED_IN_PERSON,
    login: iso('2026-04-14', '07:45'), logoff: iso('2026-04-14', '16:15'),
    zeitTyp: ApiZeitTyp.ARBEITSZEIT,
    marker: [ApiStempelzeitMarker.CHIP_STEMPELN_ANMELDUNG, ApiStempelzeitMarker.CHIP_STEMPELN_ABMELDUNG] },
  { id: 'sz-34', version: 1, deleted: false, state: ApiState.READ, person: MOCK_LOGGED_IN_PERSON,
    login: iso('2026-04-13', '08:00'), logoff: iso('2026-04-13', '16:30'),
    zeitTyp: ApiZeitTyp.ARBEITSZEIT, anmerkung: 'Zeitkorrektur durch Leiter', poKorrektur: true },

  // ── Hassan Adam (p-me) — week Apr 6–10 ─────────────────────────────────────
  { id: 'sz-35', version: 1, deleted: false, state: ApiState.READ, person: MOCK_LOGGED_IN_PERSON,
    login: iso('2026-04-10', '00:00'), logoff: iso('2026-04-10', '23:59'),
    zeitTyp: ApiZeitTyp.ZEITAUSGLEICH, anmerkung: 'ZA-Tag' },
  { id: 'sz-36', version: 1, deleted: false, state: ApiState.READ, person: MOCK_LOGGED_IN_PERSON,
    login: iso('2026-04-09', '08:00'), logoff: iso('2026-04-09', '16:30'),
    zeitTyp: ApiZeitTyp.ARBEITSZEIT,
    marker: [ApiStempelzeitMarker.CHIP_STEMPELN_ANMELDUNG, ApiStempelzeitMarker.CHIP_STEMPELN_ABMELDUNG] },
  { id: 'sz-37', version: 1, deleted: false, state: ApiState.READ, person: MOCK_LOGGED_IN_PERSON,
    login: iso('2026-04-08', '09:00'), logoff: iso('2026-04-08', '17:00'),
    zeitTyp: ApiZeitTyp.TELEARBEIT },
  { id: 'sz-38', version: 1, deleted: false, state: ApiState.READ, person: MOCK_LOGGED_IN_PERSON,
    login: iso('2026-04-07', '08:15'), logoff: iso('2026-04-07', '16:45'),
    zeitTyp: ApiZeitTyp.REMOTEZEIT, anmerkung: 'Nachgebucht',
    eintragungsart: ApiStempelzeitEintragungsart.SELBST },
  { id: 'sz-39', version: 1, deleted: false, state: ApiState.READ, person: MOCK_LOGGED_IN_PERSON,
    login: iso('2026-04-06', '08:00'), logoff: iso('2026-04-06', '16:30'),
    zeitTyp: ApiZeitTyp.ARBEITSZEIT,
    marker: [ApiStempelzeitMarker.ONLINE_STEMPELN_ANMELDUNG, ApiStempelzeitMarker.ONLINE_STEMPELN_ABMELDUNG] },

  // ── Hassan Adam (p-me) — week Mar 30 – Apr 3 ───────────────────────────────
  { id: 'sz-40', version: 1, deleted: false, state: ApiState.READ, person: MOCK_LOGGED_IN_PERSON,
    login: iso('2026-04-03', '08:00'), logoff: iso('2026-04-03', '15:30'),
    zeitTyp: ApiZeitTyp.ARBEITSZEIT, anmerkung: 'Früher gegangen' },
  { id: 'sz-41', version: 1, deleted: false, state: ApiState.READ, person: MOCK_LOGGED_IN_PERSON,
    login: iso('2026-04-02', '08:30'), logoff: iso('2026-04-02', '17:00'),
    zeitTyp: ApiZeitTyp.REMOTEZEIT },
  { id: 'sz-42', version: 1, deleted: false, state: ApiState.READ, person: MOCK_LOGGED_IN_PERSON,
    login: iso('2026-04-01', '08:00'), logoff: iso('2026-04-01', '16:30'),
    zeitTyp: ApiZeitTyp.ARBEITSZEIT,
    marker: [ApiStempelzeitMarker.CHIP_STEMPELN_ANMELDUNG, ApiStempelzeitMarker.CHIP_STEMPELN_ABMELDUNG] },
  { id: 'sz-43', version: 1, deleted: false, state: ApiState.READ, person: MOCK_LOGGED_IN_PERSON,
    login: iso('2026-03-31', '00:00'), logoff: iso('2026-03-31', '23:59'),
    zeitTyp: ApiZeitTyp.BEREITSCHAFT, anmerkung: 'Bereitschaftsdienst' },
  { id: 'sz-44', version: 1, deleted: false, state: ApiState.READ, person: MOCK_LOGGED_IN_PERSON,
    login: iso('2026-03-30', '08:00'), logoff: iso('2026-03-30', '16:30'),
    zeitTyp: ApiZeitTyp.ARBEITSZEIT, anmerkung: 'Zeitkorrektur', poKorrektur: true },

  // ── Hassan Adam (p-me) — week Mar 23–27 ────────────────────────────────────
  { id: 'sz-45', version: 1, deleted: false, state: ApiState.READ, person: MOCK_LOGGED_IN_PERSON,
    login: iso('2026-03-27', '08:00'), logoff: iso('2026-03-27', '16:00'),
    zeitTyp: ApiZeitTyp.ARBEITSZEIT },
  { id: 'sz-46', version: 1, deleted: false, state: ApiState.READ, person: MOCK_LOGGED_IN_PERSON,
    login: iso('2026-03-26', '00:00'), logoff: iso('2026-03-26', '23:59'),
    zeitTyp: ApiZeitTyp.KRANKENSTAND },
  { id: 'sz-47', version: 1, deleted: false, state: ApiState.READ, person: MOCK_LOGGED_IN_PERSON,
    login: iso('2026-03-25', '00:00'), logoff: iso('2026-03-25', '23:59'),
    zeitTyp: ApiZeitTyp.KRANKENSTAND },
  { id: 'sz-48', version: 1, deleted: false, state: ApiState.READ, person: MOCK_LOGGED_IN_PERSON,
    login: iso('2026-03-24', '08:00'), logoff: iso('2026-03-24', '16:30'),
    zeitTyp: ApiZeitTyp.ARBEITSZEIT,
    marker: [ApiStempelzeitMarker.ONLINE_STEMPELN_ANMELDUNG, ApiStempelzeitMarker.ONLINE_STEMPELN_ABMELDUNG] },
  { id: 'sz-49', version: 1, deleted: false, state: ApiState.READ, person: MOCK_LOGGED_IN_PERSON,
    login: iso('2026-03-23', '00:00'), logoff: iso('2026-03-23', '23:59'),
    zeitTyp: ApiZeitTyp.GUTSCHRIFT, anmerkung: 'Überstundenabbau' },

  // ── Anna Müller (p-2) — recent entries ─────────────────────────────────────
  { id: 'sz-50', version: 1, deleted: false, state: ApiState.READ, person: MOCK_PERSONEN[1],
    login: iso('2026-04-20', '09:00'), logoff: iso('2026-04-20', '17:30'),
    zeitTyp: ApiZeitTyp.TELEARBEIT,
    marker: [ApiStempelzeitMarker.HOMEOFFICE_STEMPELN_ANMELDUNG, ApiStempelzeitMarker.HOMEOFFICE_STEMPELN_ABMELDUNG] },
  { id: 'sz-51', version: 1, deleted: false, state: ApiState.READ, person: MOCK_PERSONEN[1],
    login: iso('2026-04-17', '08:00'), logoff: iso('2026-04-17', '16:30'),
    zeitTyp: ApiZeitTyp.ARBEITSZEIT,
    marker: [ApiStempelzeitMarker.CHIP_STEMPELN_ANMELDUNG, ApiStempelzeitMarker.CHIP_STEMPELN_ABMELDUNG] },
  { id: 'sz-52', version: 1, deleted: false, state: ApiState.READ, person: MOCK_PERSONEN[1],
    login: iso('2026-04-16', '07:30'), logoff: iso('2026-04-16', '16:00'),
    zeitTyp: ApiZeitTyp.ARBEITSZEIT },
  { id: 'sz-53', version: 1, deleted: false, state: ApiState.READ, person: MOCK_PERSONEN[1],
    login: iso('2026-04-15', '08:00'), logoff: iso('2026-04-15', '16:30'),
    zeitTyp: ApiZeitTyp.REMOTEZEIT,
    marker: [ApiStempelzeitMarker.HOMEOFFICE_STEMPELN_ANMELDUNG, ApiStempelzeitMarker.HOMEOFFICE_STEMPELN_ABMELDUNG] },
  { id: 'sz-54', version: 1, deleted: false, state: ApiState.READ, person: MOCK_PERSONEN[1],
    login: iso('2026-04-14', '00:00'), logoff: iso('2026-04-14', '23:59'),
    zeitTyp: ApiZeitTyp.ZEITAUSGLEICH, anmerkung: 'ZA-Tag' },
  { id: 'sz-55', version: 1, deleted: false, state: ApiState.READ, person: MOCK_PERSONEN[1],
    login: iso('2026-04-13', '08:00'), logoff: iso('2026-04-13', '16:30'),
    zeitTyp: ApiZeitTyp.ARBEITSZEIT, anmerkung: 'Nachgebucht',
    eintragungsart: ApiStempelzeitEintragungsart.SELBST },
];

// ─────────────────────────────────────────────────────────────────────────────
// Freigabe-Positionen, Tätigkeitsbuchungen, Trigger, LkDetails
// ─────────────────────────────────────────────────────────────────────────────
const FREIGABE_STATUS_CYCLE = [
  'PRUEFEN_DV',
  'PRUEFEN_EV',
  'ABGELEHNT',
  'FREIGEGEBEN',
  'FREIGEGEBEN_AUTO',
];

const PRODUKT_POSITION_NAMES = [
  'Betrieb',
  'Testmanagement',
  'Entwicklung',
  'Konzeption',
  'Wartung',
  'Benutzerbetreuung',
  'Datenbankadministration',
  'Projektmanagement',
  'Schulung',
  'Deployment',
];

function padId(n: number): string {
  return n.toString().padStart(3, '0');
}

function pickMonat(index: number): string {
  // Cycle through the last 12 months so the Monat column shows variety.
  const base = new Date(2026, 3, 1); // April 2026
  const d = new Date(base.getFullYear(), base.getMonth() - (index % 12), 1);
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, '0');
  return `${y}-${m}-01`;
}

/** Builds a realistic set of ApiFreigabePosition-shaped mocks. */
function buildMockFreigabePositionen(count: number, idPrefix: string): any[] {
  const out: any[] = [];
  for (let i = 0; i < count; i++) {
    const bucher = MOCK_PERSONEN[i % MOCK_PERSONEN.length];
    const produkt = MOCK_PRODUKTE[i % MOCK_PRODUKTE.length];
    const posName = PRODUKT_POSITION_NAMES[i % PRODUKT_POSITION_NAMES.length];
    const status = FREIGABE_STATUS_CYCLE[i % FREIGABE_STATUS_CYCLE.length];

    out.push({
      id: `${idPrefix}-${padId(i + 1)}`,
      version: 1,
      deleted: false,
      state: ApiState.READ,
      anmerkung: i % 4 === 0 ? 'Bitte prüfen' : '',
      freigabeStatus: status,
      minutenDauer: 60 + (i * 37) % 540,
      buchungsZeitraum: pickMonat(i),
      produktPosition: {
        id: `pp-${idPrefix}-${i + 1}`,
        version: 1,
        deleted: false,
        state: ApiState.READ,
        produktPositionname: posName,
        produkt: produkt,
        aktiv: true,
      },
      bucher: bucher,
      metadaten: i % 5 === 0
        ? {
            originalProduktPosition: PRODUKT_POSITION_NAMES[(i + 3) % PRODUKT_POSITION_NAMES.length],
            originalProdukt: MOCK_PRODUKTE[(i + 1) % MOCK_PRODUKTE.length].kurzName,
          }
        : undefined,
    });
  }
  return out;
}

export const MOCK_FREIGABE_POSITIONEN: any[] = buildMockFreigabePositionen(55, 'fp');

export const MOCK_FREIGABE_POSITIONEN_HISTORY: any[] = buildMockFreigabePositionen(55, 'fph');

function buildMockTaetigkeitsbuchungen(count: number): any[] {
  const taetigkeiten = [
    'Analyse', 'Programmierung', 'Konzeption', 'Wartung', 'Test',
    'Dokumentation', 'Besprechung', 'Deployment', 'Schulung', 'Bericht',
    'Fehlerbehebung', 'Projektmanagement', 'Workshop', 'Recherche',
    'Qualitätssicherung', 'Softwaredesign', 'Datenbankadministration',
  ];
  const buchungspunkte = [
    'Entwicklung', 'Betrieb', 'Wartung', 'Test', 'Rollout',
    'Support', 'Konzept', 'Dokumentation', 'Deployment', 'Schulung',
  ];
  const anmerkungen = [
    'Siehe Jira Ticket',
    'Bug #1234 behoben',
    'Review mit Team',
    'Kundenanforderung umgesetzt',
    '',
    'Release vorbereitet',
    'Abstimmung mit Fachbereich',
    '',
  ];
  const out: any[] = [];
  for (let i = 0; i < count; i++) {
    // Spread across a 3-month window so months/days vary.
    const monthOffset = i % 3;
    const day = ((i % 27) + 1).toString().padStart(2, '0');
    const month = (2 + monthOffset).toString().padStart(2, '0'); // Feb–Apr 2026
    out.push({
      id: `tb-${padId(i + 1)}`,
      version: 1,
      state: ApiState.READ,
      minutenDauer: 30 + (i * 37) % 450,
      taetigkeit: taetigkeiten[i % taetigkeiten.length],
      buchungspunkt: {
        id: `bp-${i + 1}`,
        version: 1,
        state: ApiState.READ,
        buchungspunkt: buchungspunkte[i % buchungspunkte.length],
        aktiv: true,
      },
      anmerkung: anmerkungen[i % anmerkungen.length],
      jiraTicket: i % 4 === 0 ? `GETIT-${1000 + i}` : undefined,
      datum: `2026-${month}-${day}T08:00:00`,
      tagesabschluss: i % 5 === 0,
    });
  }
  return out;
}

export const MOCK_TAETIGKEITSBUCHUNGEN: any[] = buildMockTaetigkeitsbuchungen(35);

export const MOCK_TRIGGER: any[] = [
  {
    id: 'tr-1',
    version: 1,
    state: ApiState.READ,
    aktion: 'JAHRESABSCHLUSS',
    status: 'OFFEN',
  },
];

export const MOCK_LK_DETAILS: any[] = [
  {
    id: 'lk-1',
    version: 1,
    state: ApiState.READ,
    kategorie: 'LK1',
    stundensatz: '85.00',
    basisstunden: '1760',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Diverses
// ─────────────────────────────────────────────────────────────────────────────
export const MOCK_MUSS_PDF_LESEN: ApiMussPdfLesen = { mussPdfLesen: false };

export const MOCK_ABSCHLUSS_INFO: any = {
  abschlussDatum: '2026-03-31',
  offen: false,
  gepruefteStunden: '156.5',
};

export const MOCK_FEIERTAGE: any[] = [
  { datum: '2026-01-01', bezeichnung: 'Neujahr' },
  { datum: '2026-01-06', bezeichnung: 'Heilige Drei Könige' },
  { datum: '2026-04-06', bezeichnung: 'Ostermontag' },
  { datum: '2026-05-01', bezeichnung: 'Staatsfeiertag' },
  { datum: '2026-05-14', bezeichnung: 'Christi Himmelfahrt' },
  { datum: '2026-05-25', bezeichnung: 'Pfingstmontag' },
  { datum: '2026-06-04', bezeichnung: 'Fronleichnam' },
  { datum: '2026-08-15', bezeichnung: 'Mariä Himmelfahrt' },
  { datum: '2026-10-26', bezeichnung: 'Nationalfeiertag' },
  { datum: '2026-11-01', bezeichnung: 'Allerheiligen' },
  { datum: '2026-12-08', bezeichnung: 'Mariä Empfängnis' },
  { datum: '2026-12-25', bezeichnung: 'Weihnachten' },
  { datum: '2026-12-26', bezeichnung: 'Stefanitag' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Person history (Logbuch / historyAuswertung)
// ─────────────────────────────────────────────────────────────────────────────
/** Column order in the back-end CSV export. Mirrors PersonHistoryEntry keys. */
const PERSON_HISTORY_COLUMNS: string[] = [
  'bearbeitungszeit', 'bearbeiter', 'bearbeiterId', 'vorgang',
  'titel', 'vorname', 'nachname', 'emailGeschaeftlich',
  'geburtsdatum', 'geschlecht', 'funktion', 'personalnr',
  'anmerkung', 'emailPrivat', 'eintrittsDatum', 'austrittsDatum',
  'aktiv', 'svnr', 'emailExtern', 'staatsangehoerigkeit',
  'rolle', 'bucher', 'rechte', 'funktionen',
  'firma', 'selbststaendig', 'windowsBenutzerkonto', 'stundensatz',
  'bereitschaftsStundensatz', 'dienstverwendung', 'mitarbeiterart', 'geprueft',
  'stundenkontingentJaehrlich', 'stundenkontingentJaehrlichVertrag', 'mobilNummerBmi', 'mobilNummerExtern',
  'zimmerNummer', 'leerPdf', 'leistungskategorie', 'personenverantwortlicher',
  'teamleiter', 'teamzuordnung', 'organisationseinheit', 'freigabegruppe',
  'letzteBearbeitung',
];

/** Raw CSV body — semicolon-separated, double-quoted, one record per line. */
const MOCK_PERSON_HISTORY_CSV = `"2024-02-28 15:35:48";"Thiem Peter Franz";"thiem01@bmi.gv.at";"PersonenPO";"Monsigneur";"Achret";"Brig";"a.b@bmi.gv.at";"19900512";"divers";"IV/2";"986532";"hier kommt wieder ein     als Trennzeichen hier startet neue Zeile nach einem Zeilenumbruch ggg";"k.x@a.lglg";"2020-02-03";"9999-12-31";"true";"01234567890123456789012345678901";"lala@holland.nl";"Österreich";"DEFAULT";"FREIER_BUCHER";"STP,LAN,RUS,BER,OST,OSB";"TEAML,ABTL";"firma";"true";"s.b";"145,00";;"SERVICEMANAGER_IN";"EXTERN_OHNE_BAKS";"true";"1600";"1400";"Mobi123/23456";"A123456789012345678901234";"HP111";"true";"22,00";"Dipl.Ing.(FH) Markus Blank";"Manfred Elsinger";"Netzwerk";;"Architektur";"2023-12-17";
"2024-04-10 12:18:49";"Jahresabschluss";"Jahresabschluss";"ResetPersonJahreskontingent";"Monsigneur";"Achret";"Brig";"a.b@bmi.gv.at";"19900512";"divers";"IV/2";"986532";"hier kommt wieder ein     als Trennzeichen hier startet neue Zeile nach einem Zeilenumbruch ggg";"k.x@a.lglg";"2020-02-03";"9999-12-31";"true";"01234567890123456789012345678901";"lala@holland.nl";"Österreich";"DEFAULT";"FREIER_BUCHER";"STP,LAN,RUS,BER,OST,OSB";"TEAML,ABTL";"firma";"true";"s.b";"145,00";;"SERVICEMANAGER_IN";"EXTERN_OHNE_BAKS";"true";"1400";"1400";"Mobi123/23456";"A123456789012345678901234";"HP111";"true";"22,00";"Dipl.Ing.(FH) Markus Blank";"Manfred Elsinger";"Netzwerk";;"Architektur";"2023-12-17";
"2025-02-04 10:02:53";"Terab Hassan";"terab01@bmi.gv.at";"PersonenPO";"Monsigneur";"Achret";"Brig";"a.b@bmi.gv.at";"19900512";"divers";"IV/2";"986532";"hier kommt wieder ein     als Trennzeichen hier startet neue Zeile nach einem Zeilenumbruch ggg  XXX";"k.x@a.lglg";"2020-02-03";"9999-12-31";"true";"01234567890123456789012345678901";"lala@holland.nl";"Österreich";"DEFAULT";"FREIER_BUCHER";"STP,LAN,RUS,BER,OST,OSB";"TEAML,ABTL";"firma";"true";"s.b";"145,00";"";"SERVICEMANAGER_IN";"EXTERN_OHNE_BAKS";"true";"1400";"1400";"Mobi123/23456";"A123456789012345678901234";"HP111";"true";"22,00";"Dipl.Ing.(FH) Markus Blank";"Manfred Elsinger";"Netzwerk";;"Architektur";"2023-12-17";
"2025-04-24 12:52:27";"Thiem Peter Franz";"thiem01@bmi.gv.at";"PersonenPO";"Monsigneur";"Achret";"Brig";"a.b@bmi.gv.at";"19900512";"divers";"IV/2";"986532";"hier kommt wieder ein     als Trennzeichen hier startet neue Zeile nach einem Zeilenumbruch ggg  XXX";"k.x@a.lglg";"2020-02-03";"9999-12-31";"true";"01234567890123456789012345678901";"lala@holland.nl";"Österreich";"DEFAULT";"FREIER_BUCHER";"STP,LAN,RUS,BER,OST,OSB";"TEAML,ABTL";"firma";"true";"s.b";"145,00";"";;"EXTERN_OHNE_BAKS";"false";"1400";"1400";"Mobi123/23456";"A123456789012345678901234";"HP111";"true";"22,00";"Dipl.Ing.(FH) Markus Blank";"Manfred Elsinger";"Netzwerk";;"Architektur";"2023-12-17";
"2025-04-24 12:52:37";"Thiem Peter Franz";"thiem01@bmi.gv.at";"PersonenPO";"Monsigneur";"Achret";"Brig";"a.b@bmi.gv.at";"19900512";"divers";"IV/2";"986532";"hier kommt wieder ein     als Trennzeichen hier startet neue Zeile nach einem Zeilenumbruch ggg  XXX";"k.x@a.lglg";"2020-02-03";"9999-12-31";"true";"01234567890123456789012345678901";"lala@holland.nl";"Österreich";"DEFAULT";"FREIER_BUCHER";"STP,LAN,RUS,BER,OST,OSB";"TEAML,ABTL";"firma";"true";"s.b";"145,00";"";"ARCHITEKT_IN";"EXTERN_OHNE_BAKS";"true";"1400";"1400";"Mobi123/23456";"A123456789012345678901234";"HP111";"true";"22,00";"Dipl.Ing.(FH) Markus Blank";"Manfred Elsinger";"Netzwerk";;"Architektur";"2023-12-17";
"2026-02-26 10:33:01";"Thiem Peter Franz";"thiem01@bmi.gv.at";"PersonenPO";"Monsigneure";"Achret";"Brig";"a.b@bmi.gv.at";"19900512";"divers";"IV/2";"986532";"hier kommt wieder ein     als Trennzeichen hier startet neue Zeile nach einem Zeilenumbruch ggg  XXX";"k.x@a.lglg";"2020-02-03";"9999-12-31";"true";"01234567890123456789012345678901";"lala@holland.nl";"Österreich";"DEFAULT";"FREIER_BUCHER";"STP,LAN,RUS,BER,OST,OSB";"TEAML,ABTL";"firma";"true";"s.b";"145,00";"";"ARCHITEKT_IN";"EXTERN_OHNE_BAKS";"true";"1400";"1400";"Mobi123/23456";"A123456789012345678901234";"HP111";"true";"22,00";"Dipl.Ing.(FH) Markus Blank";"Manfred Elsinger";"Netzwerk";;"Architektur";"2023-12-17";
"2026-04-22 10:45:35";"Thiem Peter Franz";"thiem01@bmi.gv.at";"PersonenPO";"Monsigneure";"Achretx";"Brig";"a.b@bmi.gv.at";"19900512";"divers";"IV/2";"986532";"hier kommt wieder ein     als Trennzeichen hier startet neue Zeile nach einem Zeilenumbruch ggg  XXX";"k.x@a.lglg";"2020-02-03";"9999-12-31";"true";"01234567890123456789012345678901";"lala@holland.nl";"Österreich";"DEFAULT";"FREIER_BUCHER";"STP,LAN,RUS,BER,OST,OSB";"TEAML,ABTL";"firma";"true";"s.b";"145,00";"";"ARCHITEKT_IN";"EXTERN_OHNE_BAKS";"true";"1400";"1400";"Mobi123/23456";`;

/** Splits a CSV row that uses ';' as separator and '"' as quote, with no
    escape sequence beyond doubled quotes. Empty fields (`;;`) become ''.
    A trailing `;` is treated as a row terminator (no synthetic empty field
    appended at the end). */
function parseSemicolonRow(line: string): string[] {
  const out: string[] = [];
  let i = 0;
  let buf = '';
  let inQuotes = false;
  let lastSeparatorIndex = -1;
  while (i < line.length) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') { buf += '"'; i += 2; continue; }
      if (ch === '"') { inQuotes = false; i += 1; continue; }
      buf += ch; i += 1;
    } else {
      if (ch === ';') { out.push(buf); buf = ''; lastSeparatorIndex = i; i += 1; continue; }
      if (ch === '"') { inQuotes = true; i += 1; continue; }
      buf += ch; i += 1;
    }
  }
  const endedWithSeparator = lastSeparatorIndex === line.length - 1;
  if (buf !== '' || !endedWithSeparator) out.push(buf);
  return out;
}

/** Pre-parsed list of PersonHistoryEntry-shaped rows for the mock backend.
    `_fieldCount` keeps track of how many real columns each row had so the
    Logbuch diff can ignore "missing" trailing columns from truncated rows. */
export const MOCK_PERSON_HISTORY: any[] = MOCK_PERSON_HISTORY_CSV
  .split(/\r?\n/)
  .map(l => l.trim())
  .filter(l => l.length > 0)
  .map(line => {
    const fields = parseSemicolonRow(line);
    const entry: any = { raw: line, _fieldCount: fields.length };
    for (let i = 0; i < PERSON_HISTORY_COLUMNS.length; i++) {
      entry[PERSON_HISTORY_COLUMNS[i]] = fields[i] ?? '';
    }
    return entry;
  });
