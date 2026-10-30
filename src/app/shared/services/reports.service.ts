import { readAuthToken } from './auth-token';
import { skipGlobalErrorDialog } from '../interceptors/http-error.context';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  /** Read per request - see auth-token.ts for why this is not cached. */
  get token(): string { return readAuthToken(); }

  constructor(public http : HttpClient) 
  {  }

  getDailyquery(id) {
    
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    const date = new Date().toISOString().split('.')[0];
    var url = environment.backendAPIURL+`/Events/${id}/status`
    // var url = environment.backendAPIURL+`/Events/0/status`

    return this.http.get(url, { headers, responseType: 'json' });
 }
  /**
   * One page of the events with a status (0 = every status), newest first. The API keeps the
   * body a plain array and puts the total in the X-Total-Count header, so the total is returned
   * alongside the rows.
   */
  getEventsPage(statusId: number, page: number, pageSize = 50) {
    const url = environment.backendAPIURL + `/Events/${statusId}/status?page=${page}&pageSize=${pageSize}`;

    return this.http.get<any[]>(url, { observe: 'response' }).pipe(
      map(res => ({ items: res.body ?? [], total: Number(res.headers.get('X-Total-Count') ?? res.body?.length ?? 0) }))
    );
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

  return this.http.post(url, { userId, currentPassword, newPassword }, { headers, responseType: 'json', context: skipGlobalErrorDialog() });
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
