import {HttpClient, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
 import { Person, StempelzeitDto } from '../models/person';
import { AppConstants } from '../models/app-constants';
import { TimeEntry } from '../models/time-entry.interface';
 import { catchError, Observable, throwError, map,  of, tap } from 'rxjs';
import { GetitRestService } from './getit-rest.service';
import { ApiStempelzeit } from '../models/ApiStempelzeit';
import {DateUtilsService} from './utils/date-utils.service';
import {ApiProdukt} from '../models/ApiProdukt';
import {GetitRest2Service} from './getit-rest-2.service';
import {ApiPerson} from '../models/ApiPerson';
import {GetitRest3Service} from './getit-rest-3.service';

@Injectable({
  providedIn: 'root'
})
export class StempelzeitService {

  private detail2 = "zivildiener-details.json"

  constructor(private http: HttpClient,
              private getitRestSevice : GetitRestService,
              private getitRestSevice_ : GetitRest2Service,
              private getitRestSevice__ : GetitRest3Service

  ) { }


  getPersons(): Observable<Person[]> {
    return this.http.get<Person[]>(AppConstants.API_URL_PERSONEN);
  }

  getPersons_(): Observable<ApiPerson[]> {
    //return this.http.get<Person[]>(AppConstants.API_URL_PERSONEN);
    return this.getitRestSevice_.getPersonen('true', 'false');
  }


  getStempelzeiten(id : string): Observable<ApiStempelzeit[]> {
    let firstDayOfLastMonth = DateUtilsService.getFirstDayOfLastMonth();
    return  this.getitRestSevice_.getPersonStempelzeitenNoAbwesenheit(id, firstDayOfLastMonth);
  }

  getStempelzeiten_(id : string): Observable<HttpResponse<ApiStempelzeit[]>> {
    let firstDayOfLastMonth = DateUtilsService.getFirstDayOfLastMonth();
    return  this.getitRestSevice__.getPersonStempelzeitenNoAbwesenheit(id, firstDayOfLastMonth);
  }

  getPersonGebuchtProdukte(personId : string) : Observable<ApiProdukt[]>{
    let firstDayOfLastMonth = DateUtilsService.getFirstDayOfLastMonth();
    return this.getitRestSevice_.getPersonProdukte(personId ,'gebucht', firstDayOfLastMonth);

  }

  getPersonGebuchtProdukte_(personId : string) : Observable<HttpResponse<ApiProdukt[]>>{
    let firstDayOfLastMonth = DateUtilsService.getFirstDayOfLastMonth();
    return this.getitRestSevice__.getPersonProdukte(personId ,'gebucht', firstDayOfLastMonth);

  }
  createStempelzeit(stempelZeit: ApiStempelzeit, personId : string): Observable<ApiStempelzeit> {
    console.log('createStempelzeit-personId', personId);
    return this.getitRestSevice.createStempelzeit(stempelZeit, personId, 'StempelzeitenSelbst');
  }

  createStempelzeit_(stempelZeit: ApiStempelzeit, personId : string): Observable<HttpResponse<ApiStempelzeit>> {
    console.log('createStempelzeit-personId', personId);
    return this.getitRestSevice__.createStempelzeit(stempelZeit, personId, 'StempelzeitenSelbst');
  }


  updateStempelzeit(stempelZeit: ApiStempelzeit,  stempelzeitId : string): Observable<ApiStempelzeit> {

    console.log('stempelZeit', stempelZeit);
    console.log('stempelzeitId', stempelzeitId);

    return this.getitRestSevice.updateStempelzeit(stempelZeit,  stempelzeitId, 'StempelzeitenPO' );
  }

  updateStempelzeit_(stempelZeit: ApiStempelzeit,  stempelzeitId : string): Observable<HttpResponse<ApiStempelzeit>> {

    console.log('stempelZeit', stempelZeit);
    console.log('stempelzeitId', stempelzeitId);

    return this.getitRestSevice__.updateStempelzeit(stempelZeit,  stempelzeitId, 'StempelzeitenPO' );
  }

updateStempelzeit2(stempelZeit: StempelzeitDto): Observable<TimeEntry> {
  console.log('stempelZeit', stempelZeit);
  let url = AppConstants.API_URL_STEMPELZEITEN + '/' + stempelZeit.id + '?vorgang=StempelzeitenPO' ;

  console.log('updatePerson-POST-URL', url);

  return   this.http.post<TimeEntry>(url, stempelZeit);

}

  // ============================================================================
  // MAIN METHOD: Delete Stempelzeit
  // ============================================================================
  // Instructions for Backend Developer:
   // ============================================================================

  deleteStempelzeitSmart(stempelzeit: ApiStempelzeit, id: string): Observable<ApiStempelzeit> {
    console.log('Deleting stempelzeit');

    return this.getitRestSevice.updateStempelzeit(stempelzeit, id, 'ZivildienerPO' ).pipe(
      tap((result: ApiStempelzeit) => {
        console.log('Stempelzeit deleted/updated successfully:', result);
      }),
      catchError((error) => {
        console.error('Error deleting/updating stempelzeit:', error);
         return throwError(() => new Error('Failed to delete stempelzeit. Please try again.'));
      })
    );



  }
   // ============================================================================
  // MAIN METHOD: Save Stempelzeit
  // ============================================================================
  // Instructions for Backend Developer:
  // - Currently simulating save with JSON (active code below)
  // - To switch to backend: Comment out JSON section, uncomment BACKEND section
  // ============================================================================

  saveStempelzeitSmart(stempelzeit: ApiStempelzeit, id: string, isCreating: boolean): Observable<ApiStempelzeit> {
    console.log('Saving stempelzeit, isCreating:', isCreating);


    if(isCreating){
      return this.getitRestSevice.createStempelzeit(stempelzeit, id, 'ZivildienerPO' ).pipe(
        tap((result: ApiStempelzeit) => {
          console.log('Stempelzeit deleted/updated successfully:', result);
        }),
        catchError((error) => {
          console.error('Error deleting/updating stempelzeit:', error);
           return throwError(() => new Error('Failed to delete stempelzeit. Please try again.'));
        })
      );
    }else{
      return this.getitRestSevice.updateStempelzeit(stempelzeit, id, 'ZivildienerPO' ).pipe(
        tap((result: ApiStempelzeit) => {
          console.log('Stempelzeit deleted/updated successfully:', result);
        }),
        catchError((error) => {
          console.error('Error deleting/updating stempelzeit:', error);
           return throwError(() => new Error('Failed to delete stempelzeit. Please try again.'));
        })
      );
    }


    //  JSON FILE SIMULATION (CURRENTLY ACTIVE)
    // Simulating save operation for development/testing
   /* const savedStempelzeit: ApiStempelzeit = {
      ...stempelzeit
    };
    console.log('Simulated save to JSON (no actual persistence)');
    return of(savedStempelzeit);
    */

    //  BACKEND API
    // Uncomment this section when backend is ready:
    /*
    if (isCreating) {
      return this.getitService.createStempelzeit(stempelzeit, personId, 'ZivildienerFO').pipe(
        map(response => {
          console.log('Created via BACKEND API');
          return response;
        }),
        catchError(error => {
          console.error(' Backend create error:', error);
          return throwError(() => 'Failed to create stempelzeit');
        })
      );
    } else {
      return this.getitService.updateStempelzeit(stempelzeit, personId).pipe(
        map(response => {
          console.log('Updated via BACKEND API');
          return response;
        }),
        catchError(error => {
          console.error(' Backend update error:', error);
          return throwError(() => 'Failed to update stempelzeit');
        })
      );
    }
    */
  }


   // ============================================================================
  // MAIN METHOD: Get Stempelzeiten
  // ============================================================================
  // Instructions for Backend Developer:
  // - Currently using JSON file (active code below)
  // - To switch to backend: Comment out JSON section, uncomment BACKEND section
  // ============================================================================

  getStempelzeitenSmart(personId: string): Observable<ApiStempelzeit[]> {
    console.log('Loading stempelzeiten for person:', personId);

    // -------------------------------------------------------------------------
    // OPTION 1: JSON FILE (CURRENTLY ACTIVE)
    // -------------------------------------------------------------------------
    // Using local JSON file for development/testing
    return this.getdetail2ById(personId).pipe(
      map(staticData => {
      //  const extractedData = this.extractStempelzeitenFromStatic(staticData);
       // console.log(' Loaded from JSON file:', extractedData.length, 'entries');
        return staticData;
      }),
      catchError(error => {
        console.error('Error loading from JSON file:', error);
        return of([]);
      })
    );

    // -------------------------------------------------------------------------
    // OPTION 2: BACKEND API
    // -------------------------------------------------------------------------
    // Uncomment this section when backend is ready:
    /*
    return this.getitService.getPersonStempelzeitenOhneAbwesenheit(personId).pipe(
      map(backendData => {
        console.log('Loaded from BACKEND API (without absences):', backendData.length, 'entries');
        return backendData;
      }),
      catchError(error => {
        console.error('Backend API error:', error);
        return throwError(() => 'Failed to load data from backend');
      })
    );
    */
  }


  getdetail2ById(id: string): Observable<ApiStempelzeit[]> {

    return this.getitRestSevice.getPersonStempelzeiten(id).pipe(
      tap(stempelzeiten => console.log("Before filter:", stempelzeiten)),
       catchError(this.handelError)
    );
  }

  getdetail2ById___(id: string): Observable<any> {
    return this.http.get<any>(this.detail2).pipe(
      catchError(this.handelError)
    );
  }


   // Extract stempelzeiten from various JSON data structures
   private extractStempelzeitenFromStatic(data: any): ApiStempelzeit[] {
    if (Array.isArray(data)) {
      return data;
    } else if (data?.timeEntries && Array.isArray(data.timeEntries)) {
      return data.timeEntries;
    } else if (data?.stempelzeiten && Array.isArray(data.stempelzeiten)) {
      return data.stempelzeiten;
    } else if (data?.content && Array.isArray(data.content)) {
      return data.content;
    } else if (data?.login) {
      return [data];
    } else {
      console.warn(' Unknown JSON data structure:', data);
      return [];
    }
  }


    // Error handler for HTTP requests
    private handelError(error: HttpErrorResponse) {
      let userMessage = 'An unknown error occurred!'
      if (error.error instanceof ErrorEvent) {
        console.log('A client side error occurred:', error.error.message);
        userMessage = `network error: ${error.error.message}`;
      } else {
        console.error(`Backend returned code ${error.status}, body was:`, error.error);
        if (error.status === 404) {
          userMessage = 'The requested stempelzeit data could not be found (Error 404). Please check the file path.';
        } else if (error.status === 500) {
          userMessage = 'There was a server error (Error 500). Please try again later.';
        } else {
          userMessage = `Error: ${error.statusText} (code: ${error.status})`;
        }
      }
      return throwError(() => userMessage)
    }


}
