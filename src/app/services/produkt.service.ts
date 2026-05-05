import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, of, tap, throwError } from 'rxjs';
import { Produkt } from '../models/person';
import { AppConstants } from '../models/app-constants';
import {ApiProdukt} from '../models/ApiProdukt';
import {GetitRest2Service} from './getit-rest-2.service';
import {hasMockProduktDetail, MOCK_PRODUKT_DETAILS} from '../mock/produkt-detail.mock';




@Injectable({
  providedIn: 'root'
})
export class ProduktService {

  private listUrl = 'produkte.json';
  private detailUrl = 'produkte_detail.json';


  constructor(private http: HttpClient,
              private getitRestService : GetitRest2Service) { }




  getProdukte(): Observable<ApiProdukt[]> {
    // Inline mock so the list lands on IDs that getProduktById() can
    // resolve via MOCK_PRODUKT_DETAILS — see src/app/mock/produkt-detail.mock.ts.
    const mocks = Object.values(MOCK_PRODUKT_DETAILS)
      .filter((p, i, arr) => arr.findIndex(x => x.id === p.id) === i); // dedupe alias entries
    return of(JSON.parse(JSON.stringify(mocks)));
    // return this.getitRestService.getProdukte();
  }



  getProduktById(id: string): Observable<any> {
    // Inline mock — known ids resolve directly, anything unknown falls
    // back to the first mock so the tree always renders something.
    // See src/app/mock/produkt-detail.mock.ts.
    const mock = hasMockProduktDetail(id)
      ? MOCK_PRODUKT_DETAILS[id]
      : Object.values(MOCK_PRODUKT_DETAILS)[0];
    console.log('Produkt mock served for id', id, '→', mock?.id);
    return of(JSON.parse(JSON.stringify(mock)));
    /*
    return this.http.get<Produkt>(AppConstants.API_URL_PRODUKTE + '/' + id +'?filter=filter')
    .pipe(
      tap(response => console.log('API Response:', response)),
      catchError(this.handleError)
    );
    */
  }


  updateProdukt(produkt: ApiProdukt): Observable<ApiProdukt> {
    console.log('produkt', produkt);
   return this.getitRestService.updateProdukt(produkt.id!, produkt);
   /* let url = AppConstants.API_URL_PRODUKTE + '/' + produkt.id ;
    console.log('update-Produkt-POST-URL', url);
    return   this.http.post<any>(url, produkt);*/
  }

  updateProduktPosition(produktPosition: any): Observable<any> {
    console.log('produktPosition', produktPosition);
    let url = AppConstants.API_URL_PRODUKT_POSITIONEN + '/' + produktPosition.id ;
    console.log('update-produktPosition-POST-URL', url);
    return   this.http.post<any>(url, produktPosition);
  }

    // Reusable error handler
    private handleError(error: HttpErrorResponse) {
      // This variable will hold the user-friendly error message.
      let userMessage = 'An unknown error occurred!';

      if (error.error instanceof ErrorEvent) {
        // A client-side or network error occurred.
        console.error('A client-side error occurred:', error.error.message);
        userMessage = `Network error: ${error.error.message}`;
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong.
        console.error(
          `Backend returned code ${error.status}, ` +
          `body was:`, error.error);

        // Customize the message based on the status code
        if (error.status === 404) {
          userMessage = 'The requested product data could not be found (Error 404). Please check the file path.';
        } else if (error.status === 500) {
          userMessage = 'There was a server error (Error 500). Please try again later.';
        } else {
          // For other errors, use the status text if available.
          userMessage = `Error: ${error.statusText} (Code: ${error.status})`;
        }
      }

      // Return an observable that emits the user-friendly message.
      // This is what the component will receive in its 'error' block.
      return throwError(() => userMessage);
    }

}
