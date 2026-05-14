import { Component, OnInit, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatCheckboxChange } from "@angular/material/checkbox";
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

import { FormValidationService } from '../../../services/utils/form-validation.service';
import { TimeUtilityService } from '../../../services/utils/time-utility.service';
import { TreeNodeService } from '../../../services/utils/tree-node.service';
import { TimeOverlapService } from '../../../services/utils/time-overlap.service';
import { TreeExpansionService } from '../../../services/utils/tree-expansion.service';
import { DateParserService } from '../../../services/utils/date-parser.service';
import { ApiStempelzeit } from '../../../models/ApiStempelzeit';
import { ApiZeitTyp } from '../../../models/ApiZeitTyp';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog/confirmation-dialog.component';
import { InfoDialogComponent } from '../../dialogs/info-dialog/info-dialog.component';
import { ErrorDialogComponent } from '../../dialogs/error-dialog/error-dialog.component';
import { StatusPanelService } from '../../../services/utils/status-panel-status.service';
import { AppConstants } from '../../../models/app-constants';
import { TaetigkeitNode } from '../../../models/taetigkeit-node';
import { NachverrechnungService } from '../../../services/nachverrechnung.service';
import { ApiTaetigkeitsbuchung } from '../../../models/ApiTaetigkeitsbuchung';
import { ApiProdukt } from '../../../models/ApiProdukt';
import { ApiProduktPosition } from '../../../models/ApiProduktPosition';
import { ApiProduktPositionBuchungspunkt } from '../../../models/ApiProduktPositionBuchungspunkt';
import { ApiTaetigkeitTyp, getApiTaetigkeitTypDisplayValues } from '../../../models/ApiTaetigkeitTyp';
import { DateUtilsService } from '../../../services/utils/date-utils.service';
import { FlatNode } from '../../../models/Flat-node';
import { TreeBuilderService } from '../../../services/utils/tree-builder.service';
import { ApiAbschlussInfo } from '../../../models/ApiAbschlussInfo';
import { MatNativeDateModule, MAT_DATE_FORMATS, DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TimeBoxComponent } from '../../../shared/components/time-box/time-box.component';
import { TreeNodeManagementService } from '../../../services/utils/tree-node-management.service';
import { CustomDateAdapter } from '../../../services/custom-date-adapter.service';
//import {PersonService} from '../../../services/person.service';

