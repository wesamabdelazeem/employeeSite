import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
// import { MatCheckbox } from '@angular/material/checkbox';
import { forkJoin } from 'rxjs';
import { FlatNode } from '../../../models/Flat-node';
import { TaetigkeitNode } from '../../../models/TaetigkeitNode';
import { FormValidationService } from '../../../services/utils/form-validation.service';
import { TimeUtilityService } from '../../../services/utils/time-utility.service';
import { TimeOverlapService } from '../../../services/utils/time-overlap.service';
import { DropdownExtractorService } from '../../../services/utils/dropdown-extractor.service';
import { DateParserService } from '../../../services/utils/date-parser.service';
import { ActivityFormService } from '../../../services/utils/activity-form.service';
import { TreeManagementService } from '../../../services/utils/tree-management.service';
import { StatusPanelService } from '../../../services/utils/status-panel-status.service';
import { AppConstants } from '../../../models/app-constants';
import { DeleteConfirmDialogComponent } from '../../delete-confirm-dialog/delete-confirm-dialog.component';
import { InfoDialogComponent } from '../../dialogs/info-dialog/info-dialog.component';
import { ErrorDialogComponent } from '../../dialogs/error-dialog/error-dialog.component';
import { CloseOpenConfirmDialogComponent } from '../../dialogs/close-open-confirm-dialog/close-open-confirm-dialog.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MAT_DATE_FORMATS, DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { CustomDateAdapter } from '../../../services/custom-date-adapter.service';
import { ApiProdukt } from '../../../models/ApiProdukt';
import { ApiProduktPosition } from '../../../models/ApiProduktPosition';
import { ApiProduktPositionBuchungspunkt } from '../../../models/ApiProduktPositionBuchungspunkt';
import { ApiTaetigkeitTyp } from '../../../models/ApiTaetigkeitTyp';
import { ApiTaetigkeitsbuchung } from '../../../models/ApiTaetigkeitsbuchung';
import { ApiAbschlussInfo } from '../../../models/ApiAbschlussInfo';
import { ApiBuchungsart } from '../../../models/ApiBuchungsart';
import { ApiZeitTyp } from '../../../models/ApiZeitTyp';
import { DateUtilsService } from '../../../services/utils/date-utils.service';
import { TaetigkeitFormValue } from '../../../models/TaetigkeitFormValue';
import { TaetigkeitenTimeBoxComponent } from '../../../shared/components/taetigkeiten-time-box/taetigkeiten-time-box.component';
import { TaetigkeitenHistorischService } from '../../../services/taetigkeiten-historisch.service';
import { TaetigkeitenLevel1Component } from '../../../shared/taetigkeiten-level1/taetigkeiten-level1.component';
import { TaetigkeitenLevel2Component } from '../../../shared/taetigkeiten-level2/taetigkeiten-level2.component';
import { TaetigkeitenLevel3Component } from '../../../shared/taetigkeiten-level3/taetigkeiten-level3.component';
import { TaetigkeitenKorrigierenService } from '../../../services/taetigkeiten-korrigieren.service';

export const DATE_FORMATS = {
  parse: { dateInput: 'DD.MM.YYYY' },
  display: {
    dateInput: 'DD.MM.YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-taetigkeiten-korrigieren-details',
  imports: [ MatProgressSpinnerModule,
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMenuModule,
    MatTooltipModule,
    TaetigkeitenTimeBoxComponent,
    TaetigkeitenLevel1Component,
    TaetigkeitenLevel2Component,
    TaetigkeitenLevel3Component,],
  templateUrl: './taetigkeiten-korrigieren-details.component.html',
  styleUrl: './taetigkeiten-korrigieren-details.component.scss'
})
export class TaetigkeitenKorrigierenDetailsComponent {
 private readonly baseBuchungsartOptions = ['ARBEITSZEIT', 'REMOTEZEIT'];
  private readonly baseTaetigkeitOptions = Object.values(ApiTaetigkeitTyp);

  produktOptions: ApiProdukt[] = [];
  produktpositionOptions: ApiProduktPosition[] = [];
  buchungspunktOptions: ApiProduktPositionBuchungspunkt[] = [];

  get buchungsartOptions(): string[] {
    return [...this.baseBuchungsartOptions];
  }

  get taetigkeitOptions(): string[] {
    const formValues = [
      this.taetigkeitForm?.get('taetigkeit')?.value,
      this.alarmForm?.get('taetigkeit')?.value,
    ].filter((v): v is string => !!v && typeof v === 'string');
    const set = new Set<string>(this.baseTaetigkeitOptions);
    formValues.forEach(v => {
      if (!this.baseTaetigkeitOptions.some(o => this.compareTaetigkeit(o, v))) {
        set.add(v);
      }
    });
    return Array.from(set);
  }

  getBuchungsartDisplay(key: string): string {
    return ApiZeitTyp[key as keyof typeof ApiZeitTyp] ?? key;
  }

