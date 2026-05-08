import { Injectable } from '@angular/core';
export const PathConst = {
  PERSONEN: 'personen',
  ORGANISATIONSEINHEITEN: 'organisationseinheiten',
  VERTRAEGE: 'vertraege',
  VERTRAG_POSITIONEN: 'vertragPositionen',
  VERTRAG_POSITION_VERBRAUCHER: 'vertragPositionVerbraucher',
  PRODUKTE: 'produkte',
  PRODUKT_POSITIONEN: 'produktPositionen',
  PRODUKT_POSITIONEN_BUCHUNGSPUNKTE: 'produktPositionBuchungspunkte',
  STUNDENPLANUNG: 'stundenplanung',
  TAETIGKEITSBUCHUNGEN: 'taetigkeitsbuchungen',
  STEMPELZEITEN: 'stempelzeiten',
  PERSONENVERMERKE: 'personenvermerke',
  FREIGABE_POSITIONEN: 'freigabePositionen',
  FREIGABE_GRUPPEN: 'freigabeGruppen',
  BEREITSCHAFT: 'bereitschaft',
  ZIVI_URLAUBKRANK: 'ziviUrlaubKrank',
  INFO: 'info',
  ME: 'me',
  ABSCHLUSS_TAG: 'abschluss/tag',
  ABSCHLUSS_MONAT: 'abschluss/monat',
  ABSCHLUSS_INFO: 'abschluss/info',
  TEAMZUORDNUNGEN: 'teamzuordnungen',
  LEISTUNGSKATEGORIEN: 'leistungskategorien',
  VERTRAGSPARTNER: 'vertragspartner',
  GESCHAEFZSZAHLEN: 'geschaeftszahlen',
  ROLLENBEZEICHNUNGEN: 'rollenbezeichnungen',
  FEIERTAGE: 'feiertage',
  INFOPDF_MUSSLESEN: 'infopdf/musslesen',
  INFOPDF_HATGELESEN: 'infopdf/hatgelesen',
  GEPLANT_GEBUCHT: 'geplantGebucht',
  PERSONENVERANTWORTLICHE: 'personenverantwortliche',
  DURCHFUEHRUNGSVERANTWORTLICHER: 'durchfuehrungsverantwortlicher',
  ID: 'id',
  PARENT_ID: 'parentId',
  DATUM: 'datum',
  RESET: 'reset',
  DISABLE: 'disable',
  RESET_AND_COPY: 'resetAndCopy',
  STEMPELN: 'stempeln',
  ANZAHL: '/anzahl',

  FREIGABE_POSITIONEN_ANZAHL: 'freigabePositionen/anzahl',
  FREIGABE_POSITIONEN_HISTORY: 'freigabePositionen/history',
  VERTRAEGE_VERTRAGSVERANTWORTLICHER: 'vertraege/vertragsverantwortlicher',
  PERSONEN_DURCHFUEHRUNGSVERANTWORTLICHER: 'personen/durchfuehrungsverantwortlicher',


  AUSWERTUNGEN: '/auswertungen',
  AUSWERTUNGEN_EV: '/auswertungen/ev',
  AUSWERTUNGEN_DV: '/auswertungen/dv',
  AUSWERTUNGEN_SM: '/auswertungen/sm',
  AUSWERTUNGEN_HISTORY: '/auswertungen/history',
  AUSWERTUNGEN_VERTRAGPARTNER: '/auswertungen/vertragspartner',
  AUSWERTUNGEN_FREIGABEGRUPPE: '/auswertungen/freigabegruppe',
  AUSWERTUNGEN_STEMPELZEITKORREKTUR: '/auswertungen/stempelzeitkorrektur',
  AUSWERTUNGEN_UEBERFAELLIGEBUCHUNGEN: '/auswertungen/ueberfaellige-buchungen',
  AUSWERTUNGEN_NACHGETRAGENEREMOTEBUCHUNGEN: '/auswertungen/nachgetragene-remote-buchungen',
  AUSWERTUNGEN_ABWESENHEITEN: '/auswertungen/abwesenheiten',
  PERSONEN_DETAILLISTE: '/personen/detailliste',
  PERSONEN_ORGLEITER: '/personen/orgleiter',
  ZIVI_ANWESEND: '/zivi-anwesend',
  JAHRESAUSWERTUNG: '/jahresauswertung',
  AUSWERTUNG: 'auswertung',
  AUSNUETZUNG: 'ausnuetzung',
  KOSTEN: 'kosten',
} as const;

//export const ANZAHL = "/anzahl";
//export const HISTORY = "/history";


//export const FREIGABE_POSITIONEN_ANZAHL = PathConst.FREIGABE_POSITIONEN + ANZAHL;
//export const FREIGABE_POSITIONEN_HISTORY = PathConst.FREIGABE_POSITIONEN + HISTORY;

export const QueryConst = {
  PERSONDETAILGRAD: 'persondetail',
  BERECHNETE_STUNDEN: 'berechneteStunden',
  ADD_VERTRAEGE: 'addVertraege',
  NUR_NAMEN: 'nurNamen',
  FILTER: 'filter',
  TAETIGKEITEN_AB: 'taetigkeitenAb',
  TAETIGKEITEN_BIS: 'taetigkeitenBis',
  PLANUNGSJAHR: 'planungsjahr',
  LOGIN_AB: 'loginAb',
  LOGIN_BIS: 'loginBis',
  PERSON_ID: 'personId',
  ZEITTYP: 'zeitTyp',
  LOGOFF_AB: 'logoffAb',
  VERBRAUCHTE_STUNDEN: 'verbrauchteStunden',
  VORGANG: 'vorgang',
  VERBRAUCHER: 'verbraucher',
  AUFHEBEN: 'aufheben',
  PRODUKTPOSITION: 'produktPosition',
  ADD_GEBUCHT: 'addGebucht',
  NUR_AKTIV: 'nurAktiv',
  FUNKTION: 'funktion',
  AB: 'ab',
  BIS: 'bis',
  BUCHUNG_ID: 'buchungId',
  JAHR: 'jahr',
  STUNDENSATZ_NEU: 'stundensatzNeu'
} as const;