export const DATE_FORMATS = {
  parse: {
    dateInput: 'DD.MM.YYYY',
  },
  display: {
    dateInput: 'DD.MM.YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-nachverrechnung-details',
  imports: [

    MatProgressSpinnerModule, MatTreeModule, MatIconModule, MatButtonModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatSnackBarModule,
    ReactiveFormsModule, CommonModule,

    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatCheckboxModule,
    TimeBoxComponent,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS }
  ],
  templateUrl: './nachverrechnung-details.component.html',
  styleUrl: './nachverrechnung-details.component.scss'
})
export class NachverrechnungDetailsComponent {


  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level,
    node => node.expandable
  );

  isCreatingNewThirdLevel = false;
  alarmNode: FlatNode | null = null;
  showRightPanelAlarmActions = false;
 personName:string='';
 private transformer = (node: TaetigkeitNode, level: number): FlatNode => ({
  expandable: -level === 0 || level === 1,
  name: node.name,
  level: level,
  hasEntries: node.hasEntries ?? false,
  hasNotification: node.hasNotification || false,
  formData: node.formData,
  stempelzeitData: node.stempelzeitData,
  monthName: node.monthName,
  gebuchtTotal: node.gebuchtTotal,
  dayName: node.dayName,
  gestempelt: node.gestempelt,
  gebucht: node.gebucht,
  stempelzeitenList: node.stempelzeitenList,
  gebuchtTime: node.gebuchtTime,
  gestempeltTime: node.gestempeltTime,
  timeRange: node.timeRange,
  hasAlarm: node.hasAlarm || false,
  alarmData: node.alarmData || null,
  productName: node.productName,
  positionName: node.positionName,
  buchungspunkt: node.buchungspunkt,
  isNachverrechnung: node.isNachverrechnung || false,
  taetigkeit: node.taetigkeit,
  anmerkung: node.anmerkung,
  jiraTicket: node.jiraTicket
});

  treeFlattener = new MatTreeFlattener(
    this.transformer,
    node => node.level,
    node => node.expandable,
    node => node.children
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  bereitschaftForm: FormGroup;
  alarmForm: FormGroup;
  nachverrechnungForm!: FormGroup;
  monthSummaryForm!: FormGroup;
  showNachverrechnungForm = false;
  hideDateField = false;
  isViewingNachverrechnung = false;
  currentDayDate: Date | null = null;
  selectedNachverrechnungNode: FlatNode | null = null;
  produktOptions: ApiProdukt[] = [];
  produktpositionOptions: ApiProduktPosition[] = [];
  buchungspunktOptions: ApiProduktPositionBuchungspunkt[] = [];
  taetigkeitOptions: { key: ApiTaetigkeitTyp; value: string }[] = getApiTaetigkeitTypDisplayValues();
  selectedNode: FlatNode | null = null;
  isEditing = false;
  isLoading = true;
  isCreatingNew = false;
  isNewlyCreated = false;
  private clickTimeout: ReturnType<typeof setTimeout> | null = null;
  private readonly DOUBLE_CLICK_DELAY = 250;
  private clickCount = 0;
  personId!: string;
  abschlussInfo: ApiAbschlussInfo | null = null;

  private fieldDisplayMap: { [key: string]: string } = {
    'startDatum': 'Start Datum',
    'startStunde': 'Start Stunde',
    'startMinuten': 'Start Minuten',
    'endeDatum': 'Ende Datum',
    'endeStunde': 'Ende Stunde',
    'endeMinuten': 'Ende Minuten',
    'anmerkung': 'Anmerkung',
    'produkt': 'Produkt',
    'produktposition': 'Produktposition',
    'buchungspunkt': 'Buchungspunkt',
    'taetigkeit': 'Tätigkeit'
  };

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,


    private formValidationService: FormValidationService,
    private timeUtilityService: TimeUtilityService,
    private treeNodeService: TreeNodeService,
    private timeOverlapService: TimeOverlapService,
    private treeExpansionService: TreeExpansionService,
    private dateParserService: DateParserService,
    private treeNodeManagementService: TreeNodeManagementService,
    private treeBuilderService:TreeBuilderService,
    private dateUtilsService:DateUtilsService,
    private statusPanelService: StatusPanelService,
    private nachverrechnungService: NachverrechnungService
  ) {
    this.bereitschaftForm = this.createBereitschaftForm();
    this.alarmForm = this.createAlarmForm();
    this.nachverrechnungForm = this.createNachverrechnungForm();
    this.monthSummaryForm = this.createMonthSummaryForm();
  }

  private createNachverrechnungForm(): FormGroup {
    return this.fb.group({
      produkt: [null, Validators.required],
      produktposition: [null, Validators.required],
      buchungspunkt: [null, Validators.required],
      taetigkeit: [null, Validators.required],
      startDatum: [new Date(), Validators.required],
      dauerStunden: [0],
      dauerMinuten: [0],
      anmerkung: [''],
      jiraTicket: ['']
    });
  }

  private createMonthSummaryForm(): FormGroup {
    return this.fb.group({
      abgeschlossen: [false],
      gebucht: [{ value: '00:00', disabled: true }]
    });
  }

  onMonthAbgeschlossenChange(checked: boolean): void {
    if (this.selectedNode && this.selectedNode.level === 0) {
      this.selectedNode.hasNotification = checked;
    }
  }

  onDayAbgeschlossenChange(checked: boolean): void {
    if (this.selectedNode && this.selectedNode.level === 1) {
      this.selectedNode.hasNotification = checked;
    }
  }

  openNachverrechnungForm(): void {
    this.showNachverrechnungForm = true;
    this.selectedNode = null;
    this.showRightPanelAlarmActions = false;
    this.isCreatingNew = false;
    this.isNewlyCreated = false;
    this.isEditing = false;
    this.hideDateField = false;
    this.isViewingNachverrechnung = false;
    this.currentDayDate = null;
    this.selectedNachverrechnungNode = null;
    this.produktpositionOptions = [];
    this.buchungspunktOptions = [];
    this.nachverrechnungForm.reset({
      produkt: null,
      produktposition: null,
      buchungspunkt: null,
      taetigkeit: null,
      startDatum: new Date(),
      dauerStunden: 0,
      dauerMinuten: 0,
      anmerkung: '',
      jiraTicket: ''
    });
  }

  openDayNachverrechnungForm(node: FlatNode, event?: Event): void {
    if (event) event.stopPropagation();
    const dayDate = this.dateParserService.getDateFromFormattedDay(node.dayName || '');
    this.showNachverrechnungForm = true;
    this.selectedNode = null;
    this.showRightPanelAlarmActions = false;
    this.isCreatingNew = false;
    this.isNewlyCreated = false;
    this.isEditing = false;
    this.hideDateField = true;
    this.isViewingNachverrechnung = false;
    this.currentDayDate = dayDate;
    this.selectedNachverrechnungNode = null;
    this.produktpositionOptions = [];
    this.buchungspunktOptions = [];
    this.nachverrechnungForm.reset({
      produkt: null,
      produktposition: null,
      buchungspunkt: null,
      taetigkeit: null,
      startDatum: dayDate,
      dauerStunden: 0,
      dauerMinuten: 0,
      anmerkung: '',
      jiraTicket: ''
    });
  }

  viewNachverrechnungEntry(node: FlatNode): void {
    if (!node.formData) return;
    this.showNachverrechnungForm = true;
    this.selectedNode = node;
    this.showRightPanelAlarmActions = false;
    this.isCreatingNew = false;
    this.isNewlyCreated = false;
    this.isEditing = false;
    this.hideDateField = true;
    this.isViewingNachverrechnung = true;
    this.selectedNachverrechnungNode = node;
    const formData = node.formData;
    this.produktpositionOptions = formData.produkt?.produktPosition ?? [];
    this.buchungspunktOptions = formData.produktposition?.produktPositionBuchungspunkt ?? [];
    this.nachverrechnungForm.reset(formData);
  }

  onProduktChange(produkt: ApiProdukt | null): void {
    this.produktpositionOptions = produkt?.produktPosition ?? [];
    this.buchungspunktOptions = [];
    this.nachverrechnungForm.patchValue({
      produktposition: null,
      buchungspunkt: null
    });
  }

  onProduktpositionChange(position: ApiProduktPosition | null): void {
    this.buchungspunktOptions = position?.produktPositionBuchungspunkt ?? [];
    this.nachverrechnungForm.patchValue({ buchungspunkt: null });
  }

  private loadProdukte(): void {
    const planungsjahr = String(new Date().getFullYear());
    this.nachverrechnungService.getProdukte(this.personId, 'buchbar', planungsjahr).subscribe({
      next: (produkte) => {
        this.produktOptions = produkte;
      },
      error: (err) => {
        console.warn('loadProdukte failed:', err);
        this.produktOptions = [];
      }
    });
  }

  cancelNachverrechnung(): void {
    this.showNachverrechnungForm = false;
    this.hideDateField = false;
    this.isViewingNachverrechnung = false;
    this.currentDayDate = null;
    this.selectedNachverrechnungNode = null;
    this.nachverrechnungForm.reset();
  }

  showNachverrechnungInfo(): void {
    this.dialog.open(InfoDialogComponent, {
      data: {
        title: 'Es sind Fehler aufgetreten',
        detail: 'Eine Nachverrechnung darf nur für das letzte verrechnete Monat gemacht werden'
      },
      panelClass: 'custom-dialog-width'
    });
  }

  async deleteNachverrechnungEntry(): Promise<void> {
    const node = this.selectedNachverrechnungNode;
    if (!node) return;

    const confirmed = await this.showDeleteConfirmation(node.name || 'Nachverrechnung');
    if (!confirmed) return;

    this.treeNodeService.deleteNodeFromTree(this.dataSource.data, node);
    this.dataSource.data = [...this.dataSource.data];
    this.cancelNachverrechnung();
    this.showInfoDialog('Nachverrechnung gelöscht!');
    this.statusPanelService.addMessageRequest(
      AppConstants.MSG_NACHVERRECHNUNG_DELETED_SUCCESS,
      'DELETE',
      0,
      this.fakeOkResponse()
    );
  }

  saveNachverrechnung(): void {
    if (this.isViewingNachverrechnung) {
      return;
    }
    this.formValidationService.validateAllFields(this.nachverrechnungForm);
    if (!this.nachverrechnungForm.valid) {
      const errors = this.formValidationService.getValidationErrors(this.nachverrechnungForm, this.fieldDisplayMap);
      if (errors.length > 0) {
        this.showErrorDialog(this.formValidationService.formatValidationErrors(errors));
      }
      this.statusPanelService.addMessageRequest(
        AppConstants.MSG_NACHVERRECHNUNG_CREATED_ERROR,
        'POST',
        0,
        this.fakeErrorResponse()
      );
      return;
    }

    const formValue = this.nachverrechnungForm.value;
    const rawDate = this.hideDateField && this.currentDayDate ? this.currentDayDate : formValue.startDatum;
    const datum: Date = rawDate instanceof Date ? rawDate : new Date(rawDate);
    if (!datum || isNaN(datum.getTime())) {
      this.showErrorDialog('Bitte ein gültiges Datum auswählen.');
      this.statusPanelService.addMessageRequest(
        AppConstants.MSG_NACHVERRECHNUNG_CREATED_ERROR,
        'POST',
        0,
        this.fakeErrorResponse()
      );
      return;
    }

    const stunden = Number(formValue.dauerStunden) || 0;
    const minuten = Number(formValue.dauerMinuten) || 0;
    const dauer = `${String(stunden).padStart(2, '0')}:${String(minuten).padStart(2, '0')}`;
    const minutenDauer = stunden * 60 + minuten;

    const buchungspunktId: string = formValue.buchungspunkt?.id ?? formValue.buchungspunkt ?? '';
    if (!buchungspunktId) {
      this.showErrorDialog('Bitte einen Buchungspunkt auswählen.');
      this.statusPanelService.addMessageRequest(
        AppConstants.MSG_NACHVERRECHNUNG_CREATED_ERROR,
        'POST',
        0,
        this.fakeErrorResponse()
      );
      return;
    }

    const dto: ApiTaetigkeitsbuchung = {
      datum: datum.toISOString(),
      minutenDauer,
      taetigkeit: formValue.taetigkeit ?? undefined,
      buchungspunkt: formValue.buchungspunkt ?? undefined,
      anmerkung: formValue.anmerkung || '',
      jiraTicket: formValue.jiraTicket || ''
    };

    const startTime = Date.now();
    this.nachverrechnungService
      .createTaetigkeitsbuchung(dto, buchungspunktId, this.personId, 'BuchungErfassen')
      .subscribe({
        next: (response) => {
          const duration = Date.now() - startTime;

          const monthYear = this.timeUtilityService.getMonthYearString(datum);
          const monthNode = this.treeNodeManagementService.findOrCreateMonthNode(
            this.dataSource.data, monthYear,
            (my) => this.timeUtilityService.parseMonthYearString(my)
          );
          const dayKey = this.timeUtilityService.formatDayName(datum);
          const dayNode = this.treeNodeManagementService.findOrCreateDayNode(
            monthNode, dayKey, datum,
            (str) => this.dateParserService.getDateFromFormattedDay(str)
          );

          if (!dayNode.children) dayNode.children = [];
          const produkt: ApiProdukt | null = formValue.produkt ?? null;
          const position: ApiProduktPosition | null = formValue.produktposition ?? null;
          const buchungspunktNode: ApiProduktPositionBuchungspunkt | null = formValue.buchungspunkt ?? null;
          const taetigkeitLabel = this.taetigkeitOptions.find(o => o.key === formValue.taetigkeit)?.value ?? '';
          dayNode.children.push({
            name: `${produkt?.kurzName ?? ''} ${position?.produktPositionname ?? ''} ${buchungspunktNode?.buchungspunkt ?? ''}`.trim(),
            timeRange: dauer,
            gestempeltTime: dauer,
            gebucht: dauer,
            gebuchtTime: dauer,
            productName: produkt?.kurzName ?? produkt?.produktname ?? '',
            positionName: position?.produktPositionname ?? '',
            buchungspunkt: buchungspunktNode?.buchungspunkt ?? '',
            taetigkeit: taetigkeitLabel,
            anmerkung: formValue.anmerkung || '',
            jiraTicket: formValue.jiraTicket || '',
            isNachverrechnung: true,
            formData: formValue,
            buchungData: response.body ?? undefined,
            children: [],
            hasAlarm: false,
            alarmData: null
          });
          dayNode.hasEntries = true;

          this.dataSource.data = [...this.dataSource.data];
          this.treeNodeManagementService.expandParentNodesForNewEntry(this.treeControl, monthYear, dayKey);

          this.statusPanelService.addMessageRequest(
            AppConstants.MSG_NACHVERRECHNUNG_CREATED_SUCCESS,
            'POST',
            duration,
            response
          );

          this.showInfoDialog('Nachverrechnung gespeichert!');
          this.cancelNachverrechnung();
        },
        error: (err) => {
          const duration = Date.now() - startTime;
          this.statusPanelService.addMessageRequest(
            AppConstants.MSG_NACHVERRECHNUNG_CREATED_ERROR,
            'POST',
            duration,
            err
          );
          this.showErrorDialog('Fehler beim Speichern der Nachverrechnung.');
        }
      });
  }

  cancelMonthSummary(): void {
    this.selectedNode = null;
  }

  saveMonthSummary(): void {
    this.showInfoDialog('Monatsübersicht gespeichert!');
  }

  onDauerChange(field: 'dauerStunden' | 'dauerMinuten', value: number): void {
    this.nachverrechnungForm.get(field)?.setValue(value);
  }

