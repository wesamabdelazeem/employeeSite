import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiPerson } from '../models/ApiPerson';
import { ApiStempelzeit } from '../models/ApiStempelzeit';
import { ApiProdukt } from '../models/ApiProdukt';
import { ApiAbschlussInfo } from '../models/ApiAbschlussInfo';
import { GetitRest3Service } from './getit-rest-3.service';

@Injectable({
  providedIn: 'root'
})
export class TaetigkeitenHistorischService {

  constructor(private getitRest3Service: GetitRest3Service) {}

  getPerson(id: string, persondetail?: string, berechneteStunden: boolean = true, addVertraege?: boolean): Observable<HttpResponse<ApiPerson>> {
    return this.getitRest3Service.getPerson(id, persondetail, berechneteStunden, addVertraege);
  }

  getPersonen(berechneteStunden?: string, nurNamen?: string, funktion?: string): Observable<HttpResponse<ApiPerson[]>> {
    return this.getitRest3Service.getPersonen(berechneteStunden, nurNamen, funktion);
  }

  getPersonProdukte(personId: string, filter: string, taetigkeitenAb?: string, taetigkeitenBis?: string, planungsjahr?: string): Observable<HttpResponse<ApiProdukt[]>> {
    return this.getitRest3Service.getPersonProdukte(personId, filter, taetigkeitenAb, taetigkeitenBis, planungsjahr);
  }

  getPersonStempelzeiten(personId: string, loginAb?: string, loginBis?: string): Observable<HttpResponse<ApiStempelzeit[]>> {
    return this.getitRest3Service.getPersonStempelzeiten(personId, loginAb, loginBis);
  }

  abschlussInfo(personId: string): Observable<HttpResponse<ApiAbschlussInfo>> {
    return this.getitRest3Service.abschlussInfo(personId);
  }
}
