import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { TextFieldModule } from '@angular/cdk/text-field';
import { TaetigkeitenTimeBoxComponent } from '../components/taetigkeiten-time-box/taetigkeiten-time-box.component';
import { ApiProdukt } from '../../models/ApiProdukt';
import { ApiProduktPosition } from '../../models/ApiProduktPosition';
import { ApiProduktPositionBuchungspunkt } from '../../models/ApiProduktPositionBuchungspunkt';
import { ApiZeitTyp } from '../../models/ApiZeitTyp';
import { ApiTaetigkeitTyp } from '../../models/ApiTaetigkeitTyp';
import { ApiBuchungsart } from '../../models/ApiBuchungsart';

@Component({
  selector: 'app-taetigkeiten-level3',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    TextFieldModule,
    TaetigkeitenTimeBoxComponent,
  ],
  templateUrl: './taetigkeiten-level3.component.html',
  styleUrl: './taetigkeiten-level3.component.scss',
})
export class TaetigkeitenLevel3Component {
  @Input() formGroup!: FormGroup;
  @Input() title: string = 'Tätigkeit';

  @Input() buchungsartOptions: string[] = [];
  @Input() produktOptions: ApiProdukt[] = [];
  @Input() produktpositionOptions: ApiProduktPosition[] = [];
  @Input() buchungspunktOptions: ApiProduktPositionBuchungspunkt[] = [];
  @Input() taetigkeitOptions: string[] = [];

  @Input() isEditing: boolean = false;
  @Input() isCreatingNew: boolean = false;
  @Input() isNewlyCreated: boolean = false;
  @Input() isHeaderCreated: boolean = false;
  @Input() isSelectedDayLocked: boolean = false;
  @Input() saveAttempted: boolean = false;
  @Input() canEditTimeSection: boolean = false;
  @Input() showHeader: boolean = true;

  @Output() cancel = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  @Output() save = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();
  @Output() validateTime = new EventEmitter<'anmeldezeit' | 'abmeldezeit'>();

  getBuchungsartDisplay(key: string): string {
    return ApiZeitTyp[key as keyof typeof ApiZeitTyp] ?? key;
  }

  getHour(timeType: 'anmeldezeit' | 'abmeldezeit'): number {
    return Number(this.formGroup.get(`${timeType}Stunde`)?.value || 0);
  }

  onTimeChange(field: string, value: number, timeType: 'anmeldezeit' | 'abmeldezeit'): void {
    this.formGroup.get(field)?.patchValue(value);
    this.validateTime.emit(timeType);
  }

  get isAnmerkungEmpty(): boolean {
    const v = this.formGroup?.get('anmerkung')?.value;
    return !v || String(v).trim() === '';
  }

  isFieldEmpty(name: string): boolean {
    const v = this.formGroup?.get(name)?.value;
    if (v === null || v === undefined) return true;
    if (typeof v === 'string') return v.trim() === '';
    return false;
  }

  get isTimeEmpty(): boolean {
    const s1 = Number(this.formGroup?.get('anmeldezeitStunde')?.value || 0);
    const m1 = Number(this.formGroup?.get('anmeldezeitMinuten')?.value || 0);
    const s2 = Number(this.formGroup?.get('abmeldezeitStunde')?.value || 0);
    const m2 = Number(this.formGroup?.get('abmeldezeitMinuten')?.value || 0);
    return s1 === 0 && m1 === 0 && s2 === 0 && m2 === 0;
  }

  get isJiraTicketInvalid(): boolean {
    const c = this.formGroup?.get('jiraTicket');
    return !!(c?.hasError('jiraPrefix') || c?.hasError('jiraSuffixRequired') || c?.hasError('jiraRequired'));
  }

  jiraTicketErrorMessage(): string {
    const c = this.formGroup?.get('jiraTicket');
    if (c?.hasError('jiraRequired')) return 'Jira-Ticket ist erforderlich';
    if (c?.hasError('jiraSuffixRequired')) return 'Jira-Ticket darf nicht nur "PGETIT-" enthalten';
    if (c?.hasError('jiraPrefix')) return 'Jira-Ticket muss mit "PGETIT" beginnen';
    return '';
  }

  onJiraInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const prefix = 'PGETIT-';
    let val = input.value;

    if (val === '' || val === prefix) {
      input.value = '';
      this.formGroup.get('jiraTicket')?.patchValue('', { emitEvent: false });
      return;
    }

    if (!val.startsWith(prefix)) {
      const tail = val.replace(/^PGETIT-?/i, '');
      val = prefix + tail;
    }

    if (val.length > 30) val = val.slice(0, 30);

    input.value = val;
    this.formGroup.get('jiraTicket')?.patchValue(val, { emitEvent: false });
  }

  private positionKeys(v: any): string[] {
    if (v == null) return [];
    if (typeof v === 'string') return [v.toLowerCase()];
    if (typeof v === 'object') {
      const keys: string[] = [];
      if (v.id) keys.push(String(v.id).toLowerCase());
      if (v.produktPositionname) keys.push(String(v.produktPositionname).toLowerCase());
      return keys;
    }
    return [String(v).toLowerCase()];
  }

  private buchungspunktKeys(v: any): string[] {
    if (v == null) return [];
    if (typeof v === 'string') return [v.toLowerCase()];
    if (typeof v === 'object') {
      const keys: string[] = [];
      if (v.id) keys.push(String(v.id).toLowerCase());
      if (v.buchungspunkt) keys.push(String(v.buchungspunkt).toLowerCase());
      return keys;
    }
    return [String(v).toLowerCase()];
  }

  comparePosition = (a: any, b: any): boolean => {
    if (a === b) return true;
    const ka = this.positionKeys(a);
    const kb = this.positionKeys(b);
    if (!ka.length || !kb.length) return false;
    return ka.some(k => kb.includes(k));
  };

  compareBuchungspunkt = (a: any, b: any): boolean => {
    if (a === b) return true;
    const ka = this.buchungspunktKeys(a);
    const kb = this.buchungspunktKeys(b);
    if (!ka.length || !kb.length) return false;
    return ka.some(k => kb.includes(k));
  };

  compareString = (a: any, b: any): boolean => {
    if (a === b) return true;
    if (a == null || b == null) return false;
    return String(a).toLowerCase() === String(b).toLowerCase();
  };

  compareTaetigkeit = (a: any, b: any): boolean => {
    if (a === b) return true;
    if (a == null || b == null) return false;
    const norm = (v: any): string => {
      const s = String(v);
      const enumMap = ApiTaetigkeitTyp as unknown as Record<string, string>;
      if (enumMap[s] !== undefined) return enumMap[s].toLowerCase();
      return s.toLowerCase();
    };
    return norm(a) === norm(b);
  };

  compareBuchungsart = (a: any, b: any): boolean => {
    if (a === b) return true;
    if (a == null || b == null) return false;
    const norm = (v: any): string => {
      const s = String(v);
      const enumMap = ApiBuchungsart as unknown as Record<string, string>;
      if (enumMap[s] !== undefined) return enumMap[s].toLowerCase();
      return s.toLowerCase();
    };
    return norm(a) === norm(b);
  };

  onLeftHeaderClick(): void {
    if ((this.isCreatingNew || this.isNewlyCreated) && this.isEditing) {
      this.cancel.emit();
    } else if (this.isEditing && !this.isCreatingNew && !this.isNewlyCreated) {
      this.cancel.emit();
    } else {
      this.delete.emit();
    }
  }

  onEditOrSave(): void {
    if (this.isEditing) {
      this.save.emit();
    } else {
      this.edit.emit();
    }
  }
}
