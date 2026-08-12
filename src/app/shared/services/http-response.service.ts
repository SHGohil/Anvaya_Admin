import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { HttpResponse } from '../model/http.model';


@Injectable({
  providedIn: 'root'
})
export class HttpResponseService {

  constructor(http: HttpClient,) { }

  protected formatHttpErrorResponse(err: HttpErrorResponse) {
    return {
      err: {
        error: err.error,
        message: err.message,
        name: err.name,
        code: err.status,
      },
      data: null,
    };
  }

  protected formatHttpOkResponse<T>(data: T): HttpResponse<T> {
    return {
      err: null,
      data: data,
    };
  }
}
