import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';

import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule, MatOptionModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {CustomDateAdapter} from '../../../services/custom-date-adapter.service';
import {DATE_FORMATS} from '../../abwesenheit-korrigieren/abwesenheit-korrigieren-detail/abwesenheit-korrigieren-detail.component';
import { PersonenService } from '../../../services/personen.service';
 import {ActivatedRoute, Router} from '@angular/router';
import {ApiPerson} from '../../../models/ApiPerson';
import {DummyService} from '../../../services/dummy.service';
import {Subject, takeUntil} from 'rxjs';
import {ApiVertrag} from '../../../models/ApiVertrag';
import {MatCardModule} from '@angular/material/card';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatListModule} from '@angular/material/list';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatMenuModule} from '@angular/material/menu';
import {DateUtilsService} from '../../../services/utils/date-utils.service';
import {ErrorDialogComponent} from '../../dialogs/error-dialog/error-dialog.component';
import {LogbuchDialogComponent} from '../../dialogs/logbuch-dialog/logbuch-dialog.component';

@Component({
  selector: 'app-personen-detail',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatInputModule,
    MatOptionModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatTooltipModule,
    MatDialogModule,
    MatMenuModule,
    FormsModule

  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS },
  ],
  templateUrl: './personen-detail.component.html',
  styleUrl: './personen-detail.component.scss'
})
export class PersonenDetailComponent {




  personForm!: FormGroup;
  isEditMode = false;
  isLoading = false;
  personId: string | null = null;
  currentPerson: ApiPerson | null = null;
  originalFormValues: any = null;

  /** German messages shown to the user when Save is pressed with invalid form. */
  validationErrors: string[] = [];

