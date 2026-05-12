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
import { MatCheckboxModule } from '@angular/material/checkbox';

import { NachverrechnungService } from '../../../services/nachverrechnung.service';
import { NavigationRefreshService } from '../../../services/navigation-refresh.service';
import { ApiPerson } from '../../../models/ApiPerson';

@Component({
  selector: 'app-nachverrechnung-list',
  standalone: true,
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
  templateUrl: './nachverrechnung-list.component.html',
  styleUrls: ['./nachverrechnung-list.component.scss'],
})
export class NachverrechnungListComponent implements OnInit, OnDestroy {
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

  activeSortColumn: string = 'nachname';
  sortDirection: 'asc' | 'desc' = 'asc';
  sortInteracted: boolean = false;
  selectedRowId: string | null = null;

  private static savedState: {
    searchTerm: string;
    showInactive: boolean;
    activeSortColumn: string;
    sortDirection: 'asc' | 'desc';
    sortInteracted: boolean;
    selectedRowId: string | null;
  } | null = null;
  private static routerSubInstalled = false;
  private static readonly SEARCH_DEBOUNCE_MS = 250;
  private refreshSub?: Subscription;
  private searchSub?: Subscription;
  private searchInput$ = new Subject<void>();

  constructor(
    private router: Router,
    private nachverrechnungService: NachverrechnungService,
    private host: ElementRef<HTMLElement>,
    private refreshService: NavigationRefreshService,
  ) {
    if (!NachverrechnungListComponent.routerSubInstalled) {
      NachverrechnungListComponent.routerSubInstalled = true;
      this.router.events
        .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
        .subscribe((e) => {
          if (!/^\/calculation(?:\/|$)/.test(e.urlAfterRedirects)) {
            NachverrechnungListComponent.savedState = null;
          }
        });
    }

    const saved = NachverrechnungListComponent.savedState;
    if (saved) {
      this.searchTerm = saved.searchTerm;
      this.showInactive = saved.showInactive;
      this.activeSortColumn = saved.activeSortColumn;
      this.sortDirection = saved.sortDirection;
      this.sortInteracted = saved.sortInteracted;
      this.selectedRowId = saved.selectedRowId;
    }

    this.refreshSub = this.refreshService.refresh$.subscribe((route) => {
      if (route === '/calculation') {
        this.resetAndReload();
      }
    });
  }

  ngOnInit(): void {
    this.searchSub = this.searchInput$
      .pipe(debounceTime(NachverrechnungListComponent.SEARCH_DEBOUNCE_MS))
      .subscribe(() => {
        this.applyFilter();
      });

    this.loadPersonenData();
  }

  ngOnDestroy(): void {
    NachverrechnungListComponent.savedState = {
      searchTerm: this.searchTerm,
      showInactive: this.showInactive,
      activeSortColumn: this.activeSortColumn,
      sortDirection: this.sortDirection,
      sortInteracted: this.sortInteracted,
      selectedRowId: this.selectedRowId,
    };
    this.refreshSub?.unsubscribe();
    this.searchSub?.unsubscribe();
    this.searchInput$.complete();
  }

  private resetAndReload(): void {
    this.searchTerm = '';
    this.showInactive = false;
    this.activeSortColumn = 'nachname';
    this.sortDirection = 'asc';
    this.sortInteracted = false;
    this.selectedRowId = null;
    NachverrechnungListComponent.savedState = null;
    this.loadPersonenData();
  }

  loadPersonenData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.nachverrechnungService.getPersonen().subscribe({
      next: (response) => {
        this.attendanceData = response.body ?? [];
        this.applyFilter();
        this.isLoading = false;
        this.scrollToSelectedRow();
      },
      error: (error) => {
        console.error('Error loading personen:', error);
        this.errorMessage = 'Fehler beim Laden der Daten';
        this.isLoading = false;
      },
    });
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
      if (field !== 'aktiv') {
        const aktivA = a.aktiv ? 0 : 1;
        const aktivB = b.aktiv ? 0 : 1;
        if (aktivA !== aktivB) return aktivA - aktivB;
      }

      const valueA = this.getSortValue(a, field);
      const valueB = this.getSortValue(b, field);

      if (valueA < valueB) return direction === 'asc' ? -1 : 1;
      if (valueA > valueB) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  toggleSort(field: string): void {
    if (this.activeSortColumn === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.activeSortColumn = field;
      this.sortDirection = 'asc';
    }
    this.sortInteracted = true;
    this.filteredData = this.applySorting(this.filteredData);
    this.dataSource.data = this.filteredData;
  }

  private getSortValue(item: ApiPerson, field: string): string {
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
      .replace(/[̀-ͯ]/g, '')
      .replace(/ö/g, 'o')
      .replace(/ü/g, 'u')
      .replace(/ä/g, 'a')
      .replace(/ß/g, 'ss');
  }

  getSortIcon(column: string): string {
    if (this.activeSortColumn !== column) return '';
    if (column === 'nachname' && !this.sortInteracted) return '';
    return this.sortDirection === 'asc' ? 'keyboard_arrow_up' : 'keyboard_arrow_down';
  }

  selectRow(row: ApiPerson): void {
    this.selectedRowId = row.id ?? null;
  }

  goToDetails(row: ApiPerson): void {
    this.selectedRowId = row.id ?? null;
    this.router.navigate(['/calculation', row.id]);
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
