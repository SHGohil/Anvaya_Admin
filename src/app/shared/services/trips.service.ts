import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { HttpResponse } from '../model/http.model';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { HttpResponseService } from './http-response.service';
import { environment } from '../../../environments/environment';
import { Trips, Tripscat, Tripstatus } from '../model/trips.model';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class TripsService extends HttpResponseService{
  protected baseUrl = environment.backendAPIURL;
  userdata: any;
  token: any;

  constructor(protected http: HttpClient ) { 
    super(http)
  }
  getTrips(): Observable<HttpResponse<Trips>>{
    return this.http.get<Trips>(`${this.baseUrl}/UserTrips`)
    .pipe(
      map(res => {
        return this.formatHttpOkResponse<Trips>(res);
      }),
      catchError((err:HttpErrorResponse) => {
        return of(this.formatHttpErrorResponse(err));
      }),
    );   
   }



   getTripscategories(): Observable<HttpResponse<Tripscat>>{
    return this.http.get<Tripscat>(`${this.baseUrl}/TripTypes`)
    .pipe(
      map(res => {
        return this.formatHttpOkResponse<Tripscat>(res);
      }),
      catchError((err:HttpErrorResponse) => {
        return of(this.formatHttpErrorResponse(err));
      }),
    );   
   }


   getTripstatus(): Observable<HttpResponse<Tripstatus>>{
    return this.http.get<Tripstatus>(`${this.baseUrl}/TripStatus`)
    .pipe(
      map(res => {
        return this.formatHttpOkResponse<Tripstatus>(res);
      }),
      catchError((err:HttpErrorResponse) => {
        return of(this.formatHttpErrorResponse(err));
      }),
    );   
   }




   getalltripbyId(id:number): Observable<HttpResponse<Tripscat>>{
    return this.http.get<Tripscat>(`${this.baseUrl}/Userstriptypefilter/${id}`)
    .pipe(
      map(res => {
        return this.formatHttpOkResponse<Tripscat>(res);
      }),
      catchError((err:HttpErrorResponse) => {
        return of(this.formatHttpErrorResponse(err));
      }),
    );   
   }


   getalltripbystatusId( tripTypeId: number ,tripStatusId: number): Observable<HttpResponse<Tripscat>>{
    return this.http.get<Tripscat>(`${this.baseUrl}/Userstriptypefilter/${tripTypeId}/${tripStatusId}`)
    .pipe(
      map(res => {  
        return this.formatHttpOkResponse<Tripscat>(res);
      }),
      catchError((err:HttpErrorResponse) => {
        return of(this.formatHttpErrorResponse(err));
      }),
    );   
   }






gettripbyiddata(id:number):Observable<HttpResponse<Trips>>{
    return this.http.get<Trips>(`${this.baseUrl}/UserTrips/${id}`)
    .pipe(map(res=>{
      return this.formatHttpOkResponse<Trips>(res);
    }),
    catchError((err:HttpErrorResponse)=>{
      return of(this.formatHttpErrorResponse(err));
    })
    )
   }



   cancletrippost(id:number):Observable<HttpResponse<Trips>>{
    let url = `${this.baseUrl}/UserTrips/${id}`
    return this.http.post(url,[])
    .pipe(map((res:any)=>{
      return this.formatHttpOkResponse<Trips>(res);
    }),
    catchError((err:HttpErrorResponse)=>{
      return of(this.formatHttpErrorResponse(err));
    })
    )
   }

   tripCancel(id:number){
    let url = `${this.baseUrl}/TimedHostedService/start/${id}`
    return this.http.post(url,[])
    .pipe(map((res:any)=>{
      return this.formatHttpOkResponse<Trips>(res);
    }),
    catchError((err:HttpErrorResponse)=>{
      return of(this.formatHttpErrorResponse(err));
    })
    )
   }

   updatetrip(time:any,id){
    let url =`${this.baseUrl}/Edittriptimes/${time}/${id}`;
    return this.http.post(url,[]).pipe(map((res:any)=>{
      return this.formatHttpOkResponse(res);
    }),
    catchError((err:HttpErrorResponse)=>{
      return of (this.formatHttpErrorResponse(err));
    }))
   }

}
