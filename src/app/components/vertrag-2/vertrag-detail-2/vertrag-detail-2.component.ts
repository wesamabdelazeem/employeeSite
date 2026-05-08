// import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, Inject, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
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
// import { VertrageService } from '../../../services/vertrage.service';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog/confirmation-dialog.component';
import { InfoDialogComponent } from '../../dialogs/info-dialog/info-dialog.component';
import { ErrorDialogComponent } from '../../dialogs/error-dialog/error-dialog.component';
import { DeleteConfirmDialogComponent } from '../../delete-confirm-dialog/delete-confirm-dialog.component';
import {
  StundensatzAendeungDialogComponent,
  StundensatzAendeungDialogResult,
} from '../../dialogs/Stundensatz-aendeung-dialog/stundensatz-aendeung-dialog/stundensatz-aendeung-dialog.component';
import { FlatNode } from '../../../models/Flat-node';
import { TaetigkeitNode } from '../../../models/TaetigkeitNode';
import { VertraegeService } from '../../../services/vertraege.service';
import { ApiVertrag } from '../../../models/ApiVertrag';
import { ApiVertragPosition } from '../../../models/ApiVertragPosition';
import{ApiVertragPositionVerbraucher}from "../../../models/ApiVertragPositionVerbraucher";
import{ApiStundenplanung} from "../../../models/ApiStundenplanung";
import { ApiPerson } from '../../../models/ApiPerson';
import { ApiProdukt } from '../../../models/ApiProdukt';
import { ApiProduktPosition } from '../../../models/ApiProduktPosition';
import{ApiVertragBezugsart}from"../../../models/ApiVertragBezugsart"
import{ApiVertragsTyp}from"../../../models/ApiVertragsTyp"

// import{VertraegeService}from "../../../services/vertrage.service"

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
  selector: 'app-vertrage-details',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
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

  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ],
  templateUrl: './vertrag-detail-2.component.html',
  styleUrl: './vertrag-detail-2.component.scss'
})
export class VertragDetail2Component  implements OnInit {
vertragForm!: FormGroup;
  positionDetailForm!: FormGroup;
  verbraucherDetailForm!: FormGroup;
  childDetailForm!: FormGroup;
  isFormEditable = false;
  isPositionFormEditable = false;
  isVerbraucherFormEditable = false;
  isChildFormEditable = false;
  saving = false;
  loading = true;
  originalVertragData: any = {};
  vertragspositionen: any[] = [];
  selectedPosition: any | null = null;
verantwortlicherOptions: { id: string; fullName: string }[] = [{ id: '', fullName: '< Person wählen >' }];
  servicemanagerOptions: string[] = [];
    vertragList: { id: string; produktname: string }[] = [{ id: '', produktname: '< Produkt wählen >' }];
  vertragPositionTypenList: { id: string; produktPositionname: string }[] = [{ id: '', produktPositionname: '< Produktposition wählen >' }];

  /** Placeholder labels rendered as the first option of each dropdown. */
  private readonly placeholderPerson         = '< Person wählen >';
  private readonly placeholderProdukt        = '< Produkt wählen >';
  private readonly placeholderProduktposition = '< Produktposition wählen >';
  private readonly placeholderBezugsart      = '< Bezugsart wählen >';
  private readonly placeholderVertragstyp    = '< Vertragstyp wählen >';
  private readonly placeholderVerbrauchertyp = '< Verbrauchertyp wählen >';
  private readonly placeholderRollenbez      = '< Rollenbez.Rahmenvertrag wählen >';

  /** Convert the dropdown's placeholder string back to '' before persisting. */
  private clearPlaceholder(value: any): any {
    if (
      value === this.placeholderBezugsart ||
      value === this.placeholderVertragstyp ||
      value === this.placeholderVerbrauchertyp ||
      value === this.placeholderRollenbez
    ) {
      return '';
    }
    return value;
  }
isNewPositionBeingCreated = false;
isNewVerbraucherBeingCreated = false;
isNewChildBeingCreated = false;
positionSubmitAttempted = false;
childSubmitAttempted = false;
verbraucherSubmitAttempted = false;
vertragSubmitAttempted = false;
 editingNewNodeParentId: string | null = null;
 vertragId!: string;
rollenbezeichnungOptions: string[] = [];
geschaeftszahlenOptions: string[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private dummyService: VertraegeService,
    private cdr: ChangeDetectorRef,

  ) {
    this.bezugsartenOptions = [this.placeholderBezugsart, ...this.buildOption(ApiVertragBezugsart)];
    this.vertragsTypOptions = [this.placeholderVertragstyp, ...this.buildOption(ApiVertragsTyp)];
  }

ngOnInit(): void {
  this.vertragId = this.route.snapshot.paramMap.get('id')!;

  this.initMainForm();
  this.initPositionDetailForm();
  this.initVerbraucherDetailForm();
  this.initChildDetailForm();
  this.loadRollenbezeichnungen();
  this.loadVerantwortlicherOptions();
  this.loadProdukte();

  if (!this.vertragId || this.vertragId === 'new') {
    this.vertragId = null!;
    this.isFormEditable = true;
    this.vertragForm.enable();
    this.vertragForm.patchValue({
      aktiv: true,
      ende: new Date(9999, 11, 31),
    });
    this.loading = false;
    this.loadGeschaeftszahlen();
    return;
  }

  this.loadGeschaeftszahlen();
}
private loadVerantwortlicherOptions(): void {
  this.dummyService.getPersonen1().subscribe({
    next: (persons: any[]) => {
      this.verantwortlicherOptions = [
        { id: '', fullName: this.placeholderPerson },
        ...persons.map(p => ({
          id: p.id,
          fullName: `${p.vorname || ''} ${p.nachname || ''}`.trim()
        }))
      ];
    },
    error: (err) => console.error('Error loading Verantwortlicher:', err)
  });
}
private loadGeschaeftszahlen(): void {
  this.dummyService.getAlleAktuellenGeschaeftszahlen().subscribe({
    next: (data) => {
      const raw = Array.isArray(data.geschaeftszahl) ? data.geschaeftszahl : [];

      // ✅ Add empty string so mat-select can match geschaeftszahl: ""
      this.geschaeftszahlenOptions = ['', ...raw];

      if (this.vertragId) {
        this.loadVertragData();
      }
    },
    error: (err) => console.error('Error loading Geschaeftszahlen:', err)
  });
}
private loadProdukte(): void {
  this.dummyService.getProdukte().subscribe({
    next: (produkte: ApiProdukt[]) => {
      // Use the same `id || produktname` fallback that the form patch uses,
      // so mat-select always finds a matching option even when mock data
      // produkte have no `id` field.
      this.vertragList = [
        { id: '', produktname: this.placeholderProdukt },
        ...(produkte || []).map((p) => ({
          id: p.id || p.produktname || '',
          produktname: p.produktname || ''
        }))
      ];
    },
    error: (err) => console.error('Error loading Produkte:', err)
  });
}

private loadProduktPositionen(produktId: string, onLoaded?: () => void): void {
  if (!produktId) {
    this.vertragPositionTypenList = [
      { id: '', produktPositionname: this.placeholderProduktposition }
    ];
    onLoaded?.();
    return;
  }
  this.dummyService.getProdukt(produktId).subscribe({
    next: (produkt: ApiProdukt) => {
      this.vertragPositionTypenList = [
        { id: '', produktPositionname: this.placeholderProduktposition },
        ...(produkt?.produktPosition || []).map((pp: ApiProduktPosition) => ({
          id: pp.id || pp.produktPositionname || '',
          produktPositionname: pp.produktPositionname || ''
        }))
      ];
      onLoaded?.();
    },
    error: (err) => {
      console.error('Error loading ProduktPositionen:', err);
      onLoaded?.();
    }
  });
}

private loadRollenbezeichnungen(): void {
  this.dummyService.getAlleAktuellenRollenbezeichnungen().subscribe({
    next: (data) => {
      this.rollenbezeichnungOptions = [
        this.placeholderRollenbez,
        ...(Array.isArray(data.rollenbezeichnung) ? data.rollenbezeichnung : [])
      ];
    },
    error: (err) => {
      console.error('Error loading Rollenbezeichnungen:', err);
    }
  });
}
 addVertragsposition(): void {
  this.cancelAndResetNewFlags();

  const newPosition = {
    id: `new-level1-${Date.now()}`,
    name: 'Neue Vertragsposition',
    start: undefined,
    ende: undefined,
    status: 'active',
    aktiv: true,
    typ: 'Vertragsposition',
    isExpanded: false,
    level: 1,
    auftraggeber: '',
    organisationseinheit: '',
    durchfuehrungsverantwortlicher: '',
    positionstyp: '',
    buchungsfreigabe: false,
    anmerkung: '',
    volumenEuro: 0,
    volumenStunden: 0,
    stundenGeplant: 0,
    children: [],
    isNew: true,
    isPendingCreation: true
  };
  this.selectedPosition = newPosition;
  this.isPositionFormEditable = true;
  this.positionDetailForm.enable();
  this.positionDetailForm.reset({
    aktiv: true,
    positionsbezeichnung: '',
    planungsjahr: '',
    volumen: '',
    volumenEuro: '',
    jahresuebertrag: false,
    rollenbezRahmenvertrag: this.placeholderRollenbez,
    anmerkung: '',
  });

  this.positionSubmitAttempted = false;
  this.isNewPositionBeingCreated = true;
  this.editingNewNodeParentId = null;
}

addVerbraucher(parentNode: any, event: Event): void {
  event.stopPropagation();
  this.cancelAndResetNewFlags();

  if (!parentNode || parentNode.level !== 1) return;

  const newVerbraucher = {
    id: `new-level2-${Date.now()}`,
    name: 'Neue Person',
    typ: 'Verbraucher',
    level: 2,
    parentId: parentNode.id,
    volumenEuro: 0,
    volumenStunden: 0,
    stundenGeplant: 0,
    aktiv: true,
    children: [],
    isNew: true,
    isPendingCreation: true
  };
  this.selectedPosition = newVerbraucher;
  this.isVerbraucherFormEditable = true;
  this.verbraucherDetailForm.enable();
  this.verbraucherDetailForm.reset({
    aktiv: true,
    verbraucherTyp: this.placeholderVerbrauchertyp,
    person: '',
    verbraucher: '',
    stundensatz: '',
    StundensatzAnderung: '',
    stundenkontingent: '',
    volumenEuro: '',
    anmerkung: '',
  });
  this.verbraucherSubmitAttempted = false;
  this.isNewVerbraucherBeingCreated = true;
  this.editingNewNodeParentId = parentNode.id;
}