ngOnInit() {
  this.personId  = this.nachverrechnungService.getLoggedInPersonId();
  this.loadData(this.personId );
  this.loadProdukte();
}

  private createBereitschaftForm(): FormGroup {
    return this.fb.group({
      startDatum: [null, Validators.required],
      startStunde: [0, [Validators.required, Validators.min(0), Validators.max(23)]],
      startMinuten: [0, [Validators.required, Validators.min(0), Validators.max(59)]],
      endeDatum: [null, Validators.required],
      endeStunde: [0, [Validators.required, Validators.min(0), Validators.max(23)]],
      endeMinuten: [0, [Validators.required, Validators.min(0), Validators.max(59)]],
      anmerkung: ['']
    });
  }

private createAlarmForm(): FormGroup {
  return this.fb.group({
    startDatum: [null, Validators.required],
    startStunde: [0],
    startMinuten: [0],
    endeDatum: [null, Validators.required],
    endeStunde: [0],
    endeMinuten: [0],
    anmerkung: ['']
  });
}
private readonly personRequest = {
  detail: 'FullPvTlName',
  berechneteStunden: true,
  addVertraege: false
};

/*
loadData_NOT(personId: string) {
  this.isLoading = true;
  let firstDayOfLastMonth = DateUtilsService.getFirstDayOfLastMonth();
  this.personenService.loadPersonDetailsNew(personId).subscribe({
    next: (person) => {
      this.selectedPerson = person;
      console.log('Person', person);
      this.employeeName = `${person.vorname} ${person.nachname}`;
      console.log('employeeName', this.employeeName);

      this.nachverrechnungService.getPersonStempelzeitenNoAbwesenheit(personId, firstDayOfLastMonth).subscribe({
        next: (stempelzeiten) => {
          console.log('stempelzeiten', stempelzeiten);
          const filtered =  stempelzeiten; //stempelzeiten.filter((s: any) => s.zeitTyp === 'ARBEITSZEIT');
          const treeData = this.transformToTreeStructure(filtered);
          this.dataSource.data = treeData;
          this.isLoading = false;
                this.expandCurrentAndLastMonth();

        },
        error: () => this.isLoading = false
      });
    },
    error: () => this.isLoading = false
  });
}

*/
loadData(personId: string) {
  this.isLoading = true;
  const currentYear = new Date().getFullYear();
  const startDate = `${currentYear}-01-01`;
  const endDate = `${currentYear}-12-31`;
  let firstDayOfLastMonth = DateUtilsService.getFirstDayOfLastMonth();

  this.nachverrechnungService.getPerson(
    personId,
    this.personRequest.detail,
    this.personRequest.berechneteStunden,
    this.personRequest.addVertraege
  ).subscribe({
    next: (person) => {
      this.personName = `${person.vorname} ${person.nachname}`;
      this.nachverrechnungService.getPersonStempelzeitenNoAbwesenheit(personId, startDate, endDate).subscribe({
        next: (stempelzeiten) => {
          const filtered = stempelzeiten;
          const baseTreeData = this.treeExpansionService.generateCurrentAndPreviousMonth();
          const mergedTreeData = this.mergeApiDataIntoTree(baseTreeData, filtered);

          this.dataSource.data = mergedTreeData;
          this.isLoading = false;

          this.treeExpansionService.expandCurrentAndLastMonth(this.treeControl);
        },
        error: () => this.isLoading = false
      });
      this.nachverrechnungService.getPersonAbschlussInfo(personId).subscribe({
        next: (info) => {
          this.abschlussInfo = info;
        }
      });
    },
    error: () => this.isLoading = false
  });
}

