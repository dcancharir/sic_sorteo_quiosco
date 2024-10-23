import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseApi } from '../model/ResponseApi';

@Injectable({
  providedIn: 'root'
})
export class TipodocumentoService {
  private readonly apiUrl = "http://localhost:5148/api/"
  constructor(private httpclient:HttpClient) { 
  
  }
  GetTipoDocumento():Observable<ResponseApi>{
    const url = `${this.apiUrl}tipodocumento/getbystatus/1`
    return this.httpclient.get<ResponseApi>(url)
  }
}