 canAddVerbraucher(node:FlatNode): boolean {
  return node && node.level === 1;
}

canAddBuchungspunkt(node: FlatNode): boolean {
  return node && node.level === 2;
}
     addBuchungspunkt(parentNode:any, event: Event): void {
  event.stopPropagation();
  this.cancelAndResetNewFlags();

  if (!parentNode || parentNode.level !== 2) return;

  const newBuchungspunkt = {
    id: `new-level3-${Date.now()}`,
    name: 'Neuer Buchungspunkt',
    typ: 'Buchungspunkt',
    level: 3,
    parentId: parentNode.id,
    aktiv: true,
    stundenGeplant: 0,
    anmerkung: '',
    produkt: '',
    produktposition: '',
    produktPosition: {},
    isNew: true,
    isPendingCreation: true
  };
  this.selectedPosition = newBuchungspunkt;
  this.isChildFormEditable = true;
  this.childDetailForm.enable();
  this.childDetailForm.reset({
    produkt: '',
    produktposition: '',
    stundenGeplant: '',
    anmerkung: '',
    aktiv: true,
  });
  this.childSubmitAttempted = false;
  this.isNewChildBeingCreated = true;
  this.editingNewNodeParentId = parentNode.id;
}

  private initMainForm(): void {
    this.vertragForm = this.fb.group({
      vertragsname: ['', Validators.required],
      vertragszusatz: ['', Validators.required],
      vertragspartner: ['', Validators.required],
      auftraggeber: ['', Validators.required],
      vertragsverantwortlicher: [''],
      bezugsart: [this.placeholderBezugsart],
      elak: [''],
      beschaffungsnummer: [''],
      lkVertrag: [false],
      aktiv: [false],
      erstellungsdatum: [null, Validators.required],
      start: [null, Validators.required],
      ende: [null, Validators.required],
      vertragssumme: ['', Validators.required],
      auftragsreferenz: [''],
      rahmenvertragGZ: [''],
      vertragstype: [this.placeholderVertragstyp, Validators.required],
      anmerkung: ['']
    });
    // Don't disable here — disable AFTER patchValue in loadVertragData.
    // Otherwise mat-select binds against a disabled control and the trigger
    // can stay blank even when the value matches an option (Bezugsart bug).
  }
bezugsartenOptions: string[] = [];
vertragsTypOptions: string[] = [];
verbraucherArray: string[] = ['< Verbrauchertyp wählen >', 'Personal', 'Sachmittel'];

/** Take an enum object and return its values as a flat string[] for mat-options. */
private buildOption(enumObj: any): string[] {
  return Object.values(enumObj as Record<string, string>);
}


  private initPositionDetailForm(): void {
    this.positionDetailForm = this.fb.group({
      aktiv: [false],
      positionsbezeichnung: ['', Validators.required],
      planungsjahr: ['', Validators.required],
      volumen: [''],
      volumenEuro: ['', Validators.required],
      jahresuebertrag: [false],
      rollenbezRahmenvertrag: [this.placeholderRollenbez],
      anmerkung: [''],
    });
    this.positionDetailForm.disable();
  }

  private initVerbraucherDetailForm(): void {
    this.verbraucherDetailForm = this.fb.group({
      aktiv: [false],
      verbraucherTyp: [this.placeholderVerbrauchertyp, Validators.required],
      person: [''],
      verbraucher: [''],
      stundensatz: [''],
      StundensatzAnderung:[''],
      stundenkontingent: [''],
      volumenEuro: ['', Validators.required],
      anmerkung: ['']
    });
    this.verbraucherDetailForm.disable();

    // Required fields depend on the selected Verbrauchertyp
    this.verbraucherDetailForm.get('verbraucherTyp')!.valueChanges.subscribe((typ: string) => {
      this.applyVerbraucherRequiredValidators(typ);
    });
  }

