import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {

  constructor(private http : HttpClient) { }
  adminLogin(loginDetails:any){
    
      let url = environment.backendAPIURL +`/Login/${loginDetails.mobileOremail}/${loginDetails.password}`;
      return this.http.post(url,[]);
   
  } 
  }
