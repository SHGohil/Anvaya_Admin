import { readAuthToken } from './auth-token';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
 providedIn: 'root'
})
export class YourServiceName {
 /** Read per request - see auth-token.ts for why this is not cached. */
 get token(): string { return readAuthToken(); }

 constructor(public http: HttpClient) { }

 getnotification() {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    const url = environment.backendAPIURL + `/EventNotifications`;
    return this.http.get(url, { headers, responseType: 'json' });
 }

 getEventdetail(id) {
  const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
  // const date = new Date().toISOString().split('.')[0];
  var url = environment.backendAPIURL+`/Events/${id}`
  // var url = environment.backendAPIURL+`/Events/0/status`
 
  return this.http.get(url, { headers, responseType: 'json' });
}
}
