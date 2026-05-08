import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Router } from '@angular/router';
import { ApiPerson } from "../../../models/ApiPerson";
import { TaetigkeitenHistorischService } from '../../../services/taetigkeiten-historisch.service';

@Component({
  selector: 'app-tatigkeiten-historisch-list',
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
    MatCheckboxModule
  ],
  templateUrl: './taetigkeiten-historisch-list.component.html',
  styleUrl: './taetigkeiten-historisch-list.component.scss'
})
export class TatigkeitenHistorischListComponent implements OnInit, OnDestroy {
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

   sortState: { [key: string]: 'asc' | 'desc' } = {
     nachname: 'asc',
     vorname: 'asc',
     mitarbeiterart: 'asc'
   };

   private static readonly LAST_ROW_KEY = 'taethist.lastRowId';
   private static readonly SEARCH_KEY = 'taethist.search';
   private static readonly SHOW_INACTIVE_KEY = 'taethist.showInactive';
   private static readonly SORT_COLUMN_KEY = 'taethist.sortColumn';
   private static readonly SORT_DIRECTION_KEY = 'taethist.sortDirection';
   selectedRowId: string | null = null;
   activeSortColumn: string | null = null;

   constructor(
     private renderer: Renderer2,
     private router: Router,
     private taetigkeitenHistorischService: TaetigkeitenHistorischService,
   ) {
     this.searchTerm = sessionStorage.getItem(TatigkeitenHistorischListComponent.SEARCH_KEY) ?? '';
     this.showInactive = sessionStorage.getItem(TatigkeitenHistorischListComponent.SHOW_INACTIVE_KEY) === 'true';
     this.activeSortColumn = sessionStorage.getItem(TatigkeitenHistorischListComponent.SORT_COLUMN_KEY);
     const storedDir = sessionStorage.getItem(TatigkeitenHistorischListComponent.SORT_DIRECTION_KEY) as 'asc' | 'desc' | null;
     if (this.activeSortColumn && storedDir) {
       this.sortState[this.activeSortColumn] = storedDir;
     }
   }

   ngOnInit(): void {
     window.scrollTo(0, 0);
     this.loadDataFromServer();
   }

   loadDataFromServer(): void {
     this.isLoading = true;
     this.errorMessage = '';

     this.taetigkeitenHistorischService.getPersonen('true', 'false').subscribe({
       next: (response) => {
         const data = response.body ?? [];
         this.attendanceData = this.transformData(data);
         this.applyFilter();
         this.isLoading = false;
         this.restoreAndScrollToLastRow();
       },
       error: (error: any) => {
         console.error('Error loading persons:', error);
         this.errorMessage = 'Fehler beim Laden der Daten';
         this.isLoading = false;
       }
     });
   }

   onRowClick(row: ApiPerson): void {
     this.selectedRowId = row.id ?? null;
     if (row.id) {
       sessionStorage.setItem(TatigkeitenHistorischListComponent.LAST_ROW_KEY, row.id);
     }
   }

   private restoreAndScrollToLastRow(): void {
     const lastId = sessionStorage.getItem(TatigkeitenHistorischListComponent.LAST_ROW_KEY);
     if (!lastId) return;
     this.selectedRowId = lastId;
     setTimeout(() => {
       const el = document.querySelector(`[data-row-id="${lastId}"]`) as HTMLElement | null;
       const container = document.querySelector('.table-container') as HTMLElement | null;
       if (!el || !container) return;
       const elRect = el.getBoundingClientRect();
       const containerRect = container.getBoundingClientRect();
       container.scrollTop += (elRect.top - containerRect.top) - (containerRect.height / 2) + (elRect.height / 2);
     }, 0);
   }

  private transformData(data: ApiPerson[]): ApiPerson[] {
   return data.map(item => ({
     ...item,
     vorname: item.vorname ?? undefined,
     nachname: item.nachname ?? undefined,
     mitarbeiterart: item.mitarbeiterart ?? undefined,
     rolle: item.rolle ?? undefined
   }));
 }


   ngOnDestroy(): void {}
   onCheckboxChange(): void {
     sessionStorage.setItem(TatigkeitenHistorischListComponent.SHOW_INACTIVE_KEY, String(this.showInactive));
     this.applyFilter();
   }

   filterdata(): void {
     sessionStorage.setItem(TatigkeitenHistorischListComponent.SEARCH_KEY, this.searchTerm);
     this.applyFilter();
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
   const sortedField = this.activeSortColumn;
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
     return row.aktiv === false ? 'inactive-row' : '';
   }
  toggleSort(field: string) {
   if (this.activeSortColumn === field) {
     this.sortState[field] = this.sortState[field] === 'asc' ? 'desc' : 'asc';
   }
   this.activeSortColumn = field;
   sessionStorage.setItem(TatigkeitenHistorischListComponent.SORT_COLUMN_KEY, field);
   sessionStorage.setItem(TatigkeitenHistorischListComponent.SORT_DIRECTION_KEY, this.sortState[field]);

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
     if (this.sortState[column] === 'asc') {
       return 'keyboard_arrow_up';
     } else if (this.sortState[column] === 'desc') {
       return 'keyboard_arrow_down';
     }
     return 'swap_vert';
   }

  goToDetails(row: ApiPerson): void {
   if (!row.id) {
     console.error('Person ID is missing', row);
     return;
   }

   this.selectedRowId = row.id;
   sessionStorage.setItem(TatigkeitenHistorischListComponent.LAST_ROW_KEY, row.id);
   this.router.navigate(['/taetigkeitenhistorischlist', row.id]);
 }

 }