loadData_2(personId: string) {
     this.isLoading = true;
     const currentYear = new Date().getFullYear();
     const startDate = `${currentYear}-01-01`;
     const endDate = `${currentYear}-12-31`;

     this.nachverrechnungService.getPerson(
       personId,
       this.personRequest.detail,
       this.personRequest.berechneteStunden,
       this.personRequest.addVertraege
     ).subscribe({
       next: (person) => {
         this.personName = `${person.vorname} ${person.nachname}`;
         this.nachverrechnungService.getPersonStempelzeitenNoAbwesenheit(personId, startDate, endDate).subscribe({
           next: (stempelzeiten) => {
             const filtered = stempelzeiten;
             const baseTreeData = this.treeExpansionService.generateCurrentAndPreviousMonth();
             const mergedTreeData = this.mergeApiDataIntoTree(baseTreeData, filtered);

             this.dataSource.data = mergedTreeData;
             this.isLoading = false;

             this.treeExpansionService.expandCurrentAndLastMonth(this.treeControl);
           },
           error: () => this.isLoading = false
         });
         this.nachverrechnungService.getPersonAbschlussInfo(personId).subscribe({
           next: (info) => {
             this.abschlussInfo = info;
           }
         });
       },
       error: () => this.isLoading = false
     });
   }
