import {Component, OnInit, OnDestroy, Renderer2, inject, ElementRef} from '@angular/core';
import { CommonModule } from '@angular/common';
 import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Router } from '@angular/router';
import { StempelzeitService } from '../../../services/stempelzeit.service';
import {ApiPerson} from '../../../models/ApiPerson';
import {EnumService} from '../../../services/utils/enum.service';
import {MatListItemIcon} from '@angular/material/list';
import {MatTooltipModule} from '@angular/material/tooltip';
import {PersonenService} from '../../../services/personen.service';
import {HttpResponse} from '@angular/common/http';
import {AppConstants} from '../../../models/app-constants';
import {StatusPanelService} from '../../../services/utils/status-panel-status.service';
import {filter} from 'rxjs/operators';
import {Subject, takeUntil} from 'rxjs';
import {NavigationRefreshService} from '../../../services/navigation-refresh.service';
//import { Person } from '../../../models/person';

/*
interface Employee {
  id?: number;
  famName: string;
  vorName: string;
  mita: string;
  aktiv: boolean;
  anwesend?: string;
  logoff?: string;
  abwesenheitVorhanden?: boolean;
}
*/

@Component({
  selector: 'app-stempelzeit-list-2',
  imports: [FormsModule,
    MatTableModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatMenuModule,
    MatDialogModule,
    CommonModule,
    FlexLayoutModule,
    MatCheckboxModule,
    MatTooltipModule ,
  ],
  templateUrl: './stempelzeit-list-2.component.html',
  styleUrl: './stempelzeit-list-2.component.scss'
})
export class StempelzeitList2Component {
  stempelzeitService = inject(StempelzeitService);
  personenService = inject(PersonenService);
  statusPanelService = inject(StatusPanelService);
  navigationRefreshService = inject(NavigationRefreshService);

  renderer= inject(Renderer2);
  router= inject(Router);
  hostElement = inject(ElementRef<HTMLElement>);


  private destroy$ = new Subject<void>();

  displayedColumns: string[] = [
    'icon',
    'nachname',
    'vorname',
    'mitarbeiterart',
  ];

  persons: ApiPerson[] = [];
  filteredData: ApiPerson[] = [];
  dataSource = new MatTableDataSource<ApiPerson>();
  searchTerm: string = '';
  showInactive: boolean = false;
  showSideMenu: boolean = false;
  sideMenuType: 'phone' | 'info' | null = null;
  selectedPerson: ApiPerson | null = null;
  selectedRowId: string | number | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';

  /** Single-click vs. double-click disambiguation timer. */
  private clickTimeout: any = null;
  /** Static cache that survives in-app navigation but resets on a full
   *  page refresh (because a refresh re-evaluates the JS bundle). This
   *  is what gives us "remember state on Back" without making the
   *  state sticky across reloads. */
  private static lastSelectedRowId: string | number | null = null;
  private static lastShowInactive = false;

  sortState: { [key: string]: 'asc' | 'desc' } = {
    nachname: 'asc',
    vorname: 'asc',
    mitarbeiterart: 'asc'
  };

  ngOnInit(): void {
    this.restoreSelectedRowId();
    this.showInactive = StempelzeitList2Component.lastShowInactive;
    this.loadDataFromServer();
    this.navigationRefreshService.refresh$
      .pipe(
        filter(route => route === '/stempelzeiten'),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.loadDataFromServer();
      });
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy called', new Date().toISOString());

    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDataFromServer() {
    this.isLoading = true;
    this.errorMessage = '';
    const startTime = Date.now();

    this.personenService.getAllPersons__('false', 'false').subscribe({
      next: (response: HttpResponse<ApiPerson[]>) => {
        const duration = Date.now() - startTime;
        this.persons = this.applySorting(response.body!);
        this.applyFilter();
        this.isLoading = false;
        this.statusPanelService.addMessageRequest(
          AppConstants.MSG_PERSONEN_LOADED_SUCCESS, 'GET', duration, response
        );
      },
      error: (error) => {
        const duration = Date.now() - startTime;
        this.errorMessage = 'Fehler beim Laden der Daten';
        this.isLoading = false;
        this.statusPanelService.addMessageRequest(
          AppConstants.MSG_PERSONEN_LOADED_ERROR, 'GET', duration, error
        );
      }
    });

    /*
     this.stempelzeitService.getPersons_().subscribe({
      next: (data : ApiPerson[]) => {
        this.persons = this.applySorting(data); // this.transformData(data);
        this.applyFilter();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading data from JSON:', error);
        this.errorMessage = 'Fehler beim Laden der Daten';
        this.isLoading = false;
      }
    });
     */
  }

  onCheckboxChange(): void {
    StempelzeitList2Component.lastShowInactive = this.showInactive;
    this.applyFilter();
  }

  filterdata(): void {
    this.applyFilter();
  }

