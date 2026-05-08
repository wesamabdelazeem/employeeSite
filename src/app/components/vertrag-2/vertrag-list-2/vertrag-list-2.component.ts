import { Component, ViewChild, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { VertraegeService } from '../../../services/vertraege.service';
import { NavigationRefreshService } from '../../../services/navigation-refresh.service';
import { ApiVertrag } from '../../../models/ApiVertrag';

@Component({
  selector: 'app-vertrag-list-2',
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSortModule,
    MatMenuModule,
    MatTooltipModule,
  ],
  templateUrl: './vertrag-list-2.component.html',
  styleUrl: './vertrag-list-2.component.scss',
})
export class VertragList2Component implements AfterViewInit, OnDestroy {
  @ViewChild(MatSort) sort!: MatSort;
  dataSource = new MatTableDataSource<ApiVertrag>([]);

  vertraege: ApiVertrag[] = [];
  searchTerm = '';
  showInactive = false;
  displayedColumns: string[] = ['vertragsname', 'zusatz', 'org-Einheit', 'geplan', 'verbrauchtDate'];

  /**
   * In-memory state that survives detail-back navigation but NOT a round-trip
   * to a different component. Static so it persists across this component's
   * own destroy/recreate cycle when navigating to /vertraege-2/:id and back.
   * Cleared via Router events (nav away from /vertraege-2) and via the
   * NavigationRefreshService (sidebar "Verträge" click).
   */
  private static savedState: {
    searchTerm: string;
    showInactive: boolean;
    activeSortColumn: string | null;
    sortState: { [key: string]: 'asc' | 'desc' };
    selectedRowId: string | null;
  } | null = null;
  private static routerSubInstalled = false;
  private refreshSub?: Subscription;

  selectedRowId: string | null = null;
  activeSortColumn: string | null = null;

  sortState: { [key: string]: 'asc' | 'desc' } = {
    vertragsname: 'asc',
    zusatz: 'asc',
    geplan: 'desc',
    'org-Einheit': 'asc',
    verbrauchtDate: 'desc',
  };

  constructor(
    private vertraegeService: VertraegeService,
    private router: Router,
    private host: ElementRef<HTMLElement>,
    private refreshService: NavigationRefreshService,
  ) {
    
    if (!VertragList2Component.routerSubInstalled) {
      VertragList2Component.routerSubInstalled = true;
      this.router.events
        .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
        .subscribe((e) => {
          if (!/^\/vertraege-2(?:\/|$)/.test(e.urlAfterRedirects)) {
            VertragList2Component.savedState = null;
          }
        });
    }

    // Restore state from the previous instance (back-arrow from detail).
    const saved = VertragList2Component.savedState;
    if (saved) {
      this.searchTerm = saved.searchTerm;
      this.showInactive = saved.showInactive;
      this.activeSortColumn = saved.activeSortColumn;
      this.sortState = { ...this.sortState, ...saved.sortState };
      this.selectedRowId = saved.selectedRowId;
    }

    this.loadVertraege();

    // Sidebar click on "Verträge" — refresh from the top, even if the URL
    // didn't actually change.
    this.refreshSub = this.refreshService.refresh$.subscribe((route) => {
      if (route === '/vertraege-2') {
        this.resetAndReload();
      }
    });
  }

  ngOnDestroy(): void {
    // Persist current view state for the back-arrow trip from the detail page.
    VertragList2Component.savedState = {
      searchTerm: this.searchTerm,
      showInactive: this.showInactive,
      activeSortColumn: this.activeSortColumn,
      sortState: { ...this.sortState },
      selectedRowId: this.selectedRowId,
    };
    this.refreshSub?.unsubscribe();
  }

  private loadVertraege(): void {
    this.vertraegeService.getVertraege().subscribe({
      next: (data) => {
        this.vertraege = this.sortData(data ?? []);
        this.filterData();
        if (this.activeSortColumn) {
          this.applySort(this.activeSortColumn);
        }
        this.scrollToSelectedRow();
      },
      error: (err) => {
        console.error('Error fetching vertraege list:', err);
      },
    });
  }

