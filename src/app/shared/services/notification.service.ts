import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
 providedIn: 'root'
})
export class YourServiceName {
 token: string;

 constructor(public http: HttpClient) {
    let user;
    if (typeof window !== 'undefined' && window.localStorage) {
      user = localStorage.getItem('user');
    }
    var userdata = JSON.parse(user);
    this.token = userdata.token;
 }
   
 getnotification() {
  debugger;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    const url = environment.backendAPIURL + `/EventNotifications`;
    return this.http.get(url, { headers, responseType: 'json' });
 }

 getEventdetail(id) {
    debugger
  const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
  // const date = new Date().toISOString().split('.')[0];
  var url = environment.backendAPIURL+`/Events/${id}`
  // var url = environment.backendAPIURL+`/Events/0/status`
 
  return this.http.get(url, { headers, responseType: 'json' });
}
}
