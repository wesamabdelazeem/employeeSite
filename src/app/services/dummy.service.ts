import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { ApiPerson } from '../models/ApiPerson';
import { ApiGeplantGebucht } from '../models/ApiGeplantGebucht';
import { ApiLeistungskategorien } from '../models/ApiLeistungskategorien';
import { ApiProdukt } from '../models/ApiProdukt';
import { ApiFreigabePositionAnzahl } from '../models/ApiFreigabePositionAnzahl';
import { ApiVertrag } from '../models/ApiVertrag';
import { ApiStempelzeit } from '../models/ApiStempelzeit';
//import { Organisationseinheit } from '../models/organisationseinheit';
import { AppConstants } from '../models/app-constants';
//import { Datalistorganizationanc } from '../models/datalistorganizationanc';
import { ApiAbschlussInfo } from '../models/ApiAbschlussInfo';

@Injectable({
  providedIn: 'root'
})
export class DummyService {

  ///////// Personen Component ///////////////
  private readonly json1 = '/assets/1_json_person_detail_response_2.json';
  private readonly json2 = '/1_json_person_detail_response_1750153663701.json';
  private readonly json3 = '/assets/json_personen_list.json';
  private readonly abwesenheitKorrigieren='/assets/abwesenheit-korrigieren.json';
  private readonly apiDelay = 500;
private readonly json4 = '/bereitschaft-korrigieren-2.json';
private readonly json5 = '/bereitschaft-korrigieren-hassan-2.json';

  ///////// Stempelzeiten Component ///////////////
  private listUrl = "/assets/stempelzeit-list.json"
  private detailUrl = "stempelzeit-details.json"
  private detail2 = "zivildiener-details.json"

  ///////// Products JSON - NEW! ///////////////
  private produkteUrl = "tatigkeiten-historisch-produkt.json"  // Add your products JSON file name here

  private  stem='/assets/json_stempelzeiten_1.json'
  private stempelzeiten='/assets/json_details_Update_2026.json'
  private stempelzeitenInfo="/assets/stempel_info.json"

  private produkteUrlFiltered = "/assets/request_product_filter.json"
  private produkteStempFiltered = "/assets/Json_produkte-stemp.json"
  private ziviStempel="/assets/response_details_1754057171119.json"



  private listUrl2 = "/assets/stempelzeit-list.json"
  private detailUrl2 = "/assets/zivildiener-details.json"
  constructor(private http: HttpClient) { }

  ///////////////////////////////// Personen Component ////////////////////////////////////////

  getPerson(
    id: string,
    persondetail?: string,
    berechneteStunden: boolean = false,
    addVertraege?: boolean
  ): Observable<ApiPerson> {
    console.log("loading id " + id);
    console.log("parameters:", { persondetail, berechneteStunden, addVertraege });

    return this.http.get<ApiPerson>(this.json1).pipe(
      delay(this.apiDelay),
      map(person => {
        console.log("person details loaded from json1");
        return person;
      })
    );
  }

  getPersonenn(
    berechneteStunden: boolean = false,
    nurNamen: boolean = false
  ): Observable<ApiPerson[]> {
    console.log('loading persons list');
    console.log('parameters:', { berechneteStunden, nurNamen });

    return this.http.get<ApiPerson[]>(this.json3).pipe(
      delay(this.apiDelay),
      map(response => {
        const persons: ApiPerson[] = Array.isArray(response) ? response : [];
        console.log("persons loaded from json3:", persons.length);
        return persons;
      })
    );
  }

  getPersonNachverrechnung(): Observable<ApiPerson[]> {
    return this.http.get<ApiPerson[]>(this.json3).pipe(
      delay(this.apiDelay),
      map(response => Array.isArray(response) ? response : [])
    );
  }

