import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

export interface QuestionDialogData {
  title?: string;
  message?: string;
  label?: string;
  confirmText?: string;
  cancelText?: string;
}

@Component({
  selector: 'app-question-dialog',
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './question-dialog.component.html',
  styleUrl: './question-dialog.component.scss'
})
export class QuestionDialogComponent {
  reason: string = '';

  constructor(
    public dialogRef: MatDialogRef<QuestionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: QuestionDialogData
  ) {}

  confirm(): void {
    const trimmed = (this.reason || '').trim();
    if (!trimmed) return;
    this.dialogRef.close(trimmed);
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
