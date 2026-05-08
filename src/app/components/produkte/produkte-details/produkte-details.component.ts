import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient} from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { MatDialog,MatDialogModule,MatDialogRef,MAT_DIALOG_DATA}from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Injectable } from '@angular/core';
import { MatDateFormats, NativeDateAdapter } from '@angular/material/core';
import { DeleteConfirmDialogComponent } from '../../delete-confirm-dialog/delete-confirm-dialog.component';
import { ErrorDialogComponent } from '../../dialogs/error-dialog/error-dialog.component';
import { ApiProduktPosition } from '../../../models/ApiProduktPosition';
import { ApiProduktPositionBuchungspunkt } from '../../../models/ApiProduktPositionBuchungspunkt';
import { ApiProdukt } from '../../../models/ApiProdukt';
import { ApiProduktPositionTyp } from '../../../models/ApiProduktPositionTyp';
import { ProduktService } from '../../../services/produkt.service';
// import { ProduktpositionNode } from '../../../models/ProduktpositionNode';
import { ProduktpositionNode } from '../../../models/ProduktpositionNode';
import { GermanDateInputDirective } from '../../../shared/directives/german-date-input.directive';

@Injectable()
export class CustomDateAdapter extends NativeDateAdapter {
  override format(date: Date, displayFormat: Object): string {
    if (displayFormat === 'dd.MM.yyyy') {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    }
    return super.format(date, displayFormat);
  }

 
  override parse(value: any): Date | null {
    if (value instanceof Date) return value;
    if (value == null || value === '') return null;
    if (typeof value === 'number') return new Date(value);

    const str = String(value).trim();
    if (!str) return null;

    const parts = str.split(/[^\d]+/).filter(Boolean);
    if (parts.length < 3) return super.parse(value);

    let [d, m, y] = parts.map((p) => Number(p));
    if (!Number.isFinite(d) || !Number.isFinite(m) || !Number.isFinite(y)) {
      return super.parse(value);
    }

    if (y < 100) y += y < 70 ? 2000 : 1900;

    const date = new Date(y, m - 1, d);
    if (
      date.getFullYear() !== y ||
      date.getMonth() !== m - 1 ||
      date.getDate() !== d
    ) {
      return null;
    }
    return date;
  }
}

export const DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'dd.MM.yyyy',
  },
  display: {
    dateInput: 'dd.MM.yyyy',
    monthYearLabel: 'MMMM yyyy',
    dateA11yLabel: 'dd.MM.yyyy',
    monthYearA11yLabel: 'MMMM yyyy',
  },
};

@Component({
  selector: 'app-produkte-details',
  imports: [
   CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    MatDividerModule,
    MatSnackBarModule,
    FormsModule,
    MatDialogModule,
    MatMenuModule,
    MatTooltipModule,
    MatCardModule,
    MatToolbarModule,
    HttpClientModule,
    GermanDateInputDirective,
  ],
   providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS }
  ],
  templateUrl: './produkte-details.component.html',
  styleUrl: './produkte-details.component.scss'
})
export class ProdukteDetailsComponent {

   produktForm!: FormGroup;
  positionDetailForm!: FormGroup;
  childDetailForm!: FormGroup;
  isFormEditable = false;
  isPositionFormEditable = false;
  saving = false;
  loading = true;
  produktData: ApiProdukt = {} as ApiProdukt;
  produktpositionen: ProduktpositionNode[] = [];
  selectedPosition: ProduktpositionNode | null = null;
  isChildFormEditable = false;
  verantwortlicherOptions: string[] = [];
  servicemanagerOptions: string[] = [];
  creatingParentId: string | null = null;
ergebnisverantwortlicherOptions: string[] = [];  // add this line
  auftraggeberOptions: string[] = ['Bundesministerium', 'Grossinger Walter', 'Musterfrau Erika'];

  produktMenuItems = [
    { label: 'Tätigkeiten Plan-Ist Vergleich', icon: 'mdi-alarm', action: 'Taetigkeiten-Plan-Ist-Vergleich' },
    { label: 'Auswertung - Produkt', icon: 'mdi-file-excel', action: 'Auswertung-Produkt' },
    { label: 'Logbuch', icon: 'mdi-file-document', action: 'Logbuch-Produkt' },
  ];

