import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { HttpResponse } from '../model/http.model';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { HttpResponseService } from './http-response.service';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

import {verificationstatus} from   '../model/verficationstatus.model'

@Injectable({
  providedIn: 'root'
})
export class VerificationstatusService extends HttpResponseService{
  protected baseUrl = environment.backendAPIURL;
  userdata: any;
  token: any;

   constructor(protected http: HttpClient,private router:Router) {
    super(http)
   
       
   }

   getverificationstatus():Observable<HttpResponse<verificationstatus>>{
    return this.http.get<verificationstatus>(`${this.baseUrl}/VerificationStatus`)
    .pipe(map(res=>{
      return this.formatHttpOkResponse<verificationstatus>(res);
    }),
    catchError((err:HttpErrorResponse)=>{
      return of(this.formatHttpErrorResponse(err));
    })
    )
   }

   postverificationstatus(data:verificationstatus):Observable<HttpResponse<verificationstatus>>{
    return this.http.post<verificationstatus>(`${this.baseUrl}/VerificationStatus`,data)
    .pipe(map(res=>{
      return this.formatHttpOkResponse<verificationstatus>(res);
    }),
    catchError((err:HttpErrorResponse)=>{
      return of(this.formatHttpErrorResponse(err));
    })
    )
   }
   updateverificationstatus(id:number,data:verificationstatus):Observable<HttpResponse<verificationstatus>>{
    return this.http.post<verificationstatus>(`${this.baseUrl}/VerificationStatus/${id}`,data)
    .pipe(map(res=>{
      return this.formatHttpOkResponse<verificationstatus>(res);
    }),
    catchError((err:HttpErrorResponse)=>{
      return of(this.formatHttpErrorResponse(err));
    })
    )
   }
   deleteverificationstatus(id:number):Observable<HttpResponse<verificationstatus>>{
    return this.http.post<verificationstatus>(`${this.baseUrl}/VerificationStatus/${id}/delete`,null)
    .pipe(map(res=>{
      return this.formatHttpOkResponse<verificationstatus>(res);
    }),
    catchError((err:HttpErrorResponse)=>{
      return of(this.formatHttpErrorResponse(err));
    })
    )
   }
}
