/**
 * Single audit-log row returned from `historyAuswertung()` for a person.
 * Mirrors the column shape of the back-end CSV export.
 */
export interface PersonHistoryEntry {
  bearbeitungszeit: string;
  bearbeiter: string;
  bearbeiterId: string;
  vorgang: string;
  titel: string;
  vorname: string;
  nachname: string;
  emailGeschaeftlich: string;
  geburtsdatum: string;
  geschlecht: string;
  funktion: string;
  personalnr: string;
  anmerkung: string;
  emailPrivat: string;
  eintrittsDatum: string;
  austrittsDatum: string;
  aktiv: string;
  svnr: string;
  emailExtern: string;
  staatsangehoerigkeit: string;
  rolle: string;
  bucher: string;
  rechte: string;
  funktionen: string;
  firma: string;
  selbststaendig: string;
  windowsBenutzerkonto: string;
  stundensatz: string;
  bereitschaftsStundensatz: string;
  dienstverwendung: string;
  mitarbeiterart: string;
  geprueft: string;
  stundenkontingentJaehrlich: string;
  stundenkontingentJaehrlichVertrag: string;
  mobilNummerBmi: string;
  mobilNummerExtern: string;
  zimmerNummer: string;
  leerPdf: string;
  leistungskategorie: string;
  personenverantwortlicher: string;
  teamleiter: string;
  teamzuordnung: string;
  organisationseinheit: string;
  freigabegruppe: string;
  letzteBearbeitung: string;
  /** Original raw row for debugging. */
  raw?: string;
  /** Number of real columns the parser found in this row's CSV line. Used by
      the Logbuch diff to ignore "missing" columns from truncated rows. */
  _fieldCount?: number;
}