private mergeApiDataIntoTree(baseTree: TaetigkeitNode[], apiData: ApiStempelzeit[]): TaetigkeitNode[] {
  if (!apiData || apiData.length === 0) {
    return baseTree;
  }

  const apiTreeData = this.treeBuilderService.transformToTreeStructure(apiData);
  for (const apiMonth of apiTreeData) {
    const baseMonth = baseTree.find(m => m.monthName === apiMonth.monthName);

    if (baseMonth && apiMonth.children) {
      for (const apiDay of apiMonth.children) {
        const baseDay = baseMonth.children?.find(d => d.dayName === apiDay.dayName);

        if (baseDay) {
          baseDay.children = apiDay.children || [];
          baseDay.hasEntries = apiDay.hasEntries || false;
          baseDay.gestempelt = apiDay.gestempelt || '00:00';
          baseDay.hasAlarm = apiDay.hasAlarm || false;
          baseDay.alarmData = apiDay.alarmData || null;
        }
      }

      baseMonth.hasEntries = baseMonth.children?.some(d => d.hasEntries) || false;
    }
  }

  return baseTree;
}

onNodeClick(node:FlatNode, event?: MouseEvent) {
  this.clickCount++;

  if (this.clickCount === 1) {

    this.clickTimeout = setTimeout(() => {

      this.handleSingleClick(node);
      this.clickCount = 0;
    }, this.DOUBLE_CLICK_DELAY);
  }
}

onNodeDoubleClick(node: FlatNode, event?: MouseEvent) {

  if (this.clickTimeout) {
    clearTimeout(this.clickTimeout);
    this.clickTimeout = null;
  }

  this.clickCount = 0;
  this.handleDoubleClick(node);
}

private handleSingleClick(node:  FlatNode) {
  if (this.showRightPanelAlarmActions && node !== this.alarmNode) {
    this.resetAlarmState();
  }

  if (node.level === 2 && node.isNachverrechnung) {
    this.viewNachverrechnungEntry(node);
    return;
  }

  this.showNachverrechnungForm = false;
  this.isNewlyCreated = false;
  this.isCreatingNew = false;
  this.selectedNode = node;

  if (node.level === 0) {
    this.monthSummaryForm.patchValue({
      abgeschlossen: !!node.hasNotification,
      gebucht: node.gebuchtTotal || '00:00'
    });
  }

  if (node.level === 2 && node.formData) {
    this.populateForm(node.formData);
  }
  this.disableAllFormControls();
}

private handleDoubleClick(node:  FlatNode) {
  if (node.expandable) {
    if (this.treeControl.isExpanded(node)) {
      this.treeControl.collapse(node);
    } else {
      this.treeControl.expand(node);
    }
  }


  this.handleSingleClick(node);
}

  populateForm(formData: any) {
    if (!this.showRightPanelAlarmActions) {
      this.bereitschaftForm.patchValue(formData);
    }
  }

  onAlarmClick(node:  FlatNode, event: Event) {
    event.stopPropagation();
  if (this.isCreatingNew || this.isNewlyCreated || this.isEditing) {
    this.isCreatingNew = false;
    this.isNewlyCreated = false;
    this.isEditing = false;
    this.bereitschaftForm.reset();
    this.bereitschaftForm.disable();
  }
    this.alarmNode = node;
    this.isCreatingNewThirdLevel = true;
    this.showRightPanelAlarmActions = true;
    this.createNewThirdLevelForm(node);
  }



  /////////////////////////CREATION ///////////////////////

  createNewThirdLevelForm(parentNode:  FlatNode) {
    this.alarmForm.reset();
    const parentDate = this.dateParserService.getDateFromFormattedDay(parentNode.dayName || '');
    this.alarmForm.patchValue(this.getDefaultFormValue(parentDate));

  }
private getDefaultFormValue(date: Date) {
  return {
    startDatum: date,
    startStunde: 0,
    startMinuten: 0,
    endeDatum: date,
    endeStunde: 0,
    endeMinuten: 0,
    anmerkung: ''
  };
}

