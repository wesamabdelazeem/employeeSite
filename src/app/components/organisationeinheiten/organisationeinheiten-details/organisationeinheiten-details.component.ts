import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import {MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule} from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DateAdapter } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { Datalistorganizationanc } from '../../../models/datalistorganizationanc';
import { PersonenService } from '../../../services/personen.service';
import { MatDialog } from '@angular/material/dialog';
import { InfoDialogComponent } from '../../dialogs/info-dialog/info-dialog.component';
import { ErrorDialogComponent } from '../../dialogs/error-dialog/error-dialog.component';
import { forkJoin } from 'rxjs';
import { take } from 'rxjs/operators';
import {ApiOrganisationseinheit} from '../../../models/ApiOrganisationseinheit';
import {SharedDataServiceService} from '../../../services/shared-data-service.service';
import {OrganisationseinheitService} from '../../../services/organisationseinheit.service';
import {ApiMitarbeiterart} from '../../../models/ApiMitarbeiterart';
import {ApiPerson} from '../../../models/ApiPerson';
import {CustomDateAdapter} from '../../../services/custom-date-adapter.service';
import {
  DATE_FORMATS
} from '../../bereitschaftszeiten/bereitschaftszeiten-details/bereitschaftszeiten-details.component';
import { GermanDateInputDirective } from '../../../shared/directives/german-date-input.directive';


@Component({
  selector: 'app-organisationeinheiten-details',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatProgressSpinnerModule,
    GermanDateInputDirective
  ],

  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS }
  ],
  templateUrl: './organisationeinheiten-details.component.html',
  styleUrl: './organisationeinheiten-details.component.scss'
})
export class OrganisationeinheitenDetailsComponent {
  organisationseinheitForm: FormGroup;
  isNewOrganisationseinheit = true;
  isFormEditable = false;
  loading = false;
  saving = false;
  /** Set once the user clicks Save; required-field highlighting only
   *  appears after this becomes true. Cleared again on cancel/edit. */
  submitted = false;
  selectedOrganization: ApiOrganisationseinheit | null = null;

  dataSource: ApiOrganisationseinheit[] = [];
  uebergeordneteEinheiten: ApiOrganisationseinheit[] = [];
  leitungPersonen: ApiPerson[] = [];
  selectedId : string | undefined; // or string, depending on your ID type
  selectedParentId  : string | undefined;

  constructor(
    private dateAdapter: DateAdapter<Date>,
    private fb: FormBuilder,
    private router: Router,
    private OrganisationseinheitService: OrganisationseinheitService,
    private personenService : PersonenService,
    private dialog: MatDialog

  ) {
    this.organisationseinheitForm = this.createForm();
    this.isFormEditable = false;
    this.dateAdapter.setLocale('de-DE'); // Set German locale

  }


