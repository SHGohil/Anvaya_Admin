import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { HttpResponse } from '../model/http.model';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { HttpResponseService } from './http-response.service';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { transmissiontype} from '../model/transmissiontype.model';
@Injectable({
  providedIn: 'root'
})
export class TransmissiontypeService extends HttpResponseService{
  protected baseUrl = environment.backendAPIURL;
  userdata: any;
  token: any;

   constructor(protected http: HttpClient,private router:Router) {
    super(http)
   
       
   }

   gettransmission():Observable<HttpResponse<transmissiontype>>{
    return this.http.get<transmissiontype>(`${this.baseUrl}/TransmissionTypes`)
    .pipe(map(res=>{
      return this.formatHttpOkResponse<transmissiontype>(res);
    }),
    catchError((err:HttpErrorResponse)=>{
      return of(this.formatHttpErrorResponse(err));
    })
    )
   }
}
