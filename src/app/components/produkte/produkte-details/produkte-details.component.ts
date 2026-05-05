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
import {MatDialog,MatDialogModule,MatDialogRef,MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Injectable } from '@angular/core';
import { MatDateFormats, NativeDateAdapter } from '@angular/material/core';
import { ProduktService } from '../../../services/produkt.service';
import { PersonenService } from '../../../services/personen.service';
import { forkJoin } from 'rxjs';
import { Person } from '../../../models/person';
import { LookupService } from '../../../services/utils/lookup.service';
import { ErrorHandlingService } from '../../../services/error-handling.service';
import {ApiPerson} from '../../../models/ApiPerson';
import {ApiMitarbeiterart} from '../../../models/ApiMitarbeiterart';
import {ConfirmationDialogComponent} from '../../confirmation-dialog/confirmation-dialog/confirmation-dialog.component';
import {ApiProdukt} from '../../../models/ApiProdukt';
import {ApiProduktPosition} from '../../../models/ApiProduktPosition';
import {LogbuchDialogComponent} from '../../dialogs/logbuch-dialog/logbuch-dialog.component';
import {getMockProduktHistory} from '../../../mock/produkt-history.mock';
import {getMockProduktPositionHistory} from '../../../mock/produkt-position-history.mock';
import {PRODUKT_POSITION_LOGBUCH_COLUMNS} from '../../../models/ProduktPositionHistoryEntry';

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
}

export const MY_DATE_FORMATS: MatDateFormats = {
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
    HttpClientModule
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
  produktData: ApiProdukt = {};
  selectedProdukt : ApiProdukt = {};
  produktpositionen: ApiProduktPosition[] = [];
  selectedPosition: any | null = null;
  isChildFormEditable = false;
  verantwortlicherOptions: string[] = [];
  servicemanagerOptions: string[] = [];
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private produktService: ProduktService,
    private errorHandlingService : ErrorHandlingService

  ) {}

  ngOnInit(): void {
    this.selectedProdukt = history.state?.produktData;

    this.initMainForm();
    this.initPositionDetailForm();

    this.childDetailForm = this.fb.group({
      docName: [''],
      docTyp: [''],
      aktiv: [false],
    });

    const id = this.route.snapshot.paramMap.get('id');
    this.loadProduktData(id || '1');
  }

  private initMainForm(): void {
    this.produktForm = this.fb.group({
      produktname: ['', Validators.required],
      kurzName: [''],
      produktTyp: [''],
      auftraggeber: [''],
      ergebnisverantwortlicher: [''],
      aktiv: [false],
      start: [null],
      ende: [null],
      auftraggeberOrganisation: [''],
      anmerkung: ['']
    });
    this.produktForm.disable();
  }

  private initPositionDetailForm(): void {
    this.positionDetailForm = this.fb.group({
      aktiv: [false],
      produktposition: [''],
      positionstyp: [''],
      auftraggeber: [''],
      durchfuehrungsverantwortlicher: [''],
      servicemanager: [''],
      start: [null],
      ende: [null],
      organisationseinheit: [''],
      anmerkung: [''],
      buchungsfreigabe: [false]
    });
    this.positionDetailForm.disable();
  }

  private loadProduktData__(id: string): void {
    this.loading = true;

    let detailData : any = this.selectedProdukt;
        console.log(`Loading product details for ID: ${id}`, detailData);

        this.produktData = detailData;

        const allVerantwortlicher: string[] = [];
        const allServicemanager: string[] = [];

        if (detailData.produktPosition) {
          detailData.produktPosition.forEach((pos: any) => {
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
//
        if (detailData.produktPosition) {
          this.produktpositionen = detailData.produktPosition.map((parentPos: any) => {
            const children = (parentPos.produktPositionBuchungspunkt || [])
              .map((childPos: any, index: number) => ({
              id: childPos.id || `${parentPos.id}-${index}`,
              name: childPos.buchungspunkt,
              aktiv: childPos.aktiv,
              status: childPos.aktiv ? 'active' : 'inactive',
              typ: 'Buchungspunkt' as const,
              level: 2,
              parentId: parentPos.id,
              start: childPos.start ? new Date(childPos.start) : undefined,
              ende: childPos.ende ? new Date(childPos.ende) : undefined,
              auftraggeber: childPos.auftraggeber,
              organisationseinheit: childPos.organisationseinheit,
              durchfuehrungsverantwortlicher: childPos.durchfuehrungsverantwortlicher,
              positionstyp: childPos.positionstyp,
              buchungsfreigabe: childPos.buchungsfreigabe,
              anmerkung: childPos.anmerkung,
            }));

            return {
              id: parentPos.id,
              name: parentPos.produktPositionname,
              start: new Date(parentPos.start),
              ende: new Date(parentPos.ende),
              status: parentPos.aktiv ? 'active' : 'inactive',
              aktiv: parentPos.aktiv,
              typ: 'Produktposition' as const,
              isExpanded: false,
              level: 1,
              children: children,
              auftraggeber: parentPos.auftraggeber,
              organisationseinheit: parentPos.auftraggeberOrganisation,
              durchfuehrungsverantwortlicher:
                parentPos.durchfuehrungsverantwortlicher?.vorname +
                ' ' +
                parentPos.durchfuehrungsverantwortlicher?.nachname,
              positionstyp: parentPos.produktPositionTyp,
              buchungsfreigabe: parentPos.buchungsfreigabe,
              anmerkung: parentPos.anmerkung,
              servicemanager: parentPos.auftraggeberOrganisation,
            };
          });

        }
        this.produktForm.patchValue(this.produktData);
        this.produktForm.disable();
        this.loading = false;




  }


  private loadProduktData(id: string): void {
    this.loading = true;
    // const detailFileUrl = 'produkte_detail.json';

    this.produktService.getProduktById(id).subscribe({
      next: (detailData) => {
        console.log(`Loading product details for ID: ${id}`, detailData);

        this.produktData = detailData;

        const allVerantwortlicher: string[] = [];
        const allServicemanager: string[] = [];

        if (detailData.produktPosition) {
          detailData.produktPosition.forEach((pos: any) => {
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
//
        if (detailData.produktPosition) {
          this.produktpositionen = detailData.produktPosition.map((parentPos: any) => {
            const children = (parentPos.produktPositionBuchungspunkt || []).map((childPos: any, index: number) => ({
              id: childPos.id || `${parentPos.id}-${index}`,
              name: childPos.buchungspunkt,
              aktiv: childPos.aktiv,
              status: childPos.aktiv ? 'active' : 'inactive',
              typ: 'Buchungspunkt' as const,
              level: 2,
              parentId: parentPos.id,
              start: childPos.start ? new Date(childPos.start) : undefined,
              ende: childPos.ende ? new Date(childPos.ende) : undefined,
              auftraggeber: childPos.auftraggeber,
              organisationseinheit: childPos.organisationseinheit,
              durchfuehrungsverantwortlicher: childPos.durchfuehrungsverantwortlicher,
              positionstyp: childPos.positionstyp,
              buchungsfreigabe: childPos.buchungsfreigabe,
              anmerkung: childPos.anmerkung,
            }));

            return {
              id: parentPos.id,
              name: parentPos.produktPositionname,
              start: new Date(parentPos.start),
              ende: new Date(parentPos.ende),
              status: parentPos.aktiv ? 'active' : 'inactive',
              aktiv: parentPos.aktiv,
              typ: 'Produktposition' as const,
              isExpanded: false,
              level: 1,
              children: children,
              auftraggeber: parentPos.auftraggeber,
              organisationseinheit: parentPos.auftraggeberOrganisation,
              durchfuehrungsverantwortlicher:
                parentPos.durchfuehrungsverantwortlicher?.vorname +
                ' ' +
                parentPos.durchfuehrungsverantwortlicher?.nachname,
              positionstyp: parentPos.produktPositionTyp,
              buchungsfreigabe: parentPos.buchungsfreigabe,
              anmerkung: parentPos.anmerkung,
              servicemanager: parentPos.auftraggeberOrganisation,
            };
          });

        }
        this.produktForm.patchValue(this.produktData);
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
      this.snackBar.open('Bitte füllen Sie alle Pflichtfelder aus.', 'Schließen', {
        duration: 3000, verticalPosition: 'top',
      });
      return;
    }

    this.saving = true;
    console.log('this.produktData-test', this.produktData);
    console.log('this.produktForm.value', this.produktForm.value)



    this.produktData = {
      ...this.selectedProdukt,      // Keep existing properties
      ...this.produktForm.value     // Override with form values
    };

    this.produktService.updateProdukt(this.produktData).subscribe( {
      next: (updatedProdukt) => {
        console.log("produktData-After-Update", updatedProdukt);

        this.isEditMode = false;
        this.isFormEditable = false;
        this.produktForm.disable();

        this.saving = false;
        this.produktForm.get('version')?.setValue(updatedProdukt.version);

        this.snackBar.open('Prodkut erfolgreich aktualisiert', 'Close', {
          duration: 5000,
          panelClass: ['custom-snackbar-1'],
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });


      },
      error: (err) => {
        console.error('Fehler beim Aktualisieren der Person:', err);
        this.errorHandlingService.handleAppError(err);


        //    this.form.enable();
      }
    });

    /*
        setTimeout(() => {
          //this.produktData = { ...this.produktData, ...this.produktForm.value };
          this.produktData = this.produktForm.value;
          console.log('this.produktData-test-2', this.produktData);
          this.saving = false;
          this.isFormEditable = false;
          this.produktForm.disable();
          this.snackBar.open('Daten wurden erfolgreich gespeichert', 'Schließen', {
            duration: 3000, verticalPosition: 'top',
          });
        }, 1000);
        */
  }

  onSubmit__(): void {
    if (this.produktForm.invalid) {
      this.snackBar.open('Bitte füllen Sie alle Pflichtfelder aus.', 'Schließen', {
        duration: 3000, verticalPosition: 'top',
      });
      return;
    }

    this.saving = true;
    setTimeout(() => {
      this.produktData = { ...this.produktData, ...this.produktForm.value };
      this.saving = false;
      this.isFormEditable = false;
      this.produktForm.disable();
      this.snackBar.open('Daten wurden erfolgreich gespeichert', 'Schließen', {
        duration: 3000, verticalPosition: 'top',
      });
    }, 1000);
  }

  onCancel(): void {
    if (this.isFormEditable) {
      this.isFormEditable = false;
      this.produktForm.patchValue(this.produktData);
      this.produktForm.disable();
    } else {
      this.router.navigate(['/produkte']);
    }
  }

  /** Toolbar menu action — opens the shared LogbuchDialog populated
   *  with mock produkt history (see src/app/mock/produkt-history.mock.ts).
   *  Mirrors PersonenDetailComponent.openLogbuch — same dialog
   *  component, same shape, just produkt-shaped data. */
  openLogbuch(): void {
    const produktId = this.produktData?.id ?? this.route.snapshot.paramMap.get('id') ?? '';
    const produktName = this.produktData?.produktname || this.produktData?.kurzName || 'Produkt';
    const entries = getMockProduktHistory(produktId);
    console.log('Produkte menu: Logbuch clicked', { produktId, produktName, entryCount: entries.length });
    this.dialog.open(LogbuchDialogComponent, {
      data: { title: 'Logbuch', subtitle: produktName, entries },
      panelClass: 'logbuch-dialog-panel',
      autoFocus: false,
      width: '680px',
      maxWidth: '95vw',
    });
  }

  /** Position-side Logbuch — same dialog component, but with a
   *  ProduktPosition-shaped column config so Vorgang / Start / Ende /
   *  Aktiv / Buchungsfreigabe / Positionstyp / Auftraggeber /
   *  Organisationseinheit are diffed instead of person columns. */
  openProduktPositionLogbuch(): void {
    const positionId = this.selectedPosition?.id ?? '';
    const positionName = this.selectedPosition?.name || 'Produktposition';
    const entries = getMockProduktPositionHistory(positionId, positionName);
    console.log('Produktposition menu: Logbuch clicked', { positionId, positionName, entryCount: entries.length });
    this.dialog.open(LogbuchDialogComponent, {
      data: {
        title: 'Logbuch',
        subtitle: positionName,
        entries,
        columns: PRODUKT_POSITION_LOGBUCH_COLUMNS,
      },
      panelClass: 'logbuch-dialog-panel',
      autoFocus: false,
      width: '680px',
      maxWidth: '95vw',
    });
  }


  selectPosition(position: any): void {
    if (this.selectedPosition?.id === position.id) {
      return;
    }

    this.selectedPosition = position;
    this.isPositionFormEditable = false;
    this.isChildFormEditable = false; // Reset child edit

    if (position.typ === 'Dokumentation' || position.typ === 'Buchungspunkt') {
      this.childDetailForm.patchValue({
        docName: position.name || '',
        docTyp: position.typ || '',
        aktiv: position.aktiv || false
      });
      this.childDetailForm.disable();
    } else {
      this.positionDetailForm.reset({
        ...position,
        produktposition: position.name,
      });
      this.positionDetailForm.disable();
    }
  }

  onEditOrSubmitPosition(): void {
    if (!this.isPositionFormEditable) {
      this.isPositionFormEditable = true;
      this.positionDetailForm.enable();
      this.positionDetailForm.get('produktposition')?.disable();
    } else {
      this.savePositionDetails();
    }
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
        this.positionDetailForm.get('produktposition')?.enable();
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
      this.snackBar.open('Bitte füllen Sie alle Pflichtfelder der Position aus.', 'Schließen', {
        duration: 3000, verticalPosition: 'top',
      });
      return;
    }

    const updateInArray = (arr: any[], id: string | number, updatedData: any) => {
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

    updateInArray(this.produktpositionen, this.selectedPosition.id, this.positionDetailForm.getRawValue());

    this.isPositionFormEditable = false;
    this.positionDetailForm.disable();

    this.snackBar.open('Daten der Position wurden gespeichert.', 'Schließen', {
      duration: 2000, verticalPosition: 'top',
    });
  }

  onCancelPosition(): void {
    if (!this.selectedPosition) return;

    this.isPositionFormEditable = false;
    this.positionDetailForm.reset({
      ...this.selectedPosition,
      produktposition: this.selectedPosition.name,
    });
    this.positionDetailForm.disable();
  }

  openDeleteDialog(): void {
    if (!this.selectedPosition) return;

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
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
    if (!this.selectedPosition) return;

    const removeFromArray = (arr: any[], id: string | number): any[] => {
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

    this.produktpositionen = removeFromArray(this.produktpositionen, this.selectedPosition.id);

    this.selectedPosition = null;
    this.positionDetailForm.reset();
    this.positionDetailForm.disable();
    this.isPositionFormEditable = false;

    this.snackBar.open('Der Eintrag wurde erfolgreich gelöscht.', 'Schließen', {
      duration: 3000,
      verticalPosition: 'top',
    });
  }

  toggleMenu(): void {
    // Implement menu toggle logic
  }
  cancelChildDetails(): void {
    this.childDetailForm.reset();
    this.childDetailForm.disable();
  }
  saveChildDetails(): void {
    if (!this.selectedPosition) return;

    if (this.childDetailForm.invalid) {
      this.snackBar.open('Bitte füllen Sie alle Pflichtfelder aus.', 'Schließen', {
        duration: 3000,
        verticalPosition: 'top'
      });
      return;
    }

    const updatedData = this.childDetailForm.value;

    const updateInArray = (arr: any[], id: string | number, updatedData: any) => {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === id) {
          arr[i] = {
            ...arr[i],
            ...updatedData,
            name: updatedData.docName || arr[i].name,
            typ: arr[i].typ
          };
          this.selectedPosition = arr[i];
          return true;
        }
        if (arr[i].children && updateInArray(arr[i].children!, id, updatedData)) {
          return true;
        }
      }
      return false;
    };

    updateInArray(this.produktpositionen, this.selectedPosition.id, updatedData);

    this.isChildFormEditable = false;
    this.childDetailForm.disable();

    this.snackBar.open('Daten wurden gespeichert.', 'Schließen', {
      duration: 2000,
      verticalPosition: 'top'
    });
  }
}
