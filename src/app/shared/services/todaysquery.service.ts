import { readAuthToken } from './auth-token';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class TodaysqueryService {
  /** Read per request - see auth-token.ts for why this is not cached. */
  get token(): string { return readAuthToken(); }

  constructor(public http : HttpClient) 
  {  }

  getTodaysquerys() {
    
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    const date = new Date().toISOString().split('.')[0];
    var url = environment.backendAPIURL+`/Reports?date=${date}`

    return this.http.get(url, { headers, responseType: 'json' });
 }

 getanalytics(year){
  const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
  const date = new Date().toISOString().split('.')[0];
  var url = environment.backendAPIURL+`/Analytics?year=${year}`

  return this.http.get(url, { headers, responseType: 'json' });
 }
}
