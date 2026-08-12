import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { HttpResponse } from '../model/http.model';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { HttpResponseService } from './http-response.service';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { driver } from '../model/driver.model';
import { Dirent } from 'fs';
@Injectable({
  providedIn: 'root'
})
export class DriverService extends HttpResponseService{
  protected baseUrl = environment.backendAPIURL;
  userdata: any;
  token: any;

   constructor(protected http: HttpClient,private router:Router) {
    super(http)
   
       
   }

   getdriverdata():Observable<HttpResponse<driver>>{
    return this.http.get<driver>(`${this.baseUrl}/Drivers`)
    .pipe(map(res=>{
      return this.formatHttpOkResponse<driver>(res);
    }),
    catchError((err:HttpErrorResponse)=>{
      return of(this.formatHttpErrorResponse(err));
    })
    )
   }
   getdriverbyiddata(id:number):Observable<HttpResponse<driver>>{
    return this.http.get<driver>(`${this.baseUrl}/Drivers/${id}`)
    .pipe(map(res=>{
      return this.formatHttpOkResponse<driver>(res);
    }),
    catchError((err:HttpErrorResponse)=>{
      return of(this.formatHttpErrorResponse(err));
    })
    )
   }

   postdriverdata(data:any):Observable<HttpResponse<driver>>{
    return this.http.post<driver>(`${this.baseUrl}/Drivers`,data)
    .pipe(map(res=>{
      return this.formatHttpOkResponse<driver>(res);
    }),
    catchError((err:HttpErrorResponse)=>{
      return of(this.formatHttpErrorResponse(err));
    })
    )
   }
   updatedriverdata(id:number,data:any):Observable<HttpResponse<driver>>{
    return this.http.post<driver>(`${this.baseUrl}/Drivers/${id}`,data)
    .pipe(map(res=>{
      return this.formatHttpOkResponse<driver>(res);
    }),
    catchError((err:HttpErrorResponse)=>{
      return of(this.formatHttpErrorResponse(err));
    })
    )
   }
   deletedriverdata(id:number):Observable<HttpResponse<driver>>{
    return this.http.post<driver>(`${this.baseUrl}/Drivers/${id}/delete`,null)
    .pipe(map(res=>{
      return this.formatHttpOkResponse<driver>(res);
    }),
    catchError((err:HttpErrorResponse)=>{
      return of(this.formatHttpErrorResponse(err));
    })
    )
   }
updateverificationstatusid(id:number):Observable<HttpResponse<driver>>{
  return this.http.post<driver>(`${this.baseUrl}/Updateverificationstatus/${id}`,null)
  .pipe(map(res=>{
    return this.formatHttpOkResponse<driver>(res);
  }),
  catchError((err:HttpErrorResponse)=>{
    return of(this.formatHttpErrorResponse(err));
  })
  )
 }

}
