import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { HttpResponse } from '../model/http.model';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { HttpResponseService } from './http-response.service';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { Hours } from '../model/Hours.model';
@Injectable({
  providedIn: 'root'
})
export class HoursService  extends HttpResponseService{
  protected baseUrl = environment.backendAPIURL;
  userdata: any;
  token: any;

   constructor(protected http: HttpClient,private router:Router) {
    super(http)
   
       
   }

   gethoursdatabyid(val):Observable<HttpResponse<Hours>>{
    return this.http.get<Hours>(`${this.baseUrl}/Hours/${val}/flag`)
    .pipe(map(res=>{
      return this.formatHttpOkResponse<Hours>(res);
    }),
    catchError((err:HttpErrorResponse)=>{
      return of(this.formatHttpErrorResponse(err));
    })
    )
   }
   getoutstationroundtriphoursdatabyid():Observable<HttpResponse<Hours>>{
    return this.http.get<Hours>(`${this.baseUrl}/OutstationRoundtriphours`)
    .pipe(map(res=>{
      return this.formatHttpOkResponse<Hours>(res);
    }),
    catchError((err:HttpErrorResponse)=>{
      return of(this.formatHttpErrorResponse(err));
    })
    )
   }

   updatehoursdata(id:number,data:any):Observable<HttpResponse<Hours>>{
    return this.http.post<Hours>(`${this.baseUrl}/Hours/${id}`,data)
    .pipe(map(res=>{
      return this.formatHttpOkResponse<Hours>(res);
    }),
    catchError((err:HttpErrorResponse)=>{
      return of(this.formatHttpErrorResponse(err));
    })
    )
   }
   updateoutstationroundtriphoursdata(id:number,data:any):Observable<HttpResponse<Hours>>{
    return this.http.post<Hours>(`${this.baseUrl}/OutstationRoundtriphours/${id}`,data)
    .pipe(map(res=>{
      return this.formatHttpOkResponse<Hours>(res);
    }),
    catchError((err:HttpErrorResponse)=>{
      return of(this.formatHttpErrorResponse(err));
    })
    )
   }
}
