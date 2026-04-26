import {Component, ElementRef, inject, Renderer2, ViewChild,} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatSortModule, Sort} from '@angular/material/sort';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Subject, takeUntil} from 'rxjs';

import {AnwesenheitenlisteService} from '../../../services/anwesenheitenliste.service';
import {DateUtilsService, formatDateTimeGerman} from '../../../services/utils/date-utils.service';
import {AnwesenheitslisteDetailsComponent} from '../anwesenheitsliste-details/anwesenheitsliste-details.component';
import {MatMenuModule} from '@angular/material/menu';
import {AppUtilsService} from '../../../services/utils/app-utils.service';
import {ApiPersonAnwesenheit} from '../../../models/ApiPersonAnwesenheit';
import {ApiAnwesendStatus, ApiAnwesendStatusKeyMap,} from '../../../models/ApiAnwesendStatus';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {ApiPerson} from '../../../models/ApiPerson';
import {AuthenticationService} from '../../../services/authentication.service';
import {MatTooltipModule} from '@angular/material/tooltip';
import {InfoDialogComponent} from '../../dialogs/info-dialog/info-dialog.component';
import {HttpResponse} from '@angular/common/http';
import {AppConstants} from '../../../models/app-constants';
import {StatusPanelService} from '../../../services/utils/status-panel-status.service';
import {filter} from 'rxjs/operators';
import {NavigationRefreshService} from '../../../services/navigation-refresh.service';

@Component({
  selector: 'app-anwesenheitsliste-list',
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatMenuModule,
    MatDialogModule,
    MatTooltipModule,
    MatCheckboxModule
  ],
  templateUrl: './anwesenheitsliste-list.component.html',
  styleUrl: './anwesenheitsliste-list.component.scss'
})
export class AnwesenheitslisteListComponent {
  authenticationService  = inject(AuthenticationService);
  statusPanelService = inject(StatusPanelService);
  anwesenheitenService = inject( AnwesenheitenlisteService);


  displayedColumns: string[] = [
    'icon',
    'familienname',
    'vorname',
    'abwesendBis',
    'mitarbeiterart',
    'actions',
  ];
  anwesenheitenData: ApiPersonAnwesenheit[] = [];
  filteredData: ApiPersonAnwesenheit[] = [];
  searchTerm: string = '';
  showSideMenu: boolean = false;
  sideMenuType: 'phone' | 'info' | null = null;
  selectedPerson: ApiPersonAnwesenheit | null = null;

  showInactive: boolean = false;
  isLoading: boolean = false;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  loading = false;
  message: string | null = null;
  dataSource = new MatTableDataSource<ApiPerson>();
  sortState: { [key: string]: 'asc' | 'desc' } = {
    nachname: 'asc',
    vorname: 'asc',
    mitarbeiterart: 'asc',
    anwesend : 'asc'
  };
  private destroy$ = new Subject<void>();

