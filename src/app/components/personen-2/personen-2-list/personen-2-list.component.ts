import {AfterViewInit, Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {FormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {CommonModule} from '@angular/common';

import {MatDialogModule} from '@angular/material/dialog';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {Person} from '../../../models/person';
import {PersonenService} from '../../../services/personen.service';
import {Router} from '@angular/router';
import {DummyService} from '../../../services/dummy.service';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {ApiPerson} from '../../../models/ApiPerson';
import {ApiRolle, getApiRolleDisplayValues} from '../../../models/ApiRolle';
import {ApiMitarbeiterart, getApiMitarbeiterartDisplayValues} from '../../../models/ApiMitarbeiterart';
import {getEnumKeyByValue, transformEnum} from '../../../services/utils/enum.utils';
import {ApiZeitTyp} from '../../../models/ApiZeitTyp';
import {EnumService} from '../../../services/utils/enum.service';
import {ApiBucher} from '../../../models/ApiBucher';
import {MatTooltip} from '@angular/material/tooltip';
import {ThemeService} from '../../../services/utils/theme.service';


@Component({
  selector: 'app-personen-2-list',
  imports: [
    FormsModule,
    MatTableModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatMenuModule,
    MatCheckboxModule,

    MatDialogModule,
    CommonModule,
    FlexLayoutModule,
    MatTooltip

  ],
  templateUrl: './personen-2-list.component.html',
  styleUrl: './personen-2-list.component.scss'
})
export class Personen2ListComponent implements AfterViewInit {
  private static readonly SELECTED_ID_KEY = 'personen-list-selected-id';
  @ViewChild('personenTable', { read: ElementRef }) personenTable?: ElementRef<HTMLElement>;

  selectedPersonId: string | null = null;

  displayedColumns: string[] = [
    'iconcheck',
    'statusIcon',
    'nachname',
    'vorname',
    'mitarbeiterart',
    'gesamt',
    'geplant',
    'gebucht',
    'geplant2026',
    'rolle',

  ];

  protected readonly EnumService = EnumService;

  attendanceData: ApiPerson[] = [];
  filteredData: ApiPerson[] = [];
  dataSource = new MatTableDataSource<ApiPerson>();
  searchTerm: string = '';
  showInactive: boolean = false;
  showSideMenu: boolean = false;
  sideMenuType: 'phone' | 'info' | null = null;
  selectedEmployee: ApiPerson | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';

  sortState: { [key: string]: 'asc' | 'desc' } = {
    nachname: 'asc',        // changed from 'famName'
    vorname: 'asc',         // changed from 'vorName'
    mitarbeiterart: 'asc',  // changed from 'mita'
    gesamt: 'asc',
    geplant: 'asc',
    gebucht: 'asc',
    geplant2026: 'asc',
    rolle: 'asc'
  };
  menuOptions: any;

  constructor(
    private renderer: Renderer2,
     private router: Router,
    private personsenService : PersonenService,
    private dummyService: DummyService,
    public themeService: ThemeService
  ) { }

  ngOnInit(): void {
  //  this.loadDataFromJson();
    // Restore the last-selected row only for a single back-navigation, then
    // clear it so a page refresh (F5) does not keep the row highlighted and
    // does not force the list to jump to it on every reload.
    this.selectedPersonId = sessionStorage.getItem(Personen2ListComponent.SELECTED_ID_KEY);
    sessionStorage.removeItem(Personen2ListComponent.SELECTED_ID_KEY);
    this.loadDataFromServer();
  }

  ngAfterViewInit(): void {
    // If the table finishes rendering before data loads, scroll happens again
    // in loadDataFromServer's subscription — this is just the fallback path.
    this.scrollToSelectedRow();
  }

  private selectionScrolled = false;

  private scrollToSelectedRow(): void {
    // Only run once per component init so later data refreshes / re-renders
    // don't keep yanking the scroll position back to the selected row.
    if (!this.selectedPersonId || this.selectionScrolled) return;
    setTimeout(() => {
      const host = this.personenTable?.nativeElement ?? document;
      const row = (host as HTMLElement | Document)
        .querySelector(`[data-person-id="${this.selectedPersonId}"]`) as HTMLElement | null;
      if (row) {
        row.scrollIntoView({ block: 'center', behavior: 'auto' });
        this.selectionScrolled = true;
      }
    }, 0);
  }
  menuItems = [
    'Personenliste Alle',
    'Personenliste Aktuelle',
    'Informationen hochladen',
    'Konflikte-Erhebungs Formular hochladen'
  ];

  onMenuOptionSelected(option: string): void {
    console.log('Selected option:', option);
    // Handle the selected option
  }

  loadDataFromServer(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.personsenService.loadPersonen().subscribe({
      next: (data: ApiPerson[]) => {
        this.attendanceData = data ; // this.transformData(data);
        this.applyFilter();
        this.isLoading = false;
        this.scrollToSelectedRow();
      },
      error: (error: any) => {
        console.error('Error loading data from JSON:', error);
        this.errorMessage = 'Fehler beim Laden der Daten';
        this.isLoading = false;
      }
    });
  }

  loadDataFromJson(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.dummyService.getPersonenn().subscribe({
      next: (data: any[]) => {
        this.attendanceData = this.transformData(data);
        this.applyFilter();
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading data from JSON:', error);
        this.errorMessage = 'Fehler beim Laden der Daten';
        this.isLoading = false;
      }
    });
  }

  private transformData(data: ApiPerson[]): ApiPerson[] {
    return data.map(item => {
      const vorname = item.vorname  ;
      const nachname = item.nachname ;
      const mitarbeiterart = item.mitarbeiterart ;

      return {
        id: item.id || Math.random().toString(),
        // Required properties
        vorname: vorname,
        nachname: nachname,
        aktiv: item.aktiv !== undefined ? item.aktiv : true,
        // Optional properties with proper typing
        mitarbeiterart: mitarbeiterart,
        anwesend: 'active',
      //  logoff: item.logoff,
      //  abwesenheitVorhanden: item.abwesenheitVorhanden || false,
        // Numeric properties with proper typing
        gesamt: '0', // this.parseNumber(item.gesamt, item.stundenkontingentJaehrlich),
        geplant: '0', // this.parseNumber(item.geplant),
       gebucht: '0', // this.parseNumber(item.gebucht),
       geplant2026: '0', // this.parseNumber(item.geplant2026),
        rolle: ApiRolle.DEFAULT, // item.rolle || 'DEFAULT',
        // Other optional properties
        familienname: nachname,
        status: 'active', // item.status as 'active' | 'inactive' | undefined
      };
    });
  }

  private parseNumber(...values: any[]): number {
    for (const value of values) {
      const num = Number(value);
      if (!isNaN(num)) return num;
    }
    return 0;
  }
  ngOnDestroy(): void { }

  onCheckboxChange(): void {
    this.applyFilter();
  }

  filterdata(): void {
    this.applyFilter();
  }

  applyFilter(): void {
    let filtered = [...this.attendanceData];

    if (this.searchTerm) {
      const filterValue = this.searchTerm.toLowerCase();
      filtered = filtered.filter((item: ApiPerson) =>
        (item.nachname || '').toString().toLowerCase().includes(filterValue) ||     // changed from famName
        (item.vorname || '').toString().toLowerCase().includes(filterValue) ||      // changed from vorName
        (item.mitarbeiterart || '').toString().toLowerCase().includes(filterValue) || // changed from mita
        (item.rolle || '').toString().toLowerCase().includes(filterValue)
      );
    }

    if (!this.showInactive) {
      filtered = filtered.filter(item => item.aktiv === true);
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
      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return direction === 'asc' ? valueA - valueB : valueB - valueA;
      }

      if (valueA < valueB) return direction === 'asc' ? -1 : 1;
      if (valueA > valueB) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  getRowClass(row: Person): string {
    return row.aktiv === false ? 'inactive-row' : '';
  }

  toggleSort(field: string) {
    this.sortState[field] = this.sortState[field] === 'asc' ? 'desc' : 'asc';

    const direction = this.sortState[field];
    const sorted = [...this.filteredData].sort((a, b) => {
      let valueA = this.getSortValue(a, field);
      let valueB = this.getSortValue(b, field);

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return direction === 'asc' ? valueA - valueB : valueB - valueA;
      }

      if (valueA < valueB) return direction === 'asc' ? -1 : 1;
      if (valueA > valueB) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    this.filteredData = sorted;
    this.dataSource.data = this.filteredData;
  }

  private getSortValue(item: any, field: string): string | number {
    if (['gesamt', 'geplant', 'gebucht', 'geplant2026'].includes(field)) {
      return item[field] ?? 0;
    }

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
      case 'rolle':
        value = (item.rolle || '').toString();
        break;
      default:
        value = (item[field] || '').toString();
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

  compare(a: string | number | boolean, b: string | number | boolean, isAsc: boolean): number {
    const aStr = String(a || '').toLowerCase();
    const bStr = String(b || '').toLowerCase();

    if (aStr < bStr) return isAsc ? -1 : 1;
    if (aStr > bStr) return isAsc ? 1 : -1;
    return 0;
  }

  goToDetails(row: Person): void {
    console.log('Navigate to details:', row);

    if (row.id) {
      // Remember which row the user clicked so the list can restore focus
      // to it when they navigate back.
      this.selectedPersonId = row.id;
      sessionStorage.setItem(Personen2ListComponent.SELECTED_ID_KEY, row.id);
      this.router.navigate(['/personen-2', row.id]);
    } else {
      console.error('Person ID is missing');
    }
  }

  addNewPerson(){
    this.router.navigate(['/personen-2/neu']);
  }

  openDetailDialog(employee: Person): void {
    console.log('openDetailDialog', employee);
  }

  toggleSideMenu(type: 'phone' | 'info'): void {
    if (this.showSideMenu && this.sideMenuType === type) {
      this.showSideMenu = false;
      this.sideMenuType = null;
      this.selectedEmployee = null;
    } else {
      this.showSideMenu = true;
      this.sideMenuType = type;
    }
  }

  getStatusClass(status?: string): string {
    if (!status) return '';
    switch (status) {
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

  getIconClass(entry: ApiPerson): string {
  //  if (!entry) return 'user-active';
    if (entry.aktiv ) return 'user-active';
   // if (entry.anwesend === 'inactive') return 'user-inactive';
   //  if (entry.anwesend === 'special') return 'user-special';
    return 'user-inactive';
  }

  getActiveIcon(row : ApiPerson) : string{
    if (row.aktiv){
      return 'check';
    }else{
      return 'cancel';
    }
  }

  createColumnAbwesendBis(person: Person) {
    if (!person) return '';
    if (person.logoff) {
      try {
        const date = new Date(person.logoff);
        return isNaN(date.getTime()) ? '' : date.toLocaleString();
      } catch {
        return '';
      }
    } else {
      if (person.abwesenheitVorhanden) {
        return 'Ende der Abwesenheit unbekannt';
      } else {
        return '';
      }
    }
  }

  callEmployee(employee: ApiPerson, event?: Event): void {
    const previousCallingElements = document.querySelectorAll('.phone-list-item.calling');
    previousCallingElements.forEach((element) => {
      this.renderer.removeClass(element, 'calling');
    });

    if (event) {
      const element = event.currentTarget as HTMLElement;
      this.renderer.addClass(element, 'calling');
      setTimeout(() => {
        this.renderer.removeClass(element, 'calling');
      }, 2000);
    }

    this.selectedEmployee = employee;
  }
  getStatusIcon(entry: ApiPerson): string {
    if (!entry) return 'cancel';

   //  if(ApiBucher.FREIER_BUCHER === EnumService.transformMitarbeiterBucher(entry.bucher)){
       if(entry.geprueft){

       //  console.log('entry.bucher####: ', entry.bucher);
      return 'check_circle';

    }else{
       //console.log('entry.bucher ++++ ', entry.bucher);
      return 'help_outline'
    }

    // Green icon for active persons
  }

  getStatusIconClass(entry: ApiPerson): string {
    if (!entry) return 'status-icon-red';

    // Red for inactive
    if (entry.aktiv === false || !entry.geprueft) {
      return 'status-icon-red';
    }

    // Green for active
    return 'status-icon-green';
  }


  getTooltipText(element: ApiPerson): string {
    if (!element.deleted) {
      return 'Aktiv';
    } else {
      return 'Inaktiv';
    }
  }

}
