import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class EventDataService {
  token: any;

  private eventDataSource = new BehaviorSubject<any>(null);
  currentEventData = this.eventDataSource.asObservable();
  constructor(public http : HttpClient) 
  {
    let user;
    if (typeof window !== 'undefined' && window.localStorage) {
     user = localStorage.getItem('user');
    }
    var userdata = JSON.parse(user);
    this.token = userdata.token;
  }


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
    debugger;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    const date = new Date().toISOString().split('.')[0];
    var url = environment.backendAPIURL+`/EventTimes`

    return this.http.get(url, { headers, responseType: 'json' });
 }
  getonTime(dates:any,venues:any) {
    debugger;
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