  positionMenuItems = [
    { label: 'Stundenumbuchung', icon: 'mdi-alarm-plus', action: 'Stundenumbuchung' },
    { label: 'Kosten Vorjahr', icon: 'mdi-file-excel', action: 'Kosten-Vorjahr' },
    { label: 'Kosten Gesamt', icon: 'mdi-file-excel', action: 'Kosten-Gesamt' },
    { label: 'Logbuch', icon: 'mdi-file-document', action: 'Logbuch-Produktposition' },
    { label: 'Reset', icon: 'mdi-file-document', action: 'Reset-Produktposition' },
  ];

  buchungspunktMenuItems = [
    { label: 'Logbuch', icon: 'mdi-file-document', action: 'Logbuch-Buchungspunkt' },
  ];

  onMenuAction(action: string): void {
    console.log('[ProdukteDetail] menu action:', action, 'selected:', this.selectedPosition?.id ?? '-');
  }
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private produktService: ProduktService,
  ) {}

ngOnInit(): void {
  this.initMainForm();
  this.initPositionDetailForm();

  this.childDetailForm = this.fb.group({
    buchungspunkt: ['', [Validators.required, Validators.maxLength(30)]],
    aktiv: [false],
  });

  const id = this.route.snapshot.paramMap.get('id');

  // Handle new produkt
  if (!id || id === 'new' || id === 'neu') {
    this.isFormEditable = true;
    this.produktForm.enable();
    this.loading = false;
    return;
  }

  this.loadProduktData(id);
}

  private initMainForm(): void {
    const max30 = Validators.maxLength(30);
    this.produktForm = this.fb.group({
      produktname: ['', [Validators.required, max30]],
      kurzName: ['', [Validators.required, max30]],
      produktTyp: ['', [Validators.required, max30]],
      auftraggeber: ['', [Validators.required, max30]],
      ergebnisverantwortlicher: ['', [Validators.required, max30]],
      aktiv: [false],
      start: [null, Validators.required],
      ende: [new Date(9999, 11, 31), Validators.required],
      auftraggeberOrganisation: ['', [Validators.required, max30]],
      anmerkung: ['', max30]
    });
    this.produktForm.disable();
  }

  private initPositionDetailForm(): void {
    const max30 = Validators.maxLength(30);
    this.positionDetailForm = this.fb.group({
      aktiv: [false],
      produktPositionname: ['', [Validators.required, max30]],
      produktPositionTyp: ['', [Validators.required, max30]],
      auftraggeber: ['', [Validators.required, max30]],
      durchfuehrungsverantwortlicher: ['', [Validators.required, max30]],
      servicemanager: ['', max30],
      start: [null, Validators.required],
      ende: [null],
      auftraggeberOrganisation: ['', [Validators.required, max30]],
      anmerkung: ['', max30],
      buchungsfreigabe: [false]
    });
    this.positionDetailForm.disable();
  }

  private loadProduktData(id: string): void {
    this.loading = true;
    // const detailFileUrl = 'produkte_detail.json';

    this.produktService.getProdukt(id).subscribe({
      next: (response) => {
        const detailData: ApiProdukt = response.body ?? ({} as ApiProdukt);
        console.log('API DATA KEYS:', Object.keys(detailData));
        console.log(`Loading product details for ID: ${id}`, detailData);

        this.produktData = detailData;

          const allVerantwortlicher: string[] = [];
  const allServicemanager: string[] = [];

if (detailData.produktPosition) {
    detailData.produktPosition.forEach((pos: ApiProduktPosition) => {
      if (pos.durchfuehrungsverantwortlicher) {
        const fullName = pos.durchfuehrungsverantwortlicher.vorname + ' ' + pos.durchfuehrungsverantwortlicher.nachname;
        allVerantwortlicher.push(fullName);
      }
      if (pos.auftraggeberOrganisation) {
        allServicemanager.push(pos.auftraggeberOrganisation);
      }
    });

    this.verantwortlicherOptions = [...new Set(allVerantwortlicher)];
    this.servicemanagerOptions = [...new Set(allServicemanager)];
  }

        if (detailData.produktPosition) {
          this.produktpositionen = detailData.produktPosition.map((parentPos: ApiProduktPosition): ProduktpositionNode => {
            const children: ProduktpositionNode[] = (parentPos.produktPositionBuchungspunkt || []).map(
              (childPos: ApiProduktPositionBuchungspunkt, index: number): ProduktpositionNode => ({
                id: childPos.id || `${parentPos.id}-${index}`,
                name: childPos.buchungspunkt,
                aktiv: childPos.aktiv,
                status: childPos.aktiv ? 'active' : 'inactive',
                typ: 'Buchungspunkt',
                level: 2,
                parentId: parentPos.id,
              })
            );

            const durchfName = parentPos.durchfuehrungsverantwortlicher
              ? `${parentPos.durchfuehrungsverantwortlicher.vorname ?? ''} ${parentPos.durchfuehrungsverantwortlicher.nachname ?? ''}`.trim()
              : '';

            return {
              id: parentPos.id,
              name: parentPos.produktPositionname,
              start: parentPos.start ? new Date(parentPos.start) : undefined,
              ende: parentPos.ende ? new Date(parentPos.ende) : undefined,
              status: parentPos.aktiv ? 'active' : 'inactive',
              aktiv: parentPos.aktiv,
              typ: 'Produktposition',
              isExpanded: false,
              level: 1,
              children,
              auftraggeber: parentPos.auftraggeber,
              organisationseinheit: parentPos.auftraggeberOrganisation,
              durchfuehrungsverantwortlicher: durchfName,
              positionstyp: parentPos.produktPositionTyp,
              buchungsfreigabe: parentPos.buchungsfreigabe,
              anmerkung: parentPos.anmerkung,
              servicemanager: parentPos.auftraggeberOrganisation,
            };
          });

        }
// Fix: ergebnisverantwortlicher is an object, convert to full name string
const ergebnisObj = detailData.ergebnisverantwortlicher;
const ergebnisFullName = ergebnisObj
  ? `${ergebnisObj.vorname} ${ergebnisObj.nachname}`.trim()
  : '';

if (ergebnisFullName) {
  this.ergebnisverantwortlicherOptions = [ergebnisFullName];
}

if (detailData.auftraggeber && !this.auftraggeberOptions.includes(detailData.auftraggeber)) {
  this.auftraggeberOptions = [...this.auftraggeberOptions, detailData.auftraggeber];
}

this.produktForm.patchValue({
  produktname:              detailData.produktname,
  kurzName:                 detailData.kurzName,
  produktTyp:               detailData.produktTyp,           // "ZENTRALE_KOMPONENTE"
  auftraggeber:             detailData.auftraggeber,
  ergebnisverantwortlicher: ergebnisFullName,                // "Gerhard Föda"
  aktiv:                    detailData.aktiv,
  start:                    detailData.start ? new Date(detailData.start) : null,
  ende:                     detailData.ende  ? new Date(detailData.ende)  : new Date(9999, 11, 31),
  auftraggeberOrganisation: detailData.auftraggeberOrganisation,
  anmerkung:                detailData.anmerkung ?? '',
});
        this.produktForm.disable();
        this.loading = false;
      },
       error: (errorMessage: string) => {
        console.error(`CRITICAL: Error loading data via ProduktService: ${errorMessage}`);
        this.snackBar.open(errorMessage, 'Schließen', {
          duration: 8000,
          verticalPosition: 'top',
            panelClass: ['error-snackbar']
        });
        this.loading = false;
      },
    });
  }

  onEditOrSubmit(): void {
    if (!this.isFormEditable) {
      this.isFormEditable = true;
      this.produktForm.enable();
    } else {
      this.onSubmit();
    }
  }

