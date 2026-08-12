import { readAuthToken } from './auth-token';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CalenderService {
  /** Read per request - see auth-token.ts for why this is not cached. */
  get token(): string { return readAuthToken(); }

  constructor(public http : HttpClient) 
  {  } 
  updateEvent(roleId,payload){
    
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    var url = environment.backendAPIURL+`/Events/${payload.eventsId}?roleId=${roleId}`

    return this.http.post(url,payload, { headers, responseType: 'json' });
  } 
  calenderdates(id) {
    
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
   
    var url = environment.backendAPIURL+`/Calenderview/${id}`

    return this.http.get(url, { headers, responseType: 'json' });
 } 
 onecalenderdates(id,month) {
    
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
   
    var url = environment.backendAPIURL+`/Calenderview/${id}/${month}`

    return this.http.get(url, { headers, responseType: 'json' });
 } 
 authenticateEvent(payload){
    
  const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
  var url = environment.backendAPIURL+`/EventChangeRequests`

  return this.http.post(url,payload, { headers, responseType: 'json' });
}
  specialdates() {
    
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    const date = new Date().toISOString().split('.')[0];
    var url = environment.backendAPIURL+`/SpecialDates`

    return this.http.get(url, { headers, responseType: 'json' });
 }


 currentdateevents(date){
  const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    var url = environment.backendAPIURL+`/Eventdetailsforcalender/0?date=${date}`

    return this.http.get(url, { headers, responseType: 'json' });
 } 

}
