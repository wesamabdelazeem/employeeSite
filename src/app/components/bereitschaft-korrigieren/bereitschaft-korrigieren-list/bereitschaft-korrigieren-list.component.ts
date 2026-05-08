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
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
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
   * Persisted in sessionStorage so view state survives the detail round-trip
   * AND a browser refresh of this tab. Cleared via the sidebar refresh service.
   */
  private static readonly STORAGE_KEY = 'bereitschaftkorrigieren-list-state';
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
    const saved = this.readSavedState();
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

  private readSavedState(): {
    searchTerm: string;
    showInactive: boolean;
    activeSortColumn: string;
    sortDirection: 'asc' | 'desc';
    selectedRowId: string | null;
  } | null {
    try {
      const raw = sessionStorage.getItem(BereitschaftKorrigierenListComponent.STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  private writeSavedState(): void {
    try {
      sessionStorage.setItem(
        BereitschaftKorrigierenListComponent.STORAGE_KEY,
        JSON.stringify({
          searchTerm: this.searchTerm,
          showInactive: this.showInactive,
          activeSortColumn: this.activeSortColumn,
          sortDirection: this.sortDirection,
          selectedRowId: this.selectedRowId,
        }),
      );
    } catch {
      // ignore quota / disabled-storage errors
    }
  }

  ngOnInit(): void {
    this.searchSub = this.searchInput$
      .pipe(debounceTime(BereitschaftKorrigierenListComponent.SEARCH_DEBOUNCE_MS))
      .subscribe(() => {
        this.applyFilter();
        this.writeSavedState();
      });

    this.loadPersonenData();
  }

  private resetAndReload(): void {
    this.searchTerm = '';
    this.showInactive = false;
    this.activeSortColumn = '';
    this.sortDirection = 'asc';
    this.selectedRowId = null;
    try {
      sessionStorage.removeItem(BereitschaftKorrigierenListComponent.STORAGE_KEY);
    } catch {
      // ignore
    }
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
    this.writeSavedState();
    this.refreshSub?.unsubscribe();
    this.searchSub?.unsubscribe();
    this.searchInput$.complete();
  }
  onCheckboxChange(): void {
    this.applyFilter();
    this.writeSavedState();
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
  this.writeSavedState();
}


  private getSortValue(item:ApiPerson, field: string): string {
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
