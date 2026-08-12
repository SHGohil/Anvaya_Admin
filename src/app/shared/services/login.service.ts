import { skipGlobalErrorDialog } from '../interceptors/http-error.context';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http : HttpClient) { }

  /**
   * Signs in.
   *
   * The credentials go in the request body. They used to be path segments
   * (`/Login/{email}&{password}`), which put the password in the URL - recorded
   * by IIS, by any proxy in front of the API, and in browser history.
   */
  adminLogin(loginDetails:any){
    const url = `${environment.backendAPIURL}/Login`;

    return this.http.post(url, {
      username: loginDetails.email,
      password: loginDetails.password
    }, { context: skipGlobalErrorDialog() });
  }
}
