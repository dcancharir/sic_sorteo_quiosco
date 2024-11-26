import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { ResponseApi } from '../model/ResponseApi'
import { environment } from '../../environments/environment'
@Injectable({
  providedIn: 'root'
})
export class SalaService {
  private apiUrl : string = environment.url_local
  constructor(private httpclient:HttpClient) { }
  GetSala():Observable<ResponseApi>{
    const url = `${this.apiUrl}/api/servidorsorteos/salaget`
    return this.httpclient.get<ResponseApi>(url)
  }
}
