import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-taetigkeiten-level1',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  templateUrl: './taetigkeiten-level1.component.html',
  styleUrl: './taetigkeiten-level1.component.scss',
})
export class TaetigkeitenLevel1Component {
  @Input() formGroup!: FormGroup;
  @Input() title: string = '';
  @Input() isEditing: boolean = false;
  @Input() hasNotification: boolean = false;
  @Input() showCloseButton: boolean = true;

  @Output() toggleClose = new EventEmitter<void>();

  onToggleClose(): void {
    this.toggleClose.emit();
  }
}