approveNewThirdLevel() {
  if (!this.alarmForm || !this.alarmNode) return;

  this.formValidationService.validateAllFields(this.alarmForm);
  if (!this.alarmForm.valid) {
    this.showAlarmFormValidationErrors();
    return;
  }

  const formValue = this.alarmForm.value;
if (this.abschlussInfo && this.abschlussInfo.naechsterBuchbarerTag) {
    const startDatum: Date = formValue.startDatum;
    const naechsterBuchbarerTag = new Date(this.abschlussInfo.naechsterBuchbarerTag);

    if (startDatum < naechsterBuchbarerTag) {
      this.showErrorDialog(
        `Dieser Zeitraum ist bereits abgeschlossen. Frühestens ab ${this.abschlussInfo.naechsterBuchbarerTag} buchbar.`
      );
      this.statusPanelService.addMessageRequest(
        AppConstants.MSG_BEREITSCHAFTEN_CREATED_ERROR,
        'POST',
        0,
        this.fakeErrorResponse()
      );
      return;
    }
  }
  const validationResult = this.timeOverlapService.validateBereitschaftEntry(
    formValue,
    this.dataSource.data,
    undefined
  );

  if (!validationResult.isValid) {
    this.showErrorDialog(validationResult.errorMessage!);
    this.statusPanelService.addMessageRequest(
      AppConstants.MSG_BEREITSCHAFTEN_CREATED_ERROR,
      'POST',
      0,
      this.fakeErrorResponse()
    );
    return;
  }
const startDate: Date = formValue.startDatum;
const endDate: Date = formValue.endeDatum;

  const loginDate = new Date(startDate);
  loginDate.setHours(formValue.startStunde, formValue.startMinuten, 0, 0);
  const logoffDate = new Date(endDate);
  logoffDate.setHours(formValue.endeStunde, formValue.endeMinuten, 0, 0);

  const gestempeltTime = this.timeUtilityService.calculateGestempelt(loginDate, logoffDate);
  const timeRange = `${this.timeUtilityService.formatTime(loginDate)} - ${this.timeUtilityService.formatTime(logoffDate)}`;

  const newStempelzeitData: ApiStempelzeit = {
    id: `new-${Date.now()}`,
    login: loginDate.toISOString(),
    logoff: logoffDate.toISOString(),
    zeitTyp: ApiZeitTyp.BEREITSCHAFT,
    anmerkung: formValue.anmerkung || ''
  };

  const newActivityData = { ...formValue };

  const monthYear = this.timeUtilityService.getMonthYearString(startDate);
  const monthNode = this.treeNodeManagementService.findOrCreateMonthNode(
    this.dataSource.data, monthYear,
    (my) => this.timeUtilityService.parseMonthYearString(my)
  );
  const dayKey = this.timeUtilityService.formatDayName(startDate);
  const dayNode = this.treeNodeManagementService.findOrCreateDayNode(
    monthNode, dayKey, startDate,
    (str) => this.dateParserService.getDateFromFormattedDay(str)
  );

  this.addActivityToDay(dayNode, newActivityData, timeRange, gestempeltTime, newStempelzeitData);

  this.dataSource.data = [...this.dataSource.data];
  this.treeNodeManagementService.expandParentNodesForNewEntry(this.treeControl, monthYear, dayKey);

  setTimeout(() => {
    const newNode = this.treeControl.dataNodes.find(node =>
      node.level === 2 &&
      node.formData &&
      node.formData.startDatum === formValue.startDatum &&
      node.timeRange === timeRange
    );
    if (newNode) {
      this.finalizeNewEntry(newNode);
    }
  }, 150);

  this.showInfoDialog('Neue Bereitschaft erfolgreich erstellt!');
  this.statusPanelService.addMessageRequest(
    AppConstants.MSG_BEREITSCHAFTEN_CREATED_SUCCESS,
    'POST',
    0,
    this.fakeOkResponse()
  );
  this.resetAlarmState();
}


  cancelNewThirdLevel() {
    this.resetAlarmState();
  }

  private resetAlarmState() {
    this.isCreatingNewThirdLevel = false;
    this.alarmNode = null;
    this.showRightPanelAlarmActions = false;
    this.alarmForm.reset();
  }

  private showAlarmFormValidationErrors(): void {
    const errors = this.formValidationService.getValidationErrors(this.alarmForm, this.fieldDisplayMap);
    if (errors.length > 0) {
      const errorMessage = this.formValidationService.formatValidationErrors(errors);
      this.showErrorDialog(errorMessage);
    }
  }
  private addActivityToDay(dayNode: TaetigkeitNode, formData: any, timeRange: string, gestempeltTime: string, stempelzeitData?: ApiStempelzeit): void {
     if (!dayNode.children) dayNode.children = [];
     const newChild: TaetigkeitNode = {
       name: `Bereitschaft ${timeRange}`,
       gestempeltTime: gestempeltTime,
       timeRange: timeRange,
       formData: formData,
       stempelzeitData: stempelzeitData,
       children: [],
       hasAlarm: false,
       alarmData: null
     };
     dayNode.children.push(newChild);
     this.treeNodeService.updateParentTimes(dayNode);
       dayNode.hasEntries = true;
       this.treeNodeService.recalculateDayTotals(dayNode);

   }

 addTimeEntryFromHeader() {
  if (this.showRightPanelAlarmActions || this.isCreatingNewThirdLevel) {
    this.resetAlarmState();
  }

  if (this.isCreatingNew || this.isNewlyCreated) this.cancelFormChanges();

  const currentTime = new Date();
  this.isCreatingNew = true;
  this.isNewlyCreated = true;
  this.showRightPanelAlarmActions = false;
  this.isEditing = true;

  this.bereitschaftForm.reset();
  this.bereitschaftForm.enable();
  const today = new Date();

  this.bereitschaftForm.patchValue(this.getDefaultFormValue(today));
  this.selectedNode = {
    level: 2,
    expandable: false,
    name: 'Neue Bereitschaft',
    hasNotification: false,
    formData: {
      startDatum: today,
      startStunde: 0,
      startMinuten: 0,
      endeDatum: today,
      endeStunde: 0,
      endeMinuten: 0,
      anmerkung: ''
    }
  } as FlatNode;
}

  cancelFormChanges() {
    if (this.isCreatingNewThirdLevel) {
      this.cancelNewThirdLevel();
      return;
    }

    if (this.isCreatingNew || this.isNewlyCreated) {
      this.selectedNode = null;
      this.isEditing = false;
      this.isCreatingNew = false;
      this.isNewlyCreated = false;
      this.bereitschaftForm.reset();
    } else if (this.selectedNode) {
      if (this.selectedNode.level === 2 && this.selectedNode.formData) {
        this.populateForm(this.selectedNode.formData);
      }
      this.isEditing = false;
    }
  }

  /////save message
