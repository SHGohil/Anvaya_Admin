import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { HttpResponse } from '../model/http.model';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { HttpResponseService } from './http-response.service';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { triptax} from '../model/triptax.model';

@Injectable({
  providedIn: 'root'
})
export class TriptaxserviceService extends HttpResponseService{
  protected baseUrl = environment.backendAPIURL;
  userdata: any;
  token: any;


  constructor(protected http: HttpClient,private router:Router) {
    super(http)
   
       
   }

   gettriptax():Observable<HttpResponse<triptax>>{
    return this.http.get<triptax>(`${this.baseUrl}/TripTaxes`)
    .pipe(map(res=>{
      return this.formatHttpOkResponse<triptax>(res);
    }),
    catchError((err:HttpErrorResponse)=>{
      return of(this.formatHttpErrorResponse(err));
    }))
   }
}
