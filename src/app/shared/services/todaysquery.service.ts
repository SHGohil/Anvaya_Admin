import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class TodaysqueryService {
  token: any;

  constructor(public http : HttpClient) 
  {
    let user;
    if (typeof window !== 'undefined' && window.localStorage) {
     user = localStorage.getItem('user');
    }
    var userdata = JSON.parse(user);
    this.token = userdata.token;
  }

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
