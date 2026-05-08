import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { GetitRestService } from './getit-rest.service';
import { ApiStempelzeit } from '../models/ApiStempelzeit';
import { ApiPerson } from '../models/ApiPerson';
import { GetitRest2Service } from './getit-rest-2.service';
import { MOCK_PERSONEN } from '../mock/mock-data';

@Injectable({
  providedIn: 'root'
})
export class BereitschaftKorrigierenService {

  constructor(
    //private getitRestService: GetitRestService,
    private getitRestService: GetitRest2Service,
  ) {}


  // CREATE
  createBereitschaft(
    personId: string,
    dto: ApiStempelzeit
  ): Observable<ApiStempelzeit[]> {

    console.log('createBereitschaft', dto);

    return this.getitRestService.createBereitschaft(dto, personId);
  }

  // DELETE
  deleteBereitschaft(id: string): Observable<void> {
    return this.getitRestService.deleteBereitschaft(id);
  }


  getPersonen(
    berechneteStunden?: string,
    nurNamen?: string,
    funktion?: string,
  ): Observable<ApiPerson[]> {
    return this.getitRestService.getPersonen(berechneteStunden, nurNamen, funktion).pipe(
      map((data) => (data && data.length ? data : MOCK_PERSONEN)),
      catchError((err) => {
        console.warn('getPersonen failed, falling back to mock data:', err);
        return of(MOCK_PERSONEN);
      }),
    );
  }

  /* getPersonen__(berechneteStunden: boolean = false, nurNamen: boolean = false): Observable<ApiPerson[] | null> {
      return null; //this.getitRestService.getPersonen(berechneteStunden, nurNamen);
   }

*/
   getPersonStempelzeitenNoAbwesenheit (
    personIdStr: string,
    loginAb?: string,
    loginBis?: string
  ): Observable<ApiStempelzeit[]> {
    console.log('Loading stempelzeiten for person:', personIdStr);
    console.log('parameters:', { loginAb, loginBis });
    return this.getitRestService.getPersonStempelzeitenNoAbwesenheit(personIdStr, loginAb, loginBis);
  }
}
