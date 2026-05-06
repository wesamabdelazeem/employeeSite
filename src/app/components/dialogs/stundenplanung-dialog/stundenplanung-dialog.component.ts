import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import {
  VertragStundenplanungZielEntry,
  VertragVerbraucherStundenplanungEntry,
} from '../../../mock/vertrag-stundenplanung.mock';

export interface StundenplanungDialogData {
  /** Optional title (defaults to "Stundenumplanung"). */
  title?: string;
  /** Verbraucher rows for the left table. */
  verbraucher: VertragVerbraucherStundenplanungEntry[];
  /** Static target list for the right table. Used as a fallback when
   *  no `getZiele` resolver is provided OR when no source row is
   *  selected. */
  ziele?: VertragStundenplanungZielEntry[];
  /** Per-source resolver — when provided, the right table refreshes
   *  to `getZiele(selectedVerbraucher)` whenever the user selects a
   *  row on the left. */
  getZiele?: (verbraucher: VertragVerbraucherStundenplanungEntry) => VertragStundenplanungZielEntry[];
}

/**
 * "Stundenumplanung" dialog — same visual family as the Logbuch
 * dialog: bordered header / mat-dialog-content / footer with
 * Schließen button. Inside it shows a 3-column layout:
 *   - left:   Verbraucher für Stundenumplanung (selectable)
 *   - center: Stunden number stepper + Umplanen action
 *   - right:  Ziel der Stundenumplanung (selectable)
 */
@Component({
  selector: 'app-stundenplanung-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
  ],
  templateUrl: './stundenplanung-dialog.component.html',
  styleUrl: './stundenplanung-dialog.component.scss',
})
export class StundenplanungDialogComponent {
  title: string;
  verbraucher: VertragVerbraucherStundenplanungEntry[];
  /** Currently visible target rows — recomputed when the source row
   *  selection changes (via getZiele) or stays as the static fallback. */
  displayedZiele: VertragStundenplanungZielEntry[] = [];

  private fallbackZiele: VertragStundenplanungZielEntry[];
  private getZiele?: (v: VertragVerbraucherStundenplanungEntry) => VertragStundenplanungZielEntry[];

  selectedVerbraucherIndex: number | null = null;
  selectedZielIndex: number | null = null;

  /** Hours to move. Min 0, max defaults to 99. */
  stunden = 0;
  readonly maxStunden = 99;

  readonly verbraucherCols = ['produktposition', 'verbraucher', 'geplant', 'gebucht'];
  readonly zielCols = ['produktposition', 'geplant', 'gebucht'];

  constructor(
    public dialogRef: MatDialogRef<StundenplanungDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: StundenplanungDialogData,
  ) {
    this.title = data?.title ?? 'Stundenumplanung';
    this.verbraucher = data?.verbraucher ?? [];
    this.fallbackZiele = data?.ziele ?? [];
    this.getZiele = data?.getZiele;
    this.displayedZiele = this.fallbackZiele;
    console.log('[Stundenplanung] dialog opened',
      { verbraucher: this.verbraucher.length, fallbackZiele: this.fallbackZiele.length, hasResolver: !!this.getZiele });
  }

  produktpositionLabel(row: VertragVerbraucherStundenplanungEntry | VertragStundenplanungZielEntry): string {
    return `${row.produktKurzName} » ${row.position}`;
  }

  selectVerbraucher(i: number): void {
    this.selectedVerbraucherIndex = i;
    // Clear the previously-selected target — its index may no longer
    // point to a meaningful row in the freshly recomputed list.
    this.selectedZielIndex = null;
    const src = this.verbraucher[i];
    let next: VertragStundenplanungZielEntry[];
    if (this.getZiele && src) {
      next = this.getZiele(src) ?? this.fallbackZiele;
    } else {
      next = this.fallbackZiele;
    }
    // Force a new array reference so Angular's default trackBy detects
    // the change even when the resolver hands back a cached array.
    this.displayedZiele = [...(next ?? [])];
    console.log('[Stundenplanung] verbraucher selected', {
      i,
      verbraucherId: src?.verbraucherId,
      zieleCount: this.displayedZiele.length,
    });
  }

  selectZiel(i: number): void { this.selectedZielIndex = i; }

  incStunden(): void { if (this.stunden < this.maxStunden) this.stunden += 1; }
  decStunden(): void { if (this.stunden > 0) this.stunden -= 1; }

  get canUmplanen(): boolean {
    return this.selectedVerbraucherIndex !== null
      && this.selectedZielIndex !== null
      && this.stunden > 0;
  }

  /** "Umplanen" action — for the mock dialog this just logs the
   *  intent and closes the dialog with the move payload so a parent
   *  could pick it up if needed. */
  umplanen(): void {
    if (!this.canUmplanen) return;
    const from = this.verbraucher[this.selectedVerbraucherIndex!];
    const to   = this.displayedZiele[this.selectedZielIndex!];
    const payload = { fromVerbraucherId: from.verbraucherId, toProduktPositionId: to.produktPositionId, stunden: this.stunden };
    console.log('Stundenumplanung — Umplanen', payload);
    this.dialogRef.close(payload);
  }
}
