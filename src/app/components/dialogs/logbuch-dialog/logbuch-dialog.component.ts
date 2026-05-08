import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PersonHistoryEntry } from '../../../models/PersonHistoryEntry';

export interface LogbuchDialogData {
  /** Optional title (defaults to "Logbuch"). */
  title?: string;
  /** Optional subtitle, e.g. the person's full name. */
  subtitle?: string;
  /** Audit-log entries from PersonenService.historyAuswertung. */
  entries?: PersonHistoryEntry[];
}

@Component({
  selector: 'app-logbuch-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatTooltipModule,
  ],
  templateUrl: './logbuch-dialog.component.html',
  styleUrl: './logbuch-dialog.component.scss',
})
export class LogbuchDialogComponent {
  displayedColumns = [
    'bearbeitungszeit',
    'bearbeiter',
    'vorgang',
    'name',
    'mitarbeiterart',
    'aktiv',
    'stundenkontingent',
    'anmerkung',
  ];

  /** All columns of PersonHistoryEntry in the order used for the CSV export.
      Mirrors PersonenService.HISTORY_COLUMNS. */
  private static readonly CSV_COLUMNS: { key: keyof PersonHistoryEntry; header: string }[] = [
    { key: 'bearbeitungszeit', header: 'Bearbeitungszeit' },
    { key: 'bearbeiter', header: 'Bearbeiter' },
    { key: 'bearbeiterId', header: 'Bearbeiter Id' },
    { key: 'vorgang', header: 'Vorgang' },
    { key: 'titel', header: 'Titel' },
    { key: 'vorname', header: 'Vorname' },
    { key: 'nachname', header: 'Nachname' },
    { key: 'emailGeschaeftlich', header: 'Email geschäftlich' },
    { key: 'geburtsdatum', header: 'Geburtsdatum' },
    { key: 'geschlecht', header: 'Geschlecht' },
    { key: 'funktion', header: 'Funktion' },
    { key: 'personalnr', header: 'Personalnr' },
    { key: 'anmerkung', header: 'Anmerkung' },
    { key: 'emailPrivat', header: 'Email privat' },
    { key: 'eintrittsDatum', header: 'Eintrittsdatum' },
    { key: 'austrittsDatum', header: 'Austrittsdatum' },
    { key: 'aktiv', header: 'Aktiv' },
    { key: 'svnr', header: 'SVNR' },
    { key: 'emailExtern', header: 'Email extern' },
    { key: 'staatsangehoerigkeit', header: 'Staatsangehörigkeit' },
    { key: 'rolle', header: 'Rolle' },
    { key: 'bucher', header: 'Bucher' },
    { key: 'rechte', header: 'Rechte' },
    { key: 'funktionen', header: 'Funktionen' },
    { key: 'firma', header: 'Firma' },
    { key: 'selbststaendig', header: 'Selbstständig' },
    { key: 'windowsBenutzerkonto', header: 'Windows Benutzerkonto' },
    { key: 'stundensatz', header: 'Stundensatz' },
    { key: 'bereitschaftsStundensatz', header: 'Bereitschafts-Stundensatz' },
    { key: 'dienstverwendung', header: 'Dienstverwendung' },
    { key: 'mitarbeiterart', header: 'Mitarbeiterart' },
    { key: 'geprueft', header: 'Geprüft' },
    { key: 'stundenkontingentJaehrlich', header: 'Stundenkontingent jährlich' },
    { key: 'stundenkontingentJaehrlichVertrag', header: 'Stundenkontingent jährlich (Vertrag)' },
    { key: 'mobilNummerBmi', header: 'Mobilnummer BMI' },
    { key: 'mobilNummerExtern', header: 'Mobilnummer extern' },
    { key: 'zimmerNummer', header: 'Zimmernummer' },
    { key: 'leerPdf', header: 'Leer-PDF' },
    { key: 'leistungskategorie', header: 'Leistungskategorie' },
    { key: 'personenverantwortlicher', header: 'Personenverantwortlicher' },
    { key: 'teamleiter', header: 'Teamleiter' },
    { key: 'teamzuordnung', header: 'Team' },
    { key: 'organisationseinheit', header: 'Organisationseinheit' },
    { key: 'freigabegruppe', header: 'Freigabegruppe' },
    { key: 'letzteBearbeitung', header: 'Letzte Bearbeitung' },
  ];

