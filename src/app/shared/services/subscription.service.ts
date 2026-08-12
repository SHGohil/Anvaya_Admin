import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { HttpResponse } from '../model/http.model';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { HttpResponseService } from './http-response.service';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { SubscriptionModel } from '../model/subscriptions.model';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService extends HttpResponseService{
  protected baseUrl = environment.backendAPIURL;
  userdata: any;
  token: any;
  navigate: any;
  constructor(protected http: HttpClient,private router:Router) {
    super(http)
  }
  getSubscriptionsData():Observable<HttpResponse<SubscriptionModel>>{
    return this.http.get<SubscriptionModel>(`${this.baseUrl}/Subscriptions`)
    .pipe(map(res=>{
      return this.formatHttpOkResponse<SubscriptionModel>(res);
    }),
    catchError((err:HttpErrorResponse)=>{
      return of(this.formatHttpErrorResponse(err));
    })
    )
   }
   addSubscriptionsData(payload:SubscriptionModel):Observable<HttpResponse<SubscriptionModel>>{
    let url = `${this.baseUrl}/Subscriptions`
    return this.http.post(url,payload)
    .pipe(map((res:any)=>{
      return this.formatHttpOkResponse<SubscriptionModel>(res);
    }),
    catchError((err:HttpErrorResponse)=>{
      return of(this.formatHttpErrorResponse(err));
    })
    )
   }
   updateSubscriptionsData(id:number,payload:SubscriptionModel):Observable<HttpResponse<SubscriptionModel>>{
    let url = `${this.baseUrl}/Subscriptions`
    return this.http.post(url,payload)
    .pipe(map((res:any)=>{
      return this.formatHttpOkResponse<SubscriptionModel>(res);
    }),
    catchError((err:HttpErrorResponse)=>{
      return of(this.formatHttpErrorResponse(err));
    })
    )
   } 
   deleteSubscriptionsData(id:number){
    let url = `${this.baseUrl}/Subscriptions/${id}/Delete`
    return this.http.post(url,[])
    .pipe(map((res:any)=>{
      return this.formatHttpOkResponse<SubscriptionModel>(res);
    }),
    catchError((err:HttpErrorResponse)=>{
      return of(this.formatHttpErrorResponse(err));
    })
    )
   }
}