  private resetAndReload(): void {
    this.searchTerm = '';
    this.showInactive = false;
    this.activeSortColumn = null;
    this.selectedRowId = null;
    VertragList2Component.savedState = null;
    this.loadVertraege();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item: ApiVertrag, property: string): string | number => {
      switch (property) {
        case 'vertragsname':
          return (item.vertragsname ?? '').toString().toLowerCase();
        case 'zusatz':
          return (item.vertragszusatz ?? '').toString().toLowerCase();
        case 'geplan':
          return parseFloat(item.stundenGeplant ?? '') || 0;
        case 'org-Einheit':
          return (item.vertragsverantwortlicher?.organisationseinheit?.kurzBezeichnung ?? '')
            .toString()
            .toLowerCase();
        case 'verbrauchtDate':
          return parseFloat(item.stundenGebucht ?? '') || 0;
        default:
          return ((item as Record<string, unknown>)[property] ?? '').toString().toLowerCase();
      }
    };
  }

  sortData(data: ApiVertrag[]): ApiVertrag[] {
    return [...data].sort((a, b) => {
      const nameA = a.vertragsname?.toLowerCase() || '';
      const nameB = b.vertragsname?.toLowerCase() || '';
      return nameA.localeCompare(nameB);
    });
  }

  toggleSort(field: string) {
    if (this.activeSortColumn === field) {
      this.sortState[field] = this.sortState[field] === 'asc' ? 'desc' : 'asc';
    }
    this.activeSortColumn = field;
    this.applySort(field);
  }

  private applySort(field: string) {
    const direction = this.sortState[field];
    const sorted = [...this.dataSource.data].sort((a, b) => {
      const valueA = this.getSortValue(a, field);
      const valueB = this.getSortValue(b, field);

      if (valueA < valueB) return direction === 'asc' ? -1 : 1;
      if (valueA > valueB) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    this.dataSource.data = sorted;
  }

  private getSortValue(item: ApiVertrag, field: string): string | number {
    switch (field) {
      case 'vertragsname':
        return (item.vertragsname ?? '').toString().toLowerCase();
      case 'zusatz':
        return (item.vertragszusatz ?? '').toString().toLowerCase();
      case 'geplan':
        return parseFloat(item.stundenGeplant ?? '') || 0;
      case 'org-Einheit':
        return (item.vertragsverantwortlicher?.organisationseinheit?.kurzBezeichnung ?? '')
          .toString()
          .toLowerCase();
      case 'verbrauchtDate':
        return parseFloat(item.stundenGebucht ?? '') || 0;
      default:
        return ((item as Record<string, unknown>)[field] ?? '').toString().toLowerCase();
    }
  }

  filterData() {
    const term = this.searchTerm.toLowerCase();
    const filtered = this.vertraege.filter((p) => {
      const matchesSearch =
        (p.vertragsname || '').toLowerCase().includes(term) ||
        (p.vertragszusatz || '').toLowerCase().includes(term) ||
        (p.vertragsverantwortlicher?.organisationseinheit?.kurzBezeichnung || '')
          .toLowerCase()
          .includes(term);
      const matchesActiveStatus = this.showInactive ? true : p.aktiv !== false;
      return matchesSearch && matchesActiveStatus;
    });
    this.dataSource.data = filtered;
    if (this.activeSortColumn) {
      this.applySort(this.activeSortColumn);
    }
  }

  onCheckboxChange() {
    this.filterData();
  }

  clearSearch() {
    this.searchTerm = '';
    this.filterData();
  }

  addProduct(): void {
    this.router.navigate(['/vertraege-2/new']);
  }

  selectRow(row: ApiVertrag): void {
    this.selectedRowId = row.id ?? null;
  }

  goToDetails(row: ApiVertrag) {
    this.selectedRowId = row.id ?? null;
    this.router.navigate(['/vertraege-2', row.id], {
      state: { produktData: row },
    });
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
