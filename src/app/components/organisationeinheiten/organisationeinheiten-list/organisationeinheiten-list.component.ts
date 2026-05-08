import { Component, ElementRef, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
//import { Datalistorganizationanc } from '../../../models/datalistorganizationanc';
import { Router } from '@angular/router';
// import { SharedDataServiceService } from '../services/shareddataservice';
 import { ErrorHandlingService } from '../../../services/error-handling.service';
import {OrganisationseinheitService} from '../../../services/organisationseinheit.service';
import {ApiOrganisationseinheit} from '../../../models/ApiOrganisationseinheit';

@Component({
  selector: 'app-organisationeinheiten-list',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatTooltipModule,
  ],
  templateUrl: './organisationeinheiten-list.component.html',
  styleUrl: './organisationeinheiten-list.component.scss'
})
export class OrganisationeinheitenListComponent {


  @Output() organisationseinheitSelected = new EventEmitter<string>();
  dataSource: MatTableDataSource<ApiOrganisationseinheit> = new MatTableDataSource();
  includeInactive: boolean = false;
  displayedColumns: string[] = [
    'kurzbezeichnung',
    'bezeichnung',
    'leitung',
    'uebergeordneteEinheit',
    'gueltigVon',
    'gueltigBis',
  ];
  searchTerm: string = '';
  isWhiteBg: boolean = true;
  datalistoftaple: ApiOrganisationseinheit[] = [];
  selectedRows: ApiOrganisationseinheit[] = [];

  private static readonly LAST_ROW_KEY = 'orgeinheiten.lastRowId';
  selectedRowId: string | null = null;

  sortState: { [key: string]: 'asc' | 'desc' | '' } = {
    kurzbezeichnung: '',
    bezeichnung: '',
    leitung: '',
    uebergeordneteEinheit: '',
    gueltigVon: '',
    gueltigBis: '',
  };
  activeSortColumn: string = '';

  constructor(
    private OrganisationseinheitService: OrganisationseinheitService,
    private router: Router,
    private errorHandlingService : ErrorHandlingService,
    private host: ElementRef<HTMLElement>,
  //  private sharedDataService: SharedDataServiceService
  ) { }

  ngOnInit(): void {
    this.selectedRowId = sessionStorage.getItem(OrganisationeinheitenListComponent.LAST_ROW_KEY);

    this.OrganisationseinheitService.getActiveData().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.scrollToSelectedRow();
      },
      error: (err) => {
        this.errorHandlingService.handleAppError(err);
      }
    });

/*
    this.dataSource.filterPredicate = (data: ApiOrganisationseinheit, filter: string) => {
      return (
        data.kurzBezeichnung?.toLowerCase().includes(filter) ||
        data.bezeichnung?.toLowerCase().includes(filter)
      );
    };


 */
    this.dataSource.filterPredicate = (data: ApiOrganisationseinheit, filter: string) => {
      const filterLower = filter.trim().toLowerCase();

      // Safely handle null/undefined properties with nullish coalescing
      const matchesKurz = (data.kurzBezeichnung ?? '').toLowerCase().includes(filterLower);
      const matchesBez = (data.bezeichnung ?? '').toLowerCase().includes(filterLower);

      return matchesKurz || matchesBez;
    };
    //  this.reloadData();
  }

  applyFilter(): void {
    this.dataSource.filter = this.searchTerm.trim().toLowerCase();
  }

  resetFilter(): void {
    this.searchTerm = '';
    this.applyFilter();
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('de-AT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  createOrganisationseinheit(): void {
    this.router.navigate(['/organisationseinheiten/new']);
  }

  toggleInactive(): void {

    if (this.includeInactive) {
      //   this.dataSource.data = this.dataoforganizationlistService.getAllData();

      this.OrganisationseinheitService.getAllData().subscribe(data => {
        this.dataSource.data = data;
        console.log('Active data:', data.length);

      });

    } else {
      //this.dataSource.data = this.dataoforganizationlistService.getActiveData();
      this.OrganisationseinheitService.getActiveData().subscribe(data => {
        this.dataSource.data = data;
        console.log('Inactive data:', data.length);

      });
    }

    this.applyFilter();
  }







  reloadData() {
    // this.dataSource.data = this.dataoforganizationlistService.getActiveData();

    this.OrganisationseinheitService.getActiveData().subscribe({
      next: (data) => {
        this.dataSource.data = data;
      },
      error: (err) => {
        this.errorHandlingService.handleAppError(err);
      }
    });
  }

  /**
   * Scrolls the previously-selected row into view by adjusting only the
   * table-container's scrollTop. Using scrollIntoView would also scroll the
   * page and hide the header — this scopes the scroll to the inner container.
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

  selectRow(row: ApiOrganisationseinheit): void {
    this.selectedRows = [row];
    this.selectedRowId = row.id ?? null;
    if (row.id) {
      sessionStorage.setItem(OrganisationeinheitenListComponent.LAST_ROW_KEY, row.id);
    }
  }

  goToDetails(row: ApiOrganisationseinheit): void {
    this.selectedRows = [row];
    this.selectedRowId = row.id ?? null;
    if (row.id) {
      sessionStorage.setItem(OrganisationeinheitenListComponent.LAST_ROW_KEY, row.id);
    }
    this.router.navigate(['/organisationseinheiten', row.id], {
      state: { selectedOrganisation: row }
    });
  }

  getStatusClass(row?: ApiOrganisationseinheit): string {

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];

    const gueltigbisDate = new Date(row?.gueltigBis!);
    gueltigbisDate.setHours(0, 0, 0, 0);
    const isValid = gueltigbisDate.getTime() >= today.getTime();

    if(isValid){
      return 'status-active';
    }else{
      return 'status-inactive';
    }


  }

  toggleSort(column: string): void {
    if (this.activeSortColumn !== column) {
      Object.keys(this.sortState).forEach(k => this.sortState[k] = '');
      this.sortState[column] = 'desc';
      this.activeSortColumn = column;
    } else {
      this.sortState[column] = this.sortState[column] === 'desc' ? 'asc' : 'desc';
    }
    this.applySort();
  }

  getSortIcon(column: string): string {
    if (this.sortState[column] === 'desc') return 'keyboard_arrow_down';
    return 'keyboard_arrow_up';
  }

  private applySort(): void {
    const column = this.activeSortColumn;
    if (!column) return;
    const direction = this.sortState[column];
    if (!direction) return;

    const data = [...this.dataSource.data];
    data.sort((a, b) => {
      const valA = this.getSortValue(a, column);
      const valB = this.getSortValue(b, column);
      if (valA < valB) return direction === 'asc' ? -1 : 1;
      if (valA > valB) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    this.dataSource.data = data;
  }

  private getSortValue(row: ApiOrganisationseinheit, column: string): string | number {
    switch (column) {
      case 'kurzbezeichnung':
        return (row.kurzBezeichnung ?? '').toLowerCase();
      case 'bezeichnung':
        return (row.bezeichnung ?? '').toLowerCase();
      case 'leitung':
        return `${row.leiter?.nachname ?? ''} ${row.leiter?.vorname ?? ''}`.toLowerCase();
      case 'uebergeordneteEinheit':
        return (row.parent?.kurzBezeichnung ?? '').toLowerCase();
      case 'gueltigVon':
        return row.gueltigVon ? new Date(row.gueltigVon).getTime() : 0;
      case 'gueltigBis':
        return row.gueltigBis ? new Date(row.gueltigBis).getTime() : 0;
      default:
        return '';
    }
  }

}
