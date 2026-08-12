import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { HttpResponse } from '../model/http.model';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { HttpResponseService } from './http-response.service';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { vechiletype } from '../model/vechiletype.model';
@Injectable({
  providedIn: 'root'
})
export class VehicletypeService extends HttpResponseService{
  protected baseUrl = environment.backendAPIURL;
  userdata: any;
  token: any;

   constructor(protected http: HttpClient,private router:Router) {
    super(http)
   
       
   }

   getvehicletype():Observable<HttpResponse<vechiletype>>{
    return this.http.get<vechiletype>(`${this.baseUrl}/VehicleTypes`)
    .pipe(map(res=>{
      return this.formatHttpOkResponse<vechiletype>(res);
    }),
    catchError((err:HttpErrorResponse)=>{
      return of(this.formatHttpErrorResponse(err));
    })
    )
   }
}