  getPersonen(berechneteStunden?: string,
  nurNamen?: string,
  funktion?: string): Observable<ApiPerson[]> {
    const params = new URLSearchParams();
    if(berechneteStunden!==undefined){
    params.append('berechneteStunden', berechneteStunden.toString());
    }
    if(nurNamen!==undefined){
    params.append('nurNamen', nurNamen.toString());
    }
    // if(funktion!==undefined){
    // params.append('funktion', funktion.toString());
    // }


  const queryString = params.toString();
  const path = queryString ? `${this.listUrl}?${queryString}` : this.listUrl;

  return this.http.get<ApiPerson[]>(path).pipe(
    // delay(this.apiDelay),
    // map(data => {
    //   console.log('Persons loaded from JSON (mock):', data.length);
    //   return data;
    // })
  );
}

  updatePerson(person: ApiPerson, id: string): Observable<ApiPerson> {
    console.log("updating person", id);
    return of(person).pipe(
      delay(this.apiDelay),
      map(updatedPerson => {
        console.log('person updated');
        return updatedPerson;
      })
    );
  }

  createPerson(person: ApiPerson): Observable<ApiPerson> {
    console.log("creating person");
    const newPerson = {
      ...person,
      id: 'MOCK_' + Date.now().toString(),
      version: 1
    };

    return of(newPerson).pipe(
      delay(this.apiDelay),
      map(createdPerson => {
        console.log("created mock person with id:", createdPerson.id);
        return createdPerson;
      })
    );
  }

  getPersonGeplantGebucht(
    personIdStr: string,
    positionIdStr?: string,
    planungsjahrStr?: string
  ): Observable<ApiGeplantGebucht> {
    console.log("Loading planned/booked data for:", personIdStr);
    return of({} as ApiGeplantGebucht).pipe(
      delay(this.apiDelay),
      map(data => {
        console.log("Planned/booked data loaded (MOCK - empty)");
        return data;
      })
    );
  }

  getAlleAktuellenLeistungskategorien(): Observable<ApiLeistungskategorien> {
    console.log("Loading performance categories");
    return of({} as ApiLeistungskategorien).pipe(
      delay(this.apiDelay),
      map(data => {
        console.log("Performance categories loaded (MOCK - empty)");
        return data;
      })
    );
  }

  getPersonProdukte(
    personId: string,
    filter?: string,
    taetigkeitenAb?: string,
    taetigkeitenBis?: string,
    planungsjahr?: string
  ): Observable<ApiProdukt[]> {
    console.log("Loading products for person:", personId);
    console.log("parameters:", { filter, taetigkeitenAb, taetigkeitenBis });

    // Load from the products JSON file
    return this.http.get<ApiProdukt[]>(this.produkteUrl).pipe(
      delay(this.apiDelay),
      map(products => {
        if (Array.isArray(products)) {
          console.log("Products loaded from JSON:", products.length);
          return products;
        } else {
          console.log("Products data is not an array");
          return [];
        }
      })
    );
  }

  getPersonPersonenverantwortlicher(
    personalverantwortlicherid: string,
    personenDetailStr?: string
  ): Observable<ApiPerson[]> {
    console.log("Loading responsible persons for:", personalverantwortlicherid);
    return of([]).pipe(
      delay(this.apiDelay),
      map(data => {
        console.log("Responsible persons loaded (MOCK - empty)");
        return data;
      })
    );
  }

  getVertraegeVerantwortlicher(): Observable<ApiVertrag[]> {
    console.log("Loading responsible contracts");
    return of([]).pipe(
      delay(this.apiDelay),
      map(data => {
        console.log("Contracts loaded (MOCK - empty)");
        return data;
      })
    );
  }

  getFreigabePositionenAnzahl(): Observable<ApiFreigabePositionAnzahl> {
    console.log("Loading approval count");
    return of({ anzahl: 0 } as ApiFreigabePositionAnzahl).pipe(
      delay(this.apiDelay),
      map(data => {
        console.log("Approval count loaded (MOCK - zero)");
        return data;
      })
    );
  }

  ///////////////////////////////// Stempelzeiten & Zivildiener Component ////////////////////////////////////////