  canUpload = this.authenticationService.canUploadTelefonliste();
  canView = this.authenticationService.canViewReports();

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private navigationRefreshService: NavigationRefreshService,
    private renderer: Renderer2
  ) {}

  ngOnInit_(): void {
    this.loadAnwesenheitenData();
  }


  ngOnInit(): void {
    this.loadAnwesenheitenData();
    this.navigationRefreshService.refresh$
      .pipe(
        filter(route => route === '/anwesenheitsliste'),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.loadAnwesenheitenData();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadAnwesenheitenData(): void {
    const startTime = Date.now();

    this.anwesenheitenService.getPersonenAnweesnd_().subscribe({
      next : (response : HttpResponse<ApiPersonAnwesenheit[]>) => {
        const duration = Date.now() - startTime;
        this.anwesenheitenData = response.body!;
        this.applyFilter();
        console.log(response);
        this.statusPanelService.addMessageRequest(AppConstants.MSG_ANWESENHEITEN_LOADED_SUCCESS, 'GET', duration, response);
      },
      error: (err: any) => {
        const duration = Date.now() - startTime;
        console.error('Error occurred during save:', err);
        this.statusPanelService.addMessageRequest(AppConstants.MSG_ANWESENHEITEN_LOADED_ERROR, 'GET', duration, err);
      }
    });
  }


  getTooltipText(element: ApiPersonAnwesenheit): string {
    if(element.anwesend) {
      const status = ApiAnwesendStatusKeyMap[element.anwesend] ?? ApiAnwesendStatus.UNBEKANNT;

      switch (status) {
        case ApiAnwesendStatus.ABWESEND:
          return (element.logoff ? ` Abwesend bis ${ formatDateTimeGerman(element.logoff)} ` : 'Abwesend - Ende der Abwesenheit unbekannt');
        case ApiAnwesendStatus.ANWESEND:
          return 'Anwesend';
        case ApiAnwesendStatus.WAR_HEUTE_ANWESEND:
          return 'Abgemeldet';
        case ApiAnwesendStatus.URLAUB:
        case ApiAnwesendStatus.KRANKENSTAND:
          return 'Abwesend';
        default:
          return 'War heute noch nicht angemeldet';
      }
    }else {
      return 'Unbekannt';
    }



  }
  getTelefonListePdf(){
    this.anwesenheitenService.getTelefonListePdf();
  }

  getInfoPdf(): void{
    this.anwesenheitenService.getInfoPdf();
  }

  // ─── Test menu actions ──────────────────────────────────────────────────
  onMenuTestRefresh(): void {
    console.log('Menu action: Aktualisieren clicked');
  }

  onMenuTestExport(): void {
    console.log('Menu action: Exportieren clicked');
  }

  onMenuTestSettings(): void {
    console.log('Menu action: Einstellungen clicked');
  }

  openFilePicker() {
    console.log('openFilePicker()');
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    console.log('onFileSelected()', event);
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    // Optional: Validate file type
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];

    if (!validTypes.includes(file.type)) {
      this.message = 'Bitte eine Excel-Datei (.xlsx) auswählen.';
      input.value = ''; // Reset input
      return;
    }

    this.loading = true;
    this.message = null;


    this.anwesenheitenService.uploadTelefonliste(file).subscribe({
      next: (response: string) => {
        this.loading = false;

        if (response === 'Success') {

          this.dialog.open(InfoDialogComponent, {
            data: {
              title: 'erfolgreich hochgeladen',
              detail: 'Die Telefonliste wurde erfolgreich hochgeladen!'
            },
            panelClass: 'custom-dialog-width',
          });

        } else {
          this.message = `Fehler: ${response}`;
        }

        input.value = ''; // Reset input for re-upload
      },
      error: (err) => {
        this.loading = false;
        this.message = this.getErrorMessage(err);
        input.value = ''; // Reset input
        console.error('Upload failed', err);
      }
    });
  }

  private getErrorMessage(err: any): string {
    if (err.status === 403) return 'Keine Berechtigung (PROJECT_OFFICE erforderlich).';
    if (err.status === 401) return 'Bitte anmelden.';
    if (err.status === 413) return 'Datei zu groß.';
    return 'Fehler beim Hochladen.';
  }

  applyFilter(): void {
    let filtered = [...this.anwesenheitenData];

    if (this.searchTerm) {
      const filterValue = this.searchTerm.toLowerCase();
      filtered = filtered.filter((item: ApiPerson) =>
        (item.nachname || '').toString().toLowerCase().includes(filterValue) ||
        (item.vorname || '').toString().toLowerCase().includes(filterValue) ||
        (item.mitarbeiterart || '').toString().toLowerCase().includes(filterValue)
      );
    }



    this.filteredData = this.applySorting(filtered);
    this.dataSource.data = this.filteredData;
  }

  private applySorting(data: ApiPerson[]): ApiPerson[] {
    const sortedField = Object.keys(this.sortState).find(field =>
      this.sortState[field] === 'asc' || this.sortState[field] === 'desc'
    );

    if (!sortedField) return data;

    const direction = this.sortState[sortedField];

    return [...data].sort((a, b) => {
      let valueA = this.getSortValue(a, sortedField);
      let valueB = this.getSortValue(b, sortedField);

      if (valueA < valueB) return direction === 'asc' ? -1 : 1;
      if (valueA > valueB) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }



  sortData(sort: Sort): void {
    const data = [...this.filteredData];

    if (!sort.active || sort.direction === '') {
      this.filteredData = data;
      return;
    }

    this.filteredData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'familienname':
          return this.compare(a.nachname!, b.nachname!, isAsc);
        case 'vorname':
          return this.compare(a.vorname!, b.vorname!, isAsc);
        case 'mitarbeiterart':
          return this.compare(a.mitarbeiterart!, b.mitarbeiterart!, isAsc);
        default:
          return 0;
      }
    });
  }

  compare(a: string | number, b: string | number, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  openDetailDialog(person: ApiPersonAnwesenheit): void {
    const dialogRef = this.dialog.open(AnwesenheitslisteDetailsComponent, {
      width: '800px',
      height: 'auto',
      panelClass: 'compact-dialog',
      data: { employee: person },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Handle any updates if needed
        this.loadAnwesenheitenData();
      }
    });
  }

  toggleSideMenu(type: 'phone' | 'info'): void {
    if (this.showSideMenu && this.sideMenuType === type) {
      this.showSideMenu = false;
      this.sideMenuType = null;
      // Reset selected employee when closing the menu
      this.selectedPerson = null;
    } else {
      this.showSideMenu = true;
      this.sideMenuType = type;
    }
  }

  getStatusClass(status?: string): string {

    if (!status) return '';

    switch (status) {
      case 'UNBEKANNT' :
        return 'status-inactive';
      case 'ANWESEND' :
        return 'status-active-anwesend';
      case 'ABWESEND' :
        return 'status-active';
      case 'WAR_HEUTE_ANWESEND':
        return 'status-war-heute-anwesend'
      case 'URLAUB':
        return 'status-active';
      case 'active':
        return 'status-active';
      case 'inactive':
        return 'status-inactive';
      case 'special':
        return 'status-special';
      default:
        return '';
    }
  }

  getIconClass(entry: ApiPersonAnwesenheit): string {
    if (entry.anwesend === ApiAnwesendStatus.ABWESEND ) return 'user-active';
    if (entry.anwesend === ApiAnwesendStatus.UNBEKANNT) return 'user-inactive';

    return 'user-inactive';
  }

  getMitarbeiterart(mitarbeiterart : string){
    return AppUtilsService.getMitarbeiterart(mitarbeiterart);
  }

  createColumnAbwesendBis(person : ApiPersonAnwesenheit) {
    if (person.logoff) {
      //  console.log('FOUND-Person', person);
      let date = new Date(person.logoff!);
      // console.log(date);
      if (date) {
        //    return  this.dateUtilsService.formatEndAs24(date, 'EEE dd.MM.yyyy - HH:mm');
        return formatDateTimeGerman(person.logoff);// this.dateUtilsService.formatEndAs24(date, 'EEE dd.MM.yyyy - HH:mm');
      } else {
        return '';
      }
    } else {
      if (person.abwesenheitVorhanden) {
        if (person.anwesend) {
          const status = ApiAnwesendStatusKeyMap[person.anwesend] ?? ApiAnwesendStatus.UNBEKANNT;

          switch (status) {
            case ApiAnwesendStatus.ABWESEND:
              return 'Ende der Abwesenheit unbekannt';
            default:
              return ''
          }


        } else {
          return '';
        }

      }else{
        return '';
      }

    }
  }
  callPerson(person: ApiPersonAnwesenheit, event?: Event): void {
    console.log('CALL PERSON');
    const previousCallingElements = document.querySelectorAll(
      '.phone-list-item.calling'
    );
    previousCallingElements.forEach((element) => {
      this.renderer.removeClass(element, 'calling');
    });

    if (event) {
      const element = event.currentTarget as HTMLElement;
      this.renderer.addClass(element, 'calling');

      // Remove the class after the animation completes
      setTimeout(() => {
        this.renderer.removeClass(element, 'calling');
      }, 2000);
    }

    this.selectedPerson = person;
    const phoneNumber = `+43 1 234567`;

    this.snackBar.open(
      `Calling ${person.vorname} ${person.nachname}: ${phoneNumber}`,
      'Dismiss',
      {
        duration: 3000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
        panelClass: ['call-snackbar'],
      }
    );

     console.log(
      `Calling ${person.vorname} ${person.nachname}: ${phoneNumber}`
    );
  }

  onCheckboxChange(): void {
    this.applyFilter();
  }

  filterdata(): void {
    this.applyFilter();
  }

  toggleSort(field: string) {
    this.sortState[field] = this.sortState[field] === 'asc' ? 'desc' : 'asc';

    const direction = this.sortState[field];
    const sorted = [...this.filteredData].sort((a, b) => {
      let valueA = this.getSortValue(a, field);
      let valueB = this.getSortValue(b, field);

      if (valueA < valueB) return direction === 'asc' ? -1 : 1;
      if (valueA > valueB) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    this.filteredData = sorted;
    this.dataSource.data = this.filteredData;
  }

  private getSortValue(item: ApiPersonAnwesenheit, field: string): string {
    let value = '';

    switch (field) {
      case 'nachname':
        value = (item.nachname || '').toString();
        break;
      case 'vorname':
        value = (item.vorname || '').toString();
        break;
      case 'mitarbeiterart':
        value = (item.mitarbeiterart || '').toString();
        break;
      case 'anwesend':
        value = (item.anwesend || '').toString();
        break;
      default:
        value = '';
    }

    return value.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/ö/g, 'o')
      .replace(/ü/g, 'u')
      .replace(/ä/g, 'a')
      .replace(/ß/g, 'ss');
  }


  getSortIcon(column: string): string {
    if (this.sortState[column] === 'asc') {
      return 'keyboard_arrow_up';
    } else if (this.sortState[column] === 'desc') {
      return 'keyboard_arrow_down';
    }
    return 'swap_vert';
  }

}