  private applyVerbraucherRequiredValidators(typ: string): void {
    const personCtl = this.verbraucherDetailForm.get('person');
    const stundensatzCtl = this.verbraucherDetailForm.get('stundensatz');
    const stundenkontingentCtl = this.verbraucherDetailForm.get('stundenkontingent');
    const verbraucherCtl = this.verbraucherDetailForm.get('verbraucher');

    if (typ === 'Personal') {
      personCtl?.setValidators([Validators.required]);
      stundensatzCtl?.setValidators([Validators.required]);
      stundenkontingentCtl?.setValidators([Validators.required]);
      verbraucherCtl?.clearValidators();
    } else if (typ === 'Sachmittel') {
      verbraucherCtl?.setValidators([Validators.required]);
      personCtl?.clearValidators();
      stundensatzCtl?.clearValidators();
      stundenkontingentCtl?.clearValidators();
    } else {
      personCtl?.clearValidators();
      stundensatzCtl?.clearValidators();
      stundenkontingentCtl?.clearValidators();
      verbraucherCtl?.clearValidators();
    }
    personCtl?.updateValueAndValidity({ emitEvent: false });
    stundensatzCtl?.updateValueAndValidity({ emitEvent: false });
    stundenkontingentCtl?.updateValueAndValidity({ emitEvent: false });
    verbraucherCtl?.updateValueAndValidity({ emitEvent: false });
  }

private initChildDetailForm(): void {
  this.childDetailForm = this.fb.group({
    produkt: [''],
    produktposition: ['', Validators.required],
    stundenGeplant: ['', Validators.required],
    anmerkung: [''],
    aktiv: [false],
  });
  // Don't disable here — the form template is gated by *ngIf on
  // selectedPosition, so it isn't rendered until doSelectPosition runs and
  // disables it after patchValue (with emitEvent:false).

  this.childDetailForm.get('produkt')!.valueChanges.subscribe((produktId: string) => {
    this.loadProduktPositionen(produktId);
  });
}

 private loadVertragData(): void {
  this.loading = true;

  this.dummyService.getVertrag(this.vertragId, true).subscribe({
    next: (detailData: any) => {
      if (!detailData) {
        this.loading = false;
        return;
      }

      if (detailData.vertragsverantwortlicher) {
        const v = detailData.vertragsverantwortlicher;
        const exists = this.verantwortlicherOptions.some(p => p.id === v.id);
        if (!exists) {
          this.verantwortlicherOptions = [
            ...this.verantwortlicherOptions,
            { id: v.id, fullName: `${v.vorname || ''} ${v.nachname || ''}`.trim() }
          ];
        }
      }

      // Force CD so the *ngFor mat-options are rendered (the form-content is
      // wrapped in *ngIf="!loading"); only then patch the values, so mat-select
      // can find the matching option for Bezugsart / Vertragstyp / Vertragsverantwortlicher
      // immediately instead of waiting for the user to open the dropdown.
      const bezugsartValue = this.mapBezugsart(detailData.bezugsart);
      const vertragsTypValue = this.mapVertragsTyp(detailData.vertragsTyp);
      // If the persisted value isn't one of the static enum options (older
      // record, custom value, etc.), append it so mat-select can still render
      // it instead of showing an empty trigger.
      if (bezugsartValue && !this.bezugsartenOptions.includes(bezugsartValue)) {
        this.bezugsartenOptions = [...this.bezugsartenOptions, bezugsartValue];
      }
      if (vertragsTypValue && !this.vertragsTypOptions.includes(vertragsTypValue)) {
        this.vertragsTypOptions = [...this.vertragsTypOptions, vertragsTypValue];
      }
      this.loading = false;
      this.cdr.detectChanges();
      this.vertragForm.patchValue({
        vertragsname:    detailData.vertragsname    || '',
        vertragszusatz:  detailData.vertragszusatz  || '',
        vertragspartner: detailData.vertragspartner || '',
        auftraggeber:    detailData.auftraggeber    || '',
        vertragsverantwortlicher: detailData.vertragsverantwortlicher?.id ?? '',
        bezugsart: bezugsartValue || this.placeholderBezugsart,
        elak: detailData.elak|| '',
        beschaffungsnummer: detailData.beschaffungsnummer || '',
        lkVertrag: detailData.lkKennung || false,
        aktiv:  detailData.aktiv || false,
        erstellungsdatum: detailData.erstelldatum ? new Date(detailData.erstelldatum) : null,
        start:detailData.gueltigVon   ? new Date(detailData.gueltigVon)   : null,
        ende:detailData.gueltigBis   ? new Date(detailData.gueltigBis)   : null,
        vertragssumme:detailData.vertragssumme    || '',
        auftragsreferenz: detailData.auftragsreferenz || '',
        rahmenvertragGZ: detailData.geschaeftszahl || '',
        vertragstype: vertragsTypValue || this.placeholderVertragstyp,
        anmerkung: detailData.anmerkung || ''
      });
      this.originalVertragData = JSON.parse(JSON.stringify(this.vertragForm.getRawValue()));
      // Disable AFTER patching so mat-select renders the patched value first.
      if (!this.isFormEditable) {
        this.vertragForm.disable({ emitEvent: false });
      }
      this.cdr.detectChanges();

      // Build the tree
      if (detailData.vertragPosition) {
        this.vertragspositionen = detailData.vertragPosition.map((parentPos: any) => ({
          id:           parentPos.id,
          name:         parentPos.position || 'Unnamed Position',
          aktiv:        parentPos.aktiv !== false,
          typ:          'Vertragsposition',
          isExpanded:   false,
          level:        1,
          volumenEuro:  parentPos.volumenEuro,
          volumenStunden: parentPos.volumenStunden,
          stundenGeplant: parentPos.stundenGeplant,
          anmerkung:    parentPos.anmerkung || '',

          // FIX: these 3 were never mapped before
          planungsjahr: parentPos.planungsjahr           || '',
          jahresuebertrag: parentPos.jahresuebertrag        || false,
          rollenbezRahmenvertrag: parentPos.rollenbezeichnungRahmenvertrag || '',

          children: parentPos.vertragPositionVerbraucher?.map((verbraucher: any, vIndex: number) => ({
            id:  verbraucher.id || `${parentPos.id}-v${vIndex}`,
            name: verbraucher.person
                            ? `${verbraucher.person.vorname ?? ''} ${verbraucher.person.nachname ?? ''}`.trim() || verbraucher.verbraucher || 'Unbekannter Verbraucher'
                            : verbraucher.verbraucher || verbraucher.verbraucherTyp || 'Unbekannter Verbraucher',
            personId: verbraucher.person?.id,
            typ: 'Verbraucher',
            level:2,
            isExpanded: false,
            parentId:parentPos.id,
            aktiv:verbraucher.aktiv !== false,
            volumenEuro:verbraucher.volumenEuro,
            volumenStunden: verbraucher.volumenStunden,
            stundenGeplant: verbraucher.stundenGeplant,
            verbraucherTyp:  this.mapVerbraucherTyp(verbraucher.verbraucherTyp),
            stundensatz: verbraucher.stundenpreis   || '',
            stundenkontingent: verbraucher.stundenGeplant || '',
            anmerkung: verbraucher.anmerkung      || '',
            children: verbraucher.stundenplanung?.map((plan: any, pIndex: number) => ({
              id: plan.id || `${verbraucher.id}-p${pIndex}`,
              name:plan.produktPosition?.produkt?.produktname || `Plan ${pIndex + 1}`,
              aktiv:plan.produktPosition?.aktiv !== false,
              typ:'Buchungspunkt',
              level: 3,
              parentId:verbraucher.id,
              stundenGeplant: plan.stundenGeplant,
              anmerkung: plan.anmerkung || plan.produktPosition?.anmerkung || '',
              produktPosition: plan.produktPosition
            })) || []
          })) || []
        }));
        this.sortNodesByName(this.vertragspositionen);
      }
    },
    error: (error: any) => {
      console.error('Error:', error);
      this.loading = false;
    }
  });
}

private mapBezugsart(value: string): string {
  const map: { [key: string]: string } = {
    'BBG_ABRUF':         'BBG-Abruf',
    'BRZ_ABRUF':         'BRZ-Abruf',
    'DIREKTVERGABE':     'Direktvergabe',
    'BMI_AUSSCHREIBUNG': 'BMI-Ausschreibung'
  };
  return map[value] || value || '';
}

private mapVertragsTyp(value: string): string {
  const map: { [key: string]: string } = {
    'BETRIEB': 'Betrieb',
    'PROJEKT':  'Projekt'
  };
  return map[value] || value || '';
}

private mapVerbraucherTyp(value: string): string {
  const map: { [key: string]: string } = {
    'PERSONAL':  'Personal',
    'SACHMITTEL': 'Sachmittel'
  };
  return map[value] || value || '';
}
  // Main Form Actions (Vertrag)
onEditOrSubmit(): void {
  if (!this.isFormEditable) {
    this.isFormEditable = true;
    this.vertragForm.enable();
this.loadVerantwortlicherOptions();
    // Load full persons list for the dropdown when editing
    this.dummyService.getPersonen1().subscribe({
      next: (persons: any[]) => {
        this.verantwortlicherOptions = [
          { id: '', fullName: this.placeholderPerson },
          ...persons.map(p => ({
            id: p.id,
            fullName: `${p.vorname || ''} ${p.nachname || ''}`.trim()
          }))
        ];
      }
    });
  } else {
    this.onSubmit();
  }
}
onSubmit(): void {
  this.vertragSubmitAttempted = true;
  if (this.vertragForm.invalid) {
    this.vertragForm.markAllAsTouched();
    this.showErrorDialog(
      this.buildRequiredErrorMessage(this.vertragForm, this.vertragLabelMap),
      'Es sind Eingabefehler aufgetreten'
    );
    return;
  }

  this.saving = true;
  const formValues = this.vertragForm.getRawValue();
  const isNewVertrag = !this.vertragId;

  // Build the DTO
  const dto = {} as ApiVertrag;
  dto.id = this.vertragId;
  dto.vertragsname = formValues.vertragsname;
  dto.vertragspartner = formValues.vertragspartner;
  dto.auftraggeber = formValues.auftraggeber;
  dto.vertragszusatz = formValues.vertragszusatz;
  dto.auftragsreferenz = formValues.auftragsreferenz;
  dto.elak = formValues.elak;
  dto.beschaffungsnummer = formValues.beschaffungsnummer;
  dto.anmerkung = formValues.anmerkung;
  dto.vertragssumme = formValues.vertragssumme?.toString();
  dto.aktiv = formValues.aktiv;
  dto.lkKennung = formValues.lkVertrag;
  dto.bezugsart = this.clearPlaceholder(formValues.bezugsart);
  dto.vertragsTyp = this.clearPlaceholder(formValues.vertragstype);
  dto.geschaeftszahl = formValues.rahmenvertragGZ;
  dto.vertragsverantwortlicher = { id: formValues.vertragsverantwortlicher } as ApiPerson;

  if (formValues.erstellungsdatum) {
    dto.erstelldatum = formValues.erstellungsdatum.toISOString();
  }
  if (formValues.start) {
    dto.gueltigVon = formValues.start.toISOString();
  }
  if (formValues.ende) {
    dto.gueltigBis = formValues.ende.toISOString();
  }

  const saveObservable = isNewVertrag
    ? this.dummyService.createVertrag(dto)
    : this.dummyService.updateVertrag(this.vertragId, dto);

  saveObservable.subscribe({
    next: (response: ApiVertrag) => {
      this.vertragId = response.id ?? this.vertragId;
      this.originalVertragData = JSON.parse(JSON.stringify(this.vertragForm.getRawValue()));
      this.saving = false;
      this.isFormEditable = false;
      this.vertragForm.disable({ emitEvent: false });
      this.vertragSubmitAttempted = false;

      if (isNewVertrag && response.id) {
        window.history.replaceState({}, '', `/vertrag/${response.id}`);
      }

      this.showInfoDialog('Daten wurden erfolgreich gespeichert.');
    },
    error: (error: string) => {
      this.saving = false;
      this.showErrorDialog('Fehler beim Speichern des Vertrags.');
    }
  });
}

