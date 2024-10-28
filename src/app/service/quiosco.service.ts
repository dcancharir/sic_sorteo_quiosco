import { Injectable } from '@angular/core'
import { HttpClient,HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { ResponseApi } from '../model/ResponseApi'
import { LoginQuiosco } from '../model/LoginQuiosco'
import { environment } from '../../environments/environment'
@Injectable({
  providedIn: 'root'
})
export class QuioscoService {
  private readonly apiUrl  = environment.url_sorteos
  private readonly localApiUrl = environment.url_local
  constructor(private httpclient:HttpClient) {
    if(this.apiUrl.endsWith('/')){
      this.apiUrl = this.apiUrl.slice(0,-1)
    }
    if(this.localApiUrl.endsWith('/')){
      this.localApiUrl = this.localApiUrl.slice(0,-1)
    }
   }
  LoginCliente(model:LoginQuiosco):Observable<ResponseApi>{
    const url = `${this.apiUrl}/api/quiosco/loginclient`
    const headers = new HttpHeaders().set('Content-Type', 'application/json') 
    return this.httpclient.post<ResponseApi>(url,model,{headers})
  }
  LogoutCliente(id:number):Observable<ResponseApi>{
    const url = `${this.apiUrl}/api/quiosco/logoutclient`
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
    return this.httpclient.post<ResponseApi>(url,id,{headers})
  }
  GetPrintData(id:number):Observable<ResponseApi>{
    const url = `${this.apiUrl}/api/quiosco/getprintdata/${id}`
    return this.httpclient.get<ResponseApi>(url)
  }
  Print(sorteoid:number,clienteid:number,cantidad:number):Observable<ResponseApi>{
    const url = `${this.localApiUrl}/api/printer/print/${sorteoid}/${clienteid}/${cantidad}`
    return this.httpclient.get<ResponseApi>(url)
  }
}
