import {HttpClient, HttpResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable, ReplaySubject, Subject} from 'rxjs';
import { AppConstants } from '../models/app-constants';
import { AbwesenheitItem } from '../models/abwesenheit';
import { StempelzeitDto } from '../models/person';
import {GetitRest2Service} from './getit-rest-2.service';
import {DateUtilsService} from './utils/date-utils.service';
import {ApiZeitTyp} from '../models/ApiZeitTyp';
import {ApiStempelzeit} from '../models/ApiStempelzeit';
import {PersonService} from './person.service';
import {getEnumKeyByValue} from './utils/enum.utils';
import {PersonenService} from './personen.service';
import {GetitRest3Service} from './getit-rest-3.service';

@Injectable({
  providedIn: 'root'
})
export class AbwesenheitService {
  private refreshSubject = new Subject<void>();
  refresh$ = this.refreshSubject.asObservable();

  constructor(private  personService: PersonenService,
              private getitRestService : GetitRest2Service,
              private getitRestService3: GetitRest3Service) {}




  triggerRefresh() {
    this.refreshSubject.next();
  }


  getAbwesenheitsListe(): Observable<HttpResponse<ApiStempelzeit[]>> {
    let personId = this.personService.getCurrentUser()?.id
    let currentDay = DateUtilsService.getCurrentDay();
    return this.getitRestService3.getStempelzeit(personId, getEnumKeyByValue(ApiZeitTyp, ApiZeitTyp.ABWESENHEIT), currentDay);
  }


  createAbwesenheit(stempelzeitDto: ApiStempelzeit): Observable<HttpResponse<ApiStempelzeit>> {
    let personId = this.personService.getCurrentUser()?.id
    return this.getitRestService3.createStempelzeit(stempelzeitDto,  personId!, 'Abwesenheitsverwaltung');
  }

  updateAbwesenheit(stempelzeitDto: ApiStempelzeit): Observable<HttpResponse<ApiStempelzeit>> {
    return   this.getitRestService3.updateStempelzeit(stempelzeitDto, stempelzeitDto.id!,  'Abwesenheitsverwaltung');
  }



  deleteAbwesenheit(stempelzeitDto: ApiStempelzeit): Observable<HttpResponse<ApiStempelzeit>> {
    return   this.getitRestService3.updateStempelzeit(stempelzeitDto, stempelzeitDto.id!,  'Abwesenheitsverwaltung');
  }

  sendCalendar(abwesenheitId: string) {
    console.log('Sending calll')
    return this.getitRestService3.sendStempelzeitCalendar(abwesenheitId);

  }


  /*sendCalendar(abwesenheitId: string) {
    console.log('Sending calll')
    this.getitRestService.sendStempelzeitCalendar(abwesenheitId);

    this.getitRestService.sendStempelzeitCalendar(abwesenheitId)
      .subscribe({
        next: () => {
          console.log('Calendar sent successfully');
        },
        error: (error) => {
          console.error('Error sending calendar', error);
        },
        complete: () => {
          console.log('Request completed');
        }
      });
  }

   */

  /*
  updateAbwesenheit(stempelzeitDto: ApiStempelzeit): Observable<ApiStempelzeit> {
    return   this.getitRestService.updateStempelzeit(stempelzeitDto, stempelzeitDto.id!,  'Abwesenheitsverwaltung');
  }
  */
  /*
  deleteAbwesenheit(stempelzeitDto: ApiStempelzeit): Observable<ApiStempelzeit> {
    return   this.getitRestService.updateStempelzeit(stempelzeitDto, stempelzeitDto.id!,  'Abwesenheitsverwaltung');
  }
 */
  /*
 createAbwesenheit(stempelzeitDto: ApiStempelzeit): Observable<ApiStempelzeit> {
   let personId = this.personService.getCurrentUser()?.id
   return this.getitRestService.createStempelzeit(stempelzeitDto,  personId!, 'Abwesenheitsverwaltung');
 }

 */

  /*
getAbwesenheitsListe(): Observable<ApiStempelzeit[]> {
  let personId = this.personService.getCurrentUser()?.id
  let currentDay = DateUtilsService.getCurrentDay();
  return this.getitRestService.getStempelzeit(personId, getEnumKeyByValue(ApiZeitTyp, ApiZeitTyp.ABWESENHEIT), currentDay);
 }
 */
}