  onCancel(): void {
  if (this.isFormEditable) {
    if (!this.vertragId) {
      this.router.navigate(['/vertraege-2']);
      return;
    }
    this.isFormEditable = false;
    this.vertragSubmitAttempted = false;
    this.vertragForm.patchValue(this.originalVertragData, { emitEvent: false });
    this.vertragForm.disable({ emitEvent: false });
  } else {
    this.router.navigate(['/vertraege-2']);
  }
}
selectPosition(position: any): void {
  if (this.selectedPosition?.id === position.id && !position.isNew) {
    return;
  }

  if (this.isNewPositionBeingCreated || this.isNewVerbraucherBeingCreated || this.isNewChildBeingCreated) {
    if (this.selectedPosition && this.selectedPosition.id === position.id && this.selectedPosition.isNew) {
        return;
    }
      this.discardNewPosition(false);
  this.doSelectPosition(position);

    return;
  }

  this.doSelectPosition(position);
}

toggleExpand(position: any, event: Event): void {
  event.stopPropagation();
  if (position.isNew) return;
  position.isExpanded = !position.isExpanded;
}

private doSelectPosition(position: any): void {
  this.selectedPosition = position;
  this.isPositionFormEditable = false;
  this.isVerbraucherFormEditable = false;
  this.isChildFormEditable = false;
  this.positionSubmitAttempted = false;
  this.childSubmitAttempted = false;
  this.verbraucherSubmitAttempted = false;
  this.editingNewNodeParentId = null;

  if (position.isNew) {
    if (position.typ === 'Vertragsposition') {
      this.isPositionFormEditable = true;
      this.positionDetailForm.enable();
      this.isNewPositionBeingCreated = true;
    } else if (position.typ === 'Verbraucher') {
      this.isVerbraucherFormEditable = true;
      this.verbraucherDetailForm.enable();
      this.isNewVerbraucherBeingCreated = true;
    } else if (position.typ === 'Buchungspunkt' || position.typ === 'Dokumentation') {
      this.isChildFormEditable = true;
      this.childDetailForm.enable();
      this.isNewChildBeingCreated = true;
    }
  }

  if (position.typ === 'Vertragsposition') {
   this.positionDetailForm.patchValue({
  aktiv:position.aktiv|| false,
  positionsbezeichnung:position.name|| '',
  planungsjahr:  position.planungsjahr || '',
  volumen:  position.volumenStunden || '',
  volumenEuro: position.volumenEuro || '',
  jahresuebertrag:position.jahresuebertrag|| false,
  rollenbezRahmenvertrag: position.rollenbezRahmenvertrag || this.placeholderRollenbez,
  anmerkung: position.anmerkung || '',
});
    if (!this.isPositionFormEditable) this.positionDetailForm.disable();
  } else if (position.typ === 'Verbraucher') {
  this.verbraucherDetailForm.patchValue({
    aktiv:position.aktiv|| false,
    verbraucherTyp:position.verbraucherTyp || this.placeholderVerbrauchertyp,
    person: position.personId ?? '',
    verbraucher: position.verbraucherTyp === 'Sachmittel' ? (position.name || '') : '',
    stundensatz:position.stundensatz || '',
    stundenkontingent: position.stundenkontingent|| '',
    volumenEuro:position.volumenEuro|| '',
    anmerkung:position.anmerkung|| '',
    StundensatzAnderung: position.stundensatzAenderung || ''
  });
    if (!this.isVerbraucherFormEditable) this.verbraucherDetailForm.disable();
  } else if (position.typ === 'Buchungspunkt' || position.typ === 'Dokumentation') {
    const produktObj = position.produktPosition?.produkt;
    const produktId = produktObj?.id || produktObj?.produktname || '';
    const produktpositionId =
      position.produktPosition?.id
      || position.produktPosition?.produktPositionname
      || '';

    // Make sure the saved produkt is present in vertragList; otherwise mat-select
    // can't find a matching option and the trigger stays blank in display mode.
    if (produktId && !this.vertragList.some(p => p.id === produktId)) {
      this.vertragList = [
        ...this.vertragList,
        { id: produktId, produktname: produktObj?.produktname || produktId }
      ];
    }

    // Load the positionen for this produkt FIRST so mat-select has the matching
    // option, then run change detection so *ngFor renders the new mat-option
    // nodes BEFORE patching the form values. Without detectChanges() between
    // the array update and the patch, mat-select can't find a match and the
    // dropdown stays blank until the user clicks it.
    this.loadProduktPositionen(produktId || '', () => {
      // Same defensive add for the produktposition: if the loaded list doesn't
      // include the saved one (e.g. produkt was a placeholder so the wrong list
      // came back), append it so mat-select can render it.
      if (produktpositionId && !this.vertragPositionTypenList.some(p => p.id === produktpositionId)) {
        this.vertragPositionTypenList = [
          ...this.vertragPositionTypenList,
          {
            id: produktpositionId,
            produktPositionname: position.produktPosition?.produktPositionname || produktpositionId
          }
        ];
      }
      this.cdr.detectChanges();
      this.childDetailForm.patchValue({
        produkt: produktId,
        produktposition: produktpositionId,
        stundenGeplant: position.stundenGeplant ?? '',
        anmerkung: position.anmerkung || '',
        aktiv: position.aktiv ?? false
      }, { emitEvent: false });
      // emitEvent:false on disable() — otherwise the produkt valueChanges
      // subscription fires again, reloads the produkt-positionen list and
      // drops the defensively-added saved produktposition.
      if (!this.isChildFormEditable) this.childDetailForm.disable({ emitEvent: false });
      this.cdr.detectChanges();
    });
  }
}

private isParentOfSelected(possibleParent: any, selectedNode: any): boolean {
  if (!possibleParent.children || possibleParent.children.length === 0) {
    return false;
  }


  for (const child of possibleParent.children) {
    if (child.id === selectedNode.id) {
      return true;
    }
  }

  for (const child of possibleParent.children) {
    if (child.children && this.isParentOfSelected(child, selectedNode)) {
      return true;
    }
  }

  return false;
}
  onEditOrSubmitPositionOrChild(): void {
    if (!this.selectedPosition) return;

    if (this.selectedPosition.typ === 'Vertragsposition') {
      if (!this.isPositionFormEditable) {
        this.isPositionFormEditable = true;
        this.positionDetailForm.enable();
      } else {
        this.savePositionDetails();
      }
    }
    else if (this.selectedPosition.typ === 'Verbraucher') {
      if (!this.isVerbraucherFormEditable) {
        this.isVerbraucherFormEditable = true;
        this.verbraucherDetailForm.enable();
      } else {
        this.saveVerbraucherDetails();
      }
    }
    else {
      if (!this.isChildFormEditable) {
        this.isChildFormEditable = true;
        // emitEvent:false — otherwise enable() re-fires the produkt
        // valueChanges, which reloads the produkt-positionen list and drops
        // the defensively-added saved produktposition.
        this.childDetailForm.enable({ emitEvent: false });
      } else {
        this.saveChildDetails();
      }
    }
  }

