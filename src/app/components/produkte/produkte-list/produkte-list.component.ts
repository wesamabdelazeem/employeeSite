import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
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
import { Router } from '@angular/router';
import { ProduktService } from '../../../services/produkt.service';
import { ApiProdukt } from '../../../models/ApiProdukt';

@Component({
  selector: 'app-produkte-list',
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
  templateUrl: './produkte-list.component.html',
  styleUrl: './produkte-list.component.scss',
})
export class ProdukteListComponent implements AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  dataSource = new MatTableDataSource<ApiProdukt>([]);

  produkte: ApiProdukt[] = [];
  searchTerm = '';
  showInactive = false;
  displayedColumns: string[] = ['kurzName', 'produktname', 'start', 'ende'];

  private static readonly LAST_ROW_KEY = 'produkte.lastRowId';
  selectedRowId: string | null = null;

  listMenuItems = [
    { label: 'Produkte - Ergebnisverantwortliche', icon: 'mdi-file-pdf-box', action: 'Produkte-Ergebnisverantwortliche' },
    { label: 'Produkte - Durchführungsverantwortliche', icon: 'mdi-file-pdf-box', action: 'Produkte-Durchfuehrungsverantwortliche' },
    { label: 'Produkte - Servicemanager', icon: 'mdi-file-pdf-box', action: 'Produkte-Servicemanager' },
  ];

  sortState: { [key: string]: 'asc' | 'desc' } = {
    kurzName: 'asc',
    produktname: 'asc',
    start: 'desc',
    ende: 'desc',
  };

  constructor(
    private produktService: ProduktService,
    private router: Router,
    private host: ElementRef<HTMLElement>,
  ) {
    this.selectedRowId = sessionStorage.getItem(ProdukteListComponent.LAST_ROW_KEY);

    this.produktService.getProdukte().subscribe({
      next: (response) => {
        const data = response.body ?? [];
        this.produkte = this.sortData(data);
        this.filterData();
        this.scrollToSelectedRow();
      },
      error: (err) => {
        console.error('Error fetching produkte list:', err);
      },
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item: ApiProdukt, property: string): string | number => {
      const value = (item as Record<string, unknown>)[property];
      switch (property) {
        case 'start':
        case 'ende':
          const date = value ? new Date(value as string) : null;
          return date && !isNaN(date.getTime()) ? date.getTime() : 0;
        default:
          return (value ?? '').toString().toLowerCase();
      }
    };
  }

  onMenuAction(action: string): void {
    console.log('[ProdukteList] menu action:', action);
  }

  sortData(data: ApiProdukt[]): ApiProdukt[] {
    return [...data].sort((a, b) => {
      const nameA = a.kurzName?.toLowerCase() || '';
      const nameB = b.kurzName?.toLowerCase() || '';
      return nameA.localeCompare(nameB);
    });
  }

  toggleSort(field: string) {
    this.sortState[field] = this.sortState[field] === 'asc' ? 'desc' : 'asc';
    const direction = this.sortState[field];

    const sorted = [...this.dataSource.data].sort((a, b) => {
      const rawA = (a as Record<string, unknown>)[field];
      const rawB = (b as Record<string, unknown>)[field];
      let valueA: string | number;
      let valueB: string | number;

      if (field === 'start' || field === 'ende') {
        valueA = rawA ? new Date(rawA as string).getTime() : 0;
        valueB = rawB ? new Date(rawB as string).getTime() : 0;
      } else {
        valueA = (rawA ?? '').toString().toLowerCase();
        valueB = (rawB ?? '').toString().toLowerCase();
      }

      if (valueA < valueB) return direction === 'asc' ? -1 : 1;
      if (valueA > valueB) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    this.dataSource.data = sorted;
  }

  filterData() {
    const term = this.searchTerm.toLowerCase();
    const filtered = this.produkte.filter((p) => {
      const matchesSearch =
        (p.kurzName || '').toLowerCase().includes(term) ||
        (p.produktname || '').toLowerCase().includes(term);
      const matchesActiveStatus = this.showInactive ? true : p.aktiv !== false;
      return matchesSearch && matchesActiveStatus;
    });
    this.dataSource.data = filtered;
  }

  onCheckboxChange() {
    this.filterData();
  }

  clearSearch() {
    this.searchTerm = '';
    this.filterData();
  }

  addProduct(): void {
    this.router.navigate(['/produkte/neu']);
  }

  selectRow(row: ApiProdukt): void {
    this.selectedRowId = row.id ?? null;
    if (row.id) {
      sessionStorage.setItem(ProdukteListComponent.LAST_ROW_KEY, row.id);
    }
  }

  goToDetails(row: ApiProdukt) {
    if (row.id) {
      sessionStorage.setItem(ProdukteListComponent.LAST_ROW_KEY, row.id);
    }
    this.selectedRowId = row.id ?? null;
    this.router.navigate(['/produkte', row.id], {
      state: { produktData: row },
    });
  }

  /**
   * Scrolls the previously-selected row into view inside the table-container,
   * mirroring the behaviour of organisationeinheiten-list.
   */
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