  /** Keys excluded from the Vorher/Nachher diff because they describe the
      audit row itself, not the person's snapshot. */
  private static readonly DIFF_EXCLUDE_KEYS: (keyof PersonHistoryEntry)[] = [
    'bearbeitungszeit', 'bearbeiter', 'bearbeiterId', 'vorgang', 'raw',
  ];

  entries: PersonHistoryEntry[];
  title: string;
  subtitle?: string;

  /** Index of the entry currently shown in the dialog. */
  currentIndex = 0;

  constructor(
    public dialogRef: MatDialogRef<LogbuchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LogbuchDialogData
  ) {
    this.title = data?.title ?? 'Logbuch';
    this.subtitle = data?.subtitle;
    // Sort newest → oldest so the dialog opens on the latest change.
    this.entries = [...(data?.entries ?? [])].sort((a, b) =>
      (b.bearbeitungszeit || '').localeCompare(a.bearbeitungszeit || '')
    );
    this.currentIndex = 0;
  }

  get currentEntry(): PersonHistoryEntry | null {
    return this.entries[this.currentIndex] ?? null;
  }

  /** True when there is an older entry to navigate to (further down the list). */
  get canGoPrevious(): boolean {
    return this.currentIndex < this.entries.length - 1;
  }

  /** True when there is a newer entry to navigate to (further up the list). */
  get canGoNext(): boolean {
    return this.currentIndex > 0;
  }

  /** True when the current entry is the very first version recorded. */
  get isFirstVersion(): boolean {
    return this.currentIndex >= this.entries.length - 1;
  }

  get currentChanges(): { key: string; label: string; before: string; after: string }[] {
    // The very oldest entry has no predecessor in time — its diff is empty.
    if (this.isFirstVersion) return [];
    const cur = this.entries[this.currentIndex];
    const prev = this.entries[this.currentIndex + 1];
    if (!cur || !prev) return [];

    const exclude = new Set<string>(LogbuchDialogComponent.DIFF_EXCLUDE_KEYS as string[]);
    // Only compare columns that BOTH rows actually contain. A row truncated
    // by the back-end (fewer fields than CSV_COLUMNS) shouldn't surface every
    // missing field as a "change" against a longer row.
    const totalCols = LogbuchDialogComponent.CSV_COLUMNS.length;
    const curLen = (cur as any)._fieldCount ?? totalCols;
    const prevLen = (prev as any)._fieldCount ?? totalCols;
    const compareUpTo = Math.min(curLen, prevLen, totalCols);

    return LogbuchDialogComponent.CSV_COLUMNS
      .map((c, idx) => ({ c, idx }))
      .filter(({ c, idx }) => idx < compareUpTo && !exclude.has(c.key as string))
      .map(({ c }) => ({
        key: c.key as string,
        label: c.header,
        before: ((prev as any)[c.key] ?? '').toString(),
        after: ((cur as any)[c.key] ?? '').toString(),
      }))
      .filter(d => d.before !== d.after);
  }

  /** Step to the older entry (one step further back in time). */
  previous(): void {
    if (this.canGoPrevious) this.currentIndex += 1;
  }

  /** Step to the newer entry (closer to the present). */
  next(): void {
    if (this.canGoNext) this.currentIndex -= 1;
  }

  fullName(row: PersonHistoryEntry): string {
    return [row.titel, row.vorname, row.nachname].filter(s => !!s).join(' ');
  }

  /** Builds a semicolon-separated, double-quoted CSV string from the entries
      currently shown in the dialog and triggers a browser download. */
  downloadCsv(): void {
    if (!this.entries?.length) {
      console.warn('Logbuch download: no entries to export');
      return;
    }

    const cols = LogbuchDialogComponent.CSV_COLUMNS;
    const escape = (val: unknown): string => {
      const s = (val ?? '').toString().replace(/"/g, '""');
      return `"${s}"`;
    };

    const headerRow = cols.map(c => escape(c.header)).join(';');
    const dataRows = this.entries.map(row =>
      cols.map(c => escape((row as any)[c.key])).join(';')
    );
    // Prepend a UTF-8 BOM so Excel opens umlauts correctly.
    const csv = '﻿' + [headerRow, ...dataRows].join('\r\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logbuch_${this.csvFilenameTimestamp()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log('Logbuch downloaded:', a.download, this.entries.length, 'rows');
  }

  private csvFilenameTimestamp(): string {
    const d = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
  }
}
