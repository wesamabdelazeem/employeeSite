import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
import { MatCheckbox, MatCheckboxChange } from "@angular/material/checkbox";
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import{ BereitschaftszeitenService} from '../../../services/bereitschaftszeiten.service';
 import { FormValidationService } from '../../../services/utils/form-validation.service';
import { TimeUtilityService } from '../../../services/utils/time-utility.service';
import { TreeNodeService } from '../../../services/utils/tree-node.service';
import { TimeOverlapService } from '../../../services/utils/time-overlap.service';
import { TreeExpansionService } from '../../../services/utils/tree-expansion.service';
import { DateParserService } from '../../../services/utils/date-parser.service';
import { ApiStempelzeit } from '../../../models/ApiStempelzeit';
import { ApiZeitTyp } from '../../../models/ApiZeitTyp';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MAT_DATE_FORMATS, DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { CustomDateAdapter } from '../../../services/custom-date-adapter.service';
 import { TreeBuilderService } from '../../../services/utils/tree-builder.service';
import{DateUtilsService}from "../../../services/utils/date-utils.service";
import { ApiAbschlussInfo } from '../../../models/ApiAbschlussInfo';
 import { FlatNode } from '../../../models/Flat-node';
import { TaetigkeitNode } from '../../../models/taetigkeit-node';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog/confirmation-dialog.component';
import { InfoDialogComponent } from '../../dialogs/info-dialog/info-dialog.component';
import { ErrorDialogComponent } from '../../dialogs/error-dialog/error-dialog.component';
import { TreeNodeManagementService } from '../../../services/utils/tree-node-management.service';
import { PersonenService } from '../../../services/personen.service';
import { StatusPanelService } from '../../../services/utils/status-panel-status.service';
import { AppConstants } from '../../../models/app-constants';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TimeBoxComponent } from '../../../shared/components/time-box/time-box.component';
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
  selector: 'app-bereitschaftszeiten-details',
  imports: [
    MatProgressSpinnerModule, MatTreeModule, MatIconModule, MatButtonModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatSnackBarModule,
    ReactiveFormsModule, CommonModule, MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    TimeBoxComponent
  ],
