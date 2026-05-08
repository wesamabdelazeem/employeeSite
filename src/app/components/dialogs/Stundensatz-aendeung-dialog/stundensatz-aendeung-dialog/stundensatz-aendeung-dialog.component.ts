import { Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

export interface StundensatzAendeungDialogData {
  /** Stundensatz of the existing Verbraucher (read-only baseline). */
  currentStundensatz?: number | string;
  /** Pre-filled new Stundensatz (defaults to currentStundensatz). */
  newStundensatz?: number | string;
}

export interface StundensatzAendeungDialogResult {
  confirmed: boolean;
  newStundensatz: number | null;
}

@Component({
  selector: 'app-stundensatz-aendeung-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './stundensatz-aendeung-dialog.component.html',
  styleUrl: './stundensatz-aendeung-dialog.component.scss',
})
export class StundensatzAendeungDialogComponent {
  data = inject<StundensatzAendeungDialogData>(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<StundensatzAendeungDialogComponent>);

  neuerStundensatz: number | null;

  constructor() {
    const seed = this.data?.newStundensatz ?? this.data?.currentStundensatz ?? null;
    this.neuerStundensatz = seed === null || seed === '' ? null : Number(seed);
  }

  onJa(): void {
    const result: StundensatzAendeungDialogResult = {
      confirmed: true,
      newStundensatz: this.neuerStundensatz,
    };
    this.dialogRef.close(result);
  }

  onNein(): void {
    const result: StundensatzAendeungDialogResult = {
      confirmed: false,
      newStundensatz: null,
    };
    this.dialogRef.close(result);
  }
}
