import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { ResponseApi } from '../model/ResponseApi'
import { ConfigService } from './config.service'
@Injectable({
  providedIn: 'root'
})
export class TipodocumentoService {
  private apiUrl : string = ''
  constructor(private httpclient:HttpClient,private configService : ConfigService) { 
   
  }
  GetTipoDocumento():Observable<ResponseApi>{
    this.apiUrl = `${this.configService.getConfig('URL_SERVIDOR_SORTEOS')}`
    const url = `${this.apiUrl}/api/tipodocumento/getbystatus/1`
    return this.httpclient.get<ResponseApi>(url)
  }
}
