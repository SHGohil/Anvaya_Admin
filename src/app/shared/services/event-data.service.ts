import { readAuthToken } from './auth-token';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class EventDataService {
  /** Read per request - see auth-token.ts for why this is not cached. */
  get token(): string { return readAuthToken(); }

  private eventDataSource = new BehaviorSubject<any>(null);
  currentEventData = this.eventDataSource.asObservable();
  constructor(public http : HttpClient) 
  {  }


 changeEventData(data: any) {
    this.eventDataSource.next(data);
 }
  getvenue() {
    
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    const date = new Date().toISOString().split('.')[0];
    var url = environment.backendAPIURL+`/Venues`

    return this.http.get(url, { headers, responseType: 'json' });
 }
  getTime(dates:any,venues:any) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    const date = new Date().toISOString().split('.')[0];
    var url = environment.backendAPIURL+`/EventTimes`

    return this.http.get(url, { headers, responseType: 'json' });
 }
  getonTime(dates:any,venues:any) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    const date = new Date().toISOString().split('.')[0];
    var url = environment.backendAPIURL+`/EventTimes/available?date=${dates}&venueIds=${venues}`

    return this.http.get(url, { headers, responseType: 'json' });
 }
  gettype() {
    
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    const date = new Date().toISOString().split('.')[0];
    var url = environment.backendAPIURL+`/EventTypes`

    return this.http.get(url, { headers, responseType: 'json' });
 }
  
 getStatus() {
    
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    const date = new Date().toISOString().split('.')[0];
    var url = environment.backendAPIURL+`/EventStatus`

    return this.http.get(url, { headers, responseType: 'json' });
 }
 getfoodtypes() {
    
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    const date = new Date().toISOString().split('.')[0];
    var url = environment.backendAPIURL+`/EventFoodtypes`

    return this.http.get(url, { headers, responseType: 'json' });
  }
  postevents(data){
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    const date = new Date().toISOString().split('.')[0];
    var url = environment.backendAPIURL+`/Events`

    return this.http.post(url, data,{ headers, responseType: 'json' });

}

geteventtype() {
    
  const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
  const date = new Date().toISOString().split('.')[0];
  var url = environment.backendAPIURL+`/EventTimes`

  return this.http.get(url, { headers, responseType: 'json' });
}
}