  ngOnInit(): void {
    this.selectedOrganization = history.state?.selectedOrganisation;
    this.loading = true;

    if (this.selectedOrganization) {
      console.log('Selected-Org', this.selectedOrganization);
      this.isNewOrganisationseinheit = false;
    } else {
      console.log('New Organisation ' + new Date());
      this.isNewOrganisationseinheit = true;
    }

    forkJoin([
      this.OrganisationseinheitService.getAllData().pipe(take(1)),
      this.personenService.loadPersonen().pipe(take(1))
    ]).subscribe({
      next: ([orgData, personData]) => {

        this.uebergeordneteEinheiten = (orgData ?? []).slice().sort((a, b) => {
          const nameA = a.kurzBezeichnung?.toLowerCase() || '';
          const nameB = b.kurzBezeichnung?.toLowerCase() || '';
          return nameA.localeCompare(nameB);
        });

        this.leitungPersonen = (personData ?? [])
          .filter(person => person.mitarbeiterart !== ApiMitarbeiterart.ZIVILDIENSTLEISTENDER)
          .sort((a, b) => {
            const nameA = a.nachname?.toLowerCase() || '';
            const nameB = b.nachname?.toLowerCase() || '';
            return nameA.localeCompare(nameB);
          });

        console.log('Loaded uebergeordneteEinheiten:', this.uebergeordneteEinheiten.length);
        console.log('Loaded leitungPersonen:', this.leitungPersonen.length);

        if (this.selectedOrganization) {
          this.selectedId = this.selectedOrganization.parent?.id;
          this.selectedParentId = this.selectedOrganization.leiter?.id;

          const preselectedEinheit = this.uebergeordneteEinheiten.find(
            einheit => einheit.id === this.selectedId
          );

          const preselectedLeiter = this.leitungPersonen.find(
            person => person.id === this.selectedParentId
          );

          const emailValue = Array.isArray(this.selectedOrganization.email)
            ? (this.selectedOrganization.email[0] ?? '')
            : (this.selectedOrganization.email || '');

          this.organisationseinheitForm.patchValue({
            bezeichnung: this.selectedOrganization.bezeichnung || '',
            kurzbezeichnung: this.selectedOrganization.kurzBezeichnung || '',
            gueltigVon: this.selectedOrganization.gueltigVon ? new Date(this.selectedOrganization.gueltigVon) : null,
            gueltigBis: this.selectedOrganization.gueltigBis ? new Date(this.selectedOrganization.gueltigBis) : null,
            leitung: preselectedLeiter ?? this.selectedOrganization.leiter ?? null,
            uebergeordneteEinheitId: preselectedEinheit ?? this.selectedOrganization.parent ?? null,
            testId: '',
            email: emailValue,
          });
        }

        if (this.isNewOrganisationseinheit) {
          this.organisationseinheitForm.enable();
          this.isFormEditable = true;
        } else {
          this.organisationseinheitForm.disable();
          this.isFormEditable = false;
        }
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error loading details data:', err);
        if (this.isNewOrganisationseinheit) {
          this.organisationseinheitForm.enable();
          this.isFormEditable = true;
        } else {
          this.organisationseinheitForm.disable();
          this.isFormEditable = false;
        }
        this.loading = false;
      }
    });
  }



