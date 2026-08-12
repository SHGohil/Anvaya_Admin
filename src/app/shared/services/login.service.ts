import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http : HttpClient) { }
  adminLogin(loginDetails:any){
    
    let url = `${environment.backendAPIURL}/Login/${loginDetails.email}&${loginDetails.password}`;
    return this.http.post(url, []); // The request body is empty since the data is in the URL
   
   
  } 
}
