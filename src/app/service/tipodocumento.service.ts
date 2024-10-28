import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseApi } from '../model/ResponseApi';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TipodocumentoService {
  private readonly apiUrl = environment.url_sorteos
  constructor(private httpclient:HttpClient) { 
    if(this.apiUrl.endsWith('/')){
      this.apiUrl = this.apiUrl.slice(0,-1)
    }
  }
  GetTipoDocumento():Observable<ResponseApi>{
    const url = `${this.apiUrl}/api/tipodocumento/getbystatus/1`
    return this.httpclient.get<ResponseApi>(url)
  }
}