onSubmit(): void {
  if (this.produktForm.invalid) {
    this.produktForm.markAllAsTouched();
    const labelMap: Record<string, string> = {
      produktname: 'Produktname',
      kurzName: 'Kurzname',
      produktTyp: 'Produkttyp',
      auftraggeber: 'Auftraggeber',
      ergebnisverantwortlicher: 'Ergebnisverantwortlicher',
      start: 'Start',
      ende: 'Ende',
      auftraggeberOrganisation: 'Organisationseinheit',
    };
    const missing = Object.keys(labelMap)
      .filter((k) => this.produktForm.get(k)?.invalid)
      .map((k) => labelMap[k]);
    const detail = missing.length
      ? `Bitte füllen Sie folgende Felder aus: ${missing.join(', ')}.`
      : 'Bitte füllen Sie alle Pflichtfelder aus.';
    this.dialog.open(ErrorDialogComponent, {
      data: { title: 'Pflichtfelder fehlen', detail },
      panelClass: 'custom-dialog-width',
    });
    return;
  }

  this.saving = true;
  const produkt = {
    ...this.produktData,
    ...this.produktForm.getRawValue(),
  } as ApiProdukt;
  const isNewProdukt = !produkt.id;

  const request$ = isNewProdukt
    ? this.produktService.createProdukt(produkt)
    : this.produktService.updateProdukt(produkt.id!, produkt);

  request$.subscribe({
    next: (response) => {
      const saved = response.body ?? produkt;
      this.produktData = { ...this.produktData, ...saved };

      if (isNewProdukt && this.produktData?.id) {
        window.history.replaceState({}, '', `/produkte/${this.produktData.id}`);
      }

      this.saving = false;
      this.isFormEditable = false;
      this.produktForm.disable();
      this.snackBar.open('Daten wurden erfolgreich gespeichert', 'Schließen', {
        duration: 3000, verticalPosition: 'top',
      });
    },
    error: (err) => {
      console.error('Error saving produkt:', err);
      this.saving = false;
      this.snackBar.open('Fehler beim Speichern.', 'Schließen', {
        duration: 3000, verticalPosition: 'top',
        panelClass: ['error-snackbar'],
      });
    },
  });
}

 onCancel(): void {
  if (this.isFormEditable) {
    if (!this.produktData?.id) {
      this.router.navigate(['/produkte']);
      return;
    }
    this.isFormEditable = false;
    this.produktForm.patchValue(this.produktData);
    this.produktForm.disable();
  } else {
    this.router.navigate(['/produkte']);
  }
}

  selectPosition(position: ProduktpositionNode): void {
    if (this.selectedPosition?.id && this.selectedPosition.id === position.id) {
      return;
    }

    this.selectedPosition = position;
    this.isPositionFormEditable = false;
    this.isChildFormEditable = false;
    this.creatingParentId = null;

     if (position.typ === 'Dokumentation' || position.typ === 'Buchungspunkt') {
      this.childDetailForm.patchValue({
        buchungspunkt: position.name || '',
        aktiv: position.aktiv || false
      });
      this.childDetailForm.disable();
    } else {
      this.positionDetailForm.reset({
        ...position,
        produktPositionname: position.name,
        produktPositionTyp: position.positionstyp,
        auftraggeberOrganisation: position.organisationseinheit,
      });
      this.positionDetailForm.disable();
    }
  }

  onEditOrSubmitPosition(): void {
    if (!this.isPositionFormEditable) {
      this.isPositionFormEditable = true;
      this.positionDetailForm.enable();
      this.positionDetailForm.get('produktPositionname')?.disable();
    } else {
      this.savePositionDetails();
    }
  }

  startCreateProduktposition(): void {
    if (!this.produktData?.id) {
      this.snackBar.open('Bitte Produkt zuerst speichern.', 'Schließen', {
        duration: 3000, verticalPosition: 'top',
      });
      return;
    }

    this.selectedPosition = {
      typ: 'Produktposition',
      aktiv: true,
      children: [],
      isExpanded: false,
      level: 1,
    };
    this.creatingParentId = null;

    this.positionDetailForm.reset({ aktiv: true, ende: new Date(9999, 11, 31) });
    this.positionDetailForm.enable();
    this.isPositionFormEditable = true;
    this.isChildFormEditable = false;
  }

  startCreateBuchungspunkt(parent: ProduktpositionNode): void {
    if (!parent?.id) return;

    this.selectedPosition = {
      typ: 'Buchungspunkt',
      aktiv: true,
      parentId: parent.id,
      level: 2,
    };
    this.creatingParentId = parent.id;

    this.childDetailForm.reset({ aktiv: true });
    this.childDetailForm.enable();
    this.isChildFormEditable = true;
    this.isPositionFormEditable = false;
  }

 onEditOrSubmitChild(): void {
    if (!this.isChildFormEditable) {
      this.isChildFormEditable = true;
      this.childDetailForm.enable();
    } else {
      this.saveChildDetails();
    }
  }