import { Inject } from '@angular/core';
// Adjust path as needed
import { Observable, from } from 'rxjs'


import { ApiPerson } from '../models/ApiPerson';
import { ApiStempelzeit } from '../models/ApiStempelzeit';
import { ApiOrganisationseinheit } from '../models/ApiOrganisationseinheit';
import { ApiVertrag } from '../models/ApiVertrag';
import { ApiVertragPosition } from '../models/ApiVertragPosition';
import { ApiVertragPositionVerbraucher } from '../models/ApiVertragPositionVerbraucher';
import { ApiProdukt } from '../models/ApiProdukt';
import { ApiProduktPosition } from '../models/ApiProduktPosition';
import { ApiProduktPositionBuchungspunkt } from '../models/ApiProduktPositionBuchungspunkt';
import { ApiStundenplanung } from '../models/ApiStundenplanung';
import { ApiTaetigkeitsbuchung } from '../models/ApiTaetigkeitsbuchung';
import { ApiPersonAnwesenheit } from '../models/ApiPersonAnwesenheit';
import { ApiAbschlussInfo } from '../models/ApiAbschlussInfo';
import { ApiFeiertage } from '../models/ApiFeiertage';
import { ApiInfo } from '../models/ApiInfo';
import { ApiGeplantGebucht } from '../models/ApiGeplantGebucht';
import { ApiTeamzuordnungen } from '../models/ApiTeamzuordnungen';
import { ApiVertragspartnerListe } from '../models/ApiVertragspartnerListe';
import { ApiFreigabePosition } from '../models/ApiFreigabePosition';
import { ApiFreigabePositionAnzahl } from '../models/ApiFreigabePositionAnzahl';
import { ApiPersonenvermerk } from '../models/ApiPersonenvermerk';
import { ApiMussPdfLesen } from '../models/ApiMussPdfLesen';
import { ApiGeschaeftszahlenListe } from '../models/ApiGeschaeftszahlenListe';
import { ApiRollenbezeichnungsListe } from '../models/ApiRollenbezeichnungsListe';
import { ApiLeistungskategorien } from '../models/ApiLeistungskategorien';
import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import { ApiTrigger } from '../models/ApiTrigger';
import { ApiLkDetails } from '../models/ApiLkDetails';
import { ApiTaetigkeiten } from '../models/ApiTaetigkeiten';
import {environment} from '../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class GetitRest3Service {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient,
   // @Inject('BASE_URL') private baseUrl: string
  ) { }
// ========================================
// PERSON ENDPOINTS
// ========================================


// CREATE - Single Item
  createPerson(person: ApiPerson): Observable<HttpResponse<ApiPerson>> {
    return this.http.post<ApiPerson>(`personen`, person, {
      observe: 'response',
      responseType: 'json'
    });
  }

// UPDATE - Single Item
  updatePerson(id: string, person: ApiPerson): Observable<HttpResponse<ApiPerson>> {
    return this.http.post<ApiPerson>(`personen/${id}`, person, {
      observe: 'response',
      responseType: 'json'
    });
  }

// RESET/DISABLE - Single Item
  resetPerson(parentId: string): Observable<HttpResponse<ApiPerson>> {
    return this.http.post<ApiPerson>(`personen/${parentId}/reset`, null, {
      observe: 'response',
      responseType: 'json'
    });
  }

  disablePortalPerson(id: string): Observable<HttpResponse<ApiPerson>> {
    return this.http.post<ApiPerson>(`personen/${id}/disable`, null, {
      observe: 'response',
      responseType: 'json'
    });
  }

// GET - Single Item with Params
  getPerson(
    id: string,
    persondetail?: string,
    berechneteStunden?: boolean,
    addVertraege?: boolean
  ): Observable<HttpResponse<ApiPerson>> {
    let params = new HttpParams();
    if (persondetail) params = params.set('persondetailgrad', persondetail);
    if (berechneteStunden !== undefined) params = params.set('berechneteStunden', berechneteStunden.toString());
    if (addVertraege !== undefined) params = params.set('addVertraege', addVertraege.toString());

    return this.http.get<ApiPerson>(`personen/${id}`, {
      params,
      observe: 'response',
      responseType: 'json'
    });
  }

// GET - List with Params
  getPersonen(
    berechneteStunden?: string,
    nurNamen?: string,
    funktion?: string
  ): Observable<HttpResponse<ApiPerson[]>> {
    let params = new HttpParams();
    if (berechneteStunden) params = params.set('berechneteStunden', berechneteStunden);
    if (nurNamen) params = params.set('nurNamen', nurNamen);
    if (funktion) params = params.set('funktion', funktion);

    return this.http.get<ApiPerson[]>(`personen`, {
      params,
      observe: 'response',
      responseType: 'json'
    });
  }

