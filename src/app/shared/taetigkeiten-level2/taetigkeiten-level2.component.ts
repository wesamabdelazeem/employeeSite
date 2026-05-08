import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TextFieldModule } from '@angular/cdk/text-field';

@Component({
  selector: 'app-taetigkeiten-level2',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatTooltipModule,
    TextFieldModule,
  ],
  templateUrl: './taetigkeiten-level2.component.html',
  styleUrl: './taetigkeiten-level2.component.scss',
})
export class TaetigkeitenLevel2Component {
  @Input() formGroup!: FormGroup;
  @Input() title: string = '';
  @Input() hasStempelzeiten: boolean = false;
  @Input() hasNotification: boolean = false;
  @Input() isEditing: boolean = false;
  @Input() showCloseButton: boolean = true;

  @Output() toggleClose = new EventEmitter<void>();

  onToggleClose(): void {
    this.toggleClose.emit();
  }
}
