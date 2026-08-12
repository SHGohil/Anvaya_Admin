import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChangerequestService {

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


  getchangerequest(){
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    const date = new Date().toISOString().split('.')[0];
    var url = environment.backendAPIURL+`/EventChangeRequests`

    return this.http.get(url, { headers, responseType: 'json' });
  }
  
  postChagereq(id,data){
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    const date = new Date().toISOString().split('.')[0];
    var url = environment.backendAPIURL+`/EventChangeRequests/${id}`

    return this.http.post(url, data,{ headers, responseType: 'json' });

  }
}