// GET - Anwesend List
  getPersonsAnwesend(): Observable<HttpResponse<ApiPersonAnwesenheit[]>> {
    return this.http.get<ApiPersonAnwesenheit[]>(`personen:anwesend`, {
      observe: 'response',
      responseType: 'json'
    });
  }

// GET - Produkte List
  getPersonProdukte(
    parentId: string,
    filter: string,
    taetigkeitenAb?: string,
    taetigkeitenBis?: string,
    planungsjahr?: string
  ): Observable<HttpResponse<ApiProdukt[]>> {
    let params = new HttpParams().set('filter', filter);
    if (taetigkeitenAb) params = params.set('taetigkeitenAb', taetigkeitenAb);
    if (taetigkeitenBis) params = params.set('taetigkeitenBis', taetigkeitenBis);
    if (planungsjahr) params = params.set('planungsjahr', planungsjahr);

    return this.http.get<ApiProdukt[]>(`personen/${parentId}/produkte`, {
      params,
      observe: 'response',
      responseType: 'json'
    });
  }




  // GET - Stempelzeiten List
  getPersonStempelzeiten(
    parentId: string,
    loginAb?: string,
    loginBis?: string
  ): Observable<HttpResponse<ApiStempelzeit[]>> {
    let params = new HttpParams();
    if (loginAb) params = params.set('loginAb', loginAb);
    if (loginBis) params = params.set('loginBis', loginBis);

    return this.http.get<ApiStempelzeit[]>(`personen/${parentId}/stempelzeiten`, {
      params,
      observe: 'response',
      responseType: 'json'
    });
  }

// GET - Stempelzeiten No Abwesenheit
  getPersonStempelzeitenNoAbwesenheit(
    parentId: string,
    loginAb?: string,
    loginBis?: string
  ): Observable<HttpResponse<ApiStempelzeit[]>> {
    let params = new HttpParams();
    if (loginAb) params = params.set('loginAb', loginAb);
    if (loginBis) params = params.set('loginBis', loginBis);

    return this.http.get<ApiStempelzeit[]>(`personen/${parentId}/stempelzeiten`, {
      params,
      observe: 'response',
      responseType: 'json'
    });
  }

// GET - My Stempelzeiten
  getPersonMeStempelzeiten(loginAb?: string): Observable<HttpResponse<ApiStempelzeit[]>> {
    let params = new HttpParams();
    if (loginAb) params = params.set('loginAb', loginAb);

    return this.http.get<ApiStempelzeit[]>(`personen/me/stempelzeiten`, {
      params,
      observe: 'response',
      responseType: 'json'
    });
  }

// GET - Abwesenheiten
  getPersonAbwesenheiten(id: string): Observable<HttpResponse<ApiStempelzeit[]>> {
    return this.http.get<ApiStempelzeit[]>(`personen/${id}/abwesenheiten`, {
      observe: 'response',
      responseType: 'json'
    });
  }

// GET - Teamleiter
  getPersonTeamleiter(parentId: string): Observable<HttpResponse<ApiPerson[]>> {
    return this.http.get<ApiPerson[]>(`personen/${parentId}/teamleiter`, {
      observe: 'response',
      responseType: 'json'
    });
  }

// CREATE - Stempelzeit
  createStempelzeit(
    dto: ApiStempelzeit,
    parentId: string,
    vorgang?: string
  ): Observable<HttpResponse<ApiStempelzeit>> {
    let params = new HttpParams();
    if (vorgang) params = params.set('vorgang', vorgang);

    return this.http.post<ApiStempelzeit>(`personen/${parentId}/stempelzeiten`, dto, {
      params,
      observe: 'response',
      responseType: 'json'
    });
  }

// UPDATE - Stempelzeit
  updateStempelzeit(
    dto: ApiStempelzeit,
    id: string,
    vorgang?: string
  ): Observable<HttpResponse<ApiStempelzeit>> {
    let params = new HttpParams();
    if (vorgang) params = params.set('vorgang', vorgang);

    return this.http.post<ApiStempelzeit>(`stempelzeiten/${id}`, dto, {
      params,
      observe: 'response',
      responseType: 'json'
    });
  }

// GET - All Stempelzeiten with Params
  getStempelzeit(
    personIdStr?: string,
    zeitTypStr?: string,
    logoffAb?: string
  ): Observable<HttpResponse<ApiStempelzeit[]>> {
    let params = new HttpParams();
    if (personIdStr) params = params.set('personId', personIdStr);
    if (zeitTypStr) params = params.set('zeitTyp', zeitTypStr);
    if (logoffAb) params = params.set('logoffAb', logoffAb);

    return this.http.get<ApiStempelzeit[]>(`stempelzeiten`, {
      params,
      observe: 'response',
      responseType: 'json'
    });
  }

// GET - Abwesenheiten (duplicate endpoint)
  getAbwesenheiten(
    personIdStr?: string,
    zeitTypStr?: string,
    logoffAb?: string
  ): Observable<HttpResponse<ApiStempelzeit[]>> {
    let params = new HttpParams();
    if (personIdStr) params = params.set('personId', personIdStr);
    if (zeitTypStr) params = params.set('zeitTyp', zeitTypStr);
    if (logoffAb) params = params.set('logoffAb', logoffAb);

    return this.http.get<ApiStempelzeit[]>(`stempelzeiten`, {
      params,
      observe: 'response',
      responseType: 'json'
    });
  }

