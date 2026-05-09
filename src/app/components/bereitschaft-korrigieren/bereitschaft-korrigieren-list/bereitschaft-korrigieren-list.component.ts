import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { NavigationEnd, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import { BereitschaftKorrigierenService } from '../../../services/bereitschaft-korrigieren.service';
import { NavigationRefreshService } from '../../../services/navigation-refresh.service';
import { ApiPerson } from '../../../models/ApiPerson';
import { MatCheckboxModule } from '@angular/material/checkbox';
@Component({
  selector: 'app-bereitschaft-korrigieren-list',
  imports: [
    FormsModule,
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
   ],
  templateUrl: './bereitschaft-korrigieren-list.component.html',
  styleUrl: './bereitschaft-korrigieren-list.component.scss'
})
export class BereitschaftKorrigierenListComponent implements OnInit,OnDestroy{

  displayedColumns: string[] = [
    'icon',
    'nachname',
    'vorname',
    'mitarbeiterart',
  ];

  attendanceData: ApiPerson[] = [];
  filteredData: ApiPerson[] = [];
  dataSource = new MatTableDataSource<ApiPerson>();
  searchTerm: string = '';
  showInactive: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';

  activeSortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  selectedRowId: string | null = null;

  /**
   * In-memory state that survives detail-back navigation but NOT a round-trip
   * to a different component. Static so it persists across this component's
   * own destroy/recreate cycle when navigating to /bereitschaftkorrigieren/:id and back.
   * Cleared via Router events (nav away from /bereitschaftkorrigieren) and via the
   * NavigationRefreshService (sidebar click).
   */
  private static savedState: {
    searchTerm: string;
    showInactive: boolean;
    activeSortColumn: string;
    sortDirection: 'asc' | 'desc';
    selectedRowId: string | null;
  } | null = null;
  private static routerSubInstalled = false;
  private static readonly SEARCH_DEBOUNCE_MS = 250;
  private refreshSub?: Subscription;
  private searchSub?: Subscription;
  private searchInput$ = new Subject<void>();

  constructor(
    private router: Router,
    private bereitschaftKorrigierenService: BereitschaftKorrigierenService,
    private host: ElementRef<HTMLElement>,
    private refreshService: NavigationRefreshService,
  ) {
    if (!BereitschaftKorrigierenListComponent.routerSubInstalled) {
      BereitschaftKorrigierenListComponent.routerSubInstalled = true;
      this.router.events
        .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
        .subscribe((e) => {
          if (!/^\/bereitschaftkorrigieren(?:\/|$)/.test(e.urlAfterRedirects)) {
            BereitschaftKorrigierenListComponent.savedState = null;
          }
        });
    }

    // Restore state from the previous instance (back-arrow from detail).
    const saved = BereitschaftKorrigierenListComponent.savedState;
    if (saved) {
      this.searchTerm = saved.searchTerm;
      this.showInactive = saved.showInactive;
      this.activeSortColumn = saved.activeSortColumn;
      this.sortDirection = saved.sortDirection;
      this.selectedRowId = saved.selectedRowId;
    }

    this.refreshSub = this.refreshService.refresh$.subscribe((route) => {
      if (route === '/bereitschaftkorrigieren') {
        this.resetAndReload();
      }
    });
  }

  ngOnInit(): void {
    this.searchSub = this.searchInput$
      .pipe(debounceTime(BereitschaftKorrigierenListComponent.SEARCH_DEBOUNCE_MS))
      .subscribe(() => {
        this.applyFilter();
      });

    this.loadPersonenData();
  }

  private resetAndReload(): void {
    this.searchTerm = '';
    this.showInactive = false;
    this.activeSortColumn = '';
    this.sortDirection = 'asc';
    this.selectedRowId = null;
    BereitschaftKorrigierenListComponent.savedState = null;
    this.loadPersonenData();
  }

  loadPersonenData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.bereitschaftKorrigierenService.getPersonen().subscribe({
      next: (data) => {
        this.attendanceData = data;
        this.applyFilter();
        this.isLoading = false;
        this.scrollToSelectedRow();
      },
      error: (error) => {
        console.error('Error loading personen:', error);
        this.errorMessage = 'Fehler beim Laden der Daten';
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy(): void {
    BereitschaftKorrigierenListComponent.savedState = {
      searchTerm: this.searchTerm,
      showInactive: this.showInactive,
      activeSortColumn: this.activeSortColumn,
      sortDirection: this.sortDirection,
      selectedRowId: this.selectedRowId,
    };
    this.refreshSub?.unsubscribe();
    this.searchSub?.unsubscribe();
    this.searchInput$.complete();
  }
  onCheckboxChange(): void {
    this.applyFilter();
  }

  filterdata(): void {
    this.searchInput$.next();
  }

 applyFilter(): void {
    let filtered = [...this.attendanceData];

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

    this.filteredData = this.applySorting(filtered);
    this.dataSource.data = this.filteredData;
  }
private applySorting(data: ApiPerson[]): ApiPerson[] {
  if (!this.activeSortColumn) return data;

  const field = this.activeSortColumn;
  const direction = this.sortDirection;

  return [...data].sort((a, b) => {
    let valueA = this.getSortValue(a, field);
    let valueB = this.getSortValue(b, field);

    if (valueA < valueB) return direction === 'asc' ? -1 : 1;
    if (valueA > valueB) return direction === 'asc' ? 1 : -1;
    return 0;
  });
}
 toggleSort(field: string) {
  if (this.activeSortColumn === field) {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    this.activeSortColumn = field;
    this.sortDirection = 'asc';
  }
  this.filteredData = this.applySorting(this.filteredData);
  this.dataSource.data = this.filteredData;
}


  private getSortValue(item:ApiPerson, field: string): string {
  let value = '';

  switch (field) {
    case 'aktiv':
      value = item.aktiv ? '0' : '1';
      break;
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
    if (this.activeSortColumn !== column) return '';
    return this.sortDirection === 'asc' ? 'keyboard_arrow_up' : 'keyboard_arrow_down';
  }

  selectRow(row: ApiPerson): void {
    this.selectedRowId = row.id ?? null;
  }

  goToDetails(row: ApiPerson): void {
    this.selectedRowId = row.id ?? null;
    this.router.navigate(['/bereitschaftkorrigieren', row.id]);
  }

  private scrollToSelectedRow(): void {
    if (!this.selectedRowId) return;
    const id = this.selectedRowId;
    setTimeout(() => {
      const container = this.host.nativeElement.querySelector('.table-container') as HTMLElement | null;
      const row = this.host.nativeElement.querySelector(`[data-row-id="${id}"]`) as HTMLElement | null;
      if (!container || !row) return;
      const targetTop = row.offsetTop - (container.clientHeight - row.clientHeight) / 2;
      container.scrollTop = Math.max(0, targetTop);
    });
  }
}
