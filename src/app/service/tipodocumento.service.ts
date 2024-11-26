import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { ResponseApi } from '../model/ResponseApi'
import { environment } from '../../environments/environment'
@Injectable({
  providedIn: 'root'
})
export class TipodocumentoService {
  private apiUrl : string = environment.url_local
  constructor(private httpclient:HttpClient) { 
   
  }
  GetTipoDocumento():Observable<ResponseApi>{
    const url = `${this.apiUrl}/api/servidorsorteos/tipodocumentogetbystatus/1`
    return this.httpclient.get<ResponseApi>(url)
  }
}
