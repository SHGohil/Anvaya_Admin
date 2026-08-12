import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { HttpResponse } from '../model/http.model';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { HttpResponseService } from './http-response.service';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { triptypes, triptypesbyid, tripvarient } from '../model/triptype.model';
@Injectable({
  providedIn: 'root'
})
export class TriptypeService extends HttpResponseService{
  protected baseUrl = environment.backendAPIURL;
  userdata: any;
  token: any;

   constructor(protected http: HttpClient) {
    super(http)
   
       
   }
   gettriptypes(): Observable<HttpResponse<triptypes>>{
    return this.http.get<triptypes>(`${this.baseUrl}/TripTypes`)
    .pipe(
      map(res => {
        return this.formatHttpOkResponse<triptypes>(res);
      }),
      catchError((err:HttpErrorResponse) => {
        return of(this.formatHttpErrorResponse(err));
      }),
    );
   }
   gettriptypesByid(val): Observable<HttpResponse<triptypesbyid>>{
    return this.http.get<triptypesbyid>(`${this.baseUrl}/TripTypes/${val}`)
    .pipe(
      map(res => {
        return this.formatHttpOkResponse<triptypesbyid>(res);
      }),
      catchError((err:HttpErrorResponse) => {
        return of(this.formatHttpErrorResponse(err));
      }),
    );
   }
   
   updateTripType(id:number,data:triptypes): Observable<HttpResponse<triptypes>>{
    return this.http.post<triptypes>(`${this.baseUrl}/TripTypes/${id}`,data)
    .pipe(
      map(res => {
        return this.formatHttpOkResponse<triptypes>(res);
      }),
      catchError((err:HttpErrorResponse) => {
        return of(this.formatHttpErrorResponse(err));
      }),
    );
   }
postTripTypes(data:triptypes): Observable<HttpResponse<triptypes>>{
  return this.http.post<triptypes>(`${this.baseUrl}/TripTypes`,data)
  .pipe(
    map(res => {
      return this.formatHttpOkResponse<triptypes>(res);
    }),
    catchError((err:HttpErrorResponse) => {
      return of(this.formatHttpErrorResponse(err));
    }),
  );
 }
deleteTripTypes(id:number): Observable<HttpResponse<triptypes>>{
  return this.http.post<triptypes>(`${this.baseUrl}/TripTypes/${id}/delete`,null)
  .pipe(
    map(res => {
      return this.formatHttpOkResponse<triptypes>(res);
    }),
    catchError((err:HttpErrorResponse) => {
      return of(this.formatHttpErrorResponse(err));
    }),
  );
 }

 updatetripVarient(id:number,data:any): Observable<HttpResponse<tripvarient>>{
  return this.http.post<tripvarient>(`${this.baseUrl}/TripVariants/${id}`,data)
  .pipe(
    map(res => {
      return this.formatHttpOkResponse<tripvarient>(res);
    }),
    catchError((err:HttpErrorResponse) => {
      return of(this.formatHttpErrorResponse(err));
    }),
  );
 }

  }