 onCancelPositionOrChild(): void {
  if (!this.selectedPosition) return;

  if (this.selectedPosition.isNew) {
    const parentIdToReSelect = this.editingNewNodeParentId;
    this.discardNewPosition(true);
    if (parentIdToReSelect) {
      const parentNode = this.findNodeById(this.vertragspositionen, parentIdToReSelect);
      if (parentNode) {
        this.selectPosition(parentNode);
      }
    }
  } else {
    if (this.selectedPosition.typ === 'Vertragsposition') {
      this.cancelPositionDetails();
    } else if (this.selectedPosition.typ === 'Verbraucher') {
      this.cancelVerbraucherDetails();
    } else {
      this.cancelChildDetails();
    }
  }
}

openConfirmDeleteNewDialog(): void {
  const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
    width: '500px',
    data: {
      title: `Neue ${this.selectedPosition.typ} verwerfen?`,
      message: `Wollen Sie die neu erstellte ${this.selectedPosition.typ} "${this.selectedPosition.name}" wirklich verwerfen? Alle ungespeicherten Änderungen gehen verloren.`,
    },
  });

  dialogRef.afterClosed().subscribe((result) => {
    if (result) {
      this.discardNewPosition();
    }
  });
}

private savePositionDetails(): void {
    if (!this.selectedPosition) return;
    this.positionSubmitAttempted = true;
    if (this.positionDetailForm.invalid) {
      this.positionDetailForm.markAllAsTouched();
      this.showErrorDialog(
        this.buildRequiredErrorMessage(this.positionDetailForm, this.positionLabelMap),
        'Es sind Eingabefehler aufgetreten'
      );
      return;
    }

    const formValues = this.positionDetailForm.getRawValue();

    const dto = {} as ApiVertragPosition;
    dto.position = formValues.positionsbezeichnung;
    dto.volumenStunden = formValues.volumen?.toString();
    dto.volumenEuro = formValues.volumenEuro?.toString();
    dto.anmerkung = formValues.anmerkung;
    dto.aktiv = formValues.aktiv;
    dto.planungsjahr = formValues.planungsjahr;
    dto.jahresuebertrag = formValues.jahresuebertrag;
    dto.rollenbezeichnungRahmenvertrag = this.clearPlaceholder(formValues.rollenbezRahmenvertrag);
    if (this.selectedPosition.isPendingCreation) {
      this.dummyService.createVertragPosition(dto, this.vertragId).subscribe({

        next: (response: ApiVertragPosition) => {
          const newPosition = {
            ...this.selectedPosition,
            ...formValues,
            id: response.id || this.selectedPosition.id,
            name: formValues.positionsbezeichnung,
            isPendingCreation: false,
            isNew: false
          };
          this.vertragspositionen.unshift(newPosition);
          this.sortNodesByName(this.vertragspositionen);
          this.finalizePositionSave();
        },
        error: (err: any) => {
          this.showErrorDialog('Fehler beim Erstellen der Position.');
        }
      });
    } else {
      dto.id = this.selectedPosition.id;

      this.dummyService.updateVertragPosition(this.selectedPosition.id, dto).subscribe({
        next: (response: ApiVertragPosition) => {
          const updateInArray = (arr: any[], id: string | number, data: any) => {
            for (let i = 0; i < arr.length; i++) {
              if (arr[i].id === id) {
                arr[i] = { ...arr[i], ...data };
                this.selectedPosition = arr[i];
                return true;
              }
              if (arr[i].children && updateInArray(arr[i].children!, id, data)) return true;
            }
            return false;
          };

          updateInArray(this.vertragspositionen, this.selectedPosition.id, {
            ...formValues,
            name: formValues.positionsbezeichnung
          });
          this.finalizePositionSave();
        },
        error: (err: string) => {
          this.showErrorDialog('Fehler beim Speichern der Position.');
        }
      });
    }
  }

  private finalizePositionSave(): void {
    this.isPositionFormEditable = false;
    this.positionDetailForm.disable();
    this.isNewPositionBeingCreated = false;
    this.positionSubmitAttempted = false;
    if (this.selectedPosition && this.selectedPosition.isNew) {
      this.selectedPosition.isNew = false;
    }
    this.showInfoDialog('Position erfolgreich gespeichert.');
  }

  private cancelPositionDetails(): void {
    if (!this.selectedPosition) return;

    this.positionSubmitAttempted = false;
    this.isPositionFormEditable = false;
    this.positionDetailForm.patchValue({
      aktiv: this.selectedPosition?.aktiv ?? false,
      positionsbezeichnung: this.selectedPosition?.name ?? '',
      planungsjahr: this.selectedPosition?.planungsjahr ?? '',
      volumen: this.selectedPosition?.volumen ?? '',
      volumenEuro: this.selectedPosition?.volumenEuro ?? '',
      jahresuebertrag: this.selectedPosition?.jahresuebertrag ?? false,
      rollenbezRahmenvertrag: this.selectedPosition?.rollenbezRahmenvertrag || this.placeholderRollenbez,
      anmerkung: this.selectedPosition?.anmerkung ?? '',
    });
    this.positionDetailForm.disable();
  }

 private saveVerbraucherDetails(): void {
  if (!this.selectedPosition) return;
  this.verbraucherSubmitAttempted = true;
  if (this.verbraucherDetailForm.invalid) {
    this.verbraucherDetailForm.markAllAsTouched();
    this.showErrorDialog(
      this.buildRequiredErrorMessage(this.verbraucherDetailForm, this.verbraucherLabelMap),
      'Es sind Eingabefehler aufgetreten'
    );
    return;
  }

  const formValues = this.verbraucherDetailForm.getRawValue();
  const selectedPerson = this.verantwortlicherOptions.find(p => p.id === formValues.person);
  const displayName = formValues.verbraucherTyp === 'Sachmittel'
    ? (formValues.verbraucher || 'Sachmittel')
    : (selectedPerson?.fullName || formValues.person || '');

  const dto = {} as ApiVertragPositionVerbraucher;
  dto.aktiv = formValues.aktiv;
  dto.verbraucher = displayName;
  dto.stundenpreis = formValues.verbraucherTyp === 'Sachmittel' ? '' : formValues.stundensatz?.toString();
  dto.stundenGeplant = formValues.verbraucherTyp === 'Sachmittel' ? '' : formValues.stundenkontingent?.toString();
  dto.volumenEuro = formValues.volumenEuro?.toString();
  dto.anmerkung = formValues.anmerkung;
  dto.verbraucherTyp = this.clearPlaceholder(formValues.verbraucherTyp);


  if (this.selectedPosition.isPendingCreation && this.editingNewNodeParentId) {
    this.dummyService
      .createVertragPositionVerbraucher(dto, this.editingNewNodeParentId)
      .subscribe({
        next: (response: ApiVertragPositionVerbraucher) => {
          const parentNode = this.findNodeById(
            this.vertragspositionen,
            this.editingNewNodeParentId!
          );
          if (parentNode) {
            if (!parentNode.children) parentNode.children = [];
            const savedNode = {
              ...this.selectedPosition,
              ...formValues,
              id: response.id,
              name: displayName,
              personId: formValues.person,
              isPendingCreation: false,
              isNew: false,
            };
            parentNode.children.push(savedNode);
            this.sortNodesByName(parentNode.children);
            parentNode.isExpanded = true;
            this.selectedPosition = savedNode;
          }
          this.finalizeVerbraucherSave();
        },
        error: () => {
          this.showErrorDialog('Fehler beim Erstellen des Verbrauchers.');
        },
      });
  } else {
    dto.id = this.selectedPosition.id;

    this.dummyService
      .updateVertragPositionVerbraucher(this.selectedPosition.id, dto)
      .subscribe({
        next: (response: ApiVertragPositionVerbraucher) => {
          const updateInArray = (arr: any[], id: string | number, data: any): boolean => {
            for (let i = 0; i < arr.length; i++) {
              if (arr[i].id === id) {
                arr[i] = { ...arr[i], ...data };
                this.selectedPosition = arr[i];
                return true;
              }
              if (arr[i].children && updateInArray(arr[i].children, id, data)) return true;
            }
            return false;
          };

          updateInArray(this.vertragspositionen, this.selectedPosition.id, {
            ...formValues,
            name: displayName,
            personId: formValues.person,
          });
          this.finalizeVerbraucherSave();
        },
        error: () => {
          this.showErrorDialog('Fehler beim Speichern des Verbrauchers.');
        },
      });
  }
}

