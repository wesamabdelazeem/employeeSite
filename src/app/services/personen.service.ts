import { Injectable } from '@angular/core';
import { Person } from '../models/person';
import {BehaviorSubject, Observable, of, ReplaySubject, shareReplay, tap} from 'rxjs';
import {HttpClient, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import { AppConstants } from '../models/app-constants';
import { ApiPerson } from '../models/ApiPerson';
import {GetitRest2Service} from './getit-rest-2.service';
import {PersonService} from './person.service';
import {ApiPersonAnwesenheit} from '../models/ApiPersonAnwesenheit';
import {ApiStempelzeit} from '../models/ApiStempelzeit';
import {GetitRest3Service} from './getit-rest-3.service';
import {map} from 'rxjs/operators';
import {PersonHistoryEntry} from '../models/PersonHistoryEntry';

@Injectable({
  providedIn: 'root'
})
export class PersonenService {


  private currentUserSubject = new ReplaySubject<ApiPerson>(1);
  //private allPersonsSubject = new ReplaySubject<ApiPerson[]>(1);
  private allPersonsSubject = new BehaviorSubject<ApiPerson[]>([]);

  private anwesendPersonenSubject = new ReplaySubject<ApiPerson[]>(1);

  public currentUser$: Observable<ApiPerson> = this.currentUserSubject.asObservable();
  public allPersons$: Observable<ApiPerson[]> = this.allPersonsSubject.asObservable();


  public anwesendPersonen$: Observable<ApiPerson[]> = this.anwesendPersonenSubject.asObservable();

  private allPersonsLoaded : boolean = false;
  private anwesendPersonenLoaded : boolean = false;

  private loaded = false;
  private loading = false;


  constructor(private http: HttpClient,
              private getitRestService : GetitRest2Service,
              private getitRestService_ : GetitRest3Service,

  ) { }


  updatePerson(id: string, person : ApiPerson) : Observable<ApiPerson>{
    return this.getitRestService.updatePerson(id, person);
  }

  createPerson(person : ApiPerson) : Observable<ApiPerson>{
    return this.getitRestService.createPerson(person);
  }

  loadPersonen(): Observable<ApiPerson[]> {
    return  this.getAllPersons()
  }

   loadPersonen1(): Observable<HttpResponse<ApiPerson[]>> {
    return  this.getAllPersons1();
  }

  getPersons_(): Observable<HttpResponse<ApiPerson[]>> {
     return this.getitRestService_.getPersonen('true', 'false');
  }




  loadAnwesendPersonen(): Observable<ApiPerson[]> {
    return  this.getAnwesendPersonen()

  }


  loadPersonDetails(id : string): Observable<ApiPerson> {
    return this.getitRestService.getPerson(id, 'FullPvTlName', true, true);
  /*  console.log('API_URL_PERSONEN' , AppConstants.API_URL_PERSONEN);
    let url = AppConstants.API_URL_PERSONEN + '/' + id + '?persondetailgrad=FullPvTlName&berechneteStunden=true&addVertraege=true';
    return this.http.get<ApiPerson>(url);

   */
  }

  loadPersonDetailsNew(id : string): Observable<ApiPerson> {
    console.log('API_URL_PERSONEN' , AppConstants.API_URL_PERSONEN);
    let url = AppConstants.API_URL_PERSONEN + '/' + id + '?persondetailgrad=FullPvTlName&berechneteStunden=true&addVertraege=true';
    return this.http.get<ApiPerson>(url);
  }

  /**
   * Returns the audit-log (history-auswertung) for a single person.
   * Hits the back-end / mock-backend interceptor — no inline mock data here.
   */
  historyAuswertung(personId: string): Observable<PersonHistoryEntry[]> {
    console.log('historyAuswertung()', personId);
    return this.http.get<PersonHistoryEntry[]>(`personen/${personId}/historyAuswertung`);
  }


  loadLoggedInPerson()  : Observable<ApiPerson> {

    if (this.loading || this.loaded) {
      return this.currentUser$;
    }

    console.log('loadLoggedInPerson')
    //return this.getitRestService.getPerson('me', 'Me', true, false);


    return this.getitRestService.getPerson('me', 'Me', true, false).pipe(
      tap({
        next: (person: ApiPerson) => {
          console.log('Logged-in user loaded:', person);
          this.currentUserSubject.next(person);
          this.loaded = true;
          this.loading = false;
          localStorage.setItem('userRoles', JSON.stringify(person.rolle));

         // localStorage.setItem('userRoles', person.rolle?.toString());
        },
        error: (error) => {
          console.error(' Error loading logged-in user:', error);
          this.loading = false;
        }
      })
    );
  }

  getCurrentUser(): ApiPerson | null {
    let currentUser: ApiPerson | null = null;

    // Get the latest value from the subject
    this.currentUser$.subscribe(user => {
      currentUser = user;
    });

    return currentUser;
  }

  getAnwesendPersonen() : Observable<ApiPersonAnwesenheit[]>{
    if(this.anwesendPersonenLoaded){
      return this.anwesendPersonen$;
    }

    return this.getitRestService.getPersonsAnwesend( ).pipe(
      tap({
        next : (persons : ApiPerson[])=> {
          console.log('Initializing - getAnwesendPersonen Loaded Person', persons);

          this.anwesendPersonenSubject.next(persons);
          this.anwesendPersonenLoaded = true;
        },
        error :( error : any)=> {
          this.anwesendPersonenLoaded = false;
          console.error(' Error loading all Persons:', error);

        }
      })
    )
  }

  getAnwesendPersonen_() : Observable<ApiPerson[]>{
    if(this.anwesendPersonenLoaded){
      return this.anwesendPersonen$;
    }

    return this.getitRestService.getPersonsAnwesend( ).pipe(
      tap({
        next : (persons : ApiPerson[])=> {
          console.log('Initializing - getAnwesendPersonen Loaded Person', persons);

          this.anwesendPersonenSubject.next(persons);
          this.anwesendPersonenLoaded = true;
        },
        error :( error : any)=> {
          this.anwesendPersonenLoaded = false;
          console.error(' Error loading all Persons:', error);

        }
      })
    )
  }


  //private allPersons$: Observable<ApiPerson[]> | null = null;


  private cachedPersons$: Observable<HttpResponse<ApiPerson[]>> | null = null;
  private cachedPersonsFalseBerechneteStundenFalseNurName$: Observable<HttpResponse<ApiPerson[]>> | null = null;

  getAllPersons_(): Observable<HttpResponse<ApiPerson[]>> {
    if (!this.cachedPersons$) {
      this.cachedPersons$ = this.getitRestService.getPersonen('true', 'false').pipe(
        map(persons => new HttpResponse<ApiPerson[]>({   // ← wrap in HttpResponse
          body: persons,
          status: 200,
          statusText: 'OK (cached)'
        })),
        shareReplay(1)
      );
    }else {
      console.log('########### LOAD FRIN CACHE', this.cachedPersons$);
    }
    return this.cachedPersons$;
  }

  getAllPersons__( berechneteStunden?: string,
                  nurNamen?: string): Observable<HttpResponse<ApiPerson[]>> {
    if(berechneteStunden === 'false' && nurNamen ==='false'){
      if (!this.cachedPersonsFalseBerechneteStundenFalseNurName$) {
        this.cachedPersonsFalseBerechneteStundenFalseNurName$ = this.getitRestService.getPersonen(berechneteStunden,  nurNamen).pipe(
          map(persons => new HttpResponse<ApiPerson[]>({   // ← wrap in HttpResponse
            body: persons,
            status: 200,
            statusText: 'OK (cached)'
          })),
          shareReplay(1)
        );
      }else {
        console.log('########### LOAD cachedPersonsFalseBerechneteStundenFalseNurName$ FROM CACHE', this.cachedPersonsFalseBerechneteStundenFalseNurName$);
      }
      return this.cachedPersonsFalseBerechneteStundenFalseNurName$;

    }else{
      if (!this.cachedPersons$) {
        this.cachedPersons$ = this.getitRestService.getPersonen('true', 'false').pipe(
          map(persons => new HttpResponse<ApiPerson[]>({   // ← wrap in HttpResponse
            body: persons,
            status: 200,
            statusText: 'OK (cached)'
          })),
          shareReplay(1)
        );
      }else {
        console.log('########### LOAD cachedPersons$ FROM CACHE', this.cachedPersons$);
      }
      return this.cachedPersons$;
    }

  }


  getAllPersons() : Observable<ApiPerson[]>{
    console.log('get AllPersons');
    console.log('allPersonsLoaded', this.allPersonsLoaded);
    if(this.allPersonsLoaded){
      console.log('this.allPersons$', this.allPersons$);

      this.allPersons$.subscribe({
        next: (persons) => {
          console.log('%c Persons updated', 'color: green; font-weight: bold;');
          console.log('Timestamp:', new Date().toISOString());
          console.log('Count:', persons.length);
          console.log('Sample:', persons); // First 3 persons
        }
      });
      return this.allPersons$;
    }

    return this.getitRestService.getPersonen('true', 'false' ).pipe(
      tap({
        next : (persons : ApiPerson[])=> {
          console.log('Initializing - Loaded Person', persons);

          this.allPersonsSubject.next(persons);
          this.allPersonsLoaded = true;
        },
        error :( error : any)=> {
          this.allPersonsLoaded = false;
          console.error(' Error loading all Persons:', error);

        }
      })
    )
  }


  getAllPersons1(): Observable<HttpResponse<ApiPerson[]>> {
    console.log('getAllPersons()');
    console.log('allPersonsLoaded:', this.allPersonsLoaded);

    // If cached, wrap the cached array in a fake HttpResponse
    if (this.allPersonsLoaded) {
      console.log('Returning cached persons');

      // Create a synthetic HttpResponse from cached data
      const cachedPersons = this.allPersonsSubject.getValue();
      const fakeResponse = new HttpResponse<ApiPerson[]>({
        body: cachedPersons,
        status: 200,
        statusText: 'OK (cached)',
        url: '/api/personen'
      });

      // Return as Observable using of()
      return of(fakeResponse);
    }

    // Fetch fresh data with full HttpResponse
    console.log('Fetching fresh persons from API');

    return this.getitRestService.getPersonen1('true', 'false').pipe(
      tap({
        next: (response: HttpResponse<ApiPerson[]>) => {
          console.log('Fresh data loaded');
          console.log('Status:', response.status);
          console.log('Count:', response.body?.length);

          // Cache only the body (ApiPerson[])
          if (response.body) {
            this.allPersonsSubject.next(response.body);
            this.allPersonsLoaded = true;
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error(' Error loading persons:', error);
          this.allPersonsLoaded = false;
        }
      })
    );
  }
}
