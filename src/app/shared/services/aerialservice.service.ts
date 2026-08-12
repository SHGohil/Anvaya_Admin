import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { HttpResponse } from '../model/http.model';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { HttpResponseService } from './http-response.service';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import {aerialDistance} from '../model/aerialdiastance.model'
@Injectable({
  providedIn: 'root'
})
export class AerialserviceService  extends HttpResponseService{
  protected baseUrl = environment.backendAPIURL;
  userdata: any;
  token: any;

   constructor(protected http: HttpClient,private router:Router) {
    super(http)
   
       
   }
   getaerialdistance(): Observable<HttpResponse<aerialDistance>>{
    return this.http.get<aerialDistance>(`${this.baseUrl}/AerialDistancePrices`)
    .pipe(
      map(res => {
        return this.formatHttpOkResponse<aerialDistance>(res);
      }),
      catchError((err:HttpErrorResponse) => {
        return of(this.formatHttpErrorResponse(err));
      }),
    );
   }
   
   postaerialdistance(id:number,data:aerialDistance): Observable<HttpResponse<aerialDistance>>{
    return this.http.post<aerialDistance>(`${this.baseUrl}/AerialDistancePrices/${id}`,data)
    .pipe(
      map(res => {
        return this.formatHttpOkResponse<aerialDistance>(res);
      }),
      catchError((err:HttpErrorResponse) => {
        return of(this.formatHttpErrorResponse(err));
      }),
    );
   }

  }