  compareOrganisationEinheit(
    o1: ApiOrganisationseinheit | null,
    o2: ApiOrganisationseinheit | null
  ): boolean {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  comparePerson(o1: ApiPerson | null, o2: ApiPerson | null): boolean {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }




  createForm(): FormGroup {
    return this.fb.group({
      bezeichnung: ['', Validators.required],
      kurzbezeichnung: ['', Validators.required],
      hierarchieEbene: [''],
      uebergeordneteEinheitId: [null],
      parent: [null],

      gueltigVon: ['', Validators.required],
      gueltigBis: [''],
      leitung: [null],
      kostenstelle: [''],

      fax: [''],
      email: ['', [Validators.email]],
      testId : ['']
    });
  }

  /** Light-red highlight only appears after the user has clicked Save once. */
  isFieldEmpty(name: string): boolean {
    if (!this.submitted) return false;
    const ctrl = this.organisationseinheitForm.get(name);
    return !!ctrl && ctrl.invalid;
  }

  onEditOrSubmit(): void {
    if (!this.isFormEditable) {
      this.organisationseinheitForm.enable();
      this.isFormEditable = true;
      this.submitted = false;
    } else {
      this.onSubmit();
    }
  }


  onSubmit(): void {
    this.submitted = true;
    if (this.organisationseinheitForm.invalid) {
      this.markFormGroupTouched(this.organisationseinheitForm);

      const missingFields: string[] = [];
      const f = this.organisationseinheitForm;
      if (f.get('bezeichnung')?.hasError('required')) {
        missingFields.push('Bezeichnung');
      }
      if (f.get('kurzbezeichnung')?.hasError('required')) {
        missingFields.push('Kurzbezeichnung');
      }
      if (f.get('gueltigVon')?.hasError('required')) {
        missingFields.push('Gültig von');
      }
      if (f.get('email')?.hasError('email')) {
        missingFields.push('gültige E-Mail-Adresse');
      }

      const detail = missingFields.length
        ? `Bitte füllen Sie folgende Felder aus: ${missingFields.join(', ')}.`
        : 'Bitte überprüfen Sie Ihre Eingaben.';

      this.dialog.open(ErrorDialogComponent, {
        data: { title: 'Pflichtfelder fehlen', detail },
        panelClass: 'custom-dialog-width',
      });
      return;
    }

    const formData = this.organisationseinheitForm.value;
    const id = this.selectedOrganization?.id;


    const newOrUpdatedOrg: ApiOrganisationseinheit = {
      id,
      version: this.selectedOrganization?.version,
      deleted: false,
      bezeichnung: formData.bezeichnung,
      kurzBezeichnung: formData.kurzbezeichnung,
      gueltigVon: formData.gueltigVon,
      gueltigBis: formData.gueltigBis,
      email: [formData.email],
      parent : formData.uebergeordneteEinheitId,
      leiter: formData.leitung
        ? {
          id: formData.leitung.id,
          vorname: formData.leitung.vorname,
          nachname: formData.leitung.nachname,
          recht: [],
          funktion: [],
          vertrag: []
        }
        : undefined
    };


    console.log('newOrUpdatedOrg', newOrUpdatedOrg);
    console.log('isNewOrganisationseinheit', this.isNewOrganisationseinheit);

    const handleSaveSuccess = (savedOrg?: ApiOrganisationseinheit) => {
      this.saving = false;
      this.submitted = false;
      this.organisationseinheitForm.disable();
      this.isFormEditable = false;

      if (savedOrg) {
        this.selectedOrganization = savedOrg;
        this.isNewOrganisationseinheit = false;
      }

      this.dialog.open(InfoDialogComponent, {
        data: {
          title: 'Erfolgreich',
          detail: 'Die Organisationseinheit wurde erfolgreich gespeichert.'
        },
        panelClass: 'custom-dialog-width',
      });
    };

    const handleSaveError = (err: HttpErrorResponse, action: 'create' | 'update') => {
      this.saving = false;
      console.error(`Error ${action === 'create' ? 'creating' : 'updating'} Organisationseinheit:`, err);
      this.dialog.open(ErrorDialogComponent, {
        data: {
          title: action === 'create' ? 'Fehler beim Erstellen' : 'Fehler beim Speichern',
          detail: err?.error || 'Die Organisationseinheit konnte nicht gespeichert werden.'
        },
        panelClass: 'custom-dialog-width',
      });
    };

    if (this.isNewOrganisationseinheit) {
      this.OrganisationseinheitService.createOrganisation(newOrUpdatedOrg).subscribe({
        next: (response: ApiOrganisationseinheit) => {
          console.log('Organisationseinheit created successfully:', response);
          handleSaveSuccess(response);
        },
        error: (err) => handleSaveError(err, 'create')
      });
    } else {
      this.OrganisationseinheitService.updateOrganisation(newOrUpdatedOrg).subscribe({
        next: (response) => {
          console.log('Organisationseinheit updated successfully:', response);
          handleSaveSuccess(response);
        },
        error: (err) => handleSaveError(err, 'update')
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/organisationseinheiten']);
  }

  onCancelEdit(): void {
    this.submitted = false;
    if (this.isNewOrganisationseinheit) {
      this.router.navigate(['/organisationseinheiten']);
      return;
    }

    this.organisationseinheitForm.reset();

    if (this.selectedOrganization) {
      const preselectedEinheit = this.uebergeordneteEinheiten.find(
        einheit => einheit.id === this.selectedOrganization?.parent?.id
      );
      const preselectedLeiter = this.leitungPersonen.find(
        person => person.id === this.selectedOrganization?.leiter?.id
      );
      const emailValue = Array.isArray(this.selectedOrganization.email)
        ? (this.selectedOrganization.email[0] ?? '')
        : (this.selectedOrganization.email || '');

      this.organisationseinheitForm.patchValue({
        bezeichnung: this.selectedOrganization.bezeichnung || '',
        kurzbezeichnung: this.selectedOrganization.kurzBezeichnung || '',
        gueltigVon: this.selectedOrganization.gueltigVon ? new Date(this.selectedOrganization.gueltigVon) : null,
        gueltigBis: this.selectedOrganization.gueltigBis ? new Date(this.selectedOrganization.gueltigBis) : null,
        leitung: preselectedLeiter ?? this.selectedOrganization.leiter ?? null,
        uebergeordneteEinheitId: preselectedEinheit ?? this.selectedOrganization.parent ?? null,
        testId: '',
        email: emailValue,
      });
    }

    this.organisationseinheitForm.disable();
    this.isFormEditable = false;
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  onDateInput(field: string, event: MatDatepickerInputEvent<Date>) {
    const inputValue = event.target.value;
   }

  onDateChange(field: string, event: MatDatepickerInputEvent<Date>) {
    if (event.value) {
      this.organisationseinheitForm.get(field)?.setValue(event.value);
    }
  }

}
