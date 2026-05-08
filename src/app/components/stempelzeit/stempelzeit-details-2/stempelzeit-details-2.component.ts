import {ChangeDetectorRef, Component, inject, Injectable} from '@angular/core';
import {TimeBoxComponent} from '../../../shared/components/time-box/time-box.component';
import {AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule} from '@angular/material/tree';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {ConfirmationDialogComponent} from './confirmation-dialog.component';
import {StempelzeitService} from '../../../services/stempelzeit.service';
import {ApiStempelzeit} from '../../../models/ApiStempelzeit';
import {ApiZeitTyp} from '../../../models/ApiZeitTyp';
import {ApiPerson} from '../../../models/ApiPerson';
import {getEnumKeyByValue} from '../../../services/utils/enum.utils';
import {ApiProdukt} from '../../../models/ApiProdukt';
import {ApiAbschlussInfo} from '../../../models/ApiAbschlussInfo';
import {FlatNode} from '../../../models/stempelzeit-details/FlatNode.model';
import {StempelzeitNode} from '../../../models/stempelzeit-details/StempelzeitNode.model';
import {TimeEntry} from '../../../models/stempelzeit-details/TimeEntry.model';
import {FormData} from '../../../models/stempelzeit-details/FormData.model';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatDateFormats,
  NativeDateAdapter
} from '@angular/material/core';
import {EnumService} from '../../../services/utils/enum.service';
import {DateUtilsService} from '../../../services/utils/date-utils.service';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {TimeCalculationService} from '../../../services/time-calculation.service';
import {ApiProduktPositionBuchungspunkt} from '../../../models/ApiProduktPositionBuchungspunkt';
import {ApiProduktPosition} from '../../../models/ApiProduktPosition';
import {ApiTaetigkeitsbuchung} from '../../../models/ApiTaetigkeitsbuchung';
import {StatusPanelService} from '../../../services/utils/status-panel-status.service';
import {HttpResponse} from '@angular/common/http';
import {AppConstants} from '../../../models/app-constants';
import {ApiStempelzeitEintragungsart} from '../../../models/ApiStempelzeitEintragungsart';
import {switchMap, tap} from 'rxjs';
import {ErrorDialogComponent} from '../../dialogs/error-dialog/error-dialog.component';

import {DateParserService} from '../../../services/utils/date-parser.service';
import {MatTooltipModule} from '@angular/material/tooltip';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DeleteConfirmDialogComponent} from '../../delete-confirm-dialog/delete-confirm-dialog.component';
import {InfoDialogComponent} from '../../dialogs/info-dialog/info-dialog.component';

// import { StempelzeitNode, FlatNode, FormData, TimeEntry, TimeData } from '../../../models/stempelzeit-details';


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
  selector: 'app-stempelzeit-details-2',
  imports: [MatProgressSpinnerModule,
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatTooltipModule ,
   // BrowserAnimationsModule,
    MatDialogModule,
    CommonModule, MatDatepicker, MatDatepickerInput, MatDatepickerToggle,
    TimeBoxComponent,
   ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ],
  templateUrl: './stempelzeit-details-2.component.html',
  styleUrl: './stempelzeit-details-2.component.scss'
})
export class StempelzeitDetails2Component {
  stempelzeitService = inject(StempelzeitService);
  timeService = inject(TimeCalculationService);
  fb = inject(FormBuilder);
  snackBar = inject(MatSnackBar);
  route = inject(ActivatedRoute);
  router = inject(Router);
  cdr = inject(ChangeDetectorRef);
  dialog = inject(MatDialog);
  statusPanelService = inject(StatusPanelService);
    dateParserService =  inject(DateParserService);

/*  zeittypOptions = Object.keys(ApiZeitTyp).map(key => ({
    key: key,
    value: ApiZeitTyp[key as keyof typeof ApiZeitTyp]
  }));


 */
   zeittypOptions_ = Object.keys(ApiZeitTyp)
    .map(key => ({
      key: key,
      value: ApiZeitTyp[key as keyof typeof ApiZeitTyp]
    }))
    .filter(opt => opt.value === ApiZeitTyp.ARBEITSZEIT);


  private _zeittypOptions: Array<{ key: string; value: string }> = [];
  private _lastZeittypId: string | null = null;

  get zeittypOptions(): Array<{ key: string; value: string }> {
    const currentId = this.selectedNode?.timeEntry?.id ?? null;

    // only rebuild if selected node changed
    if (currentId === this._lastZeittypId) {
      return this._zeittypOptions;
    }

    this._lastZeittypId = currentId;

    const options = Object.keys(ApiZeitTyp)
      .map(key => ({
        key: key,
        value: ApiZeitTyp[key as keyof typeof ApiZeitTyp]
      }))
      .filter(opt => opt.value === ApiZeitTyp.ARBEITSZEIT);

    // add current entry's zeitTyp if not already in list
    if (this.selectedNode?.timeEntry?.zeitTyp) {
      const currentKey = this.selectedNode.timeEntry.zeitTyp.trim();
      const exists = options.some(opt => opt.key === currentKey);

      if (!exists) {
        const displayValue = ApiZeitTyp[currentKey as keyof typeof ApiZeitTyp] ?? currentKey;
        options.push({ key: currentKey, value: displayValue });
      }
    }

    this._zeittypOptions = options;
    return this._zeittypOptions;
  }

  private clickTimeout: any = null;
  private lastClickedNode: FlatNode | null = null;
  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level,
    node => node.expandable,
  );


  private readonly baseZeittypOptions = Object.keys(ApiZeitTyp)
    .map(key => ({
      key: key,
      value: ApiZeitTyp[key as keyof typeof ApiZeitTyp]
    }))
    .filter(opt => opt.value === ApiZeitTyp.ARBEITSZEIT);

/*
  private _zeittypOptionsCache: Array<{ key: string; value: string }> | null = null;
  private _cacheDeps: { hash: string } = { hash: '' };

// Helper to generate a cache key from dependencies
  private getCacheKey(): string {
    const base = this.baseZeittypOptions?.map(o => `${o.key}:${o.value}`).join('|') ?? '';
    const selected = this.selectedNode?.timeEntry?.zeitTyp ?? '';
    return `${this.isCreatingNew}|${base}|${selected}`;
  }

// Call this whenever dependencies might change
  private invalidateZeittypCache(): void {
    const newHash = this.getCacheKey();
    if (this._cacheDeps.hash !== newHash) {
      this._cacheDeps.hash = newHash;
      this._zeittypOptionsCache = null; // Force recomputation
    }
  }
  */

  /*
  get zeittypOptions(): Array<{ key: string; value: string }> {
    // Invalidate cache if deps changed
    this.invalidateZeittypCache();

    if (this._zeittypOptionsCache) {
      return this._zeittypOptionsCache;
    }

    const options: Array<{ key: string; value: string }> = [...this.baseZeittypOptions];

    if (!this.isCreatingNew && this.selectedNode?.timeEntry?.zeitTyp) {
      let currentValue = this.selectedNode.timeEntry.zeitTyp.trim();

      // Normalize enum KEY → VALUE
      if (currentValue in ApiZeitTyp) {
        const normalized = ApiZeitTyp[currentValue as keyof typeof ApiZeitTyp];
        if (normalized) {
          currentValue = normalized;
        }
      }

      const exists = options.some(opt => opt.value === currentValue);
      if (!exists) {
        // Find enum KEY for this VALUE (reverse lookup)
        const enumKey = Object.keys(ApiZeitTyp).find(
          k => ApiZeitTyp[k as keyof typeof ApiZeitTyp] === currentValue
        );
        const keyToAdd = enumKey || currentValue;
        options.push({ key: keyToAdd, value: currentValue as string });
      }
    }

    this._zeittypOptionsCache = options;
    return options;
  }
    private invalidateZeittypOptionsCache() {
    this._zeittypOptionsCache = null;
  }
  */


  private transformer = (node: StempelzeitNode, level: number): FlatNode => {


    return {
      expandable: !!node.children,
      name: node.name,
      level: level,
      hasNotification: node.hasNotification || false,
      formData: node.formData,
      timeEntry: node.timeEntry,
      date : DateUtilsService.formatToGermanDate(new Date(node.date!))
    };
  };
  treeFlattener = new MatTreeFlattener(
    this.transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );



  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  stempelzeitForm: FormGroup;
  selectedNode: FlatNode | null = null;
  isEditing = false;
  isLoading = true;
  personName: string = '';
  isCreatingNew = false;
  newNode: FlatNode | null = null;
  personId!: string;
  abschlussInfo: ApiAbschlussInfo | null = null;
  private previousExpandedState = new Set<FlatNode>();
  produktOptions: ApiProdukt[] = [];
  selectedPerson : ApiPerson = {};
  personProdukte :  ApiProdukt[] = [];
  gebuchteStempelzeiten :  ApiStempelzeit[] = [];
  gebuchteTaetigkeiten :  ApiTaetigkeitsbuchung[] = [];

  isRemote: boolean = false;

  calculatedGebucht: Array<{ day: string; minutes: number }> = [];
  highlightedDayNode: FlatNode | null = null;
  private pendingParentDayNode: FlatNode | null = null;

  constructor(){
    this.stempelzeitForm = this.createForm();
  }


  ngOnInit() {
    this.selectedPerson = history.state?.selectedPerson as ApiPerson;
    this.getPersonName(this.selectedPerson);
    this.loadDataFromServer();
  }


  loadDataFromServer_() {

    const startTime = Date.now();

    this.stempelzeitService.getPersonGebuchtProdukte(this.selectedPerson.id!).subscribe({
      next : (data : ApiProdukt[])=> {
        this.personProdukte = data;
        this.personProdukte.forEach(p => {

          // Level 1: produktPosition
          if (p.produktPosition?.length) {
            p.produktPosition.forEach((pos: ApiProduktPosition) => {

              // Level 2: produktPositionBuchungspunkt
              if (pos.produktPositionBuchungspunkt?.length) {
                pos.produktPositionBuchungspunkt.forEach((buchung: ApiProduktPositionBuchungspunkt) => {
                  if (buchung.taetigkeitsbuchung?.length) {
                    buchung.taetigkeitsbuchung.forEach((b: ApiTaetigkeitsbuchung) => {
                      this.gebuchteTaetigkeiten.push(b);
                    if (b.stempelzeit) {
                        this.gebuchteStempelzeiten.push(b.stempelzeit);
                      }
                    })
                  }
                });
              }
            });
          }
        });

        this.calculatedGebucht =  this.timeService.getSortedDaysWithMinutes(this.gebuchteStempelzeiten);
        let r : Array<{ day: string; minutes: number }> = this.timeService.getSortedDaysWithMinutes(this.gebuchteStempelzeiten);
        r.forEach( (r) => {
          console.log('Day: ' + r.day + ', miutes= ' + r.minutes  );
        })
      },
      error: (error : any) => {

      }
    });



    this.stempelzeitService.getStempelzeiten_(this.selectedPerson.id!).subscribe({
      next: (response: HttpResponse<ApiStempelzeit[]>) => {
        const duration = Date.now() - startTime;
        const filteredData =  response.body!.filter(item =>

          item.zeitTyp === getEnumKeyByValue(ApiZeitTyp, ApiZeitTyp.ARBEITSZEIT) ||
          item.zeitTyp === getEnumKeyByValue(ApiZeitTyp,ApiZeitTyp.REMOTEZEIT) ||
          item.poKorrektur === true
        )

        const timeEntries_: ApiStempelzeit[] = filteredData;
        const treeData = this.transformJsonToTree_(timeEntries_);
        this.dataSource.data = treeData;
        this.isLoading = false;
        this.statusPanelService.addMessageRequest(AppConstants.MSG_TAETIGKEITEN_LOADED_SUCCESS, 'GET', duration, response);

      },
      error: (error) => {
        const duration = Date.now() - startTime;
        console.error('Error loading JSON data:', error);
        this.isLoading = false;
        this.snackBar.open('Fehler beim Laden der Daten', 'Schließen', {
          duration: 3000,
          verticalPosition: 'top'

        });
        this.statusPanelService.addMessageRequest(AppConstants.MSG_TAETIGKEITEN_LOADED_ERROR, 'GET', duration, error);
      }
    });
  }

  loadDataFromServer(): void {
    const startTime = Date.now();
    this.isLoading = true;

    this.stempelzeitService.getPersonGebuchtProdukte(this.selectedPerson.id!).pipe(
      tap((data: ApiProdukt[]) => {
        this.personProdukte = data;
        this.gebuchteTaetigkeiten = [];
        this.gebuchteStempelzeiten = [];

        // extract nested stempelzeiten
        data.forEach(p => {
          p.produktPosition?.forEach((pos: ApiProduktPosition) => {
            pos.produktPositionBuchungspunkt?.forEach((buchung: ApiProduktPositionBuchungspunkt) => {
              buchung.taetigkeitsbuchung?.forEach((b: ApiTaetigkeitsbuchung) => {
                this.gebuchteTaetigkeiten.push(b);
                if (b.stempelzeit) {
                  this.gebuchteStempelzeiten.push(b.stempelzeit);
                }
              });
            });
          });
        });

        this.calculatedGebucht = this.timeService.getSortedDaysWithMinutes(this.gebuchteStempelzeiten);
      }),
      switchMap(() =>
        // ← only called after getPersonGebuchtProdukte completes
        this.stempelzeitService.getStempelzeiten_(this.selectedPerson.id!)
      )
    ).subscribe({
      next: (response: HttpResponse<ApiStempelzeit[]>) => {
        const duration = Date.now() - startTime;

        const filteredData = response.body!.filter(item =>
          item.zeitTyp === getEnumKeyByValue(ApiZeitTyp, ApiZeitTyp.ARBEITSZEIT) ||
          item.zeitTyp === getEnumKeyByValue(ApiZeitTyp, ApiZeitTyp.REMOTEZEIT)  ||
          item.poKorrektur === true
        );

        const treeData = this.transformJsonToTree_(filteredData);
        this.dataSource.data = treeData;
        this.isLoading = false;
        this.autoExpandLatestMonthNodes();

        this.statusPanelService.addMessageRequest(
          AppConstants.MSG_TAETIGKEITEN_LOADED_SUCCESS, 'GET', duration, response
        );
      },
      error: (error) => {
        const duration = Date.now() - startTime;
        this.isLoading = false;
        this.snackBar.open('Fehler beim Laden der Daten', 'Schließen', {
          duration: 3000,
          verticalPosition: 'top'
        });
        this.statusPanelService.addMessageRequest(
          AppConstants.MSG_TAETIGKEITEN_LOADED_ERROR, 'GET', duration, error
        );
      }
    });
  }

