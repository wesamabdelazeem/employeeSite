
import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiProdukt } from '../models/ApiProdukt';
import { ApiProduktPositionBuchungspunkt } from '../models/ApiProduktPositionBuchungspunkt';
import { ApiProduktPosition } from '../models/ApiProduktPosition';
import { GetitRest3Service } from './getit-rest-3.service';

@Injectable({
  providedIn: 'root'
})
export class ProduktService {

  constructor(private getitRest3Service: GetitRest3Service) { }

  /////list//////
  getProdukte(): Observable<HttpResponse<ApiProdukt[]>> {
    return this.getitRest3Service.getProdukte();
  }

  ////details////////
  getProdukt(id: string, filter?: string): Observable<HttpResponse<ApiProdukt>> {
    return this.getitRest3Service.getProdukt(id, filter);
  }

  createProdukt(produkt: ApiProdukt): Observable<HttpResponse<ApiProdukt>> {
    return this.getitRest3Service.createProdukt(produkt);
  }

  updateProdukt(id: string, produkt: ApiProdukt): Observable<HttpResponse<ApiProdukt>> {
    return this.getitRest3Service.updateProdukt(id, produkt);
  }

  createProduktPosition(position: ApiProduktPosition, produktId: string): Observable<HttpResponse<ApiProduktPosition>> {
    return this.getitRest3Service.createProduktPosition(position, produktId);
  }

  updateProduktPosition(id: string, position: ApiProduktPosition): Observable<HttpResponse<ApiProduktPosition>> {
    return this.getitRest3Service.updateProduktPosition(id, position);
  }


  createProduktPositionBuchungspunkt(
    position: ApiProduktPositionBuchungspunkt,
    produktPositionId: string
  ): Observable<HttpResponse<ApiProduktPositionBuchungspunkt>> {
    return this.getitRest3Service.createProduktPositionBuchungspunkt(position, produktPositionId);
  }

  updateProduktPositionBuchungspunkt(
    id: string,
    position: ApiProduktPositionBuchungspunkt
  ): Observable<HttpResponse<ApiProduktPositionBuchungspunkt>> {
    return this.getitRest3Service.updateProduktPositionBuchungspunkt(id, position);
  }
}