 applyFilter(): void {
  let filtered = [...this.persons];
  filtered = filtered.filter(person => person.portalUser);
   if (this.searchTerm) {
    const filterValue = this.searchTerm.toLowerCase();
    filtered = filtered.filter((item: ApiPerson) =>
      (item.nachname || '').toString().toLowerCase().includes(filterValue) ||
      (item.vorname || '').toString().toLowerCase().includes(filterValue) ||
      (item.mitarbeiterart || '').toString().toLowerCase().includes(filterValue)
    );
  }

  if (!this.showInactive) {
     filtered = filtered.filter(item => item.aktiv === true);
  }


  // Apply current sort to the filtered data
  this.filteredData = this.applySorting(filtered);
  this.dataSource.data = this.filteredData;

  // After the table renders, bring the previously-selected row into view.
  this.scrollToSelectedRow();
}

  /** Scroll the previously-selected row into view inside the
   *  `.table-container` only — never the outer page — so the page/table
   *  headers stay visible. No-op if no row is selected or it's not
   *  currently in the filtered set. */
  private scrollToSelectedRow(): void {
    if (this.selectedRowId === null || this.selectedRowId === undefined) return;
    requestAnimationFrame(() => {
      const root = this.hostElement.nativeElement as HTMLElement;
      const escaped = String(this.selectedRowId).replace(/"/g, '\\"');
      const row = root.querySelector<HTMLElement>(
        `tr.list-row[data-row-id="${escaped}"]`
      );
      const container = root.querySelector<HTMLElement>('.table-container');
      if (!row || !container) return;
      const rowTop = row.offsetTop;
      const target = rowTop - (container.clientHeight - row.clientHeight) / 2;
      container.scrollTop = Math.max(0, target);
    });
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
  getRowClass(row: ApiPerson): string {
    const classes: string[] = [];
    if (row.aktiv === false) classes.push('inactive-row');
    if (this.isRowSelected(row)) classes.push('selected-row');
    return classes.join(' ');
  }

  isRowSelected(row: ApiPerson): boolean {
    return (
      this.selectedRowId !== null &&
      row.id !== undefined &&
      String(row.id) === String(this.selectedRowId)
    );
  }

  /**
   * Single click selects the row (without navigating). A pending timer is
   * cleared by `onRowDblClick` if the user double-clicks within 250 ms,
   * which lets dblclick win and route to the detail page.
   */
  onRowClick(row: ApiPerson): void {
    if (this.clickTimeout) {
      clearTimeout(this.clickTimeout);
      this.clickTimeout = null;
    }
    this.clickTimeout = setTimeout(() => {
      this.clickTimeout = null;
      this.selectRow(row);
    }, 250);
  }

  onRowDblClick(row: ApiPerson): void {
    if (this.clickTimeout) {
      clearTimeout(this.clickTimeout);
      this.clickTimeout = null;
    }
    this.selectRow(row);
    this.goToDetails(row);
  }

  private selectRow(row: ApiPerson): void {
    this.selectedRowId = row.id ?? null;
    StempelzeitList2Component.lastSelectedRowId = this.selectedRowId;
  }

  private restoreSelectedRowId(): void {
    this.selectedRowId = StempelzeitList2Component.lastSelectedRowId;
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



  private getSortValue(item: ApiPerson, field: string): string {
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
    default:
      value = (item.nachname || '').toString();
  }

  return value.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ö/g, 'o')
    .replace(/ü/g, 'u')
    .replace(/ä/g, 'a')
    .replace(/ß/g, 'ss');
}


  getStatusTooltipText(person : ApiPerson) : string{
    return person.aktiv ? 'Aktiv' : 'Inaktiv';
  }
 getSortIcon(column: string): string {
    if (this.sortState[column] === 'asc') {
      return 'keyboard_arrow_up';
    } else if (this.sortState[column] === 'desc') {
      return 'keyboard_arrow_down';
    }
    return 'swap_vert';
  }


 goToDetails(row: ApiPerson): void {
  console.log('Navigate to details:', row);

  if (row.id) {
   // this.router.navigate(['/stempelzeit', row.id]);
    this.router.navigate(['/stempelzeiten', row.id], { state: { selectedPerson : row } });
  } else {
    console.error('Employee ID is missing');
  }
}


  toggleSideMenu(type: 'phone' | 'info'): void {
    if (this.showSideMenu && this.sideMenuType === type) {
      this.showSideMenu = false;
      this.sideMenuType = null;
      this.selectedPerson = null;
    } else {
      this.showSideMenu = true;
      this.sideMenuType = type;
    }
  }



  getStatusIcon(person: ApiPerson){
    if(person.aktiv){
      return 'mdi-check';
    }else{
      return 'mdi-close';
    }
  }






  callEmployee(person: ApiPerson, event?: Event): void {
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

    this.selectedPerson = person;
  }


  protected readonly EnumService = EnumService;
}