saveBereitschaft() {
  this.formValidationService.validateAllFields(this.bereitschaftForm);
  if (!this.bereitschaftForm.valid) {
    this.showValidationErrors();
    this.statusPanelService.addMessageRequest(
      AppConstants.MSG_BEREITSCHAFTEN_CREATED_ERROR,
      'POST',
      0,
      this.fakeErrorResponse()
    );
    return;
  }

  const formValue = this.bereitschaftForm.getRawValue();
if (this.abschlussInfo && this.abschlussInfo.naechsterBuchbarerTag) {
    const startDatum: Date = formValue.startDatum;
    const naechsterBuchbarerTag = new Date(this.abschlussInfo.naechsterBuchbarerTag);

    if (startDatum < naechsterBuchbarerTag) {
      this.showErrorDialog(
        `Dieser Zeitraum ist bereits abgeschlossen. Frühestens ab ${this.abschlussInfo.naechsterBuchbarerTag} buchbar.`
      );
      this.statusPanelService.addMessageRequest(
        AppConstants.MSG_BEREITSCHAFTEN_CREATED_ERROR,
        'POST',
        0,
        this.fakeErrorResponse()
      );
      return;
    }
  }
  const excludeId = this.selectedNode?.stempelzeitData?.id;
  const validationResult = this.timeOverlapService.validateBereitschaftEntry(
    formValue,
    this.dataSource.data,
    excludeId
  );

  if (!validationResult.isValid) {
    this.showErrorDialog(validationResult.errorMessage!);
    this.statusPanelService.addMessageRequest(
      AppConstants.MSG_BEREITSCHAFTEN_CREATED_ERROR,
      'POST',
      0,
      this.fakeErrorResponse()
    );
    return;
  }

  if (this.isCreatingNew || this.isNewlyCreated) {
    this.saveNewEntry(formValue);
  }
}



private saveNewEntry(formValue: any): void {
  const startDate: Date = formValue.startDatum;
  const endDate: Date = formValue.endeDatum;
  if (!startDate || !endDate) return;

  const loginDate = new Date(startDate);
  loginDate.setHours(formValue.startStunde, formValue.startMinuten, 0, 0);

  const logoffDate = new Date(endDate);
  logoffDate.setHours(formValue.endeStunde, formValue.endeMinuten, 0, 0);

  const gebuchtTime = this.timeUtilityService.calculateGestempelt(loginDate, logoffDate);
  const timeRange = `${this.timeUtilityService.formatTime(loginDate)} - ${this.timeUtilityService.formatTime(logoffDate)}`;

  const dto: ApiStempelzeit = {
    login: loginDate.toISOString(),
    logoff: logoffDate.toISOString(),
    zeitTyp: ApiZeitTyp.BEREITSCHAFT,
    anmerkung: formValue.anmerkung || ''
  };

  const startTime = Date.now();
  this.nachverrechnungService
    .createBereitschaft(this.personId, dto)
    .subscribe({
      next: (response) => {
        const duration = Date.now() - startTime;
        const savedEntries = response.body ?? [];
        const savedEntry = savedEntries.find(
          e => e.login === dto.login && e.logoff === dto.logoff
        ) || savedEntries[savedEntries.length - 1];

        const monthYear = this.timeUtilityService.getMonthYearString(startDate);
        const monthNode = this.treeNodeManagementService.findOrCreateMonthNode(
          this.dataSource.data, monthYear,
          (my) => this.timeUtilityService.parseMonthYearString(my)
        );
        const dayKey = this.timeUtilityService.formatDayName(startDate);
        const dayNode = this.treeNodeManagementService.findOrCreateDayNode(
          monthNode, dayKey, startDate,
          (dayStr) => this.dateParserService.getDateFromFormattedDay(dayStr)
        );
        this.addActivityToDay(dayNode, formValue, timeRange, gebuchtTime, savedEntry);

        this.dataSource.data = [...this.dataSource.data];
        this.treeNodeManagementService.expandParentNodesForNewEntry(this.treeControl, monthYear, dayKey);

        this.showInfoDialog('Änderungen gespeichert!');
        this.statusPanelService.addMessageRequest(
          AppConstants.MSG_BEREITSCHAFTEN_CREATED_SUCCESS,
          'POST',
          duration,
          response
        );
        this.isEditing = false;
        this.isCreatingNew = false;
        this.isNewlyCreated = false;
        this.disableAllFormControls();

        setTimeout(() => {
          const newNode = this.treeControl.dataNodes.find(node =>
            node.level === 2 &&
            node.formData &&
            node.formData.startDatum === formValue.startDatum &&
            node.timeRange === timeRange
          );
          if (newNode) {
            this.selectedNode = newNode;
            this.populateForm(newNode.formData);
            this.disableAllFormControls();
            this.cdr.detectChanges();
          }
        }, 150);
      }
    });
}

  private showValidationErrors(): void {
    const errors = this.formValidationService.getValidationErrors(this.bereitschaftForm, this.fieldDisplayMap);
    if (errors.length > 0) {
      const errorMessage = this.formValidationService.formatValidationErrors(errors);
      this.showErrorDialog(errorMessage);
    }
  }
