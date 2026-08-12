import { readAuthToken } from './auth-token';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SpecialdatesService {
  /** Read per request - see auth-token.ts for why this is not cached. */
  get token(): string { return readAuthToken(); }

  constructor(public http : HttpClient) 
  {  }

  calenderdates(id){
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    const date = new Date().toISOString().split('.')[0];
    var url = environment.backendAPIURL+`/SpecialDateCalender?year=${id}`

    return this.http.get(url, { headers, responseType: 'json' });
  }

  specialdates() {
    
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    const date = new Date().toISOString().split('.')[0];
    var url = environment.backendAPIURL+`/SpecialDates`

    return this.http.get(url, { headers, responseType: 'json' });
 }
  postspecialdates(data) {
    
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    var url = environment.backendAPIURL+`/SpecialDatesPosting`

    return this.http.post(url,data, { headers, responseType: 'json' });
 }
}