// POST - Send Calendar (returns void)
  sendStempelzeitCalendar(id: string): Observable<HttpResponse<void>> {
    return this.http.post<void>(`stempelzeiten/sendCalendar/${id}`, null, {
      observe: 'response',
      responseType: 'json'
    });
  }



  createOrganisationseinheit(organisationseinheit: ApiOrganisationseinheit): Observable<HttpResponse<ApiOrganisationseinheit>> {
    return this.http.post<ApiOrganisationseinheit>(`organisationseinheiten`, organisationseinheit, {
      observe: 'response',
      responseType: 'json'
    });
  }

  updateOrganisationseinheit(id: string, organisationseinheit: ApiOrganisationseinheit): Observable<HttpResponse<ApiOrganisationseinheit>> {
    return this.http.post<ApiOrganisationseinheit>(`organisationseinheiten/${id}`, organisationseinheit, {
      observe: 'response',
      responseType: 'json'
    });
  }

  getOrganisationsEinheiten(): Observable<HttpResponse<ApiOrganisationseinheit[]>> {
    return this.http.get<ApiOrganisationseinheit[]>(`organisationseinheiten`, {
      observe: 'response',
      responseType: 'json'
    });
  }


  getVertraege(
    berechneteStunden?: boolean,
    verbraucheStunden?: boolean
  ): Observable<HttpResponse<ApiVertrag[]>> {
    let params = new HttpParams();
    if (berechneteStunden !== undefined) params = params.set('berechneteStunden', berechneteStunden.toString());
    if (verbraucheStunden !== undefined) params = params.set('verbrauchteStunden', verbraucheStunden.toString());

    return this.http.get<ApiVertrag[]>(`vertraege`, {
      params,
      observe: 'response',
      responseType: 'json'
    });
  }

  getVertraege1(
    vertragDetailStr: string = 'Uebersicht',
    berechneteStunden?: string,
    verbraucheStunden?: string
  ): Observable<HttpResponse<ApiVertrag[]>> {
    let params = new HttpParams().set('vertragdetailgrad', vertragDetailStr);
    if (berechneteStunden) params = params.set('berechneteStunden', berechneteStunden);
    if (verbraucheStunden) params = params.set('verbrauchteStunden', verbraucheStunden);

    return this.http.get<ApiVertrag[]>(`vertraege`, {
      params,
      observe: 'response',
      responseType: 'json'
    });
  }

  getVertrag(
    id: string,
    berechneteStunden?: boolean
  ): Observable<HttpResponse<ApiVertrag>> {
    let params = new HttpParams();
    if (berechneteStunden !== undefined) params = params.set('berechneteStunden', berechneteStunden.toString());

    return this.http.get<ApiVertrag>(`vertraege/${id}`, {
      params,
      observe: 'response',
      responseType: 'json'
    });
  }

  createVertrag(vertrag: ApiVertrag): Observable<HttpResponse<ApiVertrag>> {
    return this.http.post<ApiVertrag>(`vertraege`, vertrag, {
      observe: 'response',
      responseType: 'json'
    });
  }

  updateVertrag(id: string, vertrag: ApiVertrag): Observable<HttpResponse<ApiVertrag>> {
    return this.http.post<ApiVertrag>(`vertraege/${id}`, vertrag, {
      observe: 'response',
      responseType: 'json'
    });
  }

  getVertraegeVerantwortlicher(): Observable<HttpResponse<ApiVertrag[]>> {
    return this.http.get<ApiVertrag[]>(`vertraege-vertragsverantwortlicher`, {
      observe: 'response',
      responseType: 'json'
    });
  }


  createVertragPosition(
    position: ApiVertragPosition,
    vertragId: string
  ): Observable<HttpResponse<ApiVertragPosition>> {
    return this.http.post<ApiVertragPosition>(`vertraege/${vertragId}/vertrag-positionen`, position, {
      observe: 'response',
      responseType: 'json'
    });
  }

  updateVertragPosition(
    id: string,
    position: ApiVertragPosition
  ): Observable<HttpResponse<ApiVertragPosition>> {
    return this.http.post<ApiVertragPosition>(`vertrag-positionen/${id}`, position, {
      observe: 'response',
      responseType: 'json'
    });
  }

  resetVertragPosition(parentId: string): Observable<HttpResponse<ApiVertragPosition>> {
    return this.http.post<ApiVertragPosition>(`vertrag-positionen/${parentId}/reset`, null, {
      observe: 'response',
      responseType: 'json'
    });
  }

  jahresuebertragVertragsposition(parentId: string): Observable<HttpResponse<ApiVertragPosition>> {
    return this.http.post<ApiVertragPosition>(`vertrag-positionen/${parentId}/jahresuebertrag`, null, {
      observe: 'response',
      responseType: 'json'
    });
  }

  createVertragPositionVerbraucher(
    position: ApiVertragPositionVerbraucher,
    vertragPositionId: string
  ): Observable<HttpResponse<ApiVertragPositionVerbraucher>> {
    return this.http.post<ApiVertragPositionVerbraucher>(
      `vertrag-positionen/${vertragPositionId}/vertrag-position-verbraucher`,
      position,
      {
        observe: 'response',
        responseType: 'json'
      }
    );
  }

  createVertragPositionVerbraucher1(
    dto: ApiVertragPositionVerbraucher,
    vertragPositionId: string,
    personId?: string
  ): Observable<HttpResponse<ApiVertragPositionVerbraucher>> {
    let params = new HttpParams();
    if (personId) params = params.set('person', personId);

    return this.http.post<ApiVertragPositionVerbraucher>(
      `vertrag-positionen/${vertragPositionId}/vertrag-position-verbraucher`,
      dto,
      {
        params,
        observe: 'response',
        responseType: 'json'
      }
    );
  }

  updateVertragPositionVerbraucher(
    id: string,
    position: ApiVertragPositionVerbraucher
  ): Observable<HttpResponse<ApiVertragPositionVerbraucher>> {
    return this.http.post<ApiVertragPositionVerbraucher>(`vertrag-position-verbraucher/${id}`, position, {
      observe: 'response',
      responseType: 'json'
    });
  }

  resetAndCopyVertragPositionVerbraucher(
    id: string,
    stundensatzNeu: string
  ): Observable<HttpResponse<ApiVertragPositionVerbraucher>> {
    let params = new HttpParams().set('stundensatzNeu', stundensatzNeu);

    return this.http.post<ApiVertragPositionVerbraucher>(
      `vertrag-position-verbraucher/${id}/reset-and-copy`,
      null,
      {
        params,
        observe: 'response',
        responseType: 'json'
      }
    );
  }

  getVertragPositionVerbraucherStundenplanung(id: string): Observable<HttpResponse<ApiStundenplanung[]>> {
    return this.http.get<ApiStundenplanung[]>(`vertrag-position-verbraucher/${id}`, {
      observe: 'response',
      responseType: 'json'
    });
  }


  // TRIGGER
  getTrigger(id: string): Observable<HttpResponse<ApiTrigger>> {
    return this.http.get<ApiTrigger>(`trigger/${id}`, {
      observe: 'response',
      responseType: 'json'
    });
  }

  createTrigger(dto: ApiTrigger): Observable<HttpResponse<ApiTrigger>> {
    return this.http.post<ApiTrigger>(`trigger`, dto, {
      observe: 'response',
      responseType: 'json'
    });
  }

  updateTrigger(id: string, dto: ApiTrigger): Observable<HttpResponse<ApiTrigger>> {
    return this.http.post<ApiTrigger>(`trigger/${id}`, dto, {
      observe: 'response',
      responseType: 'json'
    });
  }

  getTriggerToVertrag(vertragId: string): Observable<HttpResponse<ApiTrigger[]>> {
    return this.http.get<ApiTrigger[]>(`vertraege/${vertragId}/trigger`, {
      observe: 'response',
      responseType: 'json'
    });
  }