  /** Stricter email pattern validator — Angular's built-in Validators.email
      accepts many bogus strings (e.g. "abc@d"). This enforces a reasonable
      local@domain.tld shape. */
  private static emailPatternValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value === null || value === undefined || value === '') return null;
    const re = /^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/;
    return re.test(String(value).trim()) ? null : { email: true };
  };

  /** Pairs FormControl names with the German label text used in the error list. */
  private readonly requiredFieldLabels: { name: string; label: string }[] = [
    { name: 'nachname', label: 'Familienname' },
    { name: 'vorname', label: 'Vorname' },
    { name: 'geburtsdatum', label: 'Geburtsdatum' },
    { name: 'geschlecht', label: 'Geschlecht' },
    { name: 'eintrittsDatum', label: 'Eintrittsdatum' },
    { name: 'emailGeschaeftlich', label: 'Email geschäftlich' },
    { name: 'organisationseinheit', label: 'Organisationseinheit' },
    { name: 'mitarbeiter', label: 'Mitarbeiterart' },
  ];

  // Panel state
  isPanelOpen = {
    personendaten: true,
    organisationsdaten: false,
    betriebsdaten: false,
    vertragsdaten: false
  };

  vertrageData: any[] = [];
  showInactive = false;

  get filteredVertrage(): any[] {
    return this.showInactive
      ? this.vertrageData
      : this.vertrageData.filter(v => v.aktiv !== false);
  }

  // Dropdown options
  geschlechtOptions = [
    { value: 'MAENNLICH', label: 'Männlich' },
    { value: 'WEIBLICH', label: 'Weiblich' },
    { value: 'DIVERS', label: 'Divers' }
  ];

  rolleOptions = [
    { value: 'ADMIN_PROJECT_OFFICE', label: 'Admin Project Office' },
    { value: 'PROJEKTLEITER', label: 'Projektleiter' },
    { value: 'MITARBEITER', label: 'Mitarbeiter' }
  ];

  bucherOptions = [
    { value: 'GEPLANTER_BUCHER', label: 'Geplanter Bucher' },
    { value: 'FREIER_BUCHER', label: 'Freier Bucher' }
  ];

  dienstverwendungOptions = [
    { value: 'REQUIREMENTS_ENGINEER', label: 'Requirements Engineer' },
    { value: 'DEVELOPER', label: 'Developer' },
    { value: 'TESTER', label: 'Tester' }
  ];

  mitarbeiterartOptions = [
    { value: 'EXTERN', label: 'Extern' },
    { value: 'INTERN', label: 'Intern' }
  ];

  rechteOptions = [
    { value: 'STEMPELN', label: 'stempeln' },
    { value: 'REMOTE_USER', label: 'Remote User' },
    { value: 'BEREITSCHAFT', label: 'Bereitschaft' },
    { value: 'ONLINE_STEMPELN_HOMEOFFICE', label: 'Online Stempeln Homeoffice' },
    { value: 'ONLINE_STEMPELN_BUERO', label: 'Online Stempeln Büro' }
  ];

  funktionOptions = [
    { value: 'TEAMLEITER', label: 'Teamleiter' },
    { value: 'ABTEILUNGSLEITER', label: 'Abteilungsleiter' }
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private personenService : PersonenService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dummyService: DummyService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.personId = this.route.snapshot.paramMap.get('id');
    this.initializeForm();


    if(this.personId === 'neu'){
      this.isEditMode = true;
      this.enterEditMode();

    }
    this.loadPersonData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.personForm = this.fb.group({
      // Personendaten Section
      eingabePruefung: [{ value: false, disabled: true }],
      titel: [{ value: '', disabled: true }],
      vorname: [{ value: '', disabled: true }, Validators.required],
      nachname: [{ value: '', disabled: true }, Validators.required],
      geburtsdatum: [{ value: '', disabled: true }, Validators.required],
      geschlecht: [{ value: '', disabled: true }, Validators.required],
      staatsangehoerigkeit: [{ value: '', disabled: true }],
      aktiv: [{ value: true, disabled: true }],
      anmerkung: [{ value: '', disabled: true }],

      // Organisationsdaten Section
      eintrittsDatum: [{ value: '', disabled: true }, Validators.required],
      austrittsDatum: [{ value: '', disabled: true }],
      emailGeschaeftlich: [{ value: '', disabled: true }, [Validators.required, Validators.email, PersonenDetailComponent.emailPatternValidator]],
      emailExtern: [{ value: '', disabled: true }, [Validators.email, PersonenDetailComponent.emailPatternValidator]],
      telefonnummer: [{ value: '', disabled: true }],
      mobilnummerBMI: [{ value: '', disabled: true }],
      mobilnummerExtern: [{ value: '', disabled: true }],
      zimmernummer: [{ value: '', disabled: true }],
      freigabegruppe: [{ value: '', disabled: true }],
      organisationseinheit: [{ value: '', disabled: true }, Validators.required],
      mitarbeiter: [{ value: '', disabled: true }, Validators.required],
      dienstverwendung: [{ value: '', disabled: true }],
      personenverantwortlicher: [{ value: '', disabled: true }],
      teamzuordnung: [{ value: '', disabled: true }],
      teamleiter: [{ value: '', disabled: true }],
      funktion: [{ value: [], disabled: true }],

      // Betriebsdaten Section
      personalnr: [{ value: '', disabled: true }],
      portalUserId: [{ value: '', disabled: true }],
      baksId: [{ value: '', disabled: true }],
      strafregisterbescheid: [{ value: '', disabled: true }],
      interessenskonflikte: [{ value: '', disabled: true }],
      leistungskategorie: [{ value: '', disabled: true }],
      stundensatzJaehrlich: [{ value: '', disabled: true }],
      stundenkontingentJaehrlich: [{ value: '', disabled: true }],
      stundenkontingentVertrag: [{ value: '', disabled: true }],
      bereitschaftsStundensatz: [{ value: '', disabled: true }],
      selbststaendig: [{ value: false, disabled: true }],
      beschaeftigtBei: [{ value: '', disabled: true }],
      getitRolle: [{ value: '', disabled: true }],
      bucher: [{ value: '', disabled: true }],
      rechte: [{ value: [], disabled: true }]
    });

    console.log('Form initialized');
  }

  private loadPersonData(): void {
    if (!this.personId || this.personId === 'neu') {
      console.log('Creating new person — skipping load, leaving form empty');
      this.personId = null;
      this.currentPerson = null;
      this.vertrageData = [];
      return;
    }

    this.isLoading = true;

    this.personenService.loadPersonDetails(this.personId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (person: ApiPerson) => {
          console.log('Person data loaded:', person);
          this.currentPerson = person;
          this.populateForm(person);
          this.transformContracts(Array.isArray(person.vertrag) ? person.vertrag : (person.vertrag ? [person.vertrag] : []));

          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading person data:', error);
          this.isLoading = false;
        }
      });
  }



  private loadPersonData_(): void {
    this.personId = this.route.snapshot.paramMap.get('id');

    console.log('Loading person data for ID:', this.personId);

    if (!this.personId) {
      console.log('No ID found - creating new person');
      return;
    }

    this.isLoading = true;

    this.dummyService.getPerson(
      this.personId,
      'FullPvTlName',
      true,
      true
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (person: ApiPerson) => {
          console.log('Person data loaded:', person);
          this.currentPerson = person;
          this.populateForm(person);
          this.transformContracts(Array.isArray(person.vertrag) ? person.vertrag : (person.vertrag ? [person.vertrag] : []));

          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading person data:', error);
          this.isLoading = false;
        }
      });
  }

  private transformContracts(contracts: ApiVertrag[]): void {
    console.log('Transforming contracts:', contracts.length, 'contracts');

    this.vertrageData = contracts.map((contract, index) => {
      // Level 0: Main Contract
      const level0 = {
        id: contract.id || index.toString(),
        title: contract.vertragsname || 'Unnamed Contract',
        geplant: contract.stundenGeplant || 0,
        gebucht: contract.stundenGebucht || 0,
        aktiv: contract.aktiv !== false,
        expanded: false,
        children: [] as any[]
      };
      // Level 1: Contract Positions
      if (Array.isArray(contract.vertragPosition) && contract.vertragPosition.length > 0) {
        level0.children = contract.vertragPosition.map((position, posIndex) => {
          const level1 = {
            id: position.id || `${index}-${posIndex}`,
            title: position.position || 'Unnamed Position',
            volumenE: position.volumenEuro ? parseFloat(position.volumenEuro) : 0,
            volumenStd: position.volumenStunden ? parseFloat(position.volumenStunden) : 0,
            geplant: position.stundenGeplant || 0,
            expanded: false,
            children: [] as any[]
          };

          // Level 2: Person Assignments
          if (Array.isArray(position.vertragPositionVerbraucher) && position.vertragPositionVerbraucher.length > 0) {
        /*    level1.children = position.vertragPositionVerbraucher.map((verbraucher: {
              id: any; volumenEuro: string; volumenStunden: string; stundenGeplant: any; }, verIndex: any) =>
              ({
                id: verbraucher.id || `${index}-${posIndex}-${verIndex}`,
                title: this.currentPerson ?
                  `${this.currentPerson.vorname} ${this.currentPerson.nachname}` :
                  'Unknown Person',
                volumenE: verbraucher.volumenEuro ? parseFloat(verbraucher.volumenEuro) : 0,
                gesamt: verbraucher.volumenStunden ? parseFloat(verbraucher.volumenStunden) : 0,
                geplant: verbraucher.stundenGeplant || 0
            }));
            */


            level1.children = position.vertragPositionVerbraucher.map((verbraucher, verIndex) => ({
              id: verbraucher.id ?? `${index}-${posIndex}-${verIndex}`,
              title: this.currentPerson
                ? `${this.currentPerson.vorname} ${this.currentPerson.nachname}`
                : 'Unknown Person',
              volumenE: verbraucher.volumenEuro ? parseFloat(verbraucher.volumenEuro) : 0,
              gesamt: verbraucher.volumenStunden ? parseFloat(verbraucher.volumenStunden) : 0,
              geplant: verbraucher.stundenGeplant ?? 0
            }));
          }



          return level1;
        });
      }

      return level0;
    });

    // Expand every node so the full tree is visible on page load.
    this.vertrageData.forEach(level0 => {
      level0.expanded = true;
      level0.children?.forEach((level1: any) => {
        level1.expanded = true;
      });
    });

    console.log('Contracts transformed:', this.vertrageData.length, 'tree items');
    console.log('Tree structure:', this.vertrageData);
  }

  private populateForm(person: ApiPerson): void {
    console.log('Populating form with person data');

    const formData = {
      // Personendaten
      eingabePruefung: person.geprueft || false,
      titel: person.titel || '',
      vorname: person.vorname || '',
      nachname: person.nachname || '',
      geburtsdatum: person.gebdat ? this.formatDate(person.gebdat) : '',
      geschlecht: person.geschlecht || '',
      staatsangehoerigkeit: person.staatsangehoerigkeit || '',
      aktiv: person.aktiv !== undefined ? person.aktiv : true,
      anmerkung: person.anmerkung || '',

      // Organisationsdaten
      eintrittsDatum: person.eintrittsDatum ? this.formatDate(person.eintrittsDatum) : '',
      austrittsDatum: person.austrittsDatum ? this.formatDate(person.austrittsDatum) : '',
      emailGeschaeftlich: person.email || '',
      emailExtern: person.emailPrivat || '',
      telefonnummer: person.telefonNummer || '',
      mobilnummerBMI: person.mobilNummerBmi || '',
      mobilnummerExtern: person.mobilNummer || '',
      zimmernummer: '',
      freigabegruppe: person.freigabegruppe || '',
      organisationseinheit: person.organisationseinheit?.bezeichnung || '',
      mitarbeiter: person.mitarbeiterart || '',
      dienstverwendung: person.dienstverwendung || '',
      personenverantwortlicher: this.formatPersonName(person.personenverantwortlicher),
      teamzuordnung: person.teamzuordnung || '',
      teamleiter: this.formatPersonName(person.teamleiter),
      funktion: person.funktion || [],

      // Betriebsdaten
      personalnr: '',
      portalUserId: person.portalUser || '',
      baksId: person.windowsBenutzerkonto || '',
      strafregisterbescheid: person.strafregisterbescheid ? this.formatDate(person.strafregisterbescheid) : '',
      interessenskonflikte: '',
      leistungskategorie: person.leistungskategorie || '',
      stundensatzJaehrlich: person.stundensatz || '',
      stundenkontingentJaehrlich: person.stundenkontingentJaehrlich || '',
      stundenkontingentVertrag: person.stundenkontingentJaehrlichVertrag || '',
      bereitschaftsStundensatz: person.bereitschaftsStundensatz || '',
      selbststaendig: person.selbststaendig || false,
      beschaeftigtBei: person.firma || '',
      getitRolle: person.rolle || '',
      bucher: person.bucher || '',
      rechte: person.recht || []
    };

    this.personForm.patchValue(formData);
    this.originalFormValues = { ...formData };

    console.log('Form populated successfully');
  }

  private formatDate(dateStr: string): string {
    if (!dateStr) return '';

    if (dateStr.length === 8 && !dateStr.includes('-')) {
      const year = dateStr.substring(0, 4);
      const month = dateStr.substring(4, 6);
      const day = dateStr.substring(6, 8);
      return `${year}-${month}-${day}`;
    }

    if (dateStr.includes('T')) {
      return dateStr.split('T')[0];
    }

    return dateStr;
  }

  private formatPersonName(person: any): string {
    if (!person) return '';
    return `${person.vorname || ''} ${person.nachname || ''}`.trim();
  }

  enterEditMode(): void {
    console.log('Entering edit mode');
    this.isEditMode = true;
    this.enableAllControls(this.personForm);
  }

  private enableAllControls(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.enable();
    });
  }

  private exitEditMode(): void {
    console.log('Exiting edit mode');
    this.isEditMode = false;
    this.validationErrors = [];
    this.disableAllControls(this.personForm);
  }

  private disableAllControls(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.disable();
    });
  }

  onSave(): void {
    console.log('Save button clicked');

    if (this.personForm.invalid) {
      console.log(' Form is invalid, not saving');
      this.personForm.markAllAsTouched();
      // Force Material to re-evaluate validity so .mat-form-field-invalid
      // is applied to every required control that is still empty.
      this.personForm.updateValueAndValidity();
      this.buildValidationErrors();
      // Open the two panels whose required fields live in, so the user
      // can actually see the red-highlighted inputs.
      this.isPanelOpen.personendaten = true;
      this.isPanelOpen.organisationsdaten = true;
      this.dialog.open(ErrorDialogComponent, {
        data: {
          title: 'Pflichtfelder prüfen',
          detail: this.validationErrors.join('\n'),
        },
        panelClass: 'custom-dialog-width',
        autoFocus: false,
      });
      return;
    }

    // Clear any previous validation errors on a successful submit attempt.
    this.validationErrors = [];

    this.isLoading = true;

    const formValue = this.personForm.getRawValue();
    console.log('Form values to save:', formValue);

    const personData: ApiPerson = this.mapFormToApiPerson(formValue);

    console.log('personData', personData);

    const saveObservable = this.personId
      ? this.personenService.updatePerson(this.personId, personData)
      : this.dummyService.createPerson(personData);

    saveObservable
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (savedPerson: ApiPerson) => {
          console.log('Person saved successfully:', savedPerson);
          this.currentPerson = savedPerson;
          this.personForm.patchValue(savedPerson);
          this.transformContracts(Array.isArray(savedPerson.vertrag) ? savedPerson.vertrag : (savedPerson.vertrag ? [savedPerson.vertrag] : []));
          this.exitEditMode();
          this.isLoading = false;

          if (!this.personId) {
            this.router.navigate(['/personen', savedPerson.id]);
          }
        },
        error: (error) => {
          console.error('Error saving person:', error);
          this.isLoading = false;
        }
      });
  }

  private buildValidationErrors(): void {
    const messages: string[] = this.requiredFieldLabels
      .filter(f => this.personForm.get(f.name)?.hasError('required'))
      .map(f => `Das Feld '${f.label}' darf nicht leer sein.`);

    // Email format validation — only report if the field has a value but
    // doesn't match the email pattern.
    const emailFields: { name: string; label: string }[] = [
      { name: 'emailGeschaeftlich', label: 'Email geschäftlich' },
      { name: 'emailExtern', label: 'Email extern' },
    ];
    for (const f of emailFields) {
      const ctrl = this.personForm.get(f.name);
      if (!ctrl) continue;
      if (!ctrl.hasError('required') && ctrl.hasError('email') && ctrl.value) {
        messages.push(`Das Feld '${f.label}' enthält keine gültige E-Mail-Adresse.`);
      }
    }

    this.validationErrors = messages;
  }

  onCancel(): void {
    console.log('Cancel button clicked');

    if (this.originalFormValues) {
      this.personForm.patchValue(this.originalFormValues);
      console.log('Form reset to original values');
    }

    this.exitEditMode();
  }

  private mapFormToApiPerson(formValue: any): ApiPerson {
    const person: ApiPerson = this.currentPerson ? { ...this.currentPerson } : {} as ApiPerson;

    person.titel = formValue.titel;
    person.vorname = formValue.vorname;
    person.nachname = formValue.nachname;
    person.gebdat = this.formatDateForApi(formValue.geburtsdatum);
    person.geschlecht = formValue.geschlecht;
    person.staatsangehoerigkeit = formValue.staatsangehoerigkeit;
    person.aktiv = formValue.aktiv;
    person.geprueft = formValue.eingabePruefung;
    person.anmerkung = formValue.anmerkung;
    person.anmerkung = formValue.anmerkung;
    person.email = formValue.emailGeschaeftlich;
    person.emailPrivat = formValue.emailExtern;
    person.telefonNummer = formValue.telefonnummer;
    person.mobilNummerBmi = formValue.mobilnummerBMI;
    person.mobilNummer = formValue.mobilnummerExtern;
    person.eintrittsDatum =  new Date(formValue.eintrittsDatum).toISOString(); //DateUtilsService.formatDateToISOFull(formValue.eintrittsDatum);
    person.austrittsDatum = new Date(formValue.austrittsDatum).toISOString();//formValue.austrittsDatum;
    person.freigabegruppe = formValue.freigabegruppe;

    person.dienstverwendung = formValue.dienstverwendung;
    person.teamzuordnung = formValue.teamzuordnung;

    person.mitarbeiterart = formValue.mitarbeiter;
    person.firma = formValue.beschaeftigtBei;
    person.selbststaendig = formValue.selbststaendig;
    person.portalUser = formValue.portalUserId;
    person.windowsBenutzerkonto = formValue.baksId;
    person.rolle = formValue.getitRolle;
    person.bucher = formValue.bucher;
    person.recht = formValue.rechte;
    person.funktion = formValue.funktion;
    person.stundensatz = formValue.stundensatzJaehrlich;
    person.stundenkontingentJaehrlich = formValue.stundenkontingentJaehrlich;
    person.stundenkontingentJaehrlichVertrag = formValue.stundenkontingentVertrag;
    person.bereitschaftsStundensatz = formValue.bereitschaftsStundensatz;
    person.leistungskategorie = formValue.leistungskategorie;

    return person;
  }

  private formatDateForApi(dateStr: string): string {
    if (!dateStr) return '';
    return dateStr.replace(/-/g, '');
  }

  onBack(): void {
    console.log('Back button clicked');
    this.router.navigate(['/personen']);
  }

  // ─── Toolbar menu actions ───────────────────────────────────────────────
  openLogbuch(): void {
    const fullName =
      this.currentPerson
        ? `${this.currentPerson.vorname ?? ''} ${this.currentPerson.nachname ?? ''}`.trim()
        : undefined;
    console.log('Menu action: Logbuch clicked', { personId: this.personId, fullName });

    const id = this.personId ?? this.currentPerson?.id ?? '';
    this.personenService.historyAuswertung(id).subscribe({
      next: entries => {
        console.log('historyAuswertung returned', entries.length, 'entries');
        this.dialog.open(LogbuchDialogComponent, {
          data: { title: 'Logbuch', subtitle: fullName, entries },
          panelClass: 'logbuch-dialog-panel',
          autoFocus: false,
          width: '680px',
          maxWidth: '95vw',
        });
      },
      error: err => {
        console.error('historyAuswertung failed', err);
        this.dialog.open(LogbuchDialogComponent, {
          data: { title: 'Logbuch', subtitle: fullName, entries: [] },
          panelClass: 'logbuch-dialog-panel',
          autoFocus: false,
        });
      },
    });
  }

  onMenuPrint(): void {
    console.log('Menu action: Drucken clicked', { personId: this.personId });
  }

  onMenuExport(): void {
    console.log('Menu action: Exportieren clicked', { personId: this.personId });
  }

  togglePanel(panel: keyof typeof this.isPanelOpen): void {
    this.isPanelOpen[panel] = !this.isPanelOpen[panel];
    console.log(`Panel ${panel} is now ${this.isPanelOpen[panel] ? 'open' : 'closed'}`);
  }

  /**
   * Toggle Level 0 (Main Contract)
   */
  toggleVertrag(vertrag: any): void {
    vertrag.expanded = !vertrag.expanded;
    console.log('Contract toggled:', vertrag.title, 'expanded:', vertrag.expanded);
  }

  /**
   * Toggle Level 1 (Contract Position)
   */
  toggleLevel2(item: any): void {
    item.expanded = !item.expanded;
    console.log('Position toggled:', item.title, 'expanded:', item.expanded);
  }

  onCheckboxChange(event: any, controlName: string, value: string): void {
    const control = this.personForm.get(controlName);
    if (!control) return;

    const currentValues: string[] = control.value || [];

    if (event.checked) {
      if (!currentValues.includes(value)) {
        control.setValue([...currentValues, value]);
      }
    } else {
      control.setValue(currentValues.filter(v => v !== value));
    }

    console.log(`Checkbox changed for ${controlName}:`, control.value);
  }
  selectedVertragId: string | null = null;

  selectVertrag(vertragId: string, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.selectedVertragId = vertragId;
    console.log('Selected vertrag:', vertragId);
  }

  goToVertrag(vertragId: string, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.router.navigate(['/vertrag', vertragId]);
  }
}
