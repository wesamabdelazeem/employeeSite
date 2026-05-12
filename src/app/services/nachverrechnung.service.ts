import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { ApiPerson } from '../models/ApiPerson';
import { GetitRest3Service } from './getit-rest-3.service';

@Injectable({ providedIn: 'root' })
export class NachverrechnungService {
  constructor(private getitRest3Service: GetitRest3Service) {}

  getPersonen(
    berechneteStunden?: string,
    nurNamen?: string,
    funktion?: string,
  ): Observable<HttpResponse<ApiPerson[]>> {
    return this.getitRest3Service.getPersonen(berechneteStunden, nurNamen, funktion);
  }
}