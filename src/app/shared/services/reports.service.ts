import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
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

  getDailyquery(id) {
    
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    const date = new Date().toISOString().split('.')[0];
    var url = environment.backendAPIURL+`/Events/${id}/status`
    // var url = environment.backendAPIURL+`/Events/0/status`

    return this.http.get(url, { headers, responseType: 'json' });
 }
  getEventdetails(id) {
    
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    const date = new Date().toISOString().split('.')[0];
    var url = environment.backendAPIURL+`/Events/${id}`
    // var url = environment.backendAPIURL+`/Events/0/status`

    return this.http.get(url, { headers, responseType: 'json' });
 }
  getEventStatus() {
    
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    const date = new Date().toISOString().split('.')[0];
    var url = environment.backendAPIURL+`/EventStatus`
    // var url = environment.backendAPIURL+`/Events/0/status`

    return this.http.get(url, { headers, responseType: 'json' });
 }

 /**
  * Changes a password.
  *
  * The credentials go in the body, not the query string: a URL is recorded by IIS,
  * by any proxy, and in browser history. The API requires the current password
  * unless the caller is an Admin.
  */
 reset(userId:any, currentPassword:string, newPassword:string){
  const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
  var url = environment.backendAPIURL+`/resetpassword`

  return this.http.post(url, { userId, currentPassword, newPassword }, { headers, responseType: 'json' });
 }

 eventstartandendtime(id:any){
  const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

  var url = environment.backendAPIURL+`/Available?eventid=${id}`

  return this.http.post(url, null,{ headers, responseType: 'json' });
 }
 eventstartandendtimebydate(id:any,date:any){
  const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

  var url = environment.backendAPIURL+`/Available/available/${id}?date=${date}`

  return this.http.post(url, null,{ headers, responseType: 'json' });
 }

}
