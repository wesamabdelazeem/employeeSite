import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-close-open-confirm-dialog',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './close-open-confirm-dialog.component.html',
  styleUrl: './close-open-confirm-dialog.component.scss'
})
export class CloseOpenConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CloseOpenConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { isClosed: boolean; dayName?: string }
  ) {}

  confirm(): void { this.dialogRef.close(true); }
  cancel(): void { this.dialogRef.close(false); }
}