  getPersonStempelzeiten(
    personId: string,
    loginAb?: string,
    loginBis?: string
  ): Observable<ApiStempelzeit[]> {
    console.log('Loading stempelzeiten for person:', personId);
    console.log('parameters:', { loginAb, loginBis });

    // Use detailUrl instead of listUrl for actual time entries
    return this.http.get<any>(this.detailUrl).pipe(
      delay(this.apiDelay),
      map(data => {
        if (Array.isArray(data)) {
          console.log('Stempelzeiten loaded from JSON:', data.length);
          return data;
        } else if (data && typeof data === 'object') {
          const extracted = data.stempelzeiten ||
            data.timeEntries ||
            data.content ||
            [];
          console.log('Stempelzeiten loaded from JSON (nested):', extracted.length);
          return extracted;
        }
        console.log('Stempelzeiten loaded from JSON: empty');
        return [];
      })
    );
  }

  createStempelzeit(
    dto: ApiStempelzeit,
    personId: string,
    vorgang?: string
  ): Observable<ApiStempelzeit> {
    console.log('Creating stempelzeit for person:', personId);
    console.log('vorgang:', vorgang);

    const newStempelzeit = {
      ...dto,
      id: 'MOCK_' + Date.now().toString(),
      version: 1
    };

    return of(newStempelzeit).pipe(
      delay(this.apiDelay),
      map(created => {
        console.log('Stempelzeit created (MOCK) with id:', created.id);
        return created;
      })
    );
  }

  updateStempelzeit(
    dto: ApiStempelzeit,
    id: string,
    vorgang?: string | boolean
  ): Observable<ApiStempelzeit> {
    console.log('Updating stempelzeit:', id);
    console.log('vorgang:', vorgang);
    if (vorgang === true) {
      return this.createStempelzeit(dto, id);
    }

    return of(dto).pipe(
      delay(this.apiDelay),
      map(updated => {
        console.log('Stempelzeit updated (MOCK)');
        return updated;
      })
    );
  }

  deleteStempelzeit(
    dto: ApiStempelzeit,
    id: string,
    vorgang?: string
  ): Observable<void> {
    console.log('Deleting stempelzeit for person:', id);
    console.log('vorgang:', vorgang);
    console.log('Stempelzeit to delete:', dto);

    return of(void 0).pipe(
      delay(this.apiDelay),
      map(() => {
        console.log('Stempelzeit deleted (MOCK)');
      })
    );
  }

  getStempelzeitenById(id: string): Observable<any> {
    return this.http.get<any>(this.detailUrl).pipe();
  }

  getStempelzeiten(): Observable<any[]> {
    return this.http.get<any[]>(this.listUrl).pipe();
  }


  getZivildiener(): Observable<any[]> {
    return this.http.get<any[]>(this.listUrl2).pipe();
  }

  getZivildienerById(id: string): Observable<any> {
    return this.http.get<any>(this.detailUrl2).pipe();
  }

  //////////////organization////////
/*
  private selectedOrganizationSubject = new BehaviorSubject<Datalistorganizationanc | null>(null);
  selectedOrganization$ = this.selectedOrganizationSubject.asObservable();

  setSelectedOrganization(org: Datalistorganizationanc) {
    this.selectedOrganizationSubject.next(org);
  }

  getSelectedOrganization(): Observable<Datalistorganizationanc | null> {
    return this.selectedOrganization$;
  }

  clearSelectedOrganization(): void {
    this.selectedOrganizationSubject.next(null);
  }
*/
//////////////////////////////////////Bereitschaft///////////////////////
  getPersonStempelzeitenNoAbwesenheit (
    personId: string,
    loginAb?: string,
    loginBis?: string
  ): Observable<ApiStempelzeit[]> {
    console.log('Loading stempelzeiten for person:', personId);
    console.log('parameters:', { loginAb, loginBis });

    return this.http.get<any>(this.json5).pipe(
      delay(this.apiDelay),
      map(data => {
        if (Array.isArray(data)) {
          console.log('Stempelzeiten loaded from JSON:', data.length);
          return data;
        } else if (data && typeof data === 'object') {
          const extracted = data.stempelzeiten ||
            data.timeEntries ||
            data.content ||
            [];
          console.log('Stempelzeiten loaded from JSON (nested):', extracted.length);
          return extracted;
        }
        console.log('Stempelzeiten loaded from JSON: empty');
        return [];
      })
    );
  }

