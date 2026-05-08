import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GetitRest3Service } from './getit-rest-3.service';
import { ApiVertrag } from '../models/ApiVertrag';
import { ApiVertragPosition } from '../models/ApiVertragPosition';
import { ApiVertragPositionVerbraucher } from '../models/ApiVertragPositionVerbraucher';
import { ApiStundenplanung } from '../models/ApiStundenplanung';
import { ApiGeschaeftszahlenListe } from '../models/ApiGeschaeftszahlenListe';
import { ApiRollenbezeichnungsListe } from '../models/ApiRollenbezeichnungsListe';
import { ApiPerson } from '../models/ApiPerson';
import { ApiProdukt } from '../models/ApiProdukt';

@Injectable({
  providedIn: 'root'
})
export class VertraegeService {

  constructor(private getitRest3Service: GetitRest3Service) {}

  getPersonen1(): Observable<ApiPerson[]> {
    return this.getitRest3Service.getPersonen().pipe(map(r => r.body ?? []));
  }

  getVertraege(
    berechneteStunden?: boolean,
    verbraucheStunden?: boolean
  ): Observable<ApiVertrag[]> {
    return this.getitRest3Service.getVertraege(berechneteStunden, verbraucheStunden)
      .pipe(map(r => r.body ?? []));
  }

  getVertrag(
    id: string,
    berechneteStunden?: boolean
  ): Observable<ApiVertrag> {
    return this.getitRest3Service.getVertrag(id, berechneteStunden)
      .pipe(map(r => r.body as ApiVertrag));
  }

  createVertrag(vertrag: ApiVertrag): Observable<ApiVertrag> {
    return this.getitRest3Service.createVertrag(vertrag)
      .pipe(map(r => r.body as ApiVertrag));
  }

  updateVertrag(id: string, vertrag: ApiVertrag): Observable<ApiVertrag> {
    return this.getitRest3Service.updateVertrag(id, vertrag)
      .pipe(map(r => r.body as ApiVertrag));
  }

  getAlleAktuellenGeschaeftszahlen(): Observable<ApiGeschaeftszahlenListe> {
    return this.getitRest3Service.getAlleAktuellenGeschaeftszahlen()
      .pipe(map(r => r.body ?? {}));
  }

  getAlleAktuellenRollenbezeichnungen(): Observable<ApiRollenbezeichnungsListe> {
    return this.getitRest3Service.getAlleAktuellenRollenbezeichnungen()
      .pipe(map(r => r.body ?? {}));
  }

  getProdukte(): Observable<ApiProdukt[]> {
    return this.getitRest3Service.getProdukte().pipe(map(r => r.body ?? []));
  }

  getProdukt(id: string, filter?: string): Observable<ApiProdukt> {
    return this.getitRest3Service.getProdukt(id, filter).pipe(map(r => r.body as ApiProdukt));
  }

  createVertragPosition(
    position: ApiVertragPosition,
    vertragId: string
  ): Observable<ApiVertragPosition> {
    return this.getitRest3Service.createVertragPosition(position, vertragId)
      .pipe(map(r => r.body as ApiVertragPosition));
  }

  updateVertragPosition(
    id: string,
    position: ApiVertragPosition
  ): Observable<ApiVertragPosition> {
    return this.getitRest3Service.updateVertragPosition(id, position)
      .pipe(map(r => r.body as ApiVertragPosition));
  }

  createVertragPositionVerbraucher(
    position: ApiVertragPositionVerbraucher,
    vertragPositionId: string
  ): Observable<ApiVertragPositionVerbraucher> {
    return this.getitRest3Service.createVertragPositionVerbraucher(position, vertragPositionId)
      .pipe(map(r => r.body as ApiVertragPositionVerbraucher));
  }

  updateVertragPositionVerbraucher(
    id: string,
    position: ApiVertragPositionVerbraucher
  ): Observable<ApiVertragPositionVerbraucher> {
    return this.getitRest3Service.updateVertragPositionVerbraucher(id, position)
      .pipe(map(r => r.body as ApiVertragPositionVerbraucher));
  }

  createStundenplanung(
    object: ApiStundenplanung,
    produktPositionId: string,
    verbraucherId: string
  ): Observable<ApiStundenplanung> {
    return this.getitRest3Service.createStundenplanung(object, produktPositionId, verbraucherId)
      .pipe(map(r => r.body as ApiStundenplanung));
  }

  updateStundenplanung(
    id: string,
    object: ApiStundenplanung
  ): Observable<ApiStundenplanung> {
    return this.getitRest3Service.updateStundenplanung(id, object)
      .pipe(map(r => r.body as ApiStundenplanung));
  }
}
