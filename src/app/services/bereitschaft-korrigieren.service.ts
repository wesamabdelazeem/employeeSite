import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { ApiStempelzeit } from '../models/ApiStempelzeit';
import { ApiPerson } from '../models/ApiPerson';
import { ApiAbschlussInfo } from '../models/ApiAbschlussInfo';
import { GetitRest2Service } from './getit-rest-2.service';
import { GetitRest3Service } from './getit-rest-3.service';
import { MOCK_PERSONEN } from '../mock/mock-data';

@Injectable({
  providedIn: 'root'
})
export class BereitschaftKorrigierenService {

  constructor(
    private getitRestService: GetitRest2Service,
    private getitRestService3: GetitRest3Service,
  ) {}


  // CREATE — returns full HttpResponse so callers can log via StatusPanelService
  createBereitschaft(
    personId: string,
    dto: ApiStempelzeit
  ): Observable<HttpResponse<ApiStempelzeit[]>> {
    return this.getitRestService3.createBereitschaft(dto, personId);
  }

  // DELETE — returns full HttpResponse so callers can log via StatusPanelService
  deleteBereitschaft(id: string): Observable<HttpResponse<void>> {
    return this.getitRestService3.deleteBereitschaft(id);
  }


  // ── Loads (body-only is enough for these) ───────────────────────────────
  getPerson(
    id: string,
    persondetail?: string,
    berechneteStunden?: boolean,
    addVertraege?: boolean
  ): Observable<ApiPerson> {
    return this.getitRestService.getPerson(id, persondetail, berechneteStunden, addVertraege);
  }

  getPersonStempelzeitenNoAbwesenheit(
    personIdStr: string,
    loginAb?: string,
    loginBis?: string
  ): Observable<ApiStempelzeit[]> {
    return this.getitRestService.getPersonStempelzeitenNoAbwesenheit(personIdStr, loginAb, loginBis);
  }

  getPersonAbschlussInfo(personIdStr: string): Observable<ApiAbschlussInfo> {
    return this.getitRestService.getPersonAbschlussInfo(personIdStr);
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
}