// LKDETAILS
  getLkDetails(vertragId: string): Observable<HttpResponse<ApiLkDetails[]>> {
    return this.http.get<ApiLkDetails[]>(`vertraege/${vertragId}/lkdetails`, {
      observe: 'response',
      responseType: 'json'
    });
  }

  createLkDetails(dto: ApiLkDetails, vertragId: string): Observable<HttpResponse<ApiLkDetails>> {
    return this.http.post<ApiLkDetails>(`vertraege/${vertragId}/lkdetails`, dto, {
      observe: 'response',
      responseType: 'json'
    });
  }

  updateLkDetails(id: string, dto: ApiLkDetails): Observable<HttpResponse<ApiLkDetails>> {
    return this.http.post<ApiLkDetails>(`lkdetails/${id}`, dto, {
      observe: 'response',
      responseType: 'json'
    });
  }

// PRODUKT
  getProdukte(): Observable<HttpResponse<ApiProdukt[]>> {
    return this.http.get<ApiProdukt[]>(`produkte`, {
      observe: 'response',
      responseType: 'json'
    });
  }

  getProdukte1(expandAllStr: string = 'false', filter?: string): Observable<HttpResponse<ApiProdukt[]>> {
    let params = new HttpParams().set('expandAll', expandAllStr);
    if (filter) params = params.set('filter', filter);

    return this.http.get<ApiProdukt[]>(`produkte`, {
      params,
      observe: 'response',
      responseType: 'json'
    });
  }

  getProdukteFiltered(filter: string): Observable<HttpResponse<ApiProdukt[]>> {
    let params = new HttpParams().set('filter', filter);

    return this.http.get<ApiProdukt[]>(`produkte`, {
      params,
      observe: 'response',
      responseType: 'json'
    });
  }

  getProdukt(id: string, filter?: string): Observable<HttpResponse<ApiProdukt>> {
    let params = new HttpParams();
    if (filter) params = params.set('filter', filter);

    return this.http.get<ApiProdukt>(`produkte/${id}`, {
      params,
      observe: 'response',
      responseType: 'json'
    });
  }

  createProdukt(produkt: ApiProdukt): Observable<HttpResponse<ApiProdukt>> {
    return this.http.post<ApiProdukt>(`produkte`, produkt, {
      observe: 'response',
      responseType: 'json'
    });
  }

  updateProdukt(id: string, produkt: ApiProdukt): Observable<HttpResponse<ApiProdukt>> {
    return this.http.post<ApiProdukt>(`produkte/${id}`, produkt, {
      observe: 'response',
      responseType: 'json'
    });
  }

  // PRODUKT POSITION
  createProduktPosition(position: ApiProduktPosition, produktId: string): Observable<HttpResponse<ApiProduktPosition>> {
    return this.http.post<ApiProduktPosition>(`produkte/${produktId}/produkt-positionen`, position, {
      observe: 'response',
      responseType: 'json'
    });
  }

  updateProduktPosition(id: string, position: ApiProduktPosition): Observable<HttpResponse<ApiProduktPosition>> {
    return this.http.post<ApiProduktPosition>(`produkt-positionen/${id}`, position, {
      observe: 'response',
      responseType: 'json'
    });
  }

  createProduktPositionBuchungspunkt(
    position: ApiProduktPositionBuchungspunkt,
    produktPositionId: string
  ): Observable<HttpResponse<ApiProduktPositionBuchungspunkt>> {
    return this.http.post<ApiProduktPositionBuchungspunkt>(
      `produkt-positionen/${produktPositionId}/produkt-positionen-buchungspunkte`,
      position,
      {
        observe: 'response',
        responseType: 'json'
      }
    );
  }

  resetProduktPosition(id: string): Observable<HttpResponse<ApiProduktPosition>> {
    return this.http.post<ApiProduktPosition>(`produkt-positionen/${id}/reset`, null, {
      observe: 'response',
      responseType: 'json'
    });
  }

  updateProduktPositionBuchungspunkt(
    id: string,
    position: ApiProduktPositionBuchungspunkt
  ): Observable<HttpResponse<ApiProduktPositionBuchungspunkt>> {
    return this.http.post<ApiProduktPositionBuchungspunkt>(
      `produkt-positionen-buchungspunkte/${id}`,
      position,
      {
        observe: 'response',
        responseType: 'json'
      }
    );
  }

