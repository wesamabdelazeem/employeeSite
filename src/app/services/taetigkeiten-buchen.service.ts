import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiPerson } from '../models/ApiPerson';
import { ApiStempelzeit } from '../models/ApiStempelzeit';
import { ApiProdukt } from '../models/ApiProdukt';
import { ApiAbschlussInfo } from '../models/ApiAbschlussInfo';
import { ApiTaetigkeitsbuchung } from '../models/ApiTaetigkeitsbuchung';
import { ApiPersonenvermerk } from '../models/ApiPersonenvermerk';
import { GetitRest2Service } from './getit-rest-2.service';
import { GetitRest3Service } from './getit-rest-3.service';

@Injectable({
  providedIn: 'root'
})
export class TatigkeitenBuchenService {

  constructor(
    private getitRest2Service: GetitRest2Service,
    private getitRest3Service: GetitRest3Service,
  ) {}

  getPerson(id: string, persondetail?: string, berechneteStunden: boolean = true, addVertraege?: boolean): Observable<HttpResponse<ApiPerson>> {
    return this.getitRest3Service.getPerson(id, persondetail, berechneteStunden, addVertraege);
  }

  getPersonProdukte(personId: string, filter: string, taetigkeitenAb?: string, taetigkeitenBis?: string, planungsjahr?: string): Observable<HttpResponse<ApiProdukt[]>> {
    return this.getitRest3Service.getPersonProdukte(personId, filter, taetigkeitenAb, taetigkeitenBis, planungsjahr);
  }

  getPersonStempelzeiten(personId: string, loginAb?: string, loginBis?: string): Observable<HttpResponse<ApiStempelzeit[]>> {
    return this.getitRest3Service.getPersonStempelzeiten(personId, loginAb, loginBis);
  }

  getPersonAbschlussInfo(parentId: string): Observable<ApiAbschlussInfo> {
    return this.getitRest2Service.getPersonAbschlussInfo(parentId);
  }

  getPersonVermerke(parentId: string, ab: string, bis: string): Observable<HttpResponse<ApiPersonenvermerk[]>> {
    return this.getitRest3Service.getPersonVermerke(parentId, ab, bis);
  }

  createTaetigkeitsbuchung(dto: ApiTaetigkeitsbuchung, produktPositionBuchungspunktId: string, personId: string, vorgang?: string): Observable<HttpResponse<ApiTaetigkeitsbuchung>> {
    return this.getitRest3Service.createTaetigkeitsbuchung(dto, produktPositionBuchungspunktId, personId, vorgang);
  }

  updateTaetigkeitsbuchung(id: string, dto: ApiTaetigkeitsbuchung, vorgang?: string): Observable<HttpResponse<ApiTaetigkeitsbuchung>> {
    return this.getitRest3Service.updateTaetigkeitsbuchung(id, dto, vorgang);
  }

 abschlussInfo(parentId: string): Observable<HttpResponse<ApiAbschlussInfo>> {
   return this.getitRest3Service.abschlussInfo(parentId)
  }


  
}
