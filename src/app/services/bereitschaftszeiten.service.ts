import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { ApiStempelzeit } from '../models/ApiStempelzeit';
import { ApiPerson } from '../models/ApiPerson';
import { ApiAbschlussInfo } from '../models/ApiAbschlussInfo';
import {
  MOCK_PERSONEN,
  MOCK_STEMPELZEITEN,
  MOCK_ABSCHLUSS_INFO,
} from '../mock/mock-data';

@Injectable({
  providedIn: 'root'
})
export class BereitschaftszeitenService {

  constructor() {}

  getPersonen(
    berechneteStunden?: string,
    nurNamen?: string,
    funktion?: string
  ): Observable<ApiPerson[]> {
    return of(MOCK_PERSONEN);
  }

  getPersonStempelzeitenNoAbwesenheit(
    personId: string,
    loginAb?: string,
    loginBis?: string
  ): Observable<ApiStempelzeit[]> {
    return of(MOCK_STEMPELZEITEN);
  }

  createBereitschaft(
    personId: string,
    dto: ApiStempelzeit,
    vorgang?: string
  ): Observable<ApiStempelzeit[]> {
    if (!personId) {
      return throwError(() => new Error('personId is required'));
    }
    const saved: ApiStempelzeit = { ...dto, id: `mock-${Date.now()}` };
    return of([saved]);
  }

  deleteBereitschaft(id: string): Observable<void> {
    if (!id) {
      return throwError(() => new Error('id is required'));
    }
    return of(undefined);
  }

  getPersonAbschlussInfo(personIdStr: string): Observable<ApiAbschlussInfo> {
    return of(MOCK_ABSCHLUSS_INFO as ApiAbschlussInfo);
  }
}