providers: [
  { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
  { provide: DateAdapter, useClass: CustomDateAdapter },
  { provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS }
]

,
  templateUrl: './bereitschaftszeiten-details.component.html',
  styleUrl: './bereitschaftszeiten-details.component.scss'
})
export class BereitschaftszeitenDetailsComponent {
  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level,
    node => node.expandable
  );

  isCreatingNewThirdLevel = false;
  alarmNode: FlatNode | null = null;
  showRightPanelAlarmActions = false;

  private transformer = (node: TaetigkeitNode, level: number): FlatNode => ({
    expandable: -level === 0 || level === 1,
    name: node.name,
    level: level,
    hasEntries: node.hasEntries ?? false,
    hasNotification: node.hasNotification || false,
    formData: node.formData,
    stempelzeitData: node.stempelzeitData,
    monthName: node.monthName,
    // gebuchtTotal: node.gebuchtTotal,
    dayName: node.dayName,
    gestempelt: node.gestempelt,
    // gebucht: node.gebucht,
    // stempelzeitenList: node.stempelzeitenList,
    // gebuchtTime: node.gebuchtTime,
    timeRange: node.timeRange,
    hasAlarm: node.hasAlarm || false,
    alarmData: node.alarmData || null
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
    'anmerkung': 'Anmerkung'
  };

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private personService: PersonenService,
    private bereitschaftszeitenService: BereitschaftszeitenService,
    private statusPanelService: StatusPanelService,
    private formValidationService: FormValidationService,
    private timeUtilityService: TimeUtilityService,
    private treeNodeService: TreeNodeService,
    private timeOverlapService: TimeOverlapService,
    private treeExpansionService: TreeExpansionService,
    private dateParserService: DateParserService,
    private treeNodeManagementService: TreeNodeManagementService,
    private treeBuilderService: TreeBuilderService,
    private dateUtilsService: DateUtilsService
  ) {
    this.bereitschaftForm = this.createBereitschaftForm();
    this.alarmForm = this.createAlarmForm();
  }

  ngOnInit() {
    this.personId  = this.personService.getCurrentUser()?.id!;// '343200000000078';
    this.loadData(this.personId);
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

  loadData(personId: string) {
    this.isLoading = true;
    let firstDayOfLastMonth = DateUtilsService.getFirstDayOfLastMonth();
    const currentYear = new Date().getFullYear();

    const endDate = `${currentYear}-12-31`;

    this.bereitschaftszeitenService.getPersonStempelzeitenNoAbwesenheit(personId, firstDayOfLastMonth, endDate ).subscribe({
      next: (stempelzeiten) => {
        console.log('stempelzeiten', stempelzeiten);
        console.log('stempelzeiten-length', stempelzeiten.length);
        const filtered = stempelzeiten.filter((s: ApiStempelzeit) =>
          s.zeitTyp && s.zeitTyp.toUpperCase() === ApiZeitTyp.BEREITSCHAFT.toUpperCase()
        );
        const baseTreeData = this.treeExpansionService.generateCurrentAndPreviousMonth();
        const mergedTreeData = this.mergeApiDataIntoTree(baseTreeData, filtered);

        this.dataSource.data = mergedTreeData;
        this.isLoading = false;

        this.treeExpansionService.expandCurrentAndLastMonth(this.treeControl);
      },
      error: () => this.isLoading = false
    });

    this.bereitschaftszeitenService.getPersonAbschlussInfo(personId).subscribe({
      next: (info) => {
        this.abschlussInfo = info;
      }
    });
  }

loadData_(personId: string) {
  this.isLoading = true;
  const currentYear = new Date().getFullYear();
  const startDate = `${currentYear}-01-01`;
  const endDate = `${currentYear}-12-31`;

  this.bereitschaftszeitenService.getPersonStempelzeitenNoAbwesenheit(personId, startDate, endDate).subscribe({
    next: (stempelzeiten) => {
      const filtered = stempelzeiten.filter((s: ApiStempelzeit) =>
        s.zeitTyp && s.zeitTyp.toUpperCase() === ApiZeitTyp.BEREITSCHAFT.toUpperCase()
      );
      const baseTreeData = this.treeExpansionService.generateCurrentAndPreviousMonth();
      const mergedTreeData = this.mergeApiDataIntoTree(baseTreeData, filtered);

      this.dataSource.data = mergedTreeData;
      this.isLoading = false;

      this.treeExpansionService.expandCurrentAndLastMonth(this.treeControl);
    },
    error: () => this.isLoading = false
  });

  this.bereitschaftszeitenService.getPersonAbschlussInfo(personId).subscribe({
    next: (info) => {
      this.abschlussInfo = info;
    }
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
  onNodeClick(node: FlatNode, event?: MouseEvent) {
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

  private handleSingleClick(node: FlatNode) {
    if (this.showRightPanelAlarmActions && node !== this.alarmNode) {
      this.resetAlarmState();
    }

    this.isNewlyCreated = false;
    this.isCreatingNew = false;
    this.selectedNode = node;

    if (node.level === 2 && node.formData) {
      this.populateForm(node.formData);
    }
    this.disableAllFormControls();
  }

  private handleDoubleClick(node: FlatNode) {
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

  onAlarmClick(node: FlatNode, event: Event) {
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

  createNewThirdLevelForm(parentNode: FlatNode) {
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

    console.log('approveNewThirdLevel()-1');
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
        this.fakeErrorResponse('personen/bereitschaft', 400)
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
     // id: `new-${Date.now()}`,                // temporary until backend confirms
      login: loginDate.toISOString(),
      logoff: logoffDate.toISOString(),
      zeitTyp: ApiZeitTyp.BEREITSCHAFT,
      anmerkung: formValue.anmerkung || ''
    };

    this.bereitschaftszeitenService.createBereitschaft(this.personId, newStempelzeitData)
    .subscribe({
      next: (savedEntries: ApiStempelzeit[]) => {
        const savedEntry = savedEntries.find(
          (e: ApiStempelzeit) => e.login === newStempelzeitData.login && e.logoff === newStempelzeitData.logoff
        ) || savedEntries[savedEntries.length - 1] || newStempelzeitData;

        const newActivityData = { ...formValue };

        const monthYear = this.timeUtilityService.getMonthYearString(startDate);
        const monthNode = this.treeNodeManagementService.findOrCreateMonthNode(
          this.dataSource.data, monthYear,
          (monthYear) => this.timeUtilityService.parseMonthYearString(monthYear)
        );
        const dayKey = this.timeUtilityService.formatDayName(startDate);
        const dayNode = this.treeNodeManagementService.findOrCreateDayNode(monthNode, dayKey, startDate, (str) => this.dateParserService.getDateFromFormattedDay(str));

        this.addActivityToDay(dayNode, newActivityData, timeRange, gestempeltTime, savedEntry);

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
      },
      error: (err: any) => {
        console.error('Create Bereitschaft failed', err);
        this.statusPanelService.addMessageRequest(
          AppConstants.MSG_BEREITSCHAFTEN_CREATED_ERROR,
          'POST',
          0,
          this.fakeErrorResponse('personen/bereitschaft', 500)
        );
      }
    });

  }



  approveNewThirdLevel__() {

    console.log('approveNewThirdLevel()-1');
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
        this.fakeErrorResponse('personen/bereitschaft', 400)
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
     // id: `new-${Date.now()}`,                // temporary until backend confirms
      login: loginDate.toISOString(),
      logoff: logoffDate.toISOString(),
      zeitTyp: ApiZeitTyp.BEREITSCHAFT,
      anmerkung: formValue.anmerkung || ''
    };

// TODO: BEGIN OF MY CODE TO SAVE
    this.bereitschaftszeitenService.createBereitschaft(this.personId, newStempelzeitData)
    .subscribe({
      next: (savedEntries) => {

      },
      error: err => {
        console.error('Create Bereitschaft failed', err);
      }
    });

    // TODO: END OF MY CODE TO SAVE
    const newActivityData = { ...formValue };



    const monthYear = this.timeUtilityService.getMonthYearString(startDate);
    const monthNode = this.treeNodeManagementService.findOrCreateMonthNode(
      this.dataSource.data, monthYear,
      (monthYear) => this.timeUtilityService.parseMonthYearString(monthYear)
    )
    const dayKey = this.timeUtilityService.formatDayName(startDate);
    const dayNode = this.treeNodeManagementService.findOrCreateDayNode(monthNode, dayKey, startDate, (str) => this.dateParserService.getDateFromFormattedDay(str))

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
  saveBereitschaft() {

    console.log('##### saveNewEntry-1');
    this.formValidationService.validateAllFields(this.bereitschaftForm);
    if (!this.bereitschaftForm.valid) {
      this.showValidationErrors();
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
        this.fakeErrorResponse('personen/bereitschaft', 400)
      );
      return;
    }

    if (this.isCreatingNew || this.isNewlyCreated) {
      this.saveNewEntry(formValue);
    }
  }



  private saveNewEntry(formValue: any): void {
    console.log('saveNewEntry', formValue);

    const startDate: Date = formValue.startDatum
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

    this.bereitschaftszeitenService.createBereitschaft(this.personId, dto)
    .subscribe({
      next: (savedEntries: ApiStempelzeit[]) => {
        const savedEntry = savedEntries.find(
          (e: ApiStempelzeit) => e.login === dto.login && e.logoff === dto.logoff
        ) || savedEntries[savedEntries.length - 1] || dto;

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

        this.showInfoDialog('Änderungen gespeichert!');
        this.statusPanelService.addMessageRequest(
          AppConstants.MSG_BEREITSCHAFTEN_CREATED_SUCCESS,
          'POST',
          0,
          this.fakeOkResponse()
        );
        this.isEditing = false;
        this.isCreatingNew = false;
        this.isNewlyCreated = false;
        this.disableAllFormControls();
      },
      error: (err: any) => {
        console.error('Create Bereitschaft failed', err);
        this.showErrorDialog('Fehler beim Speichern der Bereitschaft.');
        this.statusPanelService.addMessageRequest(
          AppConstants.MSG_BEREITSCHAFTEN_CREATED_ERROR,
          'POST',
          0,
          this.fakeErrorResponse('personen/bereitschaft', 500)
        );
      }
    });


    /*
    this.bereitschaftszeitenService
      .createBereitschaft(this.personId, dto)
      .subscribe({
        next: (savedEntries) => {
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
        },
        error: err => {
          console.error('Create Bereitschaft failed', err);
        }
      });
      */
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
    if (!id) return;

    console.log('deleting-id', id);

    this.bereitschaftszeitenService.deleteBereitschaft(id).subscribe({
      next: () => {
        this.treeNodeService.deleteNodeFromTree(
          this.dataSource.data,
          this.selectedNode!
        );

        this.dataSource.data = [...this.dataSource.data];
        this.showInfoDialog('Bereitschaft erfolgreich gelöscht!');
        this.statusPanelService.addMessageRequest(
          AppConstants.MSG_BEREITSCHAFTEN_DELETED_SUCCESS,
          'DELETE',
          0,
          this.fakeOkResponse()
        );

        this.selectedNode = null;
        this.isEditing = false;
        this.bereitschaftForm.reset();
      },
      error: (err: any) => {
        console.error('Delete failed', err);
        this.showErrorDialog('Fehler beim Löschen der Bereitschaft.');
        this.statusPanelService.addMessageRequest(
          AppConstants.MSG_BEREITSCHAFTEN_DELETED_ERROR,
          'DELETE',
          0,
          this.fakeErrorResponse('personen/bereitschaft', 500)
        );
      }
    });

/*
    this.bereitschaftszeitenService.deleteBereitschaft(id).subscribe({
      next: () => {
        this.treeNodeService.deleteNodeFromTree(
          this.dataSource.data,
          this.selectedNode!
        );

        this.dataSource.data = [...this.dataSource.data];
        this.snackBar.open('Eintrag gelöscht!', 'Schließen', { duration: 3000 });

        this.selectedNode = null;
        this.isEditing = false;
        this.bereitschaftForm.reset();
      },
      error: err => {
        console.error('Delete failed', err);
        this.snackBar.open('Fehler beim Löschen', 'Schließen', { duration: 3000 });
      }
    });
    */
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
    this.router.navigate(['/standby-two']);
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
