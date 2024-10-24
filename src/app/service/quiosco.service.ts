import { Injectable } from '@angular/core'
import { HttpClient,HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { ResponseApi } from '../model/ResponseApi'
import { LoginQuiosco } from '../model/LoginQuiosco'
@Injectable({
  providedIn: 'root'
})
export class QuioscoService {
  private readonly apiUrl  = "http://localhost:5148/api/"
  private readonly localApiUrl = "http://localhost:7000/api/"
  constructor(private httpclient:HttpClient) { }
  LoginCliente(model:LoginQuiosco):Observable<ResponseApi>{
    const url = `${this.apiUrl}quiosco/loginclient`
    const headers = new HttpHeaders().set('Content-Type', 'application/json') 
    return this.httpclient.post<ResponseApi>(url,model,{headers})
  }
  LogoutCliente(id:number):Observable<ResponseApi>{
    const url = `${this.apiUrl}quiosco/logoutclient`
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
    return this.httpclient.post<ResponseApi>(url,id,{headers})
  }
  GetPrintData(id:number):Observable<ResponseApi>{
    const url = `${this.apiUrl}quiosco/getprintdata/${id}`
    return this.httpclient.get<ResponseApi>(url)
  }
  Print(sorteoid:number,clienteid:number,cantidad:number):Observable<ResponseApi>{
    const url = `${this.localApiUrl}/printer/print/${sorteoid}/${clienteid}/${cantidad}`
    return this.httpclient.get<ResponseApi>(url)
  }
}