private finalizeVerbraucherSave(): void {
  this.isVerbraucherFormEditable = false;
  this.verbraucherDetailForm.disable();
  this.isNewVerbraucherBeingCreated = false;
  this.verbraucherSubmitAttempted = false;
  if (this.selectedPosition) {
    this.selectedPosition.isNew = false;
    this.selectedPosition.isPendingCreation = false;
  }
  this.showInfoDialog('Verbraucher erfolgreich gespeichert.');
}

  private cancelVerbraucherDetails(): void {
    if (!this.selectedPosition) return;

    this.verbraucherSubmitAttempted = false;
    this.isVerbraucherFormEditable = false;
    this.verbraucherDetailForm.patchValue({
      aktiv: this.selectedPosition?.aktiv ?? false,
      verbraucherTyp: this.selectedPosition?.verbraucherTyp || this.placeholderVerbrauchertyp,
      person: this.selectedPosition?.personId ?? '',
      verbraucher: this.selectedPosition?.verbraucherTyp === 'Sachmittel'
        ? (this.selectedPosition?.name ?? '')
        : '',
      stundensatz: this.selectedPosition?.stundensatz ?? '',
      stundenkontingent: this.selectedPosition?.stundenkontingent ?? '',
      volumenEuro: this.selectedPosition?.volumenEuro ?? '',
      anmerkung: this.selectedPosition?.anmerkung ?? ''
    });
    this.verbraucherDetailForm.disable();
  }

 private saveChildDetails(): void {
  if (!this.selectedPosition) return;
  this.childSubmitAttempted = true;
  if (this.childDetailForm.invalid) {
    this.childDetailForm.markAllAsTouched();
    this.showErrorDialog(
      this.buildRequiredErrorMessage(this.childDetailForm, this.childLabelMap),
      'Es sind Eingabefehler aufgetreten'
    );
    return;
  }

  const formValues = this.childDetailForm.getRawValue();
  const dto = {} as ApiStundenplanung;
  dto.stundenGeplant = formValues.stundenGeplant?.toString();
  dto.anmerkung = formValues.anmerkung;
dto.produkt = { id: formValues.produkt } as ApiProdukt;
dto.produktPosition = { id: formValues.produktposition } as ApiProduktPosition;
  if (this.selectedPosition.isPendingCreation && this.editingNewNodeParentId) {
    const produktPositionId: string = formValues.produktposition ?? '';

    this.dummyService
      .createStundenplanung(dto, produktPositionId, this.editingNewNodeParentId)
      .subscribe({
        next: (response: ApiStundenplanung) => {
          const parentNode = this.findNodeById(
            this.vertragspositionen,
            this.editingNewNodeParentId!
          );
          if (parentNode) {
            if (!parentNode.children) parentNode.children = [];
            const selectedProdukt = this.vertragList.find(p => p.id === formValues.produkt);
            const selectedPosition = this.vertragPositionTypenList.find(pp => pp.id === formValues.produktposition);
            parentNode.children.push({
              ...this.selectedPosition,
              ...formValues,
              id: response.id,
              name: formValues.anmerkung || this.selectedPosition.name,
              // Mirror the nested shape that doSelectPosition reads when the
              // node is re-selected later in the tree.
              produktPosition: {
                id: formValues.produktposition,
                produktPositionname: selectedPosition?.produktPositionname || formValues.produktposition,
                produkt: {
                  id: formValues.produkt,
                  produktname: selectedProdukt?.produktname || formValues.produkt
                }
              },
              isPendingCreation: false,
              isNew: false,
            });
            this.sortNodesByName(parentNode.children);
            parentNode.isExpanded = true;
          }
          this.finalizeChildSave();
        },
        error: () => {
          this.showErrorDialog('Fehler beim Erstellen des Buchungspunkts.');
        },
      });
  } else {
    // UPDATE
    dto.id = this.selectedPosition.id;

    this.dummyService
      .updateStundenplanung(this.selectedPosition.id, dto)
      .subscribe({
        next: () => {
          const updateInArray = (arr: any[], id: string | number, data: any): boolean => {
            for (let i = 0; i < arr.length; i++) {
              if (arr[i].id === id) {
                arr[i] = { ...arr[i], ...data };
                this.selectedPosition = arr[i];
                return true;
              }
              if (arr[i].children && updateInArray(arr[i].children, id, data)) return true;
            }
            return false;
          };

          const selectedProdukt = this.vertragList.find(p => p.id === formValues.produkt);
          const selectedPosition = this.vertragPositionTypenList.find(pp => pp.id === formValues.produktposition);
          updateInArray(this.vertragspositionen, this.selectedPosition.id, {
            ...formValues,
            name: formValues.anmerkung || this.selectedPosition.name,
            produktPosition: {
              id: formValues.produktposition,
              produktPositionname: selectedPosition?.produktPositionname || formValues.produktposition,
              produkt: {
                id: formValues.produkt,
                produktname: selectedProdukt?.produktname || formValues.produkt
              }
            },
          });
          this.finalizeChildSave();
        },
        error: () => {
          this.showErrorDialog('Fehler beim Speichern des Buchungspunkts.');
        },
      });
  }
}

