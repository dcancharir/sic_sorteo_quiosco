import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { ConfigService } from './config.service'
import { ResponseApi } from '../model/ResponseApi'
@Injectable({
  providedIn: 'root'
})
export class SalaService {
  private apiUrl : string = ''
  constructor(private httpclient:HttpClient,private configService : ConfigService) { }
  GetSala():Observable<ResponseApi>{
    this.apiUrl = `${this.configService.getConfig('URL_SERVIDOR_SORTEOS')}`
    const url = `${this.apiUrl}/api/sala/get`
    return this.httpclient.get<ResponseApi>(url)
  }
}
