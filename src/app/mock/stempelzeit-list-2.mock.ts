import { ApiPerson } from '../models/ApiPerson';
import { ApiMitarbeiterart } from '../models/ApiMitarbeiterart';

/**
 * Inline mock data for the Stempelzeiten list. Used in place of the real
 * API call so we can iterate on the UI with a stable, varied dataset —
 * notable mix of `aktiv: true/false` to exercise the inactive-row styles,
 * the "inkl. inaktive" checkbox, the status-column sort, and the
 * scroll/scroll-restore behaviour. Generated deterministically from a
 * small name pool so the dataset stays the same between reloads.
 */

const VORNAMEN = [
  'Anna', 'Bernd', 'Clara', 'David', 'Elena', 'Felix', 'Greta', 'Hannes',
  'Iris', 'Jakob', 'Karin', 'Lukas', 'Maria', 'Niklas', 'Olga', 'Paul',
  'Quirin', 'Rosa', 'Stefan', 'Tina', 'Ulrich', 'Vera', 'Walter', 'Xenia',
  'Yvonne', 'Zacharias', 'Adrian', 'Beate', 'Corinna', 'Dominik', 'Eva',
  'Friedrich', 'Gabriele', 'Heinrich', 'Ingrid', 'Johannes', 'Katrin',
  'Leonie', 'Markus', 'Nadine', 'Oskar', 'Petra', 'Quentin', 'Renate',
  'Sebastian', 'Theresa', 'Urs', 'Viktor', 'Wilhelm', 'Xaver',
];

const NACHNAMEN = [
  'Müller', 'Schmidt', 'Fischer', 'Weber', 'Wagner', 'Becker', 'Hoffmann',
  'Schäfer', 'Koch', 'Richter', 'Klein', 'Wolf', 'Neumann', 'Schwarz',
  'Zimmermann', 'Braun', 'Krüger', 'Hofmann', 'Hartmann', 'Lange',
  'Werner', 'Schmitt', 'Krause', 'Meier', 'Lehmann', 'Schmid', 'Schulze',
  'Maier', 'Köhler', 'Herrmann', 'König', 'Walter', 'Mayer', 'Huber',
  'Kaiser', 'Fuchs', 'Peters', 'Lang', 'Scholz', 'Möller',
];

const MITARBEITERARTEN: ApiMitarbeiterart[] = [
  ApiMitarbeiterart.INTERN,
  ApiMitarbeiterart.INTERN,
  ApiMitarbeiterart.INTERN,
  ApiMitarbeiterart.EXTERN,
  ApiMitarbeiterart.EXTERN_OHNE_BAKS,
  ApiMitarbeiterart.ZIVILDIENSTLEISTENDER,
  ApiMitarbeiterart.LEHRLING,
  ApiMitarbeiterart.PRAKTIKANT,
  ApiMitarbeiterart.PAYROLL,
];

function makePerson(index: number, aktiv: boolean): ApiPerson {
  const vorname = VORNAMEN[index % VORNAMEN.length];
  const nachname = NACHNAMEN[(index * 7) % NACHNAMEN.length];
  const mitarbeiterart = MITARBEITERARTEN[index % MITARBEITERARTEN.length];
  return {
    id: `m${index + 1}`,
    vorname,
    nachname,
    mitarbeiterart,
    aktiv,
    portalUser: 'true' as any,
  };
}

const ACTIVE_COUNT = 110;
const INACTIVE_COUNT = 20;

export const MOCK_STEMPELZEIT_PERSONS: ApiPerson[] = [
  ...Array.from({ length: ACTIVE_COUNT }, (_, i) => makePerson(i, true)),
  ...Array.from({ length: INACTIVE_COUNT }, (_, i) =>
    makePerson(ACTIVE_COUNT + i, false)
  ),
];