private finalizeChildSave(): void {
  this.isChildFormEditable = false;
  this.childDetailForm.disable({ emitEvent: false });
  this.isNewChildBeingCreated = false;
  this.childSubmitAttempted = false;
  if (this.selectedPosition) this.selectedPosition.isNew = false;
  this.showInfoDialog('Buchungspunkt erfolgreich gespeichert.');
}


 private cancelChildDetails(): void {
  if (!this.selectedPosition) return;

  this.childSubmitAttempted = false;
  this.isChildFormEditable = false;
  const produktObj = this.selectedPosition.produktPosition?.produkt;
  this.childDetailForm.patchValue({
    produkt: produktObj?.id || produktObj?.produktname || '',
    produktposition:
      this.selectedPosition.produktPosition?.id
      || this.selectedPosition.produktPosition?.produktPositionname
      || '',
    stundenGeplant: this.selectedPosition.stundenGeplant || '',
    anmerkung: this.selectedPosition.anmerkung || '',
    aktiv: this.selectedPosition.aktiv || false
  }, { emitEvent: false });
  this.childDetailForm.disable({ emitEvent: false });
}
  openStundensatzAenderungDialog(): void {
    if (!this.selectedPosition || this.selectedPosition.typ !== 'Verbraucher') return;

    const currentStundensatz =
      this.verbraucherDetailForm.get('stundensatz')?.value
      ?? this.selectedPosition.stundensatz
      ?? null;

    const dialogRef = this.dialog.open(StundensatzAendeungDialogComponent, {
      width: '600px',
      data: {
        currentStundensatz,
        newStundensatz: currentStundensatz,
      },
    });

    dialogRef.afterClosed().subscribe((result: StundensatzAendeungDialogResult | undefined) => {
      if (!result || !result.confirmed) return;
      // Reflect the new Stundensatz in the form so the user sees the change.
      // The actual reset/duplicate flow against the backend is left to the
      // existing Verbraucher save handler.
      this.verbraucherDetailForm.patchValue(
        { stundensatz: result.newStundensatz },
        { emitEvent: false }
      );
    });
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
  if (!this.selectedPosition) return;

  const id = this.selectedPosition.id;
  const typ = this.selectedPosition.typ;

  const removeFromArray = (arr: any[], targetId: string | number): any[] => {
    return arr.filter(item => {
      if (item.id === targetId) return false;
      if (item.children) {
        item.children = removeFromArray(item.children, targetId);
      }
      return true;
    });
  };

  if (typ === 'Vertragsposition') {
    const dto = {} as ApiVertragPosition;
    dto.id = id;
    dto.position = this.selectedPosition.name;
    dto.aktiv = false;

    this.dummyService.updateVertragPosition(id, dto).subscribe({
      next: () => {
        this.vertragspositionen = removeFromArray(this.vertragspositionen, id);
        this.resetFormsAfterDelete();
        this.showInfoDialog('Position erfolgreich gelöscht.');
      },
      error: () => {
        this.showErrorDialog('Fehler beim Löschen.');
      }
    });

  } else if (typ === 'Verbraucher') {
    const dto = {} as ApiVertragPositionVerbraucher;
    dto.id = id;
    dto.aktiv = false;

    this.dummyService.updateVertragPositionVerbraucher(id, dto).subscribe({
      next: () => {
        this.vertragspositionen = removeFromArray(this.vertragspositionen, id);
        this.resetFormsAfterDelete();
        this.showInfoDialog('Verbraucher erfolgreich gelöscht.');
      },
      error: () => {
        this.showErrorDialog('Fehler beim Löschen des Verbrauchers.');
      }
    });

  } else if (typ === 'Buchungspunkt') {
    const dto = {} as ApiStundenplanung;
    dto.id = id;

    this.dummyService.updateStundenplanung(id, dto).subscribe({
      next: () => {
        this.vertragspositionen = removeFromArray(this.vertragspositionen, id);
        this.resetFormsAfterDelete();
        this.showInfoDialog('Buchungspunkt erfolgreich gelöscht.');
      },
      error: () => {
        this.showErrorDialog('Fehler beim Löschen des Buchungspunkts.');
      }
    });
  }
}
  private resetFormsAfterDelete(): void {
    this.selectedPosition = null;
    this.positionDetailForm.reset();
    this.positionDetailForm.disable();
    this.isPositionFormEditable = false;
    this.verbraucherDetailForm.reset();
    this.verbraucherDetailForm.disable();
    this.isVerbraucherFormEditable = false;
    this.childDetailForm.reset();
    this.childDetailForm.disable();
    this.isChildFormEditable = false;
  }