/////////////////////////DELETE///////////////////////////////////////
async deleteEntry() {
  if (!this.selectedNode || this.isCreatingNew) return;

  const confirmed = await this.showDeleteConfirmation(this.selectedNode.name || '');
  if (!confirmed) return;

  const id = this.selectedNode.stempelzeitData?.id;
  if (!id || id.startsWith('new-')) {
    this.treeNodeService.deleteNodeFromTree(this.dataSource.data, this.selectedNode);
    this.dataSource.data = [...this.dataSource.data];
    this.selectedNode = null;
    this.isEditing = false;
    this.bereitschaftForm.reset();
    this.statusPanelService.addMessageRequest(
      AppConstants.MSG_BEREITSCHAFTEN_DELETED_SUCCESS,
      'DELETE',
      0,
      this.fakeOkResponse()
    );
    return;
  }

  const startTime = Date.now();
  this.nachverrechnungService.deleteBereitschaft(id).subscribe({
    next: (response) => {
      const duration = Date.now() - startTime;
      this.statusPanelService.addMessageRequest(
        AppConstants.MSG_BEREITSCHAFTEN_DELETED_SUCCESS,
        'DELETE',
        duration,
        response
      );

      this.treeNodeService.deleteNodeFromTree(
        this.dataSource.data,
        this.selectedNode!
      );

      this.dataSource.data = [...this.dataSource.data];
      this.showInfoDialog('Bereitschaft erfolgreich gelöscht!');

      this.selectedNode = null;
      this.isEditing = false;
      this.bereitschaftForm.reset();
    },
    error: (err) => {
      const duration = Date.now() - startTime;
      this.statusPanelService.addMessageRequest(
        AppConstants.MSG_BEREITSCHAFTEN_DELETED_ERROR,
        'DELETE',
        duration,
        err
      );
      this.showErrorDialog('Fehler beim Löschen der Bereitschaft.');
    }
  });
}
  private async showDeleteConfirmation(entryName: string): Promise<boolean> {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      data: {
        title: 'Löschen bestätigen',
        message: `Wollen Sie den Eintrag "${entryName}" wirklich löschen?`,
        confirmText: 'Ja',
        cancelText: 'Nein'
      }
    });
    return await dialogRef.afterClosed().toPromise() === true;
  }

  disableAllFormControls(): void {
    this.bereitschaftForm.disable();
  }

  enableAllFormControls(): void {
    this.bereitschaftForm.enable();
  }

  hasChild = (_: number, node: FlatNode) => node.expandable;

  goBackToList() {
    this.router.navigate(['/bereitschaftkorrigieren']);
  }

  onCheckboxChange(event: MatCheckboxChange): void {
    if (this.selectedNode && this.isEditing) {
      this.selectedNode.hasNotification = event.checked;
    }
  }
adjustTime(type: 'start' | 'end', unit: 'hour' | 'minute', amount: number) {
  const isAlarmMode = this.showRightPanelAlarmActions;
  const isEditMode = this.isEditing || this.isCreatingNew || this.isNewlyCreated;

  if (!isAlarmMode && !isEditMode) return;

  const form = isAlarmMode ? this.alarmForm : this.bereitschaftForm;

  const controlNameHour = type === 'start' ? 'startStunde' : 'endeStunde';
  const controlNameMinute = type === 'start' ? 'startMinuten' : 'endeMinuten';

  const currentHour = form.get(controlNameHour)?.value || 0;
  const currentMinute = form.get(controlNameMinute)?.value || 0;
  const isHour24 = currentHour === 24;

  if (unit === 'hour') {
    const result = this.timeUtilityService.adjustTime(currentHour, currentMinute, 'hour', amount, isHour24);
    form.get(controlNameHour)?.setValue(result.hour);
    form.get(controlNameMinute)?.setValue(result.minute);
  } else {
    const result = this.timeUtilityService.adjustTime(currentHour, currentMinute, 'minute', amount, isHour24);
    form.get(controlNameHour)?.setValue(result.hour);
    form.get(controlNameMinute)?.setValue(result.minute);
  }
}

onTimeBoxChange(
  form: FormGroup,
  field: 'startStunde' | 'startMinuten' | 'endeStunde' | 'endeMinuten',
  value: number
): void {
  form.get(field)?.patchValue(value);
  if (field === 'startStunde' && value === 24) {
    form.get('startMinuten')?.patchValue(0, { emitEvent: false });
  }
  if (field === 'endeStunde' && value === 24) {
    form.get('endeMinuten')?.patchValue(0, { emitEvent: false });
  }
  form.updateValueAndValidity();
}

private fakeErrorResponse(url: string = 'personen/bereitschaft', status: number = 400): HttpErrorResponse {
  return new HttpErrorResponse({ status, statusText: 'Bad Request', url });
}

private fakeOkResponse(url: string = 'personen/bereitschaft'): HttpResponse<unknown> {
  return new HttpResponse<unknown>({ status: 200, statusText: 'OK', url });
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

private finalizeNewEntry(newNode: FlatNode): void {
  this.selectedNode = newNode;
  this.isCreatingNew = false;
  this.isNewlyCreated = false;
  this.isEditing = false;
  this.populateForm(newNode.formData);
  this.disableAllFormControls();
  this.cdr.detectChanges();
}
ngOnDestroy() {
  if (this.clickTimeout) {
    clearTimeout(this.clickTimeout);
  }
}
getFullDayOfWeek(node: FlatNode | null): string {
  return this.dateParserService.getFullDayOfWeekFromNode(node);
}

getDateDisplay(node: FlatNode | null): string {
  if (!node) return '';
  return this.dateUtilsService.getDateDisplayFromNode(node);
}

}
