import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { HttpResponse } from '../model/http.model';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { HttpResponseService } from './http-response.service';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { coupans } from '../model/coupans.model';
@Injectable({
  providedIn: 'root'
})
export class CoupansService extends HttpResponseService{
  updatecoupnasdata(cuponsId: any, editeddata: { cuponCode: any; cuponName: any; percentage: any; description: any; createdDate: any; modifiedDate: any; createdby: any; modifiedBy: any; }) {
    throw new Error('Method not implemented.');
  }
  getcoupans: any;

  protected baseUrl = environment.backendAPIURL;
  userdata: any;
  token: any;
  navigate: any;

   constructor(protected http: HttpClient,private router:Router) {
    super(http)

   }

   getcoupandata():Observable<HttpResponse<coupans>>{
    return this.http.get<coupans>(`${this.baseUrl}/Cupons`)
    .pipe(map(res=>{
      return this.formatHttpOkResponse<coupans>(res);
    }),
    catchError((err:HttpErrorResponse)=>{
      return of(this.formatHttpErrorResponse(err));
    })
    )
   }
   getdriverbyiddata(id:number):Observable<HttpResponse<coupans>>{
    return this.http.get<coupans>(`${this.baseUrl}/Cupons/${id}`)
    .pipe(map(res=>{
      return this.formatHttpOkResponse<coupans>(res);
    }),
    catchError((err:HttpErrorResponse)=>{
      return of(this.formatHttpErrorResponse(err));
    })
    )
   }

   postcoupansdata(data:any):Observable<HttpResponse<coupans>>{
    return this.http.post<coupans>(`${this.baseUrl}/Cupons`,data)
    .pipe(map(res=>{
      return this.formatHttpOkResponse<coupans>(res);
    }),
    catchError((err:HttpErrorResponse)=>{
      return of(this.formatHttpErrorResponse(err));
    })
    )
   }
   updateCoupnasData(id: number, data: any): Observable<HttpResponse<coupans>> {
    const url = `${this.baseUrl}/Cupons/${id}`;
    return this.http.post<coupans>(url, data)
      .pipe(
        map(res => {
          return this.formatHttpOkResponse<coupans>(res);
        }),
        catchError((err: HttpErrorResponse) => {
          return of(this.formatHttpErrorResponse(err));
        })
      );
  }
  
   deletecoupnasdata(id:number):Observable<HttpResponse<coupans>>{
    return this.http.post<coupans>(`${this.baseUrl}/Cupons/${id}/delete`,null)
    .pipe(map(res=>{
      return this.formatHttpOkResponse<coupans>(res);
    }),
    catchError((err:HttpErrorResponse)=>{
      return of(this.formatHttpErrorResponse(err));
    })
    )
   }


}