  dropdownOptions: string[] = ['2026', '2025', '2024', '2023', '2022', '2021', '2020'];
  selectedOption: string = this.dropdownOptions[0];

  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level,
    node => node.expandable
  );

  isCreatingNewThirdLevel = false;
  alarmNode: FlatNode | null = null;
  showRightPanelAlarmActions = false;
  selectedNode: FlatNode | null = null;
  isEditing = false;
  isLoading = true;
  personName: string = '';
  isCreatingNew = false;
  isNewlyCreated = false;
  isHeaderCreated = false;
  saveAttempted = false;
  alarmSaveAttempted = false;

  taetigkeitForm: FormGroup;
  monthForm: FormGroup;
  dayForm: FormGroup;
  alarmForm: FormGroup;
  abschlussInfo: ApiAbschlussInfo | null = null;
  personId!: string;
  private alarmDayKey: string | null = null;

  private fieldDisplayMap: { [key: string]: string } = {
    datum: 'Datum',
    buchungsart: 'Buchungsart',
    produkt: 'Produkt',
    produktposition: 'Produktposition',
    buchungspunkt: 'Buchungspunkt',
    taetigkeit: 'Tätigkeit',
    anmeldezeitStunde: 'Anmeldezeit Stunde',
    anmeldezeitMinuten: 'Anmeldezeit Minuten',
    abmeldezeitStunde: 'Abmeldezeit Stunde',
    abmeldezeitMinuten: 'Abmeldezeit Minuten',
    anmerkung: 'Anmerkung',
    jiraTicket: 'Jira-Ticket',
  };

  private readonly personRequest = {
    detail: 'FullPvTlName',
    berechneteStunden: true,
    addVertraege: false,
  };

  private transformer = (node: TaetigkeitNode, level: number): FlatNode => ({
    expandable: level === 0 ? true : level === 1 ? true : !!node.children && node.children.length > 0,
    name: node.name,
    level: level,
    hasNotification: node.hasNotification || false,
    formData: node.formData,
    stempelzeitData: node.stempelzeitData,
    monthName: node.monthName,
    gebuchtTotal: node.gebuchtTotal,
    dayName: node.dayName,
    gestempelt: node.gestempelt,
    gebucht: node.gebucht,
    stempelzeitenList: node.stempelzeitenList,
    productName: node.productName,
    positionName: node.positionName,
    gebuchtTime: node.gebuchtTime,
    buchungspunkt: node.buchungspunkt,
    timeRange: node.timeRange,
    dateKey: node.dateKey,
    monthKey: node.monthKey,
    zeitTyp: node.stempelzeitData?.zeitTyp || node.formData?.buchungsart,
  });

  treeFlattener = new MatTreeFlattener(
    this.transformer,
    node => node.level,
    node => node.expandable,
    node => node.children
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  private statusPanelService = inject(StatusPanelService);
  private treeManagementService = inject(TreeManagementService);
  private activityFormService = inject(ActivityFormService);

  private openErrorDialog(title: string, detail: string): void {
    this.dialog.open(ErrorDialogComponent, {
      data: { title, detail },
      panelClass: 'custom-dialog-width',
    });
  }

  private openInfoDialog(detail: string, title: string = 'Erfolgreich'): void {
    this.dialog.open(InfoDialogComponent, {
      data: { title, detail },
      panelClass: 'custom-dialog-width',
    });
  }

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private dateUtilsService: DateUtilsService,
    private taetigkeitenKorrigierenService: TaetigkeitenKorrigierenService,
    private dateParserService: DateParserService,
    private formValidationService: FormValidationService,
    private timeUtilityService: TimeUtilityService,
    private timeOverlapService: TimeOverlapService,
    private dropdownExtractorService: DropdownExtractorService
  ) {
    this.taetigkeitForm = this.activityFormService.createActivityForm();
    this.monthForm = this.activityFormService.createMonthForm();
    this.dayForm = this.activityFormService.createDayForm();
    this.alarmForm = this.activityFormService.createAlarmForm();
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const personId = params.get('id') || 'p-me';
      if (personId) {
        this.personId = personId;
        this.loadData(personId);
      }
    });
    this.taetigkeitForm.valueChanges.subscribe(() => {
      if (this.isEditing) {
        this.updateMinutenDauer();
      }
    });
  }

  private updateMinutenDauer(): void {
    const startHour = this.taetigkeitForm.get('anmeldezeitStunde')?.value || 0;
    const startMin = this.taetigkeitForm.get('anmeldezeitMinuten')?.value || 0;
    const endHour = this.taetigkeitForm.get('abmeldezeitStunde')?.value || 0;
    const endMin = this.taetigkeitForm.get('abmeldezeitMinuten')?.value || 0;

    const startTotalMin = startHour * 60 + startMin;
    const endTotalMin = endHour * 60 + endMin;
    const durationMin = endTotalMin - startTotalMin;

    if (durationMin > 0) {
      this.taetigkeitForm.patchValue({ minutenDauer: durationMin }, { emitEvent: false });
      const hours = Math.floor(durationMin / 60);
      const minutes = durationMin % 60;
      const gebuchtDisplay = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      this.taetigkeitForm.patchValue({ gebucht: gebuchtDisplay }, { emitEvent: false });
    }
  }

  loadData(personId: string) {
    this.isLoading = true;
    const startDate = `${this.selectedOption}-01-01`;
    const endDate = `${this.selectedOption}-12-31`;
    const startTime = Date.now();

    this.taetigkeitenKorrigierenService.getPerson(
      personId,
      this.personRequest.detail,
      this.personRequest.berechneteStunden,
      this.personRequest.addVertraege
    ).subscribe({
      next: (personResponse) => {
        const person = personResponse.body!;
        this.personName = `${person.vorname} ${person.nachname}`;
        forkJoin({
          products: this.taetigkeitenKorrigierenService.getPersonProdukte(personId, 'KORREKTUR', startDate, endDate),
          stempelzeiten: this.taetigkeitenKorrigierenService.getPersonStempelzeiten(personId, startDate, endDate),
          vermerke: this.taetigkeitenKorrigierenService.getPersonVermerke(personId, startDate, endDate),
          abschlussInfo: this.taetigkeitenKorrigierenService.abschlussInfo(personId),
        }).subscribe({
          next: (results) => {
            const duration = Date.now() - startTime;
            const products = results.products.body ?? [];
            const stempelzeiten = results.stempelzeiten.body ?? [];
            const abschlussInfo = results.abschlussInfo.body ?? {};

            this.abschlussInfo = abschlussInfo;
            this.produktOptions = products;
            this.extractDropdownOptions(products);

            const treeData = this.treeManagementService.transformToTreeStructure(
              products,
              stempelzeiten,
              parseInt(this.selectedOption),
              abschlussInfo,
              true,
              true
            );

            const naechster = abschlussInfo?.naechsterBuchbarerTag ?? null;
            treeData.forEach((month: any) => {
              (month.children || []).forEach((day: any) => {
                if (!day.hasNotification && day.dateKey && naechster && day.dateKey < naechster) {
                  day.hasNotification = true;
                }
              });
            });

            this.dataSource.data = treeData;
            this.recomputeAlarmDayKey();
            this.isLoading = false;

            this.statusPanelService.addMessageRequest(
              AppConstants.MSG_TAETIGKEITEN_LOADED_SUCCESS, 'GET', duration, results.products);
          },
          error: (err) => {
            const duration = Date.now() - startTime;
            this.isLoading = false;
            this.statusPanelService.addMessageRequest(
              AppConstants.MSG_TAETIGKEITEN_LOADED_ERROR, 'GET', duration, err);
          },
        });
      },
      error: (err) => {
        const duration = Date.now() - startTime;
        this.isLoading = false;
        this.statusPanelService.addMessageRequest(
          AppConstants.MSG_TAETIGKEITEN_LOADED_ERROR, 'GET', duration, err);
      },
    });
  }

  extractDropdownOptions(products: ApiProdukt[]) {
    const options = this.dropdownExtractorService.extractDropdownOptions(products);
    this.produktpositionOptions = options.produktpositionOptions;
    this.buchungspunktOptions = options.buchungspunktOptions;
  }

  goBackToList() {
    this.router.navigate(['/edit-activities']);
  }

  hasChild = (_: number, node: FlatNode) => node.expandable;

  onNodeClick(node: FlatNode) {
    if (this.showRightPanelAlarmActions && node !== this.alarmNode) {
      this.resetAlarmState();
    }

    if (node.level !== 2) {
      this.resetAlarmState();
      this.taetigkeitForm.reset({}, { emitEvent: false });
    }

    this.isNewlyCreated = false;
    this.isCreatingNew = false;
    this.isHeaderCreated = false;
    this.isEditing = false;
    this.saveAttempted = false;

    this.selectedNode = node;

    if (node.level === 2 && node.formData) {
      this.activityFormService.populateActivityForm(this.taetigkeitForm, node.formData);
    } else if (node.level === 0) {
      this.activityFormService.populateMonthForm(this.monthForm, node);
      const isLocked = this.dateParserService.isMonthLocked(node.monthKey, this.abschlussInfo?.letzterMonatsabschluss);
      this.monthForm.patchValue({ abgeschlossen: isLocked }, { emitEvent: false });
      this.activityFormService.setSummaryFormState(this.monthForm, !isLocked);
      this.monthForm.get('abgeschlossen')?.disable();
    } else if (node.level === 1) {
      this.activityFormService.populateDayForm(this.dayForm, node);
      const isLocked = this.dateParserService.isDateLocked(node.dateKey, this.abschlussInfo?.naechsterBuchbarerTag);
      this.dayForm.patchValue({ abgeschlossen: isLocked }, { emitEvent: false });
      this.activityFormService.setSummaryFormState(this.dayForm, !isLocked);
      this.dayForm.get('abgeschlossen')?.disable();
    }
    this.formValidationService.disableAllFormControls(this.taetigkeitForm);
  }

  saveForm() {
    this.saveAttempted = true;
    this.formValidationService.validateAllFields(this.taetigkeitForm);

    if (!this.taetigkeitForm.valid) {
      this.showValidationErrors();
      return;
    }

    const formValue = this.taetigkeitForm.getRawValue();
    this.validate(formValue);
  }

  private validate(formValue: TaetigkeitFormValue): void {
    const isDurationBased = formValue.durationStunde !== undefined && formValue.durationMinuten !== undefined;
    const resolvedDate: Date = formValue.datum instanceof Date
      ? formValue.datum
      : (this.dateParserService.parseGermanDate(formValue.datum as string) ?? new Date());

    resolvedDate.setHours(0, 0, 0, 0);

    let formValueForValidation: TaetigkeitFormValue;

    if (isDurationBased) {
      const durationHours = formValue.durationStunde || 0;
      const durationMinutes = formValue.durationMinuten || 0;
      if (durationHours === 0 && durationMinutes === 0) {
        this.openErrorDialog('Ungültige Dauer', 'Bitte geben Sie eine gültige Dauer ein.');
        return;
      }
      const { endHour, endMinute } = this.activityFormService.calculateDurationEndTime(0, 0, durationHours, durationMinutes);

      formValueForValidation = {
        ...formValue,
        anmeldezeitStunde: 0,
        anmeldezeitMinuten: 0,
        abmeldezeitStunde: endHour,
        abmeldezeitMinuten: endMinute,
        datum: formValue.datum instanceof Date
          ? formValue.datum
          : (this.dateParserService.parseGermanDate(formValue.datum) ?? new Date()),
      };
    } else {
      formValueForValidation = {
        ...formValue,
        datum: formValue.datum instanceof Date
          ? formValue.datum
          : (this.dateParserService.parseGermanDate(formValue.datum) ?? new Date()),
      };
    }

    if (formValueForValidation.datum instanceof Date) {
      formValueForValidation.datum.setHours(0, 0, 0, 0);
    }

    if (this.abschlussInfo?.naechsterBuchbarerTag) {
      const selectedDate: Date = resolvedDate;
      const naechsterBuchbarerTag = new Date(this.abschlussInfo.naechsterBuchbarerTag);
      if (selectedDate < naechsterBuchbarerTag) {
        this.openErrorDialog(
          'Zeitraum abgeschlossen',
          `Dieser Zeitraum ist bereits abgeschlossen. Frühestens ab ${this.abschlussInfo.naechsterBuchbarerTag} buchbar.`
        );
        return;
      }
    }

    const validationResult = this.validateTimeEntryOverlap(formValueForValidation, isDurationBased);
    if (!validationResult.isValid) {
      this.openErrorDialog('Ungültige Zeitangaben', validationResult.errorMessage || 'Die Zeitangaben sind ungültig.');
      return;
    }

    if (this.isCreatingNew || this.isNewlyCreated) {
      const wasAlarmFlow = this.isCreatingNewThirdLevel;
      this.saveNewEntry(formValueForValidation, isDurationBased);
      if (wasAlarmFlow) {
        this.resetAlarmState();
      }
      return;
    }

    this.openInfoDialog('Änderungen wurden gespeichert.');
    this.isEditing = false;
    this.isNewlyCreated = false;
    this.formValidationService.disableAllFormControls(this.taetigkeitForm);
  }

  private saveNewEntry(formValue: TaetigkeitFormValue, isDurationBased: boolean = false): void {
    const selectedDate = this.dateParserService.parseGermanDate(formValue.datum);
    if (!selectedDate) {
      this.openErrorDialog('Ungültiges Datum', 'Das angegebene Datum ist ungültig.');
      return;
    }

    const timeRange = this.activityFormService.buildTimeRange(
      formValue.anmeldezeitStunde ?? 0,
      formValue.anmeldezeitMinuten ?? 0,
      formValue.abmeldezeitStunde ?? 0,
      formValue.abmeldezeitMinuten ?? 0
    );

    const gebuchtTime = this.activityFormService.calculateGebuchtTime(
      formValue.anmeldezeitStunde ?? 0,
      formValue.anmeldezeitMinuten ?? 0,
      formValue.abmeldezeitStunde ?? 0,
      formValue.abmeldezeitMinuten ?? 0
    );

    const { loginDate, logoffDate } = this.activityFormService.createLoginLogoffDates(
      selectedDate,
      formValue.anmeldezeitStunde ?? 0,
      formValue.anmeldezeitMinuten ?? 0,
      formValue.abmeldezeitStunde ?? 0,
      formValue.abmeldezeitMinuten ?? 0
    );

    const selectedBuchungspunkt = formValue.buchungspunkt as ApiProduktPositionBuchungspunkt;
    const dto: ApiTaetigkeitsbuchung = {
      minutenDauer: this.calculateMinutenDauer(
        formValue.anmeldezeitStunde ?? 0,
        formValue.anmeldezeitMinuten ?? 0,
        formValue.abmeldezeitStunde ?? 0,
        formValue.abmeldezeitMinuten ?? 0
      ),
      taetigkeit: formValue.taetigkeit as ApiTaetigkeitTyp,
      buchungspunkt: selectedBuchungspunkt,
      jiraTicket: formValue.jiraTicket || '',
      anmerkung: formValue.anmerkung || '',
      datum: this.formatDateForBackend(selectedDate),
      buchungsart: formValue.buchungsart as ApiBuchungsart,
      stempelzeit: {
        login: loginDate.toISOString(),
        logoff: logoffDate.toISOString(),
        zeitTyp: formValue.buchungsart as ApiZeitTyp,
        anmerkung: formValue.anmerkung || '',
      },
    };

    const buchungspunktId = selectedBuchungspunkt?.id ?? '';
    if (!buchungspunktId) {
      this.openErrorDialog('Fehlende Auswahl', 'Bitte Buchungspunkt auswählen.');
      return;
    }

    const personId = this.route.snapshot.paramMap.get('id') || '';
    const startTime = Date.now();
    this.taetigkeitenKorrigierenService.createTaetigkeitsbuchung(dto, buchungspunktId, personId).subscribe({
      next: (response) => {
        const duration = Date.now() - startTime;
        const savedEntry = response.body!;
        const newStempelzeitData = savedEntry.stempelzeit || {
          login: loginDate.toISOString(),
          logoff: logoffDate.toISOString(),
          zeitTyp: formValue.buchungsart as ApiZeitTyp,
          anmerkung: formValue.anmerkung || '',
        };

        const newActivityData = this.activityFormService.createActivityData(formValue, gebuchtTime, isDurationBased);

        this.treeManagementService.addActivityToTree(
          this.dataSource.data,
          this.treeControl,
          selectedDate,
          newActivityData,
          timeRange,
          newStempelzeitData
        );

        this.dataSource.data = [...this.dataSource.data];
        this.isNewlyCreated = false;
        this.isCreatingNew = false;
        this.isHeaderCreated = false;
        this.isEditing = false;

        setTimeout(() => {
          const newNode = this.treeManagementService.findNewlyCreatedNode(
            this.treeControl.dataNodes,
            formValue,
            timeRange
          );

          if (newNode) {
            this.selectedNode = newNode;
            this.activityFormService.populateActivityForm(this.taetigkeitForm, newNode.formData);
            this.formValidationService.disableAllFormControls(this.taetigkeitForm);
            this.cdr.detectChanges();
          }
        }, 150);

        this.dialog.open(InfoDialogComponent, {
          data: { title: 'Erfolgreich', detail: 'Die Tätigkeitsbuchung wurde erfolgreich erstellt!' },
          panelClass: 'custom-dialog-width',
        });
        this.statusPanelService.addMessageRequest(
          AppConstants.MSG_TAETIGKEITEN_CREATED_SUCCESS, 'POST', duration, response);
      },
      error: (err) => {
        const duration = Date.now() - startTime;
        this.dialog.open(ErrorDialogComponent, {
          data: { title: 'Fehler beim Erstellen', detail: err.error || 'Die Tätigkeitsbuchung konnte nicht erstellt werden.' },
          panelClass: 'custom-dialog-width',
        });
        this.statusPanelService.addMessageRequest(
          AppConstants.MSG_TAETIGKEITEN_CREATED_ERROR, 'POST', duration, err);
      },
    });
  }

  private calculateMinutenDauer(startHour: number, startMin: number, endHour: number, endMin: number): number {
    return (endHour * 60 + endMin) - (startHour * 60 + startMin);
  }

  private formatDateForBackend(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onAlarmClick(node: FlatNode, event?: Event) {
    if (this.isCreatingNew || this.isNewlyCreated || this.isEditing) {
      this.isCreatingNew = false;
      this.isNewlyCreated = false;
      this.isHeaderCreated = false;
      this.isEditing = false;
      this.taetigkeitForm.reset();
      this.taetigkeitForm.disable();
    }

    if (event) {
      event.stopPropagation();
    }

    if (node.level === 1) {
      this.alarmNode = node;
      this.isCreatingNewThirdLevel = true;
      this.showRightPanelAlarmActions = true;
      this.createNewThirdLevelForm(node);
    }
  }

  createNewThirdLevelForm(parentNode: FlatNode) {
    const parentDate = this.dateParserService.getDateFromFormattedDay(parentNode.dayName || '');
    this.activityFormService.initializeAlarmForm(this.alarmForm, parentDate);
  }

  approveNewThirdLevel() {
    if (!this.alarmForm || !this.alarmNode) return;

    this.alarmSaveAttempted = true;
    this.formValidationService.validateAllFields(this.alarmForm);

    if (!this.alarmForm.valid) {
      this.showAlarmFormValidationErrors();
      return;
    }

    const alarmValue = this.alarmForm.value;
    const isRemote = this.isAlarmRemote();

    const formValue: any = {
      datum: alarmValue.datum,
      buchungsart: alarmValue.buchungsart as ApiBuchungsart,
      produkt: alarmValue.produkt,
      produktposition: alarmValue.produktposition,
      buchungspunkt: alarmValue.buchungspunkt as ApiProduktPositionBuchungspunkt,
      taetigkeit: alarmValue.taetigkeit,
      anmerkung: alarmValue.anmerkung || '',
      jiraTicket: alarmValue.jiraTicket || '',
    };

    if (isRemote) {
      formValue.anmeldezeitStunde = alarmValue.anmeldezeitStunde || 0;
      formValue.anmeldezeitMinuten = alarmValue.anmeldezeitMinuten || 0;
      formValue.abmeldezeitStunde = alarmValue.abmeldezeitStunde || 0;
      formValue.abmeldezeitMinuten = alarmValue.abmeldezeitMinuten || 0;
    } else {
      formValue.durationStunde = alarmValue.durationStunde || 0;
      formValue.durationMinuten = alarmValue.durationMinuten || 0;
    }

    this.isCreatingNew = true;
    this.isNewlyCreated = true;
    this.validate(formValue);
  }

  cancelNewThirdLevel() {
    this.resetAlarmState();
  }

  private resetAlarmState() {
    this.isCreatingNewThirdLevel = false;
    this.alarmNode = null;
    this.showRightPanelAlarmActions = false;
    this.alarmSaveAttempted = false;
    this.alarmForm.reset();
  }

  private showAlarmFormValidationErrors(): void {
    const errors = this.formValidationService.getValidationErrors(this.alarmForm, this.fieldDisplayMap);
    this.openErrorDialog('Validierungsfehler', errors.join('\n'));
  }

  deleteEntry(): void {
    if (!this.selectedNode || this.isCreatingNew) {
      if (this.isCreatingNew) this.cancelFormChanges();
      return;
    }

    const parentDay = this.findParentDay(this.selectedNode);
    if (parentDay?.hasNotification) {
      this.openErrorDialog(
        'Tag ist geschlossen',
        'Dieser Tag ist abgeschlossen. Bitte öffnen Sie den Tag, bevor Sie Einträge löschen.'
      );
      return;
    }

    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '500px',
      data: { title: 'Löschen einer Tätigkeitsbuchung', message: 'Wollen Sie die Tätigkeitsbuchung löschen?' },
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      this.performDelete();
    });
  }

  isAlarmDay(node: FlatNode): boolean {
    if (!node || node.level !== 1 || node.hasNotification) return false;
    return !!node.dateKey && node.dateKey === this.alarmDayKey;
  }

  private recomputeAlarmDayKey(): void {
    const naechster = this.abschlussInfo?.naechsterBuchbarerTag ?? null;
    const closedKeys = new Set<string>(
      this.treeControl.dataNodes
        .filter(n => n.level === 1 && n.hasNotification && !!n.dateKey)
        .map(n => n.dateKey!)
    );

    const allDayKeys: string[] = [];
    (this.dataSource.data || []).forEach((month: any) => {
      (month.children || []).forEach((day: any) => {
        if (day.dateKey && !closedKeys.has(day.dateKey)) allDayKeys.push(day.dateKey);
      });
    });

    if (!allDayKeys.length) {
      this.alarmDayKey = null;
      return;
    }

    const pool = naechster ? allDayKeys.filter(k => k >= naechster) : allDayKeys;
    const source = pool.length ? pool : allDayKeys;
    this.alarmDayKey = source.reduce((a, b) => (a > b ? a : b));
  }

  get isSelectedDayLocked(): boolean {
    if (!this.selectedNode) return false;
    const parentDay = this.findParentDay(this.selectedNode);
    return !!parentDay?.hasNotification;
  }

  private findPreviousOpenDay(dayNode: FlatNode): FlatNode | null {
    if (!dayNode.dateKey) return null;
    const earlierOpen = this.treeControl.dataNodes
      .filter(n => n.level === 1 && !!n.dateKey && n.dateKey < dayNode.dateKey! && !n.hasNotification);
    if (!earlierOpen.length) return null;
    return earlierOpen.sort((a, b) => (a.dateKey! < b.dateKey! ? -1 : 1))[0];
  }

  private findParentDay(node: FlatNode): FlatNode | null {
    if (node.level === 1) return node;
    const nodes = this.treeControl.dataNodes;
    const idx = nodes.indexOf(node);
    for (let i = idx - 1; i >= 0; i--) {
      if (nodes[i].level === 1) return nodes[i];
      if (nodes[i].level === 0) return null;
    }
    return null;
  }

  toggleDayOpenClose(dayNode: FlatNode): void {
    if (!dayNode || dayNode.level !== 1) return;

    const isClosed = !!dayNode.hasNotification;

    if (!isClosed) {
      const previousOpenDay = this.findPreviousOpenDay(dayNode);
      if (previousOpenDay) {
        this.openErrorDialog(
          'Tag kann nicht geschlossen werden',
          `Bitte schließen Sie zuerst den vorherigen offenen Tag (${previousOpenDay.dayName}). Tage müssen in chronologischer Reihenfolge abgeschlossen werden.`
        );
        return;
      }
    }

    const dialogRef = this.dialog.open(CloseOpenConfirmDialogComponent, {
      width: '500px',
      data: { isClosed, dayName: dayNode.dayName },
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;

      const willBeClosed = !isClosed;
      dayNode.hasNotification = willBeClosed;
      this.dayForm.patchValue({ abgeschlossen: willBeClosed }, { emitEvent: false });

      if (willBeClosed) {
        this.treeControl.collapseDescendants(dayNode);
        this.treeControl.collapse(dayNode);
        if (this.selectedNode && this.selectedNode !== dayNode && this.findParentDay(this.selectedNode) === dayNode) {
          this.selectedNode = dayNode;
        }
      } else {
        this.treeControl.expand(dayNode);
      }

      this.recomputeAlarmDayKey();
      this.openInfoDialog(willBeClosed ? 'Der Tag wurde geschlossen.' : 'Der Tag wurde geöffnet.');
    });
  }

  private performDelete(): void {
    if (!this.selectedNode) return;

    const stempelzeitId = this.selectedNode.stempelzeitData?.id;
    if (!stempelzeitId) {
      this.openErrorDialog('Fehler beim Löschen', 'Keine ID zum Löschen gefunden.');
      return;
    }

    const dto: ApiTaetigkeitsbuchung = {
      stempelzeit: {
        id: this.selectedNode.stempelzeitData?.id,
        zeitTyp: this.selectedNode.stempelzeitData?.zeitTyp,
        login: this.selectedNode.stempelzeitData?.login,
        logoff: this.selectedNode.stempelzeitData?.logoff,
      },
    };

    const startTime = Date.now();
    this.taetigkeitenKorrigierenService.updateTaetigkeitsbuchung(stempelzeitId, dto, 'delete').subscribe({
      next: (response) => {
        const duration = Date.now() - startTime;
        if (this.deleteNodeFromTree()) {
          this.selectedNode = null;
          this.isEditing = false;
          this.taetigkeitForm.reset();
        }
        this.dialog.open(InfoDialogComponent, {
          data: { title: 'Erfolgreich', detail: 'Die Tätigkeitsbuchung wurde erfolgreich gelöscht!' },
          panelClass: 'custom-dialog-width',
        });
        this.statusPanelService.addMessageRequest(
          AppConstants.MSG_TAETIGKEITEN_DELETED_SUCCESS, 'POST', duration, response);
      },
      error: (err) => {
        const duration = Date.now() - startTime;
        this.dialog.open(ErrorDialogComponent, {
          data: { title: 'Fehler beim Löschen', detail: err.error || 'Die Tätigkeitsbuchung konnte nicht gelöscht werden.' },
          panelClass: 'custom-dialog-width',
        });
        this.statusPanelService.addMessageRequest(
          AppConstants.MSG_TAETIGKEITEN_DELETED_ERROR, 'POST', duration, err);
      },
    });
  }

  private deleteNodeFromTree(): boolean {
    if (this.treeManagementService.deleteNodeFromTree(this.dataSource.data, this.selectedNode)) {
      this.dataSource.data = [...this.dataSource.data];
      return true;
    }
    return false;
  }

  validateTime(timeType: 'anmeldezeit' | 'abmeldezeit'): void {
    this.timeUtilityService.validateTime(this.taetigkeitForm, timeType);
  }

  get canEditTimeSection(): boolean {
    if (!this.isEditing) return false;
    const requiredFields = ['datum', 'buchungsart', 'produkt', 'produktposition', 'buchungspunkt', 'taetigkeit'];
    return requiredFields.every(field => {
      const control = this.taetigkeitForm.get(field);
      if (!control) return false;
      const value = control.value;
      return value !== null && value !== undefined && value !== '';
    });
  }

  get isAnmerkungEmpty(): boolean {
    const control = this.taetigkeitForm.get('anmerkung');
    if (!control) return false;
    const value = control.value;
    return !value || value.toString().trim() === '';
  }

  get isJiraTicketInvalid(): boolean {
    const c = this.taetigkeitForm.get('jiraTicket');
    return !!(c?.hasError('jiraPrefix') || c?.hasError('jiraSuffixRequired') || c?.hasError('jiraRequired'));
  }

  get isAlarmJiraTicketInvalid(): boolean {
    const c = this.alarmForm.get('jiraTicket');
    return !!(c?.hasError('jiraPrefix') || c?.hasError('jiraSuffixRequired') || c?.hasError('jiraRequired'));
  }

  jiraTicketErrorMessage(form: FormGroup): string {
    const c = form.get('jiraTicket');
    if (c?.hasError('jiraRequired')) return 'Jira-Ticket ist erforderlich';
    if (c?.hasError('jiraSuffixRequired')) return 'Jira-Ticket darf nicht nur "PGETIT-" enthalten';
    if (c?.hasError('jiraPrefix')) return 'Jira-Ticket muss mit "PGETIT" beginnen';
    return '';
  }

  onJiraInput(event: Event, form: FormGroup): void {
    const input = event.target as HTMLInputElement;
    const prefix = 'PGETIT-';
    let val = input.value;

    if (val === '' || val === prefix) {
      input.value = '';
      form.get('jiraTicket')?.patchValue('', { emitEvent: false });
      return;
    }

    if (!val.startsWith(prefix)) {
      const tail = val.replace(/^PGETIT-?/i, '');
      val = prefix + tail;
    }

    if (val.length > 30) val = val.slice(0, 30);

    input.value = val;
    form.get('jiraTicket')?.patchValue(val, { emitEvent: false });
  }

  comparePosition = (a: any, b: any): boolean => {
    if (a === b) return true;
    if (a == null || b == null) return false;
    const ka = typeof a === 'string' ? [a.toLowerCase()] : [String(a.id ?? '').toLowerCase(), String(a.produktPositionname ?? '').toLowerCase()].filter(Boolean);
    const kb = typeof b === 'string' ? [b.toLowerCase()] : [String(b.id ?? '').toLowerCase(), String(b.produktPositionname ?? '').toLowerCase()].filter(Boolean);
    if (!ka.length || !kb.length) return false;
    return ka.some(k => kb.includes(k));
  };

  compareBuchungspunkt = (a: any, b: any): boolean => {
    if (a === b) return true;
    if (a == null || b == null) return false;
    const ka = typeof a === 'string' ? [a.toLowerCase()] : [String(a.id ?? '').toLowerCase(), String(a.buchungspunkt ?? '').toLowerCase()].filter(Boolean);
    const kb = typeof b === 'string' ? [b.toLowerCase()] : [String(b.id ?? '').toLowerCase(), String(b.buchungspunkt ?? '').toLowerCase()].filter(Boolean);
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

  get canEditAlarmTime(): boolean {
    const requiredFields = ['datum', 'buchungsart', 'produkt', 'produktposition', 'buchungspunkt', 'taetigkeit'];
    return requiredFields.every(field => {
      const control = this.alarmForm.get(field);
      if (!control) return false;
      const value = control.value;
      return value !== null && value !== undefined && value !== '';
    });
  }

  get isAlarmAnmerkungEmpty(): boolean {
    const value = this.alarmForm.get('anmerkung')?.value;
    return !value || value.toString().trim() === '';
  }

  isAlarmFieldEmpty(name: string): boolean {
    const v = this.alarmForm?.get(name)?.value;
    if (v === null || v === undefined) return true;
    if (typeof v === 'string') return v.trim() === '';
    return false;
  }

  get isAlarmDauerEmpty(): boolean {
    const h = Number(this.alarmForm?.get('durationStunde')?.value || 0);
    const m = Number(this.alarmForm?.get('durationMinuten')?.value || 0);
    return h === 0 && m === 0;
  }

  getAlarmHour(timeType: 'anmeldezeit' | 'abmeldezeit' | 'duration' = 'duration'): number {
    return this.timeUtilityService.getHour(this.alarmForm, timeType);
  }

  validateAlarmTime(timeType: 'anmeldezeit' | 'abmeldezeit' | 'duration' = 'duration') {
    this.timeUtilityService.validateTime(this.alarmForm, timeType);
  }

  onDurationHourChange(value: number): void {
    this.alarmForm.get('durationStunde')?.patchValue(value);
    if (value === 1) {
      this.alarmForm.get('durationMinuten')?.patchValue(0);
    }
    this.validateAlarmTime('duration');
  }

  isAlarmRemote(): boolean {
    const value = this.alarmForm?.get('buchungsart')?.value;
    return String(value || '').toUpperCase() === 'REMOTEZEIT';
  }

  toggleEdit(): void {
    if (this.isEditing) {
      if (this.selectedNode?.level === 0) {
        this.saveMonthChanges();
      } else if (this.selectedNode?.level === 1) {
        this.saveDayChanges();
      } else if (this.selectedNode?.level === 2) {
        this.saveForm();
      }
      this.formValidationService.disableAllFormControls(this.taetigkeitForm);
    } else {
      this.isEditing = true;
      this.formValidationService.enableAllFormControls(this.taetigkeitForm, ['gestempelt', 'gebucht']);
      if (!this.isCreatingNew && !this.isNewlyCreated) {
        this.taetigkeitForm.get('buchungsart')?.disable({ emitEvent: false });
      }
    }
    this.cdr.detectChanges();
  }

  saveMonthChanges(): void {
    if (this.monthForm.valid && this.selectedNode?.level === 0) {
      const formValue = this.monthForm.value;
      this.selectedNode.hasNotification = formValue.abgeschlossen;
      this.selectedNode.gebuchtTotal = formValue.gebuchtTotal;
      this.openInfoDialog('Monatsänderungen wurden gespeichert.');
      this.isEditing = false;
      this.formValidationService.disableAllFormControls(this.monthForm);
      this.dataSource.data = [...this.dataSource.data];
    }
  }

  saveDayChanges(): void {
    if (this.dayForm.valid && this.selectedNode?.level === 1) {
      const formValue = this.dayForm.value;
      this.selectedNode.hasNotification = formValue.abgeschlossen;
      this.selectedNode.gestempelt = formValue.gestempelt;
      this.selectedNode.gebucht = formValue.gebucht;
      if (formValue.stempelzeiten && this.selectedNode.stempelzeitenList) {
        this.selectedNode.stempelzeitenList[0] = formValue.stempelzeiten;
      }
      this.openInfoDialog('Tagesänderungen wurden gespeichert.');
      this.isEditing = false;
      this.formValidationService.disableAllFormControls(this.dayForm);
      this.dataSource.data = [...this.dataSource.data];
    }
  }

  addTimeEntryFromHeader() {
    if (this.showRightPanelAlarmActions || this.isCreatingNewThirdLevel) {
      this.resetAlarmState();
    }
    if (this.isCreatingNew || this.isNewlyCreated) {
      this.cancelFormChanges();
    }

    const currentDate = this.dateParserService.getCurrentDateGerman();

    this.isCreatingNew = true;
    this.isNewlyCreated = true;
    this.isHeaderCreated = true;
    this.showRightPanelAlarmActions = false;
    this.isEditing = true;
    this.saveAttempted = false;

    this.activityFormService.initializeNewEntryForm(this.taetigkeitForm, currentDate);
    this.taetigkeitForm.patchValue({ datum: new Date() }, { emitEvent: false });
    this.formValidationService.enableAllFormControls(this.taetigkeitForm, ['gestempelt', 'gebucht', 'buchungsart']);
    this.taetigkeitForm.get('buchungsart')?.disable({ emitEvent: false });

    this.selectedNode = this.activityFormService.getDefaultNewEntryNode(currentDate) as FlatNode;
    this.taetigkeitForm.markAsPristine();
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
      this.isHeaderCreated = false;
      this.taetigkeitForm.reset();
    } else if (this.selectedNode) {
      if (this.selectedNode.level === 2 && this.selectedNode.formData) {
        this.activityFormService.populateActivityForm(this.taetigkeitForm, this.selectedNode.formData);
      } else if (this.selectedNode.level === 0) {
        this.activityFormService.populateMonthForm(this.monthForm, this.selectedNode);
      } else if (this.selectedNode.level === 1) {
        this.activityFormService.populateDayForm(this.dayForm, this.selectedNode);
      }

      this.isEditing = false;
      this.isNewlyCreated = false;

      if (this.selectedNode.level === 2) {
        this.taetigkeitForm.get('jiraTicket')?.disable();
      }
    }
  }

  private validateTimeEntryOverlap(
    formValue: TaetigkeitFormValue,
    isDurationBased: boolean = false
  ): { isValid: boolean; errorMessage?: string } {
    const excludeId = (this.isCreatingNew || this.isNewlyCreated)
      ? undefined
      : this.selectedNode?.stempelzeitData?.id;

    return this.timeOverlapService.validateTimeEntryOverlap(
      formValue,
      this.dataSource.data,
      excludeId,
      isDurationBased
    );
  }

  private showValidationErrors(): void {
    const errors = this.formValidationService.getValidationErrors(this.taetigkeitForm, this.fieldDisplayMap);
    this.openErrorDialog('Validierungsfehler', errors.join('\n'));
  }

  getFullDayOfWeekFromNode(node: FlatNode | null): string {
    return this.dateParserService.getFullDayOfWeekFromNode(node);
  }

  getDateDisplayFromNode(node: FlatNode | null): string {
    return this.dateUtilsService.getDateDisplayFromNode(node);
  }

  isStempelzeitenVisible(node: FlatNode): boolean {
    return this.dateParserService.isStempelzeitenVisible(node.dateKey, this.abschlussInfo?.naechsterBuchbarerTag);
  }

  onNodeDoubleClick(node: FlatNode, event: Event): void {
    event.stopPropagation();
    if (!node.expandable) return;

    const isExpanded = this.treeControl.isExpanded(node);
    this.collapseSiblings(node);

    if (isExpanded) {
      this.treeControl.collapse(node);
    } else {
      this.treeControl.expand(node);
    }
  }

  private collapseSiblings(node: FlatNode): void {
    const allNodes = this.treeControl.dataNodes;
    allNodes.forEach(n => {
      if (n !== node && n.level === node.level && this.treeControl.isExpanded(n)) {
        this.treeControl.collapseDescendants(n);
        this.treeControl.collapse(n);
      }
    });
  }
}