private findNodeById(nodes: any[], id: string | number): any | null {
  for (const node of nodes) {
    if (node.id === id) {
      return node;
    }
    if (node.children) {
      const foundChild = this.findNodeById(node.children, id);
      if (foundChild) {
        return foundChild;
      }
    }
  }
  return null;
}

private cancelAndResetNewFlags(): boolean {
  if (this.isNewPositionBeingCreated || this.isNewVerbraucherBeingCreated || this.isNewChildBeingCreated) {
    if (this.selectedPosition && this.selectedPosition.isNew) {
      this.discardNewPosition(false);
    }
    return true;
  }
  return false;
}
private discardNewPosition(showSnackBar: boolean = true): void {
  if (!this.selectedPosition || !this.selectedPosition.isNew) return;

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

  const discardedLevel = this.selectedPosition.level;
  const discardedParentId = this.editingNewNodeParentId;

  if (discardedLevel === 1) {
    this.vertragspositionen = removeFromArray(this.vertragspositionen, this.selectedPosition.id);
    this.isNewPositionBeingCreated = false;
  } else if (discardedLevel === 2) {
    this.vertragspositionen.forEach(pos => {
      if (pos.children) {
        pos.children = removeFromArray(pos.children, this.selectedPosition.id);
      }
    });
    this.isNewVerbraucherBeingCreated = false;
  } else if (discardedLevel === 3) {
    this.vertragspositionen.forEach(pos => {
      if (pos.children) {
        pos.children.forEach((verbraucher:any) => {
          if (verbraucher.children) {
            verbraucher.children = removeFromArray(verbraucher.children, this.selectedPosition.id);
          }
        });
      }
    });
    this.isNewChildBeingCreated = false;
  }

  this.selectedPosition = null;
  this.positionDetailForm.reset();
  this.positionDetailForm.disable();
  this.isPositionFormEditable = false;
  this.positionSubmitAttempted = false;
  this.verbraucherDetailForm.reset();
  this.verbraucherDetailForm.disable();
  this.isVerbraucherFormEditable = false;
  this.verbraucherSubmitAttempted = false;
  this.childDetailForm.reset();
  this.childDetailForm.disable();
  this.isChildFormEditable = false;
  this.childSubmitAttempted = false;
  this.editingNewNodeParentId = null;


  if (!showSnackBar && discardedParentId) {
    const parentNode = this.findNodeById(this.vertragspositionen, discardedParentId);
    if (parentNode) {
      this.selectPosition(parentNode);
    }
  }
}

  toggleMenu(): void {
  }
  isEditing: boolean = false;
previousValue: string = '';

onEditStundensatz(): void {
  this.isEditing = true;
  this.previousValue = this.verbraucherDetailForm.get('anmerkung')?.value || '';
}

onSaveStundensatz(): void {
  this.isEditing = false;
  const newValue = this.verbraucherDetailForm.get('anmerkung')?.value;
}

onCancelStundensatz(): void {
  this.isEditing = false;
  this.verbraucherDetailForm.patchValue({
    anmerkung: this.previousValue
  });
}

goToPersonPage(): void {
  this.router.navigate(['/personen'])

}

private showInfoDialog(detail: string, title: string = 'Erfolgreich'): void {
  this.dialog.open(InfoDialogComponent, {
    data: { title, detail },
    panelClass: 'custom-dialog-width'
  });
}

private showErrorDialog(detail: string, title: string = 'Fehler'): void {
  this.dialog.open(ErrorDialogComponent, {
    data: { title, detail },
    panelClass: 'custom-dialog-width'
  });
}

/** Build a validation message that enumerates every required field that is
 *  still empty, one "Das Feld 'X' darf nicht leer sein." line per field.
 *  The error dialog renders with white-space: pre-wrap, so newlines are
 *  preserved. */
private buildRequiredErrorMessage(form: FormGroup, labelMap: Record<string, string>): string {
  const missing: string[] = [];
  Object.keys(form.controls).forEach((key) => {
    const ctl = form.get(key);
    // Report ANY invalid control, not just ones with `required` errors.
    // Otherwise validators like `min`, `pattern`, or async failures show
    // up as the unhelpful generic "Pflichtfelder" message.
    if (ctl && ctl.invalid) {
      missing.push(labelMap[key] || key);
    }
  });
  if (missing.length === 0) {
    return 'Bitte füllen Sie alle Pflichtfelder aus.';
  }
  return missing.map((label) => `Das Feld '${label}' darf nicht leer sein.`).join('\n');
}

private vertragLabelMap: Record<string, string> = {
  vertragsname: 'Vertragsname',
  vertragszusatz: 'Vertragszusatz',
  vertragspartner: 'Vertragspartner',
  auftraggeber: 'Auftraggeber',
  erstellungsdatum: 'Erstellungsdatum',
  start: 'Gültig von',
  ende: 'Gültig bis',
  vertragssumme: 'Vertragssumme',
  vertragstype: 'Vertragstyp',
};

private positionLabelMap: Record<string, string> = {
  positionsbezeichnung: 'Positionsbezeichnung',
  planungsjahr: 'Planungsjahr',
  volumenEuro: 'Volumen [Euro]',
};

private verbraucherLabelMap: Record<string, string> = {
  verbraucherTyp: 'Verbrauchertyp',
  person: 'Person',
  verbraucher: 'Verbraucher',
  stundensatz: 'Stundensatz inkl. UST.',
  stundenkontingent: 'Stundenkontingent jährlich',
  volumenEuro: 'Volumen [Euro]',
};

private childLabelMap: Record<string, string> = {
  produktposition: 'Produktposition',
  stundenGeplant: 'Stunden geplant',
};

private sortNodesByName(nodes: any[]): any[] {
  if (!Array.isArray(nodes)) return nodes;
  nodes.sort((a, b) =>
    (a?.name || '').localeCompare((b?.name || ''), 'de', { sensitivity: 'base' })
  );
  nodes.forEach((node) => {
    if (Array.isArray(node?.children) && node.children.length > 0) {
      this.sortNodesByName(node.children);
    }
  });
  return nodes;
}

}
