import { readAuthToken } from './auth-token';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class UsersService {
  /** Read per request - see auth-token.ts for why this is not cached. */
  get token(): string { return readAuthToken(); }

  constructor(public http : HttpClient) 
  {  }

  getUsers() {
    
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
  
    var url = environment.backendAPIURL+`/Users`

    return this.http.get(url, { headers, responseType: 'json' });
  }
  getRoles() {
    
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
  
    var url = environment.backendAPIURL+`/Roles`

    return this.http.get(url, { headers, responseType: 'json' });
  }
postusers(id , data) {
    
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
  if(id==0){

    var url = environment.backendAPIURL+`/Users`
  }
  else{

    var url = environment.backendAPIURL+`/Users/${id}`
  }

    return this.http.post(url,data, { headers, responseType: 'json' });
  }
dleleteusers(id , data) {
    
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

  
    var url = environment.backendAPIURL+`/Users/${id}/delete`
  

    return this.http.post(url,data, { headers, responseType: 'json' });
  }
}