/*
  loadPersonData() {
    this.route.paramMap.subscribe(params => {
      const personId = params.get('id');
      console.log('person ID from route:', personId);
      if (personId) {
   //     this.loadDataFromJson(personId);

       // this.getPersonName(personId);
      } else {
        console.error('No person ID found in route');
        this.personName = 'Unbekannter Mitarbeiter';
      }
    });
  }
  */

  getPersonName(person: ApiPerson) {
    this.personName = `${person.vorname} ${person.nachname}`;
  }

  goBackToList() {
    this.router.navigate(['/stempelzeiten']);
  }

  getGebuchtTime(node: FlatNode): string {
    if (node.level !== 1 || !node.expandable) return '00:00';
    if(node.level === 1){
      const [day, month, year] = node.date!.split('.');
      const loginDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      const gebuchteMinuten =  this.getGebuchtMinutesInDay(loginDate);

       if(gebuchteMinuten && gebuchteMinuten > 0){
         const hours = Math.floor(gebuchteMinuten / 60);
         const minutes = Math.floor(gebuchteMinuten % 60);
         return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
       }
       else{
         return '00:00';
       }
    }
    return '00:00';
  }

  getGebuchtTime__(node: FlatNode): string {
    if (node.level !== 1 || !node.expandable) return '00:00';

    console.log('>>>>>>>>> node', node);
    console.log('>>>>>>>>> node.level ', node.level );
    console.log('>>>>>>>>> node.name ', node.name );
    console.log('>>>>>>>>> this.dataSource.data ', this.dataSource.data );
    console.log('>>>>>>>>> node.calculatedGebucht ', this.calculatedGebucht );

    if(node.level === 1){
      console.log('YYYY-node.date', node.date);

      const [day, month, year] = node.date!.split('.');
      const loginDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

      console.log('AAAA-node.date', new Date(node.date!));

      const gebuchteMinuten =  this.getGebuchtMinutesInDay(loginDate);
      console.log('gebuchteMinuten',node.date, gebuchteMinuten );

      if(gebuchteMinuten && gebuchteMinuten > 0){
        const hours = Math.floor(gebuchteMinuten / 60);
        const minutes = Math.floor(gebuchteMinuten % 60);
        console.log('Gebucht', hours + ':' + minutes);


        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;


      }
      else{
        return '00:00';
      }
    }

    return '00:00';
    /*
        if(node.date){
          let date = DateUtilsService.formatToGermanDate(new Date(node.date));
          console.log('öööö-date', date);
          const entry = this.calculatedGebucht.find(item => item.day === date);
           console.log('===== date', date);
           console.log('=== entry', entry);

         if(entry){
            const hours = Math.floor(entry?.minutes! / 60);
            const minutes = Math.floor(entry?.minutes! % 60);
            console.log('Gebucht', hours + ':' + minutes);

            console.log('entry-22', entry);
            console.log('date-22', date);
            console.log('this.calculatedGebucht', this.calculatedGebucht);

            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
          }else{
            return '00:00';
          }

        }else{
          console.log('NO DATAAAAA',node.date);
          return '00:00';
        }

        const treeData = this.dataSource.data;
        let totalMinutes = 0;

        const findNodeAndCalculateTime = (nodes: StempelzeitNode[]): boolean => {
          for (const treeNode of nodes) {

          //  console.log('**** treeNode', treeNode);
            if (treeNode.name === node.name && treeNode.children) {
              treeNode.children.forEach(child => {
           //     console.log('**** child', child);
                if (child.timeEntry) {
                  const login = new Date(child.timeEntry.login!);
                  const logoff = new Date(child.timeEntry.logoff!);
                  const duration = (logoff.getTime() - login.getTime()) / (1000 * 60); // minutes
                  totalMinutes += duration;
                }
              });
              return true;
            }
            if (treeNode.children && findNodeAndCalculateTime(treeNode.children)) {
              return true;
            }
          }
          return false;
        };

        findNodeAndCalculateTime(treeData);

        const hours = Math.floor(totalMinutes / 60);
        const minutes = Math.floor(totalMinutes % 60);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    */

  }

  getZeittypDisplay(zeitTyp: string): string {
    const option = this.zeittypOptions.find(o => o.key === zeitTyp);
    return option ? option.value : zeitTyp;
  }


  transformJsonToTree_(stempelZeiten: ApiStempelzeit[]): StempelzeitNode[] {
    const groupedByMonth: { [key: string]: ApiStempelzeit[] } = {};
    let monthsYear : string [] = this.getCurrentAndLastMonth(new Date());
    groupedByMonth[monthsYear[0]] = [];
    groupedByMonth[monthsYear[1]] = [];

    stempelZeiten.forEach(stempelZeit => {
      const loginDate = new Date(stempelZeit!.login!);
      const monthYear = this.getMonthYearString(loginDate);
      if (!groupedByMonth[monthYear]) {
        groupedByMonth[monthYear] = [];
      }
      groupedByMonth[monthYear].push(stempelZeit);
    });

    const treeData: StempelzeitNode[] = [];

    Object.keys(groupedByMonth).sort((a, b) => {
      const dateA = this.parseMonthYearString(a);
      const dateB = this.parseMonthYearString(b);
      return dateA.getTime() - dateB.getTime();
    }).forEach(monthYear => {
      const monthEntries = groupedByMonth[monthYear];
      const [month, year] = monthYear.split(' ');

      const monthNode: StempelzeitNode = {
        name: `${month} ${year}`,
        hasNotification: this.hasNotifications_(monthEntries),
        children: []
      };

      const groupedByDay: { [key: string]: ApiStempelzeit[] } = {};
      let day = new Date();

      monthEntries.forEach(entry => {
        const loginDate = new Date(entry.login!);
        const dayKey = this.formatDayName(loginDate);
        day =  loginDate;
        if (!groupedByDay[dayKey]) {
          groupedByDay[dayKey] = [];
        }
        groupedByDay[dayKey].push(entry);
      });

      Object.keys(groupedByDay).sort((a, b) => {
        const dateA = this.getDateFromFormattedDay(a);
        const dateB = this.getDateFromFormattedDay(b);
        return dateA.getTime() - dateB.getTime();
      }).forEach(dayKey => {
        const dayEntries = groupedByDay[dayKey];
        const dayNode: StempelzeitNode = {
          name: dayKey,
          hasNotification: this.hasNotifications_(dayEntries),
          children: [],
          date: dayEntries[0].login
        };
        dayEntries.forEach((entry, index) => {
          const loginTime = new Date(entry.login!);
          const logoffTime = new Date(entry.logoff!);
          const entryNode: StempelzeitNode = {
            name: `${this.formatTime(loginTime)} - ${this.formatTime(logoffTime)}`,
            date: loginTime.toLocaleDateString('de-DE'),
            hasNotification: entry.marker && entry.marker.length > 0,
            timeEntry: entry,
            formData: {
              datum: loginTime.toLocaleDateString('de-DE'),
              zeittyp: entry.zeitTyp!,
              anmeldezeit: {
                stunde: loginTime.getHours(),
                minuten: loginTime.getMinutes()
              },
              abmeldezeit: {
                stunde: logoffTime.getHours(),
                minuten: logoffTime.getMinutes()
              },
              anmerkung: entry.anmerkung! // this.generateAnmerkung(entry)
            }
          };
          dayNode.children!.push(entryNode);
        });

        monthNode.children!.push(dayNode);
      });

      treeData.push(monthNode);
    });
    return treeData;
  }
  private getDateFromFormattedDay__(dayString: string): Date {
    const parts = dayString.split(' ');
    if (parts.length < 3) {
      return new Date(); // Fallback
    }
    const dayNumber = parseInt(parts[1].replace('.', ''), 10);
    const monthName = parts[2];

    const months: { [key: string]: number } = {
      'Jänner': 0, 'Februar': 1, 'März': 2, 'April': 3, 'Mai': 4, 'Juni': 5,
      'Juli': 6, 'August': 7, 'September': 8, 'Oktober': 9, 'November': 10, 'Dezember': 11
    };

    const month = months[monthName] || 0;
    const year = new Date().getFullYear();

    return new Date(year, month, dayNumber);
  }

  private getDateFromFormattedDay(dayString: string): Date {
    if (!dayString) return new Date();

    try {
      // Split by one or more whitespace characters (handles "Mi.   15. April")
      const parts = dayString.trim().split(/\s+/);
      if (parts.length < 3) return new Date();

      // Extract day number (remove any trailing dots)
      const dayNumber = parseInt(parts[1].replace(/\./g, ''), 10);
      if (isNaN(dayNumber) || dayNumber < 1 || dayNumber > 31) return new Date();

      // Extract & normalize month name
      const rawMonth = parts[2];

      // Case-insensitive month mapping (includes Austrian "Jänner")
      const months: { [key: string]: number } = {
        'jänner': 0, 'januar': 0, 'februar': 1, 'märz': 2, 'april': 3, 'mai': 4, 'juni': 5,
        'juli': 6, 'august': 7, 'september': 8, 'oktober': 9, 'november': 10, 'dezember': 11
      };

      const monthIndex = months[rawMonth.toLowerCase()];
      if (monthIndex === undefined) return new Date();

      const year = new Date().getFullYear();
      const date = new Date(year, monthIndex, dayNumber);

      // Validate to prevent JS auto-correction (e.g., "30. Februar" → March 2)
      if (date.getFullYear() !== year || date.getMonth() !== monthIndex || date.getDate() !== dayNumber) {
        console.warn('Invalid date constructed from:', dayString);
        return new Date();
      }

      return date;
    } catch (error) {
      console.error('Error parsing date from formatted day:', error);
      return new Date();
    }
  }

  private parseMonthYearString(monthYear: string): Date {
    const months: { [key: string]: number } = {
      'Jänner': 0, 'Februar': 1, 'März': 2, 'April': 3, 'Mai': 4, 'Juni': 5,
      'Juli': 6, 'August': 7, 'September': 8, 'Oktober': 9, 'November': 10, 'Dezember': 11
    };

    const [monthName, year] = monthYear.split(' ');
    const month = months[monthName];
    return new Date(parseInt(year), month, 1);
  }

  private formatTime(date: Date): string {
    return date.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }

  private getMonthYearString(date: Date): string {
    const months = [
      'Jänner', 'Februar', 'März', 'April', 'Mai', 'Juni',
      'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  private getCurrentAndLastMonth(date: Date): string[] {
    const months = [
      'Jänner', 'Februar', 'März', 'April', 'Mai', 'Juni',
      'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
    ];

    // Current month string
    const currentMonthStr = `${months[date.getMonth()]} ${date.getFullYear()}`;
    const lastDate = new Date(date);
    lastDate.setMonth(lastDate.getMonth() - 1);
    const lastMonthStr = `${months[lastDate.getMonth()]} ${lastDate.getFullYear()}`;
    return [lastMonthStr, currentMonthStr];
  }

  private hasNotifications(entries: TimeEntry[]): boolean {
    return entries.some(entry => entry.marker && entry.marker.length > 0);
  }

  private hasNotifications_(entries: ApiStempelzeit[]): boolean {
    return entries.some(entry => entry.marker && entry.marker.length > 0);
  }

  private generateAnmerkung(entry: TimeEntry): string {
    return entry.anmerkung!;
  }


  createForm(): FormGroup {
    return this.fb.group({
      datum: ['', Validators.required],
      zeittyp: ['', Validators.required],
      anmeldezeitStunde: [0, [Validators.required, Validators.min(0), Validators.max(24)]],
      anmeldezeitMinuten: [0, [Validators.required, Validators.min(0), Validators.max(59)]],
      abmeldezeitStunde: [0, [Validators.required, Validators.min(0), Validators.max(24)]],
      abmeldezeitMinuten: [0, [Validators.required, Validators.min(0), Validators.max(59)]],
      anmerkung: ['', Validators.required]
    });
  }
  private isTimeValid(formValue: any): boolean {
    const {
      anmeldezeitStunde, anmeldezeitMinuten,
      abmeldezeitStunde, abmeldezeitMinuten
    } = formValue;

    console.log('Validating time:', {
      anmeldezeitStunde, anmeldezeitMinuten,
      abmeldezeitStunde, abmeldezeitMinuten
    });

    if (anmeldezeitStunde < 0 || anmeldezeitStunde > 24 ||
      abmeldezeitStunde < 0 || abmeldezeitStunde > 24 ||
      anmeldezeitMinuten < 0 || anmeldezeitMinuten > 59 ||
      abmeldezeitMinuten < 0 || abmeldezeitMinuten > 59) {
      return false;
    }

    if ((anmeldezeitStunde === 24 && anmeldezeitMinuten !== 0) ||
      (abmeldezeitStunde === 24 && abmeldezeitMinuten !== 0)) {
      return false;
    }

    const startTotalMinutes = anmeldezeitStunde * 60 + anmeldezeitMinuten;
    const endTotalMinutes = abmeldezeitStunde * 60 + abmeldezeitMinuten;
    if (startTotalMinutes === endTotalMinutes) {
      return true;
    }

    const isValid = endTotalMinutes > startTotalMinutes;
    return isValid;
  }

  hasChild = (_: number, node: FlatNode) => node.expandable;

  onNodeClick(node: FlatNode) {
    if (this.clickTimeout) {
      clearTimeout(this.clickTimeout);
    }

    this.clickTimeout = setTimeout(() => {
      this.handleSingleClick(node);
      this.clickTimeout = null;
      this.lastClickedNode = null;
    }, 250);
  }

  //double click handler
  onNodeDoubleClick(node: FlatNode) {
    // Clear the single click timeout
    if (this.clickTimeout) {
      clearTimeout(this.clickTimeout);
      this.clickTimeout = null;
    }

    this.handleDoubleClick(node);
    this.lastClickedNode = null;
  }

  private handleSingleClick_(node: FlatNode) {
    if (this.isCreatingNew && this.newNode) {
      this.cancelNewEntrySilently();
    }

    if (node.level === 2 && node.formData) {
      // Time entry node - has form data, so select and show details
      this.selectedNode = node;
      this.populateForm(node.formData);
      this.isEditing = false;
      this.isCreatingNew = false;
      this.updateFormControlsState();

      if(node.timeEntry?.zeitTyp === getEnumKeyByValue(ApiZeitTyp, ApiZeitTyp.REMOTEZEIT)){
        this.isRemote = true;
      }else{
        this.isRemote = false;
      }
    } else if (node.expandable) {
      this.selectedNode = node;
    } else {
      // Non-expandable node without form data
      this.selectedNode = node;
      this.stempelzeitForm.reset();
      this.isEditing = false;
      this.isCreatingNew = false;
      this.updateFormControlsState();
    }
  }




  get isArbeitszeit(): boolean {
    const formValue = this.stempelzeitForm.get('zeittyp')?.value;
    const nodeValue = this.selectedNode?.timeEntry?.zeitTyp;
    const currentTyp = formValue || nodeValue;

    // Check against BOTH the enum key string AND the enum value string
    return currentTyp === 'ARBEITSZEIT' || currentTyp === ApiZeitTyp.ARBEITSZEIT;
  }

  private showLevelWarning(): void {
    // Optional: Show a subtle message if user tries to edit a month/day
    console.warn('Edit/Save only available for time entries (level 2)');
    // Or show a snackbar/toast:
    // this.snackBar.open('Bitte wählen Sie einen Zeiteintrag zum Bearbeiten', 'OK', { duration: 3000 });
  }

  private handleSingleClick(node: FlatNode) {
    console.log('Single click on:', node.name, 'Level:', node.level);

    // Cancel any pending new entry draft
    if (this.isCreatingNew && this.newNode) {
      this.cancelNewEntrySilently();
    }

    // Always select the clicked node (for visual highlighting)
    this.selectedNode = node;
    this.highlightedDayNode = node.level === 1 ? node : null;

    if (node.level === 2 && node.formData) {
      // Level 2: Time entry → populate form for editing
      this.populateForm(node.formData);
      this.isEditing = false;
      this.isCreatingNew = false;
      this.updateFormControlsState();

    } else if (node.expandable) {
      // Level 0 (Month) or Level 1 (Day): Select only, NO auto-expand
      // Expansion is now handled by double-click or explicit expand button
      this.stempelzeitForm.reset();
      this.isEditing = false;
      this.isCreatingNew = false;
      this.updateFormControlsState();

    } else {
      // Fallback for any non-expandable leaf nodes
      this.stempelzeitForm.reset();
      this.isEditing = false;
      this.isCreatingNew = false;
      this.updateFormControlsState();
    }

    // Ensure UI updates immediately
    this.cdr?.detectChanges();
  }


/*
  private handleDoubleClick__(node: FlatNode) {
    if (node.expandable) {
      this.treeControl.toggle(node);
    }

    if (!node.expandable && node.level === 2 && node.formData) {
      this.selectedNode = node;
      this.populateForm(node.formData);
      this.isEditing = false;
      this.isCreatingNew = false;
      this.updateFormControlsState();
    }
  }

 */
/*
  private handleDoubleClick___(node: FlatNode) {
    console.log('Double click on:', node.name, 'Level:', node.level, 'Expandable:', node.expandable);
    this.selectedNode = node;

    if (node.expandable) {
      if (this.treeControl.isExpanded(node)) {
        this.treeControl.collapse(node);
      } else {
        if (node.level === 0) {
          // Close all other months first
          this.treeControl.dataNodes
            .filter(n => n.level === 0 && n !== node)
            .forEach(n => this.treeControl.collapse(n));
        } else if (node.level === 1) {
          // Close all other days in same month first
          this.treeControl.dataNodes
            .filter(n => n.level === 1 && n !== node)
            .forEach(n => this.treeControl.collapse(n));
        }
        this.treeControl.expand(node);
      }
    }

    if (!node.expandable && node.level === 2 && node.formData) {
      this.selectedNode = node;
      this.populateForm(node.formData);
      this.isEditing = false;
      this.isCreatingNew = false;
      this.updateFormControlsState();
    }
  }
*/

  private handleDoubleClick(node: FlatNode) {
    this.selectedNode = node;
    this.highlightedDayNode = null;  // ← always clear highlight on double click

    if (node.expandable) {
      if (this.treeControl.isExpanded(node)) {
        this.treeControl.collapse(node);
      } else {
        if (node.level === 0) {
          // close all other months first
          this.treeControl.dataNodes
            .filter(n => n.level === 0 && n !== node)
            .forEach(n => this.treeControl.collapse(n));
        } else if (node.level === 1) {
          // close all other days first
          this.treeControl.dataNodes
            .filter(n => n.level === 1 && n !== node)
            .forEach(n => this.treeControl.collapse(n));
        }
        this.treeControl.expand(node);
      }

      // ← clear form for month and day nodes
      this.stempelzeitForm.reset();
      this.isEditing = false;
      this.isCreatingNew = false;
      this.updateFormControlsState();
      this.cdr.detectChanges();
      return;  // ← important: stop here, don't fall through to level 2 logic
    }

    if (node.level === 2 && node.formData) {
      this.populateForm(node.formData);
      this.isEditing = false;
      this.isCreatingNew = false;
      this.updateFormControlsState();
    }

    this.cdr.detectChanges();
  }
  populateForm(formData?: FormData) {
    if (formData) {
      if (this.isEditing || this.isCreatingNew) {
        this.stempelzeitForm.get('zeittyp')?.enable();
      } else {
        this.stempelzeitForm.get('zeittyp')?.disable();
      }
      if (this.isCreatingNew) {
        this.stempelzeitForm.get('datum')?.enable();
      } else {
        this.stempelzeitForm.get('datum')?.disable();
      }

      this.stempelzeitForm.patchValue({
        datum: new Date( DateUtilsService.convertToISO(formData.datum)),
        zeittyp: formData.zeittyp,
        anmeldezeitStunde: formData.anmeldezeit.stunde,
        anmeldezeitMinuten: formData.anmeldezeit.minuten,
        abmeldezeitStunde: formData.abmeldezeit.stunde,
        abmeldezeitMinuten: formData.abmeldezeit.minuten,
        anmerkung: formData.anmerkung
      });
      this.stempelzeitForm.markAsPristine();
    } else {
      this.stempelzeitForm.reset();
    }
  }

  saveForm_() {
    debugger
    const datumControl = this.stempelzeitForm.get('datum');
    const wasDatumDisabled = datumControl?.disabled;

    if (wasDatumDisabled) {
      datumControl?.enable();
      this.stempelzeitForm.updateValueAndValidity();
    }

    this.validateAllFormFields(this.stempelzeitForm);

    if (!this.stempelzeitForm.valid || !this.selectedNode) {
      if (wasDatumDisabled) datumControl?.disable();
      this.showValidationErrors();
      return;
    }

    const formValue = this.stempelzeitForm.value;
    const datumValue = formValue.datum;
    const validationResult = this.validateTimeEntryOverlap(formValue);

    if (!validationResult.isValid) {
      if (wasDatumDisabled) datumControl?.disable();
      this.snackBar.open(validationResult.errorMessage || 'Ungültige Zeitangaben', 'Schließen', { duration: 5000, verticalPosition: 'top' });
      return;
    }

    const datumString = datumValue instanceof Date
      ? `${datumValue.getDate().toString().padStart(2, '0')}.${(datumValue.getMonth() + 1).toString().padStart(2, '0')}.${datumValue.getFullYear()}`
      : '';

    if (this.selectedNode.formData) {
      this.selectedNode.formData.datum         =  datumString; // datumValue;
      this.selectedNode.formData.zeittyp       = formValue.zeittyp;
      this.selectedNode.formData.anmeldezeit.stunde  = formValue.anmeldezeitStunde;
      this.selectedNode.formData.anmeldezeit.minuten = formValue.anmeldezeitMinuten;
      this.selectedNode.formData.abmeldezeit.stunde  = formValue.abmeldezeitStunde;
      this.selectedNode.formData.abmeldezeit.minuten = formValue.abmeldezeitMinuten;
      this.selectedNode.formData.anmerkung     = formValue.anmerkung;
    }

    this.selectedNode.name = `${this.formatTimeFromNumbers(formValue.anmeldezeitStunde, formValue.anmeldezeitMinuten)} - ${this.formatTimeFromNumbers(formValue.abmeldezeitStunde, formValue.abmeldezeitMinuten)}`;
    if (this.selectedNode.timeEntry) {
      const selectedDate =   this.parseGermanDate(datumString);
      if (selectedDate) {
        const loginTime = new Date(selectedDate);
        loginTime.setHours(formValue.anmeldezeitStunde, formValue.anmeldezeitMinuten, 0, 0);
        const logoffTime =   new Date(selectedDate);
        logoffTime.setHours(formValue.abmeldezeitStunde, formValue.abmeldezeitMinuten, 0, 0);
        this.selectedNode.timeEntry.login  = loginTime.toISOString();
        this.selectedNode.timeEntry.logoff = logoffTime.toISOString();
      }
      this.selectedNode.timeEntry.zeitTyp = formValue.zeittyp;
    }

    const dto: ApiStempelzeit = {
      id: this.selectedNode.timeEntry?.id,
      login : DateUtilsService.formatDateToISOFull(new Date(this.selectedNode.timeEntry?.login!)),
      logoff: DateUtilsService.formatDateToISOFull(new Date( this.selectedNode.timeEntry?.logoff!)),

      zeitTyp: this.selectedNode.timeEntry?.zeitTyp as ApiZeitTyp,
      poKorrektur: this.selectedNode.timeEntry?.poKorrektur,
      anmerkung: formValue.anmerkung || '',
      version : this.selectedNode.timeEntry?.version
    };

    this.stempelzeitService.updateStempelzeit(dto, dto.id!).subscribe({
      next: () => {
        if (wasDatumDisabled) datumControl?.disable();
        this.snackBar.open('Änderungen gespeichert!', 'Schließen', { duration: 3000, verticalPosition: 'top' });
        this.isEditing     = false;
        this.isCreatingNew = false;
        this.dataSource.data = [...this.dataSource.data];
        this.previousExpandedState.forEach(n => this.treeControl.expand(n));
        this.previousExpandedState.clear();
        this.stempelzeitForm.markAsPristine();
      },
      error: () => {
        if (wasDatumDisabled) datumControl?.disable();
        this.snackBar.open('Fehler beim Speichern', 'Schließen', { duration: 3000, verticalPosition: 'top' });
      }
    });
  }

  saveForm_______() {
    const datumControl = this.stempelzeitForm.get('datum');
    const wasDatumDisabled = datumControl?.disabled;

    if (!this.isCreatingNew) {
      const rawValue = this.stempelzeitForm.getRawValue();
      const datum = rawValue.datum;
      if (datum) {
        const selectedDate = datum instanceof Date
          ? datum
          : this.dateParserService.parseGermanDate(datum);
        if (selectedDate) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const selectedDateOnly = new Date(selectedDate);
          selectedDateOnly.setHours(0, 0, 0, 0);
          if (selectedDateOnly > today) {
            this.showErrorDialog(
              'Ungültiges Datum',
              'Das Datum liegt in der Zukunft. Einträge mit zukünftigem Datum können nicht gespeichert werden.'
            );
            return;
          }
        }
      }
    }

    if (wasDatumDisabled) {
      datumControl?.enable();
      this.stempelzeitForm.updateValueAndValidity();
    }

    this.validateAllFormFields(this.stempelzeitForm);

    if (!this.stempelzeitForm.valid || !this.selectedNode) {
      if (wasDatumDisabled) datumControl?.disable();
      this.showValidationErrors();
      return;
    }

    const formValue = this.stempelzeitForm.getRawValue();

    // Date/time validation
    const dateTimeValidation = this.validateDateAndTime(formValue);
    if (!dateTimeValidation.isValid) {
      if (wasDatumDisabled) datumControl?.disable();
      this.showErrorDialog(dateTimeValidation.errorTitle!, dateTimeValidation.errorMessage!);
      return;
    }

    const datumRaw = formValue.datum;
    const datumValue = datumRaw instanceof Date
      ? this.dateParserService.formatToGermanDate(datumRaw)
      : datumRaw;

    const selectedDate = datumRaw instanceof Date
      ? datumRaw
      : this.dateParserService.parseGermanDate(datumValue);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDateOnly = new Date(selectedDate!);
    selectedDateOnly.setHours(0, 0, 0, 0);

    // Overlap validation
    const validationResult = this.validateTimeEntryOverlap(formValue);
    if (!validationResult.isValid) {
      if (wasDatumDisabled) datumControl?.disable();
      this.showErrorDialog(
        'Zeitüberschneidung',
        validationResult.errorMessage || 'Ungültige Zeitangaben'
      );
      return;
    }

    // Update local formData
    if (this.selectedNode.formData) {
      this.selectedNode.formData.datum = datumValue;
      this.selectedNode.formData.zeittyp = formValue.zeittyp;
      this.selectedNode.formData.anmeldezeit.stunde = formValue.anmeldezeitStunde;
      this.selectedNode.formData.anmeldezeit.minuten = formValue.anmeldezeitMinuten;
      this.selectedNode.formData.abmeldezeit.stunde = formValue.abmeldezeitStunde;
      this.selectedNode.formData.abmeldezeit.minuten = formValue.abmeldezeitMinuten;
      this.selectedNode.formData.anmerkung = formValue.anmerkung;
    }

    this.selectedNode.name = `${this.formatTimeFromNumbers(formValue.anmeldezeitStunde, formValue.anmeldezeitMinuten)} - ${this.formatTimeFromNumbers(formValue.abmeldezeitStunde, formValue.abmeldezeitMinuten)}`;

    if (this.selectedNode.timeEntry) {
      if (selectedDate) {
        const loginTime = new Date(selectedDate);
        loginTime.setHours(formValue.anmeldezeitStunde, formValue.anmeldezeitMinuten, 0, 0);
        const logoffTime = new Date(selectedDate);
        logoffTime.setHours(formValue.abmeldezeitStunde, formValue.abmeldezeitMinuten, 0, 0);
        this.selectedNode.timeEntry.login = loginTime.toISOString();
        this.selectedNode.timeEntry.logoff = logoffTime.toISOString();
      }
      this.selectedNode.timeEntry.zeitTyp = formValue.zeittyp;
    }

    const dto: ApiStempelzeit = {
      id: this.selectedNode.timeEntry?.id,
      login : DateUtilsService.formatDateToISOFull(new Date(this.selectedNode.timeEntry?.login!)),
      logoff: DateUtilsService.formatDateToISOFull(new Date( this.selectedNode.timeEntry?.logoff!)),
      zeitTyp: this.selectedNode.timeEntry?.zeitTyp as ApiZeitTyp,
      poKorrektur: this.selectedNode.timeEntry?.poKorrektur,
      anmerkung: formValue.anmerkung || '',
      version : this.selectedNode.timeEntry?.version
    };

    const startTime = Date.now();
    this.stempelzeitService.updateStempelzeit_(dto, dto.id!).subscribe({
      next: (response) => {
        console.log('UPDATED STEMPELZEIT', response.body);
        const duration = Date.now() - startTime;

        console.log('this.dataSource.data-Befor', this.dataSource.data);

        const updatedEntity = response.body;
        if (this.selectedNode && updatedEntity?.id && updatedEntity.version !== undefined) {
          // 1. Update timeEntry reference
          if (this.selectedNode.timeEntry?.id === updatedEntity.id) {
            this.selectedNode.timeEntry.version = updatedEntity.version;
          }



          // 3. Update in tree data source (if the same object is cached there)
          const nodeInTree = this.dataSource.data.find(n =>
            n.timeEntry?.id === updatedEntity.id
          );
          if (nodeInTree?.timeEntry) {
            nodeInTree.timeEntry.version = updatedEntity.version;
          }
        }

        if (wasDatumDisabled) datumControl?.disable();
        this.showInfoDialog('Erfolgreich gespeichert', 'Änderungen wurden erfolgreich gespeichert!');
        this.isEditing = false;
        this.isCreatingNew = false;
        this.saveExpandedState();


        this.dataSource.data = [...this.dataSource.data];
        console.log('this.dataSource.data-After', this.dataSource.data);

        this.restoreExpandedState();
        this.stempelzeitForm.markAsPristine();

        // Log success to status panel
        this.statusPanelService.addMessageRequest(
          AppConstants.MSG_STEMPELZEITEN_UPDATED_SUCCESS, //  Replace with your actual constant/string
          'PUT',                                        //  Change to 'PATCH'/'POST' if needed
          duration,
          response
        );

     //   this.saved.emit(); // Emit success event (if you have an @Output() saved)
      },
      error: (err) => {
        const duration = Date.now() - startTime;

        // Log error to status panel
        this.statusPanelService.addMessageRequest(
          AppConstants.MSG_STEMPELZEITEN_UPDATED_ERROR,   //  Replace with your actual constant/string
          'PUT',                                        //   Match the HTTP method used
          duration,
          err
        );

        //   Original Error Logic
        if (wasDatumDisabled) datumControl?.disable();
        this.showErrorDialog('Fehler beim Speichern', 'Der Eintrag konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.');
      }
    });
  }


  private validateAllFormFields(formGroup: FormGroup): void {
    if (!formGroup || !formGroup.controls) return;

    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (!control) return;

      if ((control as any).controls) {
        this.validateAllFormFields(control as FormGroup);
      } else {
        control.markAsTouched();
        control.updateValueAndValidity();
      }
    });
  }

  private showValidationErrors(): void {
    const errors = this.getFormValidationErrors();
    if (errors.length > 0) {
      const errorMessage = this.formatValidationErrors(errors);
      this.snackBar.open(errorMessage, 'Schließen', {
        duration: 5000,
        verticalPosition: 'top'
      });
    } else {
      this.snackBar.open('Bitte füllen Sie alle erforderlichen Felder aus', 'Schließen', {
        duration: 3000,
        verticalPosition: 'top'
      });
    }
  }

  private getFormValidationErrors(): string[] {
    const errors: string[] = [];
    const controls = this.stempelzeitForm.controls;

    Object.keys(controls).forEach(key => {
      const control = controls[key];
      if (control.errors) {
        Object.keys(control.errors).forEach(errorKey => {
          switch (errorKey) {
            case 'required':
              errors.push(this.getFieldDisplayName(key) + ' ist erforderlich');
              break;
            case 'min':
              errors.push(this.getFieldDisplayName(key) + ' ist zu niedrig');
              break;
            case 'max':
              errors.push(this.getFieldDisplayName(key) + ' ist zu hoch');
              break;
            default:
              errors.push(this.getFieldDisplayName(key) + ' ist ungültig');
          }
        });
      }
    });

    return errors;
  }

  private getFieldDisplayName(fieldName: string): string {
    const fieldMap: { [key: string]: string } = {
      'datum': 'Datum',
      'zeittyp': 'Zeittyp',
      'anmeldezeitStunde': 'Anmeldezeit Stunde',
      'anmeldezeitMinuten': 'Anmeldezeit Minuten',
      'abmeldezeitStunde': 'Abmeldezeit Stunde',
      'abmeldezeitMinuten': 'Abmeldezeit Minuten',
      'anmerkung': 'Anmerkung'
    };

    return fieldMap[fieldName] || fieldName;
  }

  private formatValidationErrors(errors: string[]): string {
    if (errors.length === 1) {
      return errors[0];
    }

    return 'Bitte korrigieren Sie folgende Fehler: ' + errors.slice(0, 3).join(', ');
  }
  cancelFormChanges() {
    if (this.isCreatingNew) {
      this.cancelNewEntry();
    } else if (this.selectedNode) {
      this.populateForm(this.selectedNode.formData);
      this.isEditing = false;
    }
  }

  private cancelNewEntrySilently() {
    this.debugTreeState('Before silently cancelling new entry');
    if (this.newNode) {
      this.saveExpandedState();
      const removeNewNode = (nodes: StempelzeitNode[]): boolean => {
        for (let i = 0; i < nodes.length; i++) {
          const treeNode = nodes[i];
          if (treeNode.children) {
            const index = treeNode.children.findIndex(child =>
              child.timeEntry?.id === this.newNode!.timeEntry?.id
            );
            if (index > -1) {
              treeNode.children.splice(index, 1);
              console.log('Removed new node from children');
              return true;
            }
            if (removeNewNode(treeNode.children)) {
              return true;
            }
          }
        }
        return false;
      };

      removeNewNode(this.dataSource.data);
      this.dataSource.data = [...this.dataSource.data];
      this.restoreExpandedState();
    }

    this.isCreatingNew = false;
    this.isEditing = false;
    this.newNode = null;
    this.selectedNode = null;
    this.stempelzeitForm.reset();

    this.debugTreeState('After silently cancelling new entry');
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  private expandedNodesSet = new Set<FlatNode>();

  private saveExpandedState() {
    this.expandedNodesSet.clear();
    const expandedNodes = this.treeControl.dataNodes.filter(node =>
      this.treeControl.isExpanded(node)
    );
    expandedNodes.forEach(node => this.expandedNodesSet.add(node));
  }

  private restoreExpandedState() {
    this.treeControl.dataNodes.forEach(node => {
      const wasExpanded = Array.from(this.expandedNodesSet).some(savedNode =>
        savedNode.name === node.name &&
        savedNode.level === node.level &&
        savedNode.expandable === node.expandable
      );

      if (wasExpanded && !this.treeControl.isExpanded(node)) {
        this.treeControl.expand(node);
      }
    });

  }


  addTimeEntry(node: FlatNode, event: Event) {
    event.stopPropagation();
    event.preventDefault();

    if (this.isCreatingNew && this.newNode) {
      this.cancelNewEntrySilently();
    }

    if (node.level === 1) {
      const nodeDate = this.getDateFromFormattedDay(node.name);
      const entryDateString = nodeDate.toLocaleDateString('de-DE');

      const tempNewNode: FlatNode = {
        expandable: false,
        name: 'Neuer Eintrag',
        level: 2,
        hasNotification: false,
        formData: {
          datum: entryDateString,
          zeittyp: 'ARBEITSZEIT',
          anmeldezeit: { stunde: 0, minuten: 0 },
          abmeldezeit: { stunde: 0, minuten: 0 },
          anmerkung: ''
        },
        timeEntry: {
          id: `temp-${Date.now()}`,
          login: nodeDate.toISOString(),
          logoff: nodeDate.toISOString(),
          zeitTyp: ApiZeitTyp.ARBEITSZEIT,
          poKorrektur: false
        }
      };

      this.pendingParentDayNode = node;

      this.newNode = tempNewNode;
      this.selectedNode = tempNewNode;
      this.isCreatingNew = true;
      this.isEditing = true;
      this.highlightedDayNode = node;
      this.populateForm(tempNewNode.formData);
    }
  }

  /*

  addTimeEntry_(node: FlatNode, event: Event) {
    this.isRemote = false;
    event.stopPropagation();
    event.preventDefault();

    console.log('=== START addTimeEntry ===');
    this.debugTreeState('Before adding new entry');

    if (this.isCreatingNew && this.newNode) {
      this.cancelNewEntrySilently();
    }

    if (node.level === 1) {
      this.saveExpandedState();
      console.log('Saved expanded state:', this.expandedNodesSet.size);

      const findAndAddEntry = (nodes: StempelzeitNode[]): boolean => {
        for (const treeNode of nodes) {
          if (treeNode.name === node.name && treeNode.children) {
            const currentTime = new Date();
            const newTimeEntry: ApiStempelzeit = {
              id: `new-${Date.now()}`,
              version: 1,
              deleted: false,
              login: currentTime.toISOString(),
              logoff: currentTime.toISOString(),
              zeitTyp: ApiZeitTyp.ARBEITSZEIT, // 'ARBEITSZEIT',
              poKorrektur: false,
              marker: [],
              eintragungsart: ApiStempelzeitEintragungsart.NORMAL, // 'NORMAL'
            };

            const newEntryNode: StempelzeitNode = {
              name: `00:00 - 00:00`,
              date: currentTime.toLocaleDateString('de-DE'),
              hasNotification: false,
              timeEntry: newTimeEntry,
              formData: {
                datum: currentTime.toLocaleDateString('de-DE'),
                zeittyp: 'ARBEITSZEIT',
                anmeldezeit: { stunde: 0, minuten: 0 },
                abmeldezeit: { stunde: 0, minuten: 0 },
                anmerkung: 'Neuer Eintrag'
              }
            };

            treeNode.children.push(newEntryNode);
            console.log('Added new entry to children, count:', treeNode.children.length);

            this.dataSource.data = [...this.dataSource.data];
            console.log('Updated dataSource');

            this.debugTreeState('After dataSource update, before restore');

            this.restoreExpandedState();
            console.log('Restored expanded state');

            this.debugTreeState('After restoreExpandedState');

            if (!this.treeControl.isExpanded(node)) {
              this.treeControl.expand(node);
              console.log('Forced expansion of parent node');
            }

            const newFlatNode = this.findNewFlatNode(newEntryNode);
            if (newFlatNode) {
              this.newNode = newFlatNode;
              this.selectedNode = newFlatNode;
              this.isCreatingNew = true;
              this.isEditing = true;
              this.populateForm(newFlatNode.formData);
              console.log('New node created and selected');
            }

            this.debugTreeState('Final state after addTimeEntry');
            return true;
          }
          if (treeNode.children && findAndAddEntry(treeNode.children)) return true;
        }
        return false;
      };

      findAndAddEntry(this.dataSource.data);
    }
    console.log('=== END addTimeEntry ===');
  }
  */


  private findNewFlatNode(newNode: StempelzeitNode): FlatNode | null {
    const flatNodes = this.treeControl.dataNodes;
    const foundNode = flatNodes.find(node =>
      node.level === 2 &&
      node.timeEntry?.id === newNode.timeEntry?.id
    );
    return foundNode || null;
  }

  private resetFormState() {
    this.isEditing = false;
    this.isCreatingNew = false;
    this.stempelzeitForm.markAsPristine();
    this.stempelzeitForm.markAsUntouched();
    this.stempelzeitForm.updateValueAndValidity();
  }

  saveNewEntry() {
    this.validateAndLogErrors(this.stempelzeitForm);

    if (this.stempelzeitForm.valid) {
      console.log('VALID FORM');
    } else {
      console.warn('Form is invalid. Check logs above for details.');
    }

    console.log('FIRST VALIDATION IS OK, this.newNode', this.newNode);
    if (!this.stempelzeitForm.valid || !this.newNode) {
      console.log('INVALID FORM');
      this.logValidationErrors(this.stempelzeitForm);

      // Optional: Log summary
      const errorCount = this.countValidationErrors(this.stempelzeitForm);
      console.warn(`⚠️ Total invalid controls: ${errorCount}`);


      this.showValidationErrors();
      return;
    }

    console.log('SECOND VALDIATION IS OK')

    const formValue = this.stempelzeitForm.value;


    const dateTimeValidation = this.validateDateAndTime(formValue);
    if (!dateTimeValidation.isValid) {
      this.showErrorDialog(dateTimeValidation.errorTitle!, dateTimeValidation.errorMessage!);
      return;
    }

    const validationResult = this.validateTimeEntryOverlap(formValue);
    if (!validationResult.isValid) {
      this.showErrorDialog(
        'Zeitüberschneidung',
        validationResult.errorMessage || 'Ungültige Zeitangaben'
      );
      return;
    }

    const datumRaw = formValue.datum;
    const datumValue = datumRaw instanceof Date
      ? this.dateParserService.formatToGermanDate(datumRaw)
      : datumRaw;

    const selectedDate = datumRaw instanceof Date
      ? datumRaw
      : this.dateParserService.parseGermanDate(datumValue);

    if (!selectedDate) {
      this.showErrorDialog('Ungültiges Datum', 'Bitte verwenden Sie das Format TT.MM.JJJJ.');
      return;
    }

    const selectedMonthYear = this.getMonthYearString(selectedDate);
    const selectedDayKey = this.formatDayName(selectedDate);


    const loginTime = new Date(selectedDate);
    loginTime.setHours(formValue.anmeldezeitStunde, formValue.anmeldezeitMinuten, 0, 0);
    const logoffTime = new Date(selectedDate);
    logoffTime.setHours(formValue.abmeldezeitStunde, formValue.abmeldezeitMinuten, 0, 0);
    /*
    const validationResult = this.validateTimeEntryOverlap(formValue);

    if (!validationResult.isValid) {
      this.snackBar.open(validationResult.errorMessage || 'Ungültige Zeitangaben', 'Schließen', { duration: 5000, verticalPosition: 'top' });
      return;
    }

    const datumString =  formValue.datum instanceof Date
      ? `${ formValue.datum.getDate().toString().padStart(2, '0')}.${( formValue.datum.getMonth() + 1).toString().padStart(2, '0')}.${ formValue.datum.getFullYear()}`
      : '';

    const selectedDate = this.parseGermanDate(datumString);

    if (!selectedDate) {
      this.snackBar.open('Ungültiges Datumformat', 'Schließen', { duration: 3000, verticalPosition: 'top' });
      return;
    }

    const selectedMonthYear = this.getMonthYearString(selectedDate);
    const selectedDayKey = selectedDate.toLocaleDateString('de-DE', {
      weekday: 'short', day: '2-digit', month: 'long'
    }).replace(',', ' ');

    const loginTime = new Date(selectedDate);
    loginTime.setHours(formValue.anmeldezeitStunde, formValue.anmeldezeitMinuten, 0, 0);
    const logoffTime = new Date(selectedDate);
    logoffTime.setHours(formValue.abmeldezeitStunde, formValue.abmeldezeitMinuten, 0, 0);


     */
    const newTimeEntry: ApiStempelzeit = {
      id:             `new-${Date.now()}`,
      version:1,
      deleted:false,
      login : DateUtilsService.formatDateToISOFull(loginTime),
      logoff: DateUtilsService.formatDateToISOFull(logoffTime),
      zeitTyp:        formValue.zeittyp,
      poKorrektur:    false,
      marker:         [],
      eintragungsart: ApiStempelzeitEintragungsart.NORMAL, // 'NORMAL'
    };

    const newEntryNode: StempelzeitNode = {
      name:`${this.formatTime(loginTime)} - ${this.formatTime(logoffTime)}`,
      date:selectedDate.toLocaleDateString('de-DE'),
      hasNotification: false,
      timeEntry: newTimeEntry,
      formData: {
        datum:selectedDate.toLocaleDateString('de-DE'),
        zeittyp:formValue.zeittyp,
        anmeldezeit:{ stunde: formValue.anmeldezeitStunde,  minuten: formValue.anmeldezeitMinuten },
        abmeldezeit:{ stunde: formValue.abmeldezeitStunde,  minuten: formValue.abmeldezeitMinuten },
        anmerkung:formValue.anmerkung
      }
    };

    const monthNode = this.findOrCreateMonthNode(selectedMonthYear);
    const dayNode   = this.findOrCreateDayNode(monthNode, selectedDayKey, selectedDate);
    if (!dayNode.children) dayNode.children = [];

    this.removeTemporaryNode();
    dayNode.children.push(newEntryNode);
    dayNode.children.sort((a, b) => a.name.split(' - ')[0].localeCompare(b.name.split(' - ')[0]));

    const dto: ApiStempelzeit = {
      login: newTimeEntry.login,
      logoff: newTimeEntry.logoff,
      zeitTyp: newTimeEntry.zeitTyp as ApiZeitTyp,
      poKorrektur: newTimeEntry.poKorrektur,
      anmerkung: formValue.anmerkung || '',
      version: 1
    };



    this.stempelzeitService.createStempelzeit(dto, this.selectedPerson.id!).subscribe({
      next: (created) => {
        newTimeEntry.id = created.id!;
        this.dataSource.data = [...this.dataSource.data];
        this.expandParentNodesForNewEntry(selectedMonthYear, selectedDayKey);
        const newFlatNode = this.findNewFlatNode(newEntryNode);
        if (newFlatNode) this.selectedNode = newFlatNode;
        this.snackBar.open('Neuer Eintrag gespeichert!', 'Schließen', { duration: 3000, verticalPosition: 'top' });
        this.isCreatingNew = false;
        this.isEditing     = false;
        this.newNode       = null;
        this.stempelzeitForm.markAsPristine();
      },
      error: () => this.snackBar.open('Fehler beim Speichern', 'Schließen', { duration: 3000, verticalPosition: 'top' })
    });
  }

  private logValidationErrors(control: AbstractControl, parentPath: string = ''): void {
    if (!control) return;

    // Mark as touched to trigger visual validation styles
    control.markAsTouched();

    const controls = control instanceof FormGroup
      ? Object.entries(control.controls)
      : control instanceof FormArray
        ? control.controls.map((c, i) => [i.toString(), c] as [string, AbstractControl])
        : [];

    if (controls.length > 0) {
      // Recursive: check nested controls
      controls.forEach(([key, child]) => {
        const path = parentPath ? `${parentPath}.${key}` : key;
        this.logValidationErrors(child, path);
      });
    } else {
      // Leaf control: log if invalid
      if (control.invalid && control.errors) {
        const errorDetails = Object.entries(control.errors)
          .map(([err, val]) => {
            if (err === 'required') return 'required';
            if (err === 'minlength') return `minlength:${val.requiredLength}`;
            if (err === 'maxlength') return `maxlength:${val.requiredLength}`;
            if (err === 'min') return `min:${val.min}`;
            if (err === 'max') return `max:${val.max}`;
            if (err === 'pattern') return `pattern:${val.requiredPattern}`;
            return err;
          })
          .join(', ');

        console.warn(` Invalid: "${parentPath || control}" → [${errorDetails}]`, control.errors);
      }
    }
  }

  private countValidationErrors(control: AbstractControl): number {
    let count = 0;

    if (control.invalid && control.errors) {
      count++;
    }

    const controls = control instanceof FormGroup
      ? Object.values(control.controls)
      : control instanceof FormArray
        ? control.controls
        : [];

    controls.forEach(child => {
      count += this.countValidationErrors(child);
    });

    return count;
  }

  private validateAndLogErrors(formGroup: FormGroup, parentPath: string = ''): void {
    if (!formGroup?.controls) return;

    Object.entries(formGroup.controls).forEach(([key, control]) => {
      const currentPath = parentPath ? `${parentPath}.${key}` : key;

      if (control instanceof FormGroup) {
        this.validateAndLogErrors(control, currentPath);
      } else if (control instanceof FormArray) {
        control.controls.forEach((child, index) => {
          const arrayPath = `${currentPath}[${index}]`;
          if (child instanceof FormGroup) {
            this.validateAndLogErrors(child, arrayPath);
          } else {
            this.markAndLogControl(child, arrayPath);
          }
        });
      } else {
        this.markAndLogControl(control, currentPath);
      }
    });
  }

  private markAndLogControl(control: AbstractControl, controlName: string): void {
    control.markAsTouched();
    control.updateValueAndValidity();

    if (control.errors) {
      const errorKeys = Object.keys(control.errors).join(', ');
      console.warn(`Validation failed on "${controlName}": ${errorKeys}`, control.errors);
    }
  }

  private removeTemporaryNode(): void {
    if (!this.newNode) return;

    const removeNode = (nodes: StempelzeitNode[]): boolean => {
      for (let i = 0; i < nodes.length; i++) {
        const treeNode = nodes[i];
        if (treeNode.children) {
          const index = treeNode.children.findIndex(child =>
            child.timeEntry?.id === this.newNode!.timeEntry?.id
          );
          if (index > -1) {
            treeNode.children.splice(index, 1);
            return true;
          }
          if (removeNode(treeNode.children)) {
            return true;
          }
        }
      }
      return false;
    };

    removeNode(this.dataSource.data);
  }

  parseGermanDate(dateString: string): Date | null {
    if (!dateString) return null;

    const parts = dateString.split('.');
    if (parts.length !== 3) return null;

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // 0-indexed
    const year = parseInt(parts[2], 10);

    const date = new Date(year, month, day);

    // Validate
    if (isNaN(date.getTime()) ||
      date.getDate() !== day ||
      date.getMonth() !== month ||
      date.getFullYear() !== year) {
      return null;
    }

    return date;
  }

  private parseGermanDate_(dateString: string): Date | null {
    if (!dateString || typeof dateString !== 'string') {
      console.error('parseGermanDate: dateString is null, undefined or not a string');
      return null;
    }

    const trimmedDate = dateString.trim();
    if (trimmedDate === '') {
      console.error('parseGermanDate: dateString is empty');
      return null;
    }

    // Parse German date format (DD.MM.YYYY)
    const parts = trimmedDate.split('.');
    if (parts.length !== 3) {
      console.error('parseGermanDate: Invalid date format - expected DD.MM.YYYY, got:', dateString);
      return null;
    }

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);

    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      console.error('parseGermanDate: Invalid date parts', { day, month, year, original: dateString });
      return null;
    }

    if (day < 1 || day > 31 || month < 0 || month > 11 || year < 1900 || year > 2100) {
      console.error('parseGermanDate: Date out of reasonable range', { day, month, year });
      return null;
    }

    const date = new Date(year, month, day);
    if (isNaN(date.getTime())) {
      console.error('parseGermanDate: Invalid date object created', { day, month, year, result: date });
      return null;
    }
    if (date.getDate() !== day || date.getMonth() !== month || date.getFullYear() !== year) {
      console.error('parseGermanDate: Date normalization detected invalid date', {
        input: { day, month: month + 1, year },
        output: { day: date.getDate(), month: date.getMonth() + 1, year: date.getFullYear() }
      });
      return null;
    }

    return date;
  }

  cancelNewEntry() {
    if (this.newNode) {
      const removeNewNode = (nodes: StempelzeitNode[]): boolean => {
        for (let i = 0; i < nodes.length; i++) {
          const treeNode = nodes[i];
          if (treeNode.children) {
            const index = treeNode.children.findIndex(child =>
              child.timeEntry?.id === this.newNode!.timeEntry?.id
            );
            if (index > -1) {
              treeNode.children.splice(index, 1);
              return true;
            }
            if (removeNewNode(treeNode.children)) {
              return true;
            }
          }
        }
        return false;
      };

      removeNewNode(this.dataSource.data);

      this.dataSource.data = [...this.dataSource.data];
      this.previousExpandedState.forEach(expandedNode => {
        this.treeControl.expand(expandedNode);
      });
      this.previousExpandedState.clear();

      this.snackBar.open('Eintrag verworfen', 'Schließen', {
        duration: 3000,
        verticalPosition: 'top'
      });
    }

    this.isCreatingNew = false;
    this.isEditing = false;
    this.newNode = null;
    this.selectedNode = null;
    this.stempelzeitForm.reset();
  }

  private formatTimeFromNumbers(hours: number, minutes: number): string {
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return this.formatTime(date);
  }

  async deleteEntry__() {
    if (this.selectedNode && !this.isCreatingNew) {
      const entryName = this.selectedNode.name;
      const entryDate = this.selectedNode.formData?.datum;
      const confirmed = await this.showDeleteConfirmation(entryName, entryDate);

      if (!confirmed) {
        return;
      }

      this.previousExpandedState = new Set(this.treeControl.expansionModel.selected);

      const removeNode = (nodes: StempelzeitNode[]): boolean => {
        for (let i = 0; i < nodes.length; i++) {
          const treeNode = nodes[i];
          if (treeNode.children) {
            const index = treeNode.children.findIndex(child =>
              child.timeEntry?.id === this.selectedNode!.timeEntry?.id
            );
            if (index > -1) {
              treeNode.children.splice(index, 1);
              return true;
            }
            if (removeNode(treeNode.children)) {
              return true;
            }
          }
        }
        return false;
      };

      if (removeNode(this.dataSource.data)) {
        const dto: ApiStempelzeit = {
          id: this.selectedNode.timeEntry?.id,
          login: this.selectedNode.timeEntry?.login,
          logoff: this.selectedNode.timeEntry?.logoff,
          zeitTyp: this.selectedNode.timeEntry?.zeitTyp as ApiZeitTyp,
          poKorrektur: this.selectedNode.timeEntry?.poKorrektur,
          anmerkung: this.selectedNode.formData?.anmerkung || '',
          version: this.selectedNode.timeEntry?.version,
          deleted: true
        };

        this.stempelzeitService.updateStempelzeit(dto, dto.id!).subscribe({
          next: () => {
            this.dataSource.data = [...this.dataSource.data];
            this.previousExpandedState.forEach(n => this.treeControl.expand(n));
            this.previousExpandedState.clear();
            this.snackBar.open('Eintrag gelöscht!', 'Schließen', { duration: 3000, verticalPosition: 'top' });
            this.selectedNode = null;
            this.isEditing = false;
            this.stempelzeitForm.reset();
          },
          error: () => this.snackBar.open('Fehler beim Löschen', 'Schließen', { duration: 3000, verticalPosition: 'top' })
        });
      }
    } else if (this.isCreatingNew) {
      this.cancelNewEntry();
    }
  }


  async deleteEntry() {
    if (this.selectedNode && !this.isCreatingNew) {
      const entryName = this.selectedNode.name;
      const entryDate = this.selectedNode.formData?.datum;
      const confirmed = await this.showDeleteConfirmation(entryName, entryDate);

      if (!confirmed) return;

      // ← save parent node BEFORE removing the child
      const parentNode = this.findParentNode(this.selectedNode);

      const removeNode = (nodes: StempelzeitNode[]): boolean => {
        for (let i = 0; i < nodes.length; i++) {
          const treeNode = nodes[i];
          if (treeNode.children) {
            const index = treeNode.children.findIndex(child =>
              child.timeEntry?.id === this.selectedNode!.timeEntry?.id
            );
            if (index > -1) {
              treeNode.children.splice(index, 1);
              return true;
            }
            if (removeNode(treeNode.children)) return true;
          }
        }
        return false;
      };

      if (removeNode(this.dataSource.data)) {
        const dto: ApiStempelzeit = {
          id:          this.selectedNode.timeEntry?.id,
          login:       this.selectedNode.timeEntry?.login,
          logoff:      this.selectedNode.timeEntry?.logoff,
          zeitTyp:     this.selectedNode.timeEntry?.zeitTyp as ApiZeitTyp,
          poKorrektur: this.selectedNode.timeEntry?.poKorrektur,
          anmerkung:   this.selectedNode.formData?.anmerkung || '',
          version:     this.selectedNode.timeEntry?.version,
          deleted:     true
        };


        const startTime = Date.now();

        this.stempelzeitService.updateStempelzeit_(dto, dto.id!).subscribe({
          next: (response:  HttpResponse<ApiStempelzeit> ) => {
            const duration = Date.now() - startTime;

            // refresh tree and restore expanded state
            this.saveExpandedState();
            this.refreshTree();
            this.restoreExpandedState();

            // ← select parent node after delete
            if (parentNode) {
              const restoredParent = this.treeControl.dataNodes.find(
                n => n.level === parentNode.level && n.name === parentNode.name
              );
              if (restoredParent) {
                this.selectedNode = restoredParent;
                this.highlightedDayNode = restoredParent.level === 1 ? restoredParent : null;
                // ← ensure parent stays expanded
                if (!this.treeControl.isExpanded(restoredParent)) {
                  this.treeControl.expand(restoredParent);
                }
              }
            } else {
              this.selectedNode = null;
            }

            this.isEditing = false;
            this.stempelzeitForm.reset();
            this.cdr.detectChanges();
            this.snackBar.open('Eintrag gelöscht!', 'Schließen', { duration: 3000, verticalPosition: 'top' });
            this.statusPanelService.addMessageRequest(
              AppConstants.MSG_STEMPELZEITEN_DELETED_SUCCESS, 'PUT', duration, response
            );
          },
          error: (err) => {
            const duration = Date.now() - startTime;

            this.snackBar.open('Fehler beim Löschen', 'Schließen', { duration: 3000, verticalPosition: 'top' })
            this.statusPanelService.addMessageRequest(
              AppConstants.MSG_STEMPELZEITEN_DELETED_ERROR, 'PUT', duration, err
            );
          }
          //error: () =>
        });
      }
    } else if (this.isCreatingNew) {
      this.cancelNewEntry();
    }
  }


  private async showDeleteConfirmation(entryName: string, entryDate?: string): Promise<boolean> {
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '450px',
      data: {
        absence: { name: entryName, date: entryDate }
      }
    });
    return await dialogRef.afterClosed().toPromise() === true;
  }

  private async showDeleteConfirmation__(entryName: string, entryDate?: string): Promise<boolean> {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '450px',
      panelClass: 'confirmation-dialog-panel',
      data: {
        title: 'Löschen eines Verbraucher',
        message: `Wollen Sie den Verbraucher "${entryName}"${entryDate ? ` vom ${entryDate}` : ''} wirklich löschen?`,
        confirmText: 'Ja',
        cancelText: 'Nein'
      }
    });


    const result = await dialogRef.afterClosed().toPromise();
    return result === true;
  }

  debugTreeState(action: string) {
    this.treeControl.dataNodes.forEach((node, index) => {
      if (this.treeControl.isExpanded(node)) {
      }
    });
  }

  private getNodeId(node: FlatNode): string {
    const baseId = `${node.level}-${node.name}-${node.expandable}`;

    if (node.level === 1) {
      const parentNode = this.findParentNode(node);
      if (parentNode) {
        return `${baseId}-parent:${parentNode.name}`;
      }
    }

    return baseId;
  }

  private findParentNode(node: FlatNode): FlatNode | null {
    const nodeIndex = this.treeControl.dataNodes.indexOf(node);
    if (nodeIndex <= 0) return null;
    for (let i = nodeIndex - 1; i >= 0; i--) {
      const potentialParent = this.treeControl.dataNodes[i];
      if (potentialParent.level < node.level) {
        return potentialParent;
      }
    }

    return null;
  }

  onDropdownOpened() {
    console.log('Dropdown OPENED - isEditing:', this.isEditing);
  }

  onDropdownClosed() {
    console.log('Dropdown CLOSED - isEditing:', this.isEditing);
    if (this.isEditing) {
      this.isEditing = true;
      this.cdr.detectChanges();
    }
  }

  getDropdownState(select: any): string {
    if (!select) return 'unknown';
    return `disabled: ${select.disabled}, panelOpen: ${select.panelOpen}`;
  }

  private updateFormControlsState() {
    const zeittypControl = this.stempelzeitForm.get('zeittyp');

    if (this.isEditing) {
      zeittypControl?.enable();
    } else {
      zeittypControl?.disable();
    }
    this.cdr.detectChanges();
  }

  addTimeEntryFromHeader() {
    this.debugTreeState('Before adding new entry from header');

    if (this.isCreatingNew && this.newNode) {
      this.cancelNewEntrySilently();
    }

    const currentTime = new Date();
    const currentDateString = currentTime.toLocaleDateString('de-DE');
    const tempNewNode: FlatNode = {
      expandable: false,
      name: 'Neuer Eintrag',
      level: 2,
      hasNotification: false,
      formData: {
        datum: currentDateString,
        zeittyp:   'ARBEITSZEIT',
        anmeldezeit: { stunde: 0, minuten: 0 },
        abmeldezeit: { stunde: 0, minuten: 0 },
        anmerkung: ''
      },
      timeEntry: {
        id: `temp-${Date.now()}`,
        version: 1,
        deleted: false,
        login: currentTime.toISOString(),
        logoff: currentTime.toISOString(),
        zeitTyp: ApiZeitTyp.ARBEITSZEIT,
        poKorrektur: false,
        marker: [],
        eintragungsart:  ApiStempelzeitEintragungsart.NORMAL
      }
    };

    this.selectedNode = tempNewNode;
    this.newNode = tempNewNode;
    this.isCreatingNew = true;
    this.isEditing = true;

    this.populateForm(tempNewNode.formData);

  }
  private findOrCreateMonthNode(monthYear: string): StempelzeitNode {
    let monthNode = this.dataSource.data.find(node => node.name === monthYear);

    if (!monthNode) {
      const [month, year] = monthYear.split(' ');
      monthNode = {
        name: monthYear,
        hasNotification: false,
        children: []
      };

      this.dataSource.data = [...this.dataSource.data, monthNode];

      this.dataSource.data.sort((a, b) => {
        const dateA = this.parseMonthYearString(a.name);
        const dateB = this.parseMonthYearString(b.name);
        return dateA.getTime() - dateB.getTime();
      });
  }

    return monthNode;
  }


  private findOrCreateDayNode(monthNode: StempelzeitNode, dayKey: string, date: Date): StempelzeitNode {
    if (!monthNode.children) {
      monthNode.children = [];
    }

    let dayNode = monthNode.children.find(node => node.name === dayKey);

    if (!dayNode) {
      dayNode = {
        name: dayKey,
        hasNotification: false,
        children: [],
        date: date.toISOString()  // ← store ISO date for reliable sorting
      };

      monthNode.children.push(dayNode);

      // ← sort using getDateFromFormattedDay — same as transformJsonToTree_
      monthNode.children.sort((a, b) => {
        const dateA = this.getDateFromFormattedDay(a.name);
        const dateB = this.getDateFromFormattedDay(b.name);
        return dateA.getTime() - dateB.getTime();
      });
    }

    return dayNode;
  }

  private findOrCreateDayNode_(monthNode: StempelzeitNode, dayKey: string, date: Date): StempelzeitNode {
    if (!monthNode.children) {
      monthNode.children = [];
    }

    let dayNode = monthNode.children.find(node => node.name === dayKey);

    if (!dayNode) {
      dayNode = {
        name: dayKey,
        hasNotification: false,
        children: []
      };

      monthNode.children.push(dayNode);
      monthNode.children.sort((a, b) => {
        const dateA = new Date(a.name.split('.').reverse().join('-'));
        const dateB = new Date(b.name.split('.').reverse().join('-'));
        return dateA.getTime() - dateB.getTime();
      });

      console.log('Created new day node:', dayKey);
    }

    return dayNode;
  }

  private expandParentNodesForNewEntry(monthYear: string, dayKey: string) {
    const flatNodes = this.treeControl.dataNodes;

    // Expand month node
    const monthNode = flatNodes.find(node =>
      node.level === 0 && node.name === monthYear
    );
    if (monthNode) {
      if (!this.treeControl.isExpanded(monthNode)) {
        this.treeControl.expand(monthNode);
      }
    }

    const dayNode = flatNodes.find(node =>
      node.level === 1 && node.name === dayKey
    );
    if (dayNode) {
      if (!this.treeControl.isExpanded(dayNode)) {
        this.treeControl.expand(dayNode);
      }
    }
  }

  getHour(timeType: 'anmeldezeit' | 'abmeldezeit'): number {
    const controlName = timeType === 'anmeldezeit' ? 'anmeldezeitStunde' : 'abmeldezeitStunde';
    return this.stempelzeitForm.get(controlName)?.value || 0;
  }

  getMinute(timeType: 'anmeldezeit' | 'abmeldezeit'): number {
    const controlName = timeType === 'anmeldezeit' ? 'anmeldezeitMinuten' : 'abmeldezeitMinuten';
    return this.stempelzeitForm.get(controlName)?.value || 0;
  }
  increaseHour(timeType: 'anmeldezeit' | 'abmeldezeit'): void {
    if (!this.isEditing) return;

    const hourControlName = timeType === 'anmeldezeit' ? 'anmeldezeitStunde' : 'abmeldezeitStunde';
    const minuteControlName = timeType === 'anmeldezeit' ? 'anmeldezeitMinuten' : 'abmeldezeitMinuten';

    const currentHour = this.getHour(timeType);

    if (currentHour < 24) {
      const newHour = currentHour + 1;
      this.stempelzeitForm.get(hourControlName)?.setValue(newHour);

      if (newHour === 24) {
        this.stempelzeitForm.get(minuteControlName)?.setValue(0);
      }

      this.stempelzeitForm.markAsDirty();
    }
  }

  decreaseHour(timeType: 'anmeldezeit' | 'abmeldezeit'): void {
    if (!this.isEditing) return;

    const controlName = timeType === 'anmeldezeit' ? 'anmeldezeitStunde' : 'abmeldezeitStunde';
    const currentHour = this.getHour(timeType);

    if (currentHour > 0) {
      this.stempelzeitForm.get(controlName)?.setValue(currentHour - 1);
      this.stempelzeitForm.markAsDirty();
    }
  }

  // Minute manipulation methods
  increaseMinute(timeType: 'anmeldezeit' | 'abmeldezeit'): void {
    if (!this.isEditing) return;

    const controlName = timeType === 'anmeldezeit' ? 'anmeldezeitMinuten' : 'abmeldezeitMinuten';
    const currentMinute = this.getMinute(timeType);
    const currentHour = this.getHour(timeType);

    if (currentHour === 24) return;

    if (currentMinute < 59) {
      this.stempelzeitForm.get(controlName)?.setValue(currentMinute + 1);
      this.stempelzeitForm.markAsDirty();
    }
  }

  decreaseMinute(timeType: 'anmeldezeit' | 'abmeldezeit'): void {
    if (!this.isEditing) return;

    const controlName = timeType === 'anmeldezeit' ? 'anmeldezeitMinuten' : 'abmeldezeitMinuten';
    const currentMinute = this.getMinute(timeType);
    const currentHour = this.getHour(timeType);

    if (currentHour === 24) return;

    if (currentMinute > 0) {
      this.stempelzeitForm.get(controlName)?.setValue(currentMinute - 1);
      this.stempelzeitForm.markAsDirty();
    }
  }

  validateTime(timeType: 'anmeldezeit' | 'abmeldezeit'): void {
    const hourControlName = timeType === 'anmeldezeit' ? 'anmeldezeitStunde' : 'abmeldezeitStunde';
    const minuteControlName = timeType === 'anmeldezeit' ? 'anmeldezeitMinuten' : 'abmeldezeitMinuten';

    const hourControl = this.stempelzeitForm.get(hourControlName);
    const minuteControl = this.stempelzeitForm.get(minuteControlName);

    let hourValue = hourControl?.value || 0;
    let minuteValue = minuteControl?.value || 0;

    if (hourValue < 0) hourValue = 0;
    if (hourValue > 24) hourValue = 24;

    if (minuteValue < 0) minuteValue = 0;
    if (minuteValue > 59) minuteValue = 59;
    if (hourValue === 24 && minuteValue !== 0) {
      minuteValue = 0;
    }

    hourControl?.setValue(hourValue);
    minuteControl?.setValue(minuteValue);

    this.stempelzeitForm.markAsDirty();
  }
  onZeittypChange(event: any) {
    if (this.isEditing && this.selectedNode) {
      this.stempelzeitForm.markAsDirty();

      if (this.selectedNode.formData) {
        this.selectedNode.formData.zeittyp = event.value;
      }
      if (this.selectedNode.timeEntry) {
        this.selectedNode.timeEntry.zeitTyp = event.value;
      }

      this.isEditing = true;
      this.cdr.detectChanges();
    }
  }
  private validateTimeEntryOverlap(formValue: any): { isValid: boolean; errorMessage?: string } {
    console.log('=== VALIDATE TIME ENTRY OVERLAP ===');
    console.log('Form value for validation:', formValue);

    const {
      datum,
      anmeldezeitStunde, anmeldezeitMinuten,
      abmeldezeitStunde, abmeldezeitMinuten
    } = formValue;


    if (!this.isTimeValid(formValue)) {
      console.log('Basic time validation failed');
      return {
        isValid: false,
        errorMessage: 'Ungültige Zeitangaben: Abmeldezeit muss nach Anmeldezeit liegen'
      };
    }


    const selectedDate = datum; //  this.parseGermanDate(datum);
    if (!selectedDate) {
      console.log('Date parsing failed for:', datum);
      return {
        isValid: false,
        errorMessage: 'Ungültiges Datumformat. Bitte verwenden Sie TT.MM.JJJJ'
      };
    }


    const startTime = new Date(selectedDate);
    startTime.setHours(anmeldezeitStunde, anmeldezeitMinuten, 0, 0);

    const endTime = new Date(selectedDate);
    endTime.setHours(abmeldezeitStunde, abmeldezeitMinuten, 0, 0);

    const overlaps = this.checkForTimeOverlaps(
      startTime,
      endTime,
      this.selectedNode?.timeEntry?.id
    );

    if (overlaps.hasOverlap) {
      return {
        isValid: false,
        errorMessage: `Zeitüberschneidung mit bestehendem Eintrag: ${overlaps.overlappingEntry}`
      };
    }

    console.log('Validation passed successfully #########');
    return { isValid: true };
  }

  private checkForTimeOverlaps(
    newStart: Date,
    newEnd: Date,
    excludeEntryId?: string
  ): { hasOverlap: boolean; overlappingEntry?: string } {

    const allTimeEntries: { entry: ApiStempelzeit; node: StempelzeitNode }[] = [];

    const collectTimeEntries = (nodes: StempelzeitNode[]) => {
      nodes.forEach(node => {
        if (node.timeEntry && node.formData) {
          allTimeEntries.push({ entry: node.timeEntry, node });
        }
        if (node.children) {
          collectTimeEntries(node.children);
        }
      });
    };

    collectTimeEntries(this.dataSource.data);

    for (const { entry, node } of allTimeEntries) {
      if (excludeEntryId && entry.id === excludeEntryId) {
        continue;
      }

      const existingStart = new Date(entry.login!);
      const existingEnd = new Date(entry.logoff!);

      const isSameDay =
        existingStart.toDateString() === newStart.toDateString();

      if (!isSameDay) {
        continue;
      }

      const hasOverlap =
        (newStart < existingEnd && newEnd > existingStart);

      if (hasOverlap) {
        const overlappingTime = `${this.formatTime(existingStart)} - ${this.formatTime(existingEnd)}`;
        return {
          hasOverlap: true,
          overlappingEntry: overlappingTime
        };
      }
    }

    return { hasOverlap: false };
  }

  getHeaderTitle(): string {
    if (!this.selectedNode) return 'Stempelzeit';

    if (this.selectedNode.level === 0) {
      return this.selectedNode.name;
    } else if (this.selectedNode.level === 1) {
      return this.convertToLongDayFormat(this.selectedNode.name);
    } else if (this.selectedNode.level === 2 && this.selectedNode.formData) {
      return 'Stempelzeit';
    }

    return 'Stempelzeit';
  }
  private convertToLongDayFormat_(shortFormat: string): string {
    console.log('shortFormat', shortFormat);

    try {
      const parts = shortFormat.split(' ');
      if (parts.length < 3) return shortFormat;

      const dayNumber = parseInt(parts[1].replace('.', ''), 10);
      const monthName = parts[2];

      const months: { [key: string]: number } = {
        'Jänner': 0, 'Februar': 1, 'März': 2, 'April': 3, 'Mai': 4, 'Juni': 5,
        'Juli': 6, 'August': 7, 'September': 8, 'Oktober': 9, 'November': 10, 'Dezember': 11
      };

      const month = months[monthName] || 0;
      const year = new Date().getFullYear();

      const date = new Date(year, month, dayNumber);

      const weekday = date.toLocaleDateString('de-DE', { weekday: 'long' });
      return `${weekday} ${dayNumber}. ${monthName}`;
    } catch (error) {
      console.error('Error converting day format:', error);
      return shortFormat;
    }
  }


  private convertToLongDayFormat(shortFormat: string): string {
    if (!shortFormat) return shortFormat;

    try {
      // Split by one or more whitespace characters (handles "Mi.   15. April")
      const parts = shortFormat.trim().split(/\s+/);
      if (parts.length < 3) return shortFormat;

      // Extract day number (remove any dots)
      const dayNumber = parseInt(parts[1].replace(/\./g, ''), 10);
      if (isNaN(dayNumber)) return shortFormat;

      // Extract & normalize month name
      const rawMonth = parts[2];

      // Case-insensitive month mapping (includes Austrian "Jänner")
      const months: { [key: string]: number } = {
        'jänner': 0, 'januar': 0, 'februar': 1, 'märz': 2, 'april': 3, 'mai': 4, 'juni': 5,
        'juli': 6, 'august': 7, 'september': 8, 'oktober': 9, 'november': 10, 'dezember': 11
      };

      const monthIndex = months[rawMonth.toLowerCase()];
      if (monthIndex === undefined) {
        console.warn('Unknown month:', rawMonth);
        return shortFormat;
      }

      const year = new Date().getFullYear();
      const date = new Date(year, monthIndex, dayNumber);

      // Validate to prevent JS auto-correction (e.g., "30. Februar" → March 2)
      if (date.getMonth() !== monthIndex || date.getDate() !== dayNumber) {
        console.warn('Invalid date constructed:', shortFormat);
        return shortFormat;
      }

      // Get long German weekday name
      const longWeekday = date.toLocaleDateString('de-DE', { weekday: 'long' });

      // Ensure proper capitalization for month
      const formattedMonth = rawMonth.charAt(0).toUpperCase() + rawMonth.slice(1).toLowerCase();

      return `${longWeekday} ${dayNumber}. ${formattedMonth}`;
    } catch (error) {
      console.error('Error converting day format:', error);
      return shortFormat;
    }
  }

  getEmptyStateTitle(): string {
    if (!this.selectedNode) return 'Kein Eintrag ausgewählt';

    if (this.selectedNode.level === 0) {
      return this.selectedNode.name;
    } else if (this.selectedNode.level === 1) {
      return this.selectedNode.name;
    }

    return 'Kein Eintrag ausgewählt';
  }

  getEmptyStateDescription(): string {
    if (!this.selectedNode) return 'Wählen Sie einen Eintrag aus der Liste aus, um Details anzuzeigen.';

    if (this.selectedNode.level === 0) {
      return 'Wählen Sie einen Tag aus, um Zeiteinträge zu sehen.';
    } else if (this.selectedNode.level === 1) {
      return 'Wählen Sie einen Zeiteintrag aus, um Details anzuzeigen.';
    }

    return 'Wählen Sie einen Eintrag aus der Liste aus, um Details anzuzeigen.';
  }
  getSelectedNodeDisplayName(): string {
    if (!this.selectedNode) return '';

    if (this.selectedNode.level === 0) {
      return this.selectedNode.name;
    } else if (this.selectedNode.level === 1) {
      return this.convertToLongDayFormat(this.selectedNode.name);
    }

    return '';
  }
  private formatDayName(date: Date): string {
    const weekdays: { [key: number]: string } = {
      0: 'So', 1: 'Mo', 2: 'Di', 3: 'Mi', 4: 'Do', 5: 'Fr', 6: 'Sa'
    };

    const weekday = weekdays[date.getDay()];
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleDateString('de-DE', { month: 'long' });

    return `${weekday}.   ${day}. ${month}`;
  }


  onTimeInput(field: string, event: Event, max: number): void {
    const input = event.target as HTMLInputElement;

    input.value = input.value.replace(/[^0-9]/g, '');

    if (input.value === '') {
      this.stempelzeitForm.get(field)?.patchValue(0, { emitEvent: true });
      this.stempelzeitForm.markAsDirty();
      return;
    }

    let num = parseInt(input.value, 10);

    if (num > max) {
      const lastDigit = parseInt(input.value[input.value.length - 1], 10);
      num = lastDigit;
      input.value = String(num);
    }

    this.stempelzeitForm.get(field)?.patchValue(num, { emitEvent: true });
    this.stempelzeitForm.markAsDirty();
    this.stempelzeitForm.updateValueAndValidity();
  }

  dateFilter____ = (date: Date | null): boolean => {
    if (!date) return false;
  /*  const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date <= today;


   */

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Normalize input date to midnight to avoid time component mismatches
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);
    console.log('date <= today', normalizedDate.getTime() <= today.getTime(), date, today);

    // Compare numeric timestamps (reliable & timezone-safe)
    return normalizedDate.getTime() <= today.getTime();

  };

  dateFilter = (date: Date | null): boolean => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);
    return normalizedDate.getTime() <= today.getTime();
  };


  getGebuchtMinutesInDay(loginDate: Date): number  {
    if (!loginDate) return 0;

    // Normalize to local midnight to prevent UTC timezone day-shift bugs
    const localDate = loginDate;// new Date(loginDate.getFullYear(), loginDate.getMonth(), loginDate.getDate());

    const dd = String(localDate.getDate()).padStart(2, '0');
    const mm = String(localDate.getMonth() + 1).padStart(2, '0');
    const yyyy = localDate.getFullYear();
    const targetKey = `${dd}.${mm}.${yyyy}`;
    const entry = this.calculatedGebucht.find(item => item.day === targetKey);
    if(entry){
       return entry?.minutes;
    }

    return 0;
  }

  private showErrorDialog(title: string, detail: string): void {
    this.dialog.open(ErrorDialogComponent, {
      data: { title, detail },
      panelClass: 'custom-dialog-width'
    });
  }

  private showInfoDialog(title: string, detail: string): void {
    console.log('🟡 showInfoDialog:', { title, detail });  // ← add this
    const ref = this.dialog.open(InfoDialogComponent, {
      data: { title, detail },
      panelClass: 'custom-dialog-width'
    });
    console.log('🟡 dialog ref:', ref);  // ← add this
    ref.afterOpened().subscribe(() => {
      console.log('🟡 dialog opened, componentInstance:', ref.componentInstance);
      console.log('🟡 componentInstance.data:', ref.componentInstance?.data);
    });
  }

  private validateDateAndTime(formValue: any): { isValid: boolean; errorTitle?: string; errorMessage?: string } {
    const datum = formValue.datum;

    if (!datum) {
      return { isValid: false, errorTitle: 'Pflichtfelder fehlen', errorMessage: 'Bitte wählen Sie ein Datum aus.' };
    }

    const selectedDate = datum instanceof Date ? datum : this.dateParserService.parseGermanDate(datum);
    if (!selectedDate) {
      return { isValid: false, errorTitle: 'Ungültiges Datum', errorMessage: 'Bitte verwenden Sie das Format TT.MM.JJJJ.' };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDateOnly = new Date(selectedDate);
    selectedDateOnly.setHours(0, 0, 0, 0);

    // FIX: Block future dates for new entries
    if (this.isCreatingNew && selectedDateOnly > today) {
      return {
        isValid: false,
        errorTitle: 'Ungültiges Datum',
        errorMessage: 'Das Datum darf nicht in der Zukunft liegen.'
      };
    }

    const { anmeldezeitStunde, anmeldezeitMinuten, abmeldezeitStunde, abmeldezeitMinuten } = formValue;

    //  FIX: If selected date is TODAY, both login and logoff hours must be ≤ current hour
    const isToday = selectedDateOnly.getTime() === today.getTime();
    if (this.isCreatingNew && isToday) {
      const now = new Date();
      const currentHour = now.getHours();

      if (anmeldezeitStunde > currentHour) {
        return {
          isValid: false,
          errorTitle: 'Ungültige Anmeldezeit',
          errorMessage: `Die Anmeldezeit (Stunde) darf die aktuelle Stunde (${currentHour}:xx) nicht überschreiten.`
        };
      }

      if (abmeldezeitStunde > currentHour) {
        return {
          isValid: false,
          errorTitle: 'Ungültige Abmeldezeit',
          errorMessage: `Die Abmeldezeit (Stunde) darf die aktuelle Stunde (${currentHour}:xx) nicht überschreiten.`
        };
      }
    }

    // Logoff must be after login
    const startMinutes = anmeldezeitStunde * 60 + anmeldezeitMinuten;
    const endMinutes = abmeldezeitStunde * 60 + abmeldezeitMinuten;

    if (endMinutes <= startMinutes) {
      return {
        isValid: false,
        errorTitle: 'Ungültige Zeitangaben',
        errorMessage: 'Die Abmeldezeit muss nach der Anmeldezeit liegen.'
      };
    }

    // Hour 24 rule
    if ((anmeldezeitStunde === 24 && anmeldezeitMinuten !== 0) ||
      (abmeldezeitStunde === 24 && abmeldezeitMinuten !== 0)) {
      return {
        isValid: false,
        errorTitle: 'Ungültige Zeitangaben',
        errorMessage: 'Bei 24 Stunden müssen die Minuten 0 sein.'
      };
    }

    return { isValid: true };
  }


  private autoExpandLatestMonthNodes(): void {
    setTimeout(() => {
      const allNodes = this.treeControl.dataNodes;
      const monthNodes = allNodes.filter(node => node.level === 0);

      if (!monthNodes.length) return;

      // Collapse all months first
      monthNodes.forEach(node => this.treeControl.collapse(node));

      // Only expand the latest month
      const latestMonthNode = monthNodes[monthNodes.length - 1];
      this.treeControl.expand(latestMonthNode);

      const latestMonthIndex = allNodes.indexOf(latestMonthNode);

      const dayNodesOfLatestMonth: FlatNode[] = [];
      for (let i = latestMonthIndex + 1; i < allNodes.length; i++) {
        const node = allNodes[i];
        if (node.level === 0) break;
        if (node.level === 1) dayNodesOfLatestMonth.push(node);
      }

      if (!dayNodesOfLatestMonth.length) return;

      // Collapse all days first, then expand only the last day
      dayNodesOfLatestMonth.forEach(n => this.treeControl.collapse(n));
      const lastDayNode = dayNodesOfLatestMonth[dayNodesOfLatestMonth.length - 1];
      this.treeControl.expand(lastDayNode);
      /*
      const lastDayIndex = allNodes.indexOf(lastDayNode);
      for (let i = lastDayIndex + 1; i < allNodes.length; i++) {
        const node = allNodes[i];
        if (node.level <= 1) break;
        if (node.level === 2 && node.formData) {
          this.selectedNode = node;
          this.populateForm(node.formData);
          this.isEditing = false;
          this.isCreatingNew = false;
          this.updateFormControlsState();
          break;
        }
      }
      */
    }, 0);
  }

////////////////////////////////////
 /* onSaveOrEditClick_(): void {
    if (this.isCreatingNew) {
      this.saveNewEntry();
      return;
    }

    // Guard: Only allow edit/save on existing time entries (level 2)
    if (this.selectedNode?.level !== 2) {
      console.warn('  Action blocked: Selected node is not a time entry (level 2)');
      return;
    }

    // Proceed with existing edit/save logic
    if (this.isEditing) {
      this.saveForm();
    } else {
      this.isEditing = true;
    }
  }

  */

  onSaveOrEditClick(): void {
    if (this.isCreatingNew) {
      this.saveEntry(true);
      return;
    }

    if (this.selectedNode?.level !== 2) return;

    if (this.isEditing) {
      this.saveEntry(false);
    } else {
      this.isEditing = true;
      this.updateFormControlsState();
    }
  }

  private saveEntry(isNew: boolean): void {
    this.validateAllFormFields(this.stempelzeitForm);

    if (!this.stempelzeitForm.valid) {
      this.showValidationErrors();
      return;
    }

    const formValue = this.stempelzeitForm.getRawValue();

    // date/time validation
    const dateTimeValidation = this.validateDateAndTime(formValue);
    if (!dateTimeValidation.isValid) {
      this.showErrorDialog(dateTimeValidation.errorTitle!, dateTimeValidation.errorMessage!);
      return;
    }

    // overlap validation
    const overlapValidation = this.validateTimeEntryOverlap(formValue);
    if (!overlapValidation.isValid) {
      this.showErrorDialog('Zeitüberschneidung', overlapValidation.errorMessage || 'Ungültige Zeitangaben');
      return;
    }

    const selectedDate = this.resolveDate(formValue.datum);
    if (!selectedDate) {
      this.showErrorDialog('Ungültiges Datum', 'Bitte verwenden Sie das Format TT.MM.JJJJ.');
      return;
    }

    const loginTime  = this.buildDateTime(selectedDate, formValue.anmeldezeitStunde, formValue.anmeldezeitMinuten);
    const logoffTime = this.buildDateTime(selectedDate, formValue.abmeldezeitStunde, formValue.abmeldezeitMinuten);

    const dto: ApiStempelzeit = {
      ...(isNew ? {} : {
        id:           this.selectedNode!.timeEntry?.id,
        version:      this.selectedNode!.timeEntry?.version,
        poKorrektur:  this.selectedNode!.timeEntry?.poKorrektur,
      }),
      login:    DateUtilsService.formatDateToISOFull(loginTime),
      logoff:   DateUtilsService.formatDateToISOFull(logoffTime),
      zeitTyp:  formValue.zeittyp as ApiZeitTyp,
      anmerkung: formValue.anmerkung || '',
      ...(isNew ? { version: 1, deleted: false, poKorrektur: false,
        marker: [], eintragungsart: ApiStempelzeitEintragungsart.NORMAL } : {})
    };

    if (isNew) {
      this.createEntry(dto, selectedDate, formValue, loginTime, logoffTime);
    } else {
      this.updateEntry(dto, loginTime, logoffTime, formValue);
    }
  }




  private createEntry(
    dto: ApiStempelzeit,
    selectedDate: Date,
    formValue: any,
    loginTime: Date,
    logoffTime: Date
  ): void {



    ////////
    const startTime = Date.now();
    const selectedMonthYear = this.getMonthYearString(selectedDate);
    const selectedDayKey    = this.formatDayName(selectedDate);

    const newEntryNode: StempelzeitNode = {
      name: `${this.formatTime(loginTime)} - ${this.formatTime(logoffTime)}`,
      date: selectedDate.toLocaleDateString('de-DE'),
      hasNotification: false,
      timeEntry: { ...dto, id: `temp-${Date.now()}` },
      formData: {
        datum:       selectedDate.toLocaleDateString('de-DE'),
        zeittyp:     formValue.zeittyp,
        anmeldezeit: { stunde: formValue.anmeldezeitStunde, minuten: formValue.anmeldezeitMinuten },
        abmeldezeit: { stunde: formValue.abmeldezeitStunde, minuten: formValue.abmeldezeitMinuten },
        anmerkung:   formValue.anmerkung
      }
    };

    const monthNode = this.findOrCreateMonthNode(selectedMonthYear);
    const dayNode   = this.findOrCreateDayNode(monthNode, selectedDayKey, selectedDate);
    if (!dayNode.children) dayNode.children = [];

    this.removeTemporaryNode();
    dayNode.children.push(newEntryNode);
  //  dayNode.children.sort((a, b) => a.name.split(' - ')[0].localeCompare(b.name.split(' - ')[0]));

    dayNode.children.sort((a, b) => {
      const timeA = a.timeEntry?.login ? new Date(a.timeEntry.login).getTime() : 0;
      const timeB = b.timeEntry?.login ? new Date(b.timeEntry.login).getTime() : 0;
      return timeA - timeB;
    });

    this.stempelzeitService.createStempelzeit_(dto, this.selectedPerson.id!).subscribe({
      next: (created) => {
        const duration = Date.now() - startTime;
        newEntryNode.timeEntry!.id = created.body!.id!;
        this.dataSource.data = [...this.dataSource.data];
        this.expandParentNodesForNewEntry(selectedMonthYear, selectedDayKey);

        const newFlatNode = this.findNewFlatNode(newEntryNode);
        if (newFlatNode) this.selectedNode = newFlatNode;

        this.afterSave();
        this.statusPanelService.addMessageRequest(
          AppConstants.MSG_STEMPELZEITEN_CREATED_SUCCESS, 'POST', duration, created
        );
      },
      error: (err) => {
        const duration = Date.now() - startTime;
        this.showErrorDialog('Fehler beim Speichern', 'Der Eintrag konnte nicht gespeichert werden.');
        this.statusPanelService.addMessageRequest(
          AppConstants.MSG_STEMPELZEITEN_CREATED_ERROR, 'POST', duration, err
        );
      }
    });
  }



  private updateEntry(
    dto: ApiStempelzeit,
    loginTime: Date,
    logoffTime: Date,
    formValue: any
  ): void {
    const startTime = Date.now();
    const datumControl = this.stempelzeitForm.get('datum');
    const wasDatumDisabled = datumControl?.disabled;

    if (wasDatumDisabled) {
      datumControl?.enable();
      this.stempelzeitForm.updateValueAndValidity();
    }

    // update local node data optimistically
    this.updateLocalNode(formValue, loginTime, logoffTime);

    this.stempelzeitService.updateStempelzeit_(dto, dto.id!).subscribe({
      next: (response) => {
        const duration = Date.now() - startTime;

        // sync version from server response
        if (response.body?.version !== undefined && this.selectedNode?.timeEntry) {
          this.selectedNode.timeEntry.version = response.body.version;
        }

        if (wasDatumDisabled) datumControl?.disable();
     /*   this.saveExpandedState();
        this.dataSource.data = [...this.dataSource.data];
        this.restoreExpandedState();
*/
        this.afterSave();
        this.statusPanelService.addMessageRequest(
          AppConstants.MSG_STEMPELZEITEN_UPDATED_SUCCESS, 'PUT', duration, response
        );
      },
      error: (err) => {
        const duration = Date.now() - startTime;
        if (wasDatumDisabled) datumControl?.disable();
        this.showErrorDialog('Fehler beim Speichern', 'Der Eintrag konnte nicht gespeichert werden.');
        this.statusPanelService.addMessageRequest(
          AppConstants.MSG_STEMPELZEITEN_UPDATED_ERROR, 'PUT', duration, err
        );
      }
    });
  }



  private updateLocalNode(formValue: any, loginTime: Date, logoffTime: Date): void {
    if (!this.selectedNode) return;

    const datumRaw   = formValue.datum;
    const datumValue = datumRaw instanceof Date
      ? this.dateParserService.formatToGermanDate(datumRaw)
      : datumRaw;

    const newName = `${this.formatTimeFromNumbers(formValue.anmeldezeitStunde, formValue.anmeldezeitMinuten)} - ${this.formatTimeFromNumbers(formValue.abmeldezeitStunde, formValue.abmeldezeitMinuten)}`;

    // ← update flat node
    if (this.selectedNode.formData) {
      this.selectedNode.formData.datum               = datumValue;
      this.selectedNode.formData.zeittyp             = formValue.zeittyp;
      this.selectedNode.formData.anmeldezeit.stunde  = formValue.anmeldezeitStunde;
      this.selectedNode.formData.anmeldezeit.minuten = formValue.anmeldezeitMinuten;
      this.selectedNode.formData.abmeldezeit.stunde  = formValue.abmeldezeitStunde;
      this.selectedNode.formData.abmeldezeit.minuten = formValue.abmeldezeitMinuten;
      this.selectedNode.formData.anmerkung           = formValue.anmerkung;
    }
    this.selectedNode.name = newName;

    if (this.selectedNode.timeEntry) {
      this.selectedNode.timeEntry.login   = loginTime.toISOString();
      this.selectedNode.timeEntry.logoff  = logoffTime.toISOString();
      this.selectedNode.timeEntry.zeitTyp = formValue.zeittyp;
    }

    // ← also update the underlying StempelzeitNode in dataSource
    const targetId = this.selectedNode.timeEntry?.id;

    const updateTreeNode = (nodes: StempelzeitNode[]): boolean => {
      for (const node of nodes) {
        if (node.timeEntry?.id === targetId) {
          node.name = newName;
          if (node.formData) {
            node.formData.datum               = datumValue;
            node.formData.zeittyp             = formValue.zeittyp;
            node.formData.anmeldezeit.stunde  = formValue.anmeldezeitStunde;
            node.formData.anmeldezeit.minuten = formValue.anmeldezeitMinuten;
            node.formData.abmeldezeit.stunde  = formValue.abmeldezeitStunde;
            node.formData.abmeldezeit.minuten = formValue.abmeldezeitMinuten;
            node.formData.anmerkung           = formValue.anmerkung;
          }
          if (node.timeEntry) {
            node.timeEntry.login   = loginTime.toISOString();
            node.timeEntry.logoff  = logoffTime.toISOString();
            node.timeEntry.zeitTyp = formValue.zeittyp;
          }
          return true;
        }
        if (node.children && updateTreeNode(node.children)) return true;
      }
      return false;
    };

    updateTreeNode(this.dataSource.data);
  }

  private updateLocalNode__(formValue: any, loginTime: Date, logoffTime: Date): void {
    if (!this.selectedNode) return;

    const datumRaw   = formValue.datum;
    const datumValue = datumRaw instanceof Date
      ? this.dateParserService.formatToGermanDate(datumRaw)
      : datumRaw;

    if (this.selectedNode.formData) {
      this.selectedNode.formData.datum              = datumValue;
      this.selectedNode.formData.zeittyp            = formValue.zeittyp;
      this.selectedNode.formData.anmeldezeit.stunde = formValue.anmeldezeitStunde;
      this.selectedNode.formData.anmeldezeit.minuten = formValue.anmeldezeitMinuten;
      this.selectedNode.formData.abmeldezeit.stunde = formValue.abmeldezeitStunde;
      this.selectedNode.formData.abmeldezeit.minuten = formValue.abmeldezeitMinuten;
      this.selectedNode.formData.anmerkung          = formValue.anmerkung;
    }

    this.selectedNode.name = `${this.formatTimeFromNumbers(formValue.anmeldezeitStunde, formValue.anmeldezeitMinuten)} - ${this.formatTimeFromNumbers(formValue.abmeldezeitStunde, formValue.abmeldezeitMinuten)}`;

    if (this.selectedNode.timeEntry) {
      this.selectedNode.timeEntry.login   = loginTime.toISOString();
      this.selectedNode.timeEntry.logoff  = logoffTime.toISOString();
      this.selectedNode.timeEntry.zeitTyp = formValue.zeittyp;
    }
  }


  private resolveDate(datum: any): Date | null {
    if (datum instanceof Date) return datum;
    return this.dateParserService.parseGermanDate(datum);
  }

  private buildDateTime(date: Date, hours: number, minutes: number): Date {
    const result = new Date(date);
    result.setHours(hours, minutes, 0, 0);
    return result;
  }

  private afterSave(): void {
    this.isEditing     = false;
    this.isCreatingNew = false;
    this.newNode       = null;
    this.stempelzeitForm.markAsPristine();
    this.updateFormControlsState();

    this.refreshAndRestoreSelection();

    setTimeout(() => {
      this.showInfoDialog('Erfolgreich gespeichert', 'Änderungen wurden erfolgreich gespeichert!');
    }, 0);
  }

  private refreshTree(): void {
    const data = this.dataSource.data;
    this.dataSource.data = [];
    this.dataSource.data = data;
  }

  private refreshAndRestoreSelection(): void {
    const selectedId = this.selectedNode?.timeEntry?.id;

    this.saveExpandedState();
    this.refreshTree();
    this.restoreExpandedState();

    // re-find selected node by id after refresh
    if (selectedId) {
      const restored = this.treeControl.dataNodes.find(
        n => n.level === 2 && n.timeEntry?.id === selectedId
      );
      if (restored) {
        this.selectedNode = restored;
        this.populateForm(restored.formData);
      }
    }

    this.cdr.detectChanges();
  }
}
