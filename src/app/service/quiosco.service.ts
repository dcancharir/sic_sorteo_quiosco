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
  private readonly localApiUrl = environment.url_local
  constructor(private httpclient:HttpClient) {
   }
  LoginCliente(model:LoginQuiosco):Observable<ResponseApi>{
    const url = `${this.localApiUrl}/api/servidorsorteos/quioscologinclient`
    const headers = new HttpHeaders().set('Content-Type', 'application/json') 
    return this.httpclient.post<ResponseApi>(url,model,{headers})
  }
  LogoutCliente(id:number):Observable<ResponseApi>{
    const url = `${this.localApiUrl}/api/servidorsorteos/quioscologoutclient`
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
    return this.httpclient.post<ResponseApi>(url,id,{headers})
  }
  GetPrintData(id:number):Observable<ResponseApi>{
    const url = `${this.localApiUrl}/api/servidorsorteos/quioscogetprintdata/${id}`
    return this.httpclient.get<ResponseApi>(url)
  }
  Print(quioscoid:number,sorteoid:number,clienteid:number,cantidad:number):Observable<ResponseApi>{
    const url = `${this.localApiUrl}/api/printer/print/${quioscoid}/${sorteoid}/${clienteid}/${cantidad}`
    return this.httpclient.get<ResponseApi>(url)
  }
}
