/**
 * Single audit-log row for a Produktposition.
 * Mirrors the column shape of the back-end CSV export — same general
 * `bearbeitungszeit / bearbeiter / vorgang` audit metadata as the
 * Person Logbuch, but the entity-specific fields belong to a
 * ProduktPosition rather than a Person.
 */
export interface ProduktPositionHistoryEntry {
  bearbeitungszeit: string;
  bearbeiter: string;
  bearbeiterId: string;
  vorgang: string;
  produktposition: string;
  durchfuehrungsverantwortlicher: string;
  servicemanager: string;
  start: string;
  ende: string;
  /** "1" or "0" — kept as string to match the CSV-shaped data. */
  aktiv: string;
  anmerkung: string;
  positionstyp: string;
  auftraggeber: string;
  organisationseinheit: string;
  /** "1" or "0" — kept as string to match the CSV-shaped data. */
  buchungsfreigabe: string;

  /** Original raw row for debugging. */
  raw?: string;
  /** Number of real columns the parser found in this row's CSV line.
      Used by the Logbuch diff to ignore "missing" columns from
      truncated rows. */
  _fieldCount?: number;
}

/** Column config for LogbuchDialogComponent (key + header). */
export const PRODUKT_POSITION_LOGBUCH_COLUMNS: { key: keyof ProduktPositionHistoryEntry; header: string }[] = [
  { key: 'bearbeitungszeit',                header: 'Bearbeitungszeit' },
  { key: 'bearbeiter',                      header: 'Bearbeiter' },
  { key: 'bearbeiterId',                    header: 'Bearbeiter Id' },
  { key: 'vorgang',                         header: 'Vorgang' },
  { key: 'produktposition',                 header: 'Produktposition' },
  { key: 'durchfuehrungsverantwortlicher',  header: 'Durchführungsverantwortlicher' },
  { key: 'servicemanager',                  header: 'Servicemanager' },
  { key: 'start',                           header: 'Start' },
  { key: 'ende',                            header: 'Ende' },
  { key: 'aktiv',                           header: 'Aktiv' },
  { key: 'anmerkung',                       header: 'Anmerkung' },
  { key: 'positionstyp',                    header: 'Positionstyp' },
  { key: 'auftraggeber',                    header: 'Auftraggeber' },
  { key: 'organisationseinheit',            header: 'Organisationseinheit' },
  { key: 'buchungsfreigabe',                header: 'Buchungsfreigabe' },
];
