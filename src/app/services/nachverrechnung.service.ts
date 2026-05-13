import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { ApiPerson } from '../models/ApiPerson';
import { ApiAbschlussInfo } from '../models/ApiAbschlussInfo';
import { ApiStempelzeit } from '../models/ApiStempelzeit';
import { ApiTaetigkeitsbuchung } from '../models/ApiTaetigkeitsbuchung';
import {
  MOCK_PERSONEN,
  MOCK_LOGGED_IN_PERSON,
  MOCK_STEMPELZEITEN,
  MOCK_ABSCHLUSS_INFO,
} from '../mock/mock-data';
import { GetitRest3Service } from './getit-rest-3.service';
import { GetitRest2Service } from './getit-rest-2.service';

@Injectable({ providedIn: 'root' })
export class NachverrechnungService {
  constructor(
    private getitRest3Service: GetitRest3Service,
    private getitRest2Service: GetitRest2Service
  ) {}

  getPersonen(
    berechneteStunden?: string,
    nurNamen?: string,
    funktion?: string,
  ): Observable<HttpResponse<ApiPerson[]>> {
    return this.getitRest3Service.getPersonen(berechneteStunden, nurNamen, funktion);
  }

  getLoggedInPersonId(): string {
    return MOCK_LOGGED_IN_PERSON.id!;
  }

  getPerson(
    id: string,
    persondetail?: string,
    berechneteStunden?: boolean,
    addVertraege?: boolean
  ): Observable<ApiPerson> {
    return this.getitRest3Service.getPerson(id, persondetail, berechneteStunden, addVertraege).pipe(
      map((res) => res.body as ApiPerson),
      catchError((err) => {
        console.warn('getPerson failed, falling back to mock data:', err);
        const match = MOCK_PERSONEN.find((p) => p.id === id);
        return of(match ?? MOCK_LOGGED_IN_PERSON);
      })
    );
  }

  getPersonAbschlussInfo(personId: string): Observable<ApiAbschlussInfo> {
    return this.getitRest2Service.getPersonAbschlussInfo(personId).pipe(
      catchError((err) => {
        console.warn('getPersonAbschlussInfo failed, falling back to mock data:', err);
        return of(MOCK_ABSCHLUSS_INFO as ApiAbschlussInfo);
      })
    );
  }

  getPersonStempelzeitenNoAbwesenheit(
    personIdStr: string,
    loginAb?: string,
    loginBis?: string
  ): Observable<ApiStempelzeit[]> {
    return this.getitRest3Service.getPersonStempelzeitenNoAbwesenheit(personIdStr, loginAb, loginBis).pipe(
      map((res) => res.body ?? []),
      map((data) => (data && data.length ? data : MOCK_STEMPELZEITEN)),
      catchError((err) => {
        console.warn('getPersonStempelzeitenNoAbwesenheit failed, falling back to mock data:', err);
        return of(MOCK_STEMPELZEITEN);
      })
    );
  }

  createBereitschaft(
    personId: string,
    dto: ApiStempelzeit
  ): Observable<HttpResponse<ApiStempelzeit[]>> {
    return this.getitRest3Service.createBereitschaft(dto, personId).pipe(
      catchError((err) => {
        console.warn('createBereitschaft failed, falling back to mock data:', err);
        const mockEntry: ApiStempelzeit = {
          ...dto,
          id: `new-${Date.now()}`
        };
        return of(new HttpResponse<ApiStempelzeit[]>({
          body: [mockEntry],
          status: 200,
          statusText: 'OK (mock)',
          url: `personen/${personId}/bereitschaft`
        }));
      })
    );
  }

  deleteBereitschaft(id: string): Observable<HttpResponse<void>> {
    return this.getitRest3Service.deleteBereitschaft(id).pipe(
      catchError((err) => {
        console.warn('deleteBereitschaft failed, falling back to mock data:', err);
        return of(new HttpResponse<void>({
          status: 200,
          statusText: 'OK (mock)',
          url: `bereitschaft/${id}`
        }));
      })
    );
  }

  createNachverrechnung(
    dto: ApiTaetigkeitsbuchung,
    produktPositionBuchungspunktId: string,
    personId: string,
    vorgang?: string
  ): Observable<HttpResponse<ApiTaetigkeitsbuchung>> {
    return this.getitRest3Service
      .createTaetigkeitsbuchung(dto, produktPositionBuchungspunktId, personId, vorgang)
      .pipe(
        catchError((err) => {
          console.warn('createNachverrechnung failed, falling back to mock response:', err);
          const mockEntry: ApiTaetigkeitsbuchung = {
            ...dto,
            id: `new-${Date.now()}`
          };
          return of(new HttpResponse<ApiTaetigkeitsbuchung>({
            body: mockEntry,
            status: 200,
            statusText: 'OK (mock)',
            url: `produkt-positionen-buchungspunkte/${produktPositionBuchungspunktId}/taetigkeitsbuchungen`
          }));
        })
      );
  }
}