// STUNDENPLANUNG
  getStundenplanungByVerbraucher(id: string): Observable<HttpResponse<ApiStundenplanung[]>> {
    return this.http.get<ApiStundenplanung[]>(`vertrag-position-verbraucher/${id}`, {
      observe: 'response',
      responseType: 'json'
    });
  }

  getStundenplanung(id: string): Observable<HttpResponse<ApiStundenplanung>> {
    return this.http.get<ApiStundenplanung>(`stundenplanung/${id}`, {
      observe: 'response',
      responseType: 'json'
    });
  }

  createStundenplanung(
    object: ApiStundenplanung,
    produktPositionId: string,
    verbraucherId: string
  ): Observable<HttpResponse<ApiStundenplanung>> {
    let params = new HttpParams().set('verbraucher', verbraucherId);

    return this.http.post<ApiStundenplanung>(
      `produkt-positionen/${produktPositionId}/stundenplanung`,
      object,
      {
        params,
        observe: 'response',
        responseType: 'json'
      }
    );
  }

  updateStundenplanung(id: string, object: ApiStundenplanung): Observable<HttpResponse<ApiStundenplanung>> {
    return this.http.post<ApiStundenplanung>(`stundenplanung/${id}`, object, {
      observe: 'response',
      responseType: 'json'
    });
  }


  // TAETIGKEITSBUCHUNG
  createTaetigkeitsbuchung(
    dto: ApiTaetigkeitsbuchung,
    produktPositionBuchungspunktId: string,
    personId: string,
    vorgang?: string
  ): Observable<HttpResponse<ApiTaetigkeitsbuchung>> {
    let params = new HttpParams().set('personId', personId);
    if (vorgang) params = params.set('vorgang', vorgang);

    return this.http.post<ApiTaetigkeitsbuchung>(
      `produkt-positionen-buchungspunkte/${produktPositionBuchungspunktId}/taetigkeitsbuchungen`,
      dto,
      {
        params,
        observe: 'response',
        responseType: 'json'
      }
    );
  }

  updateTaetigkeitsbuchung(
    id: string,
    dto: ApiTaetigkeitsbuchung,
    vorgang?: string
  ): Observable<HttpResponse<ApiTaetigkeitsbuchung>> {
    let params = new HttpParams();
    if (vorgang) params = params.set('vorgang', vorgang);

    return this.http.post<ApiTaetigkeitsbuchung>(
      `taetigkeitsbuchungen/${id}`,
      dto,
      {
        params,
        observe: 'response',
        responseType: 'json'
      }
    );
  }

// ABSCHLUSS
  abschlussTag(datum: string, aufheben?: boolean): Observable<HttpResponse<void>> {
    let params = new HttpParams();
    if (aufheben !== undefined) params = params.set('aufheben', aufheben.toString());

    return this.http.post<void>(`abschluss-tag/${datum}`, null, {
      params,
      observe: 'response',
      responseType: 'json'
    });
  }

  abschlussMonat(datum: string): Observable<HttpResponse<void>> {
    return this.http.post<void>(`abschluss-monat/${datum}`, null, {
      observe: 'response',
      responseType: 'json'
    });
  }

  abschlussInfo(parentId: string): Observable<HttpResponse<ApiAbschlussInfo>> {
    return this.http.get<ApiAbschlussInfo>(`personen/${parentId}/abschluss-info`, {
      observe: 'response',
      responseType: 'json'
    });
  }

// BEREITSCHAFT
  createBereitschaft(dto: ApiStempelzeit, parentId: string): Observable<HttpResponse<ApiStempelzeit[]>> {
    return this.http.post<ApiStempelzeit[]>(`personen/${parentId}/bereitschaft`, dto, {
      observe: 'response',
      responseType: 'json'
    });
  }

  createBereitschaft1(dto: ApiStempelzeit, parentId: string, vorgangStr?: string): Observable<HttpResponse<ApiStempelzeit[]>> {
    let params = new HttpParams();
    if (vorgangStr) params = params.set('vorgang', vorgangStr);

    return this.http.post<ApiStempelzeit[]>(
      `personen/${parentId}/bereitschaft`,
      dto,
      {
        params,
        observe: 'response',
        responseType: 'json'
      }
    );
  }

  deleteBereitschaft(id: string): Observable<HttpResponse<void>> {
    return this.http.delete<void>(`bereitschaft/${id}`, {
      observe: 'response',
      responseType: 'json'
    });
  }

  deleteBereitschaft1(id: string, vorgangStr?: string): Observable<HttpResponse<void>> {
    let params = new HttpParams();
    if (vorgangStr) params = params.set('vorgang', vorgangStr);

    return this.http.delete<void>(`bereitschaft/${id}`, {
      params,
      observe: 'response',
      responseType: 'json'
    });
  }


  // MISC
  feiertage(): Observable<HttpResponse<ApiFeiertage>> {
    return this.http.get<ApiFeiertage>(`feiertage`, {
      observe: 'response',
      responseType: 'json'
    });
  }

  createZivildienerUrlaubKrank(dto: ApiStempelzeit, parentId: string): Observable<HttpResponse<ApiStempelzeit[]>> {
    return this.http.post<ApiStempelzeit[]>(`personen/${parentId}/zivi-urlaubkrank`, dto, {
      observe: 'response',
      responseType: 'json'
    });
  }

  getInfo(): Observable<HttpResponse<ApiInfo>> {
    return this.http.get<ApiInfo>(`info`, {
      observe: 'response',
      responseType: 'json'
    });
  }

// PERSONENVERANTWORTLICHER
  getPersonPersonenverantwortlicher(parentId: string, personenDetailStr?: string): Observable<HttpResponse<ApiPerson[]>> {
    let params = new HttpParams();
    if (personenDetailStr) params = params.set('persondetailgrad', personenDetailStr);

    return this.http.get<ApiPerson[]>(`personen/${parentId}/personenverantwortliche`, {
      params,
      observe: 'response',
      responseType: 'json'
    });
  }

  getPersonDurchfuehrungsverantwortlicher(jahrStr?: string): Observable<HttpResponse<ApiPerson[]>> {
    let params = new HttpParams();
    if (jahrStr) params = params.set('jahr', jahrStr);

    return this.http.get<ApiPerson[]>(`personen-durchfuehrungsverantwortlicher`, {
      params,
      observe: 'response',
      responseType: 'json'
    });
  }

// GEPLANT GEBUCHT
  getPersonGeplantGebucht(
    parentId: string,
    positionIdStr?: string,
    planungsjahrStr?: string
  ): Observable<HttpResponse<ApiGeplantGebucht>> {
    let params = new HttpParams();
    if (positionIdStr) params = params.set('produktPosition', positionIdStr);
    if (planungsjahrStr) params = params.set('planungsjahr', planungsjahrStr);

    return this.http.get<ApiGeplantGebucht>(`personen/${parentId}/geplant-gebucht`, {
      params,
      observe: 'response',
      responseType: 'json'
    });
  }

  getPersonGeplantGebucht1(
    parentId: string,
    positionIdStr?: string,
    planungsjahrStr?: string,
    addGebucht?: boolean,
    nurAktiv?: boolean
  ): Observable<HttpResponse<ApiGeplantGebucht>> {
    let params = new HttpParams();
    if (positionIdStr) params = params.set('produktPosition', positionIdStr);
    if (planungsjahrStr) params = params.set('planungsjahr', planungsjahrStr);
    if (addGebucht !== undefined) params = params.set('addGebucht', addGebucht.toString());
    if (nurAktiv !== undefined) params = params.set('nurAktiv', nurAktiv.toString());

    return this.http.get<ApiGeplantGebucht>(`personen/${parentId}/geplant-gebucht`, {
      params,
      observe: 'response',
      responseType: 'json'
    });
  }

  getPersonGeplant(
    parentId: string,
    planungsjahrStr?: string,
    addGebucht?: boolean,
    nurAktiv?: boolean
  ): Observable<HttpResponse<ApiGeplantGebucht>> {
    let params = new HttpParams();
    if (planungsjahrStr) params = params.set('planungsjahr', planungsjahrStr);
    if (addGebucht !== undefined) params = params.set('addGebucht', addGebucht.toString());
    if (nurAktiv !== undefined) params = params.set('nurAktiv', nurAktiv.toString());

    return this.http.get<ApiGeplantGebucht>(`personen/${parentId}/geplant`, {
      params,
      observe: 'response',
      responseType: 'json'
    });
  }

  // FREIGABE POSITION
  getFreigabePositionen(funktion?: string): Observable<HttpResponse<ApiFreigabePosition[]>> {
    let params = new HttpParams();
    if (funktion) params = params.set('funktion', funktion);

    return this.http.get<ApiFreigabePosition[]>(`freigabe-positionen`, {
      params,
      observe: 'response',
      responseType: 'json'
    });
  }

  getFreigabePositionenHistory(ab: string, bis: string): Observable<HttpResponse<ApiFreigabePosition[]>> {
    let params = new HttpParams().set('ab', ab).set('bis', bis);

    return this.http.get<ApiFreigabePosition[]>(`freigabePositionen/history`, {
      params,
      observe: 'response',
      responseType: 'json'
    });
  }

  getFreigabePositionTaetigkeitsbuchungen(id: string): Observable<HttpResponse<ApiTaetigkeitsbuchung[]>> {
    return this.http.get<ApiTaetigkeitsbuchung[]>(`freigabe-positionen/${id}/taetigkeitsbuchungen`, {
      observe: 'response',
      responseType: 'json'
    });
  }

  updateFreigabePositionen(
    dto: ApiFreigabePosition[],
    buchungsIds?: string[]
  ): Observable<HttpResponse<ApiFreigabePosition[]>> {
    let params = new HttpParams();
    if (buchungsIds && buchungsIds.length > 0) {
      buchungsIds.forEach(id => params = params.append('buchungId', id));
    }

    return this.http.post<ApiFreigabePosition[]>(`freigabe-positionen`, dto, {
      params,
      observe: 'response',
      responseType: 'json'
    });
  }

  getFreigabePositionenAnzahl(): Observable<HttpResponse<ApiFreigabePositionAnzahl>> {
    return this.http.get<ApiFreigabePositionAnzahl>(`freigabe-positionen-anzahl`, {
      observe: 'response',
      responseType: 'json'
    });
  }

  getFreigabeGruppen(): Observable<HttpResponse<ApiProduktPosition[]>> {
    return this.http.get<ApiProduktPosition[]>(`freigabe-gruppen`, {
      observe: 'response',
      responseType: 'json'
    });
  }

// PERSONENVERMERK
  getPersonVermerke(parentId: string, ab: string, bis: string): Observable<HttpResponse<ApiPersonenvermerk[]>> {
    let params = new HttpParams().set('ab', ab).set('bis', bis);

    return this.http.get<ApiPersonenvermerk[]>(`personen/${parentId}/personenvermerke`, {
      params,
      observe: 'response',
      responseType: 'json'
    });
  }

  createPersonVermerk(dto: ApiPersonenvermerk, parentId: string): Observable<HttpResponse<ApiPersonenvermerk>> {
    return this.http.post<ApiPersonenvermerk>(`personen/${parentId}/personenvermerke`, dto, {
      observe: 'response',
      responseType: 'json'
    });
  }

  updatePersonVermerk(id: string, dto: ApiPersonenvermerk): Observable<HttpResponse<ApiPersonenvermerk>> {
    return this.http.post<ApiPersonenvermerk>(`personenvermerke/${id}`, dto, {
      observe: 'response',
      responseType: 'json'
    });
  }

  deletePersonVermerk(id: string): Observable<HttpResponse<void>> {
    return this.http.delete<void>(`personenvermerke/${id}`, {
      observe: 'response',
      responseType: 'json'
    });
  }


  getAlleAktuellenTeamzuordnungen(): Observable<HttpResponse<ApiTeamzuordnungen>> {
    return this.http.get<ApiTeamzuordnungen>(`teamzuordnungen`, {
      observe: 'response',
      responseType: 'json'
    });
  }

  getAlleAktuellenVertragsparter(): Observable<HttpResponse<ApiVertragspartnerListe>> {
    return this.http.get<ApiVertragspartnerListe>(`vertragspartner`, {
      observe: 'response',
      responseType: 'json'
    });
  }

  getAlleAktuellenGeschaeftszahlen(): Observable<HttpResponse<ApiGeschaeftszahlenListe>> {
    return this.http.get<ApiGeschaeftszahlenListe>(`geschaeftszahlen`, {
      observe: 'response',
      responseType: 'json'
    });
  }

  getAlleAktuellenRollenbezeichnungen(): Observable<HttpResponse<ApiRollenbezeichnungsListe>> {
    return this.http.get<ApiRollenbezeichnungsListe>(`rollenbezeichnungen`, {
      observe: 'response',
      responseType: 'json'
    });
  }

  getAlleAktuellenLeistungskategorien(): Observable<HttpResponse<ApiLeistungskategorien>> {
    return this.http.get<ApiLeistungskategorien>(`leistungskategorien`, {
      observe: 'response',
      responseType: 'json'
    });
  }

  taetigkeiten(): Observable<HttpResponse<ApiTaetigkeiten>> {
    return this.http.get<ApiTaetigkeiten>(`taetigkeiten`, {
      observe: 'response',
      responseType: 'json'
    });
  }


  // INFO PDF - Text/JSON responses
  mussInfoPdfLesen(): Observable<HttpResponse<ApiMussPdfLesen>> {
    return this.http.get<ApiMussPdfLesen>(`infopdf/musslesen`, {
      observe: 'response',
      responseType: 'json'
    });
  }

  hatInfoPdfGelesen(): Observable<HttpResponse<void>> {
    return this.http.post<void>(`infopdf/hatgelesen`, null, {
      observe: 'response',
      responseType: 'json'
    });
  }

  createPdfVermerke(): Observable<HttpResponse<void>> {
    return this.http.post<void>(`infopdf/createpdfvermerke`, null, {
      observe: 'response',
      responseType: 'json'
    });
  }

// PDF UPLOAD - Returns string with responseType: 'text'
  uploadInformationsPdf(file: File): Observable<HttpResponse<string>> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`infopdf-upload`, formData, {
      responseType: 'text',
      observe: 'response'
    });
  }

  uploadInteressenskonfliktPdf(file: File): Observable<HttpResponse<string>> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`interessenskonfliktpdf-upload`, formData, {
      responseType: 'text',
      observe: 'response'
    });
  }

// PDF DOWNLOAD - Returns Blob with responseType: 'blob'
  getInfoPdf(): Observable<HttpResponse<Blob>> {
    return this.http.get(`infopdf`, {
      responseType: 'blob',
      observe: 'response'
    });
  }

  uploadTelefonliste(file: File): Observable<HttpResponse<string>> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`telefonliste`, formData, {
      responseType: 'text',
      observe: 'response'
    });
  }

  getTelefonlistePdf(): Observable<HttpResponse<Blob>> {
    return this.http.get(`telefonliste`, {
      responseType: 'blob',
      observe: 'response'
    });
  }

// VERIFY - Returns string with responseType: 'text'
  verify(): Observable<HttpResponse<string>> {
    return this.http.get(`verify`, {
      responseType: 'text',
      observe: 'response'
    });
  }
}