  private data: ApiStempelzeit[] = [];

createBereitschaft(
  personIdStr: string,
  dto: ApiStempelzeit,
  vorgangStr?:string

): Observable<ApiStempelzeit[]> {
    this.data.push(dto);
    return of(this.data);
  }

deleteBereitschaft(id: string): Observable<void> {
  this.data = this.data.filter(
    x => `${x.login}-${x.logoff}` !== id
  );
  return of(void 0);
}



getPersonAbschlussInfo(personIdStr: string): Observable<ApiAbschlussInfo> {

  const dummyData: ApiAbschlussInfo = {
    naechsterBuchbarerTag: '2026-01-23',
    naechsterTagesabschlussAufheben: '2026-01-24',
    letzterMonatsabschluss: '2025-12-31',
    letzterGlobalerMonatsabschluss: '2025-12-31',
    ersteBuchung: '2025-01-01'
  };

  return of(dummyData);
}
  ////////////////////////Abwesenheit korrigieren//////////

  getAbwesenheitKorrigieren(): Observable<any[]> {
    return this.http.get<any[]>(this.abwesenheitKorrigieren).pipe();
  }
  //////////////////////////////////tatigkeiten////////////////////////
  abschlussInfo(personId: string): Observable<ApiAbschlussInfo> {
    console.log('DummyService: abschlussInfo called for', personId);

 const dummyData: ApiAbschlussInfo = {
  naechsterBuchbarerTag: '2026-01-24',
  letzterMonatsabschluss: '2026-01-01',
  ersteBuchung: '2026-01-01T08:00:00'
};


    return of(dummyData);
  }

  getPersonStempelzeitenNoAbwesenheit2 (
    personId: string,
    loginAb?: string,
    loginBis?: string
  ): Observable<ApiStempelzeit[]> {
    // console.log('Loading stempelzeiten for person:', personId);
    // console.log('parameters:', { loginAb, loginBis });

    console.log('getPersonStempelzeitenNoAbwesenheit2', new Date());
    return this.http.get<any>(this.stempelzeiten)
    // .pipe(
    //   delay(this.apiDelay),
    //   map(data => {
    //     if (Array.isArray(data)) {
    //       console.log('Stempelzeiten loaded from JSON:', data.length);
    //       return data;
    //     } else if (data && typeof data === 'object') {
    //       const extracted = data.stempelzeiten ||
    //         data.timeEntries ||
    //         data.content ||
    //         [];
    //       console.log('Stempelzeiten loaded from JSON (nested):', extracted.length);
    //       return extracted;
    //     }
    //     console.log('Stempelzeiten loaded from JSON: empty');
    //     return [];
    //   })
    // );
  }
  getPersonStempelzeitenNoAbwesenheit3(
    parentId: string,
    loginAb?: string,
    loginBis?: string
  ): Observable<ApiStempelzeit[]> {
    return this.http.get<any>(this.ziviStempel)
  }

  getPersonAbschlussInfo1(personIdStr: string): Observable<ApiAbschlussInfo> {

    return this.http.get<any>(this.stempelzeitenInfo)
  }

  getPersonProdukte1(
    personId: string,
    filter?: string,
    taetigkeitenAb?: string,
    taetigkeitenBis?: string,
    planungsjahr?: string
  ): Observable<ApiProdukt[]> {
    const url=filter?this.produkteStempFiltered:this.produkteUrl
    return this.http.get<ApiProdukt[]>(url)
  }
}