onEditOrSubmitPositionOrChild(): void {
  if (!this.selectedPosition) return;

  if (this.selectedPosition.typ === 'Produktposition') {
    if (!this.isPositionFormEditable) {
      this.isPositionFormEditable = true;
      this.positionDetailForm.enable();
      this.positionDetailForm.get('produktPositionname')?.enable();
    } else {
      this.savePositionDetails();
    }
  } else {
    if (!this.isChildFormEditable) {
      this.isChildFormEditable = true;
      this.childDetailForm.enable();
    } else {
      this.saveChildDetails();
    }
  }
}

onCancelPositionOrChild(): void {
  if (!this.selectedPosition) return;

  if (this.selectedPosition.typ === 'Produktposition') {
    this.onCancelPosition();
  } else {
    this.cancelChildDetails();
  }
}

  savePositionDetails(): void {
    if (!this.selectedPosition) return;
    if (this.positionDetailForm.invalid) {
      this.positionDetailForm.markAllAsTouched();
      const labelMap: Record<string, string> = {
        produktPositionname: 'Produktposition',
        produktPositionTyp: 'Positionstyp',
        auftraggeber: 'Auftraggeber',
        durchfuehrungsverantwortlicher: 'Durchf.-verantwortlicher',
        start: 'Start/End',
        auftraggeberOrganisation: 'Organisationseinheit',
      };
      const missing = Object.keys(labelMap)
        .filter(k => this.positionDetailForm.get(k)?.invalid)
        .map(k => labelMap[k]);
      const detail = missing.length
        ? `Bitte füllen Sie folgende Felder aus: ${missing.join(', ')}.`
        : 'Bitte füllen Sie alle Pflichtfelder der Position aus.';
      this.dialog.open(ErrorDialogComponent, {
        data: { title: 'Pflichtfelder fehlen', detail },
        panelClass: 'custom-dialog-width',
      });
      return;
    }

    const updateInArray = (
      arr: ProduktpositionNode[],
      id: string,
      updatedData: Partial<ProduktpositionNode>
    ): boolean => {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === id) {
          arr[i] = { ...arr[i], ...updatedData, name: arr[i].name, typ: arr[i].typ };
          this.selectedPosition = arr[i];
          return true;
        }
        if (arr[i].children && updateInArray(arr[i].children!, id, updatedData)) {
          return true;
        }
      }
      return false;
    };

    const raw = this.positionDetailForm.getRawValue() as Partial<ApiProduktPosition>;
    const startDate = raw.start as unknown as Date | null;
    const endeDate = raw.ende as unknown as Date | null;

    const position = {
      ...this.selectedPosition,
      ...raw,
      id: this.selectedPosition?.id,
      start: startDate ? startDate.toISOString() : undefined,
      ende: endeDate ? endeDate.toISOString() : undefined,
    } as unknown as ApiProduktPosition;

    const isNew = !position.id;
    const request$ = isNew
      ? this.produktService.createProduktPosition(position, this.produktData.id ?? '')
      : this.produktService.updateProduktPosition(position.id!, position);

    request$.subscribe({
      next: (response) => {
        const saved: ApiProduktPosition = response.body ?? position;

        if (isNew) {
          const status: 'active' | 'inactive' = raw.aktiv ? 'active' : 'inactive';
          const newNode: ProduktpositionNode = {
            id: saved.id,
            name: raw.produktPositionname ?? saved.produktPositionname ?? '',
            typ: 'Produktposition',
            isExpanded: false,
            level: 1,
            children: [],
            status,
            aktiv: raw.aktiv,
            start: startDate ?? undefined,
            ende: endeDate ?? undefined,
            auftraggeber: raw.auftraggeber,
            organisationseinheit: raw.auftraggeberOrganisation,
            durchfuehrungsverantwortlicher: raw.durchfuehrungsverantwortlicher as unknown as string | undefined,
            positionstyp: raw.produktPositionTyp,
            buchungsfreigabe: raw.buchungsfreigabe,
            anmerkung: raw.anmerkung,
            servicemanager: raw.auftraggeberOrganisation,
          };
          this.produktpositionen = [...this.produktpositionen, newNode];
          this.selectedPosition = newNode;
        } else {
          updateInArray(this.produktpositionen, position.id!, saved as Partial<ProduktpositionNode>);
        }

        this.isPositionFormEditable = false;
        this.positionDetailForm.disable();

        this.snackBar.open('Daten der Position wurden gespeichert.', 'Schließen', {
          duration: 2000, verticalPosition: 'top',
        });
      },
      error: (err) => {
        console.error('Error saving produktposition:', err);
        this.snackBar.open('Fehler beim Speichern der Position.', 'Schließen', {
          duration: 3000, verticalPosition: 'top',
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  onCancelPosition(): void {
    if (!this.selectedPosition) return;

    if (!this.selectedPosition.id) {
      this.selectedPosition = null;
      this.creatingParentId = null;
      this.isPositionFormEditable = false;
      this.positionDetailForm.reset();
      this.positionDetailForm.disable();
      return;
    }

    this.isPositionFormEditable = false;
    this.positionDetailForm.reset({
      ...this.selectedPosition,
      produktPositionname: this.selectedPosition.name,
      produktPositionTyp: this.selectedPosition.positionstyp,
      auftraggeberOrganisation: this.selectedPosition.organisationseinheit,
    });
    this.positionDetailForm.disable();
  }

 openDeleteDialog(): void {
  if (!this.selectedPosition) return;

  const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
    width: '500px',
    data: {
      title: `Löschen eines ${this.selectedPosition.typ}`,
      message: `Wollen Sie den ${this.selectedPosition.typ} "${this.selectedPosition.name}" wirklich löschen?`,
    },
  });

  dialogRef.afterClosed().subscribe((result) => {
    if (result) {
      this.deleteSelectedPosition();
    }
  });
}

  private deleteSelectedPosition(): void {
    if (!this.selectedPosition?.id) return;

    const removeFromArray = (arr: ProduktpositionNode[], id: string): ProduktpositionNode[] => {
      return arr.filter(item => {
        if (item.id === id) {
          return false;
        }
        if (item.children) {
          item.children = removeFromArray(item.children, id);
        }
        return true;
      });
    };

    const isBuchungspunkt = this.selectedPosition.typ === 'Buchungspunkt'
      || this.selectedPosition.typ === 'Dokumentation';

    const removedId: string = this.selectedPosition.id;

    const onSuccess = () => {
      this.produktpositionen = removeFromArray(this.produktpositionen, removedId);

      this.selectedPosition = null;
      this.positionDetailForm.reset();
      this.positionDetailForm.disable();
      this.isPositionFormEditable = false;
      this.childDetailForm.reset();
      this.childDetailForm.disable();
      this.isChildFormEditable = false;

      this.snackBar.open('Der Eintrag wurde erfolgreich gelöscht.', 'Schließen', {
        duration: 3000,
        verticalPosition: 'top',
      });
    };

    const onError = (err: unknown) => {
      console.error('Delete failed', err);
      this.snackBar.open('Fehler beim Löschen.', 'Schließen', {
        duration: 3000, verticalPosition: 'top',
        panelClass: ['error-snackbar'],
      });
    };

    if (isBuchungspunkt) {
      const position = {
        ...this.selectedPosition,
        deleted: true,
      } as ApiProduktPositionBuchungspunkt;

      this.produktService.updateProduktPositionBuchungspunkt(position.id!, position).subscribe({
        next: onSuccess,
        error: onError,
      });
    } else {
      const position = {
        ...this.selectedPosition,
        deleted: true,
      } as ApiProduktPosition;

      this.produktService.updateProduktPosition(position.id!, position).subscribe({
        next: onSuccess,
        error: onError,
      });
    }
  }

  toggleMenu(): void {
    // Implement menu toggle logic
  }
  cancelChildDetails(): void {
    if (!this.selectedPosition) return;

    if (!this.selectedPosition.id) {
      this.selectedPosition = null;
      this.creatingParentId = null;
      this.isChildFormEditable = false;
      this.childDetailForm.reset();
      this.childDetailForm.disable();
      return;
    }

    this.isChildFormEditable = false;
    this.childDetailForm.patchValue({
      buchungspunkt: this.selectedPosition.name || '',
      aktiv: this.selectedPosition.aktiv || false,
    });
    this.childDetailForm.disable();
  }
   saveChildDetails(): void {
  if (!this.selectedPosition) return;

  if (this.childDetailForm.invalid) {
    this.childDetailForm.markAllAsTouched();
    this.dialog.open(ErrorDialogComponent, {
      data: {
        title: 'Pflichtfelder fehlen',
        detail: 'Bitte geben Sie einen Buchungspunkt ein.',
      },
      panelClass: 'custom-dialog-width',
    });
    return;
  }

  const updatedData = this.childDetailForm.value as Partial<ApiProduktPositionBuchungspunkt>;

  const updateInArray = (
    arr: ProduktpositionNode[],
    id: string,
    patch: Partial<ApiProduktPositionBuchungspunkt>
  ): boolean => {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id === id) {
        arr[i] = {
          ...arr[i],
          ...patch,
          name: patch.buchungspunkt || arr[i].name,
          typ: arr[i].typ
        };
        this.selectedPosition = arr[i];
        return true;
      }
      if (arr[i].children && updateInArray(arr[i].children!, id, patch)) {
        return true;
      }
    }
    return false;
  };

  const position: ApiProduktPositionBuchungspunkt = {
    id: this.selectedPosition.id,
    aktiv: updatedData.aktiv,
    buchungspunkt: updatedData.buchungspunkt ?? this.selectedPosition.name,
  };

  const isNew = !position.id;
  const request$ = isNew
    ? this.produktService.createProduktPositionBuchungspunkt(position, this.creatingParentId!)
    : this.produktService.updateProduktPositionBuchungspunkt(position.id!, position);

  request$.subscribe({
    next: (response) => {
      const saved: ApiProduktPositionBuchungspunkt = response.body ?? position;

      if (isNew) {
        const parentId = this.creatingParentId;
        const status: 'active' | 'inactive' = updatedData.aktiv ? 'active' : 'inactive';
        const newChild: ProduktpositionNode = {
          id: saved.id,
          name: updatedData.buchungspunkt ?? saved.buchungspunkt ?? '',
          typ: 'Buchungspunkt',
          level: 2,
          parentId: parentId ?? undefined,
          status,
          aktiv: updatedData.aktiv,
        };
        const parent = this.produktpositionen.find((p: ProduktpositionNode) => p.id === parentId);
        if (parent) {
          parent.children = [...(parent.children ?? []), newChild];
          parent.isExpanded = true;
        }
        this.selectedPosition = newChild;
        this.creatingParentId = null;
      } else {
        updateInArray(this.produktpositionen, position.id!, saved as Partial<ProduktpositionNode>);
      }

      this.isChildFormEditable = false;
      this.childDetailForm.disable();

      this.snackBar.open('Daten wurden gespeichert.', 'Schließen', {
        duration: 2000,
        verticalPosition: 'top'
      });
    },
    error: (err) => {
      console.error('Error saving buchungspunkt:', err);
      this.snackBar.open('Fehler beim Speichern.', 'Schließen', {
        duration: 3000, verticalPosition: 'top',
        panelClass: ['error-snackbar'],
      });
    },
  });
}
}
