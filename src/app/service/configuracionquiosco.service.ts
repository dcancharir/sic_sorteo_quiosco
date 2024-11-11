import { Injectable } from '@angular/core'
import { environment } from '../../environments/environment'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { ConfiguracionQuioscoLocal } from '../model/ConfiguracionQuioscoLocal'
import { ImpresoraLocal } from '../model/ImpresoraLocal'
@Injectable({
  providedIn: 'root'
})
export class ConfiguracionquioscoService {
  private urlLocal:string = environment.url_local
  constructor(private httpClient:HttpClient) { 
    if(this.urlLocal.endsWith('/')){
      this.urlLocal = this.urlLocal.slice(0,-1)
    }
  }
  cargarConfiguracionQuiosco():Observable<ConfiguracionQuioscoLocal[]>{
    return this.httpClient.get<ConfiguracionQuioscoLocal[]>(`${this.urlLocal}/api/configuracion/getconfiguration`)
  }
  guardarConfiguracionQuiosco(lista:ConfiguracionQuioscoLocal[]):Observable<boolean>{
    const headers = new HttpHeaders().set('content-type', 'application/json')
    return this.httpClient.post<boolean>(`${this.urlLocal}/api/configuracion/save`,lista,{headers})
  }
  listarImpresoras():Observable<ImpresoraLocal[]>{
    return this.httpClient.get<ImpresoraLocal[]>(`${this.urlLocal}/api/configuracion/getprinters`)
  }
  guardarImpresora(model:ImpresoraLocal):Observable<boolean>{
    const headers = new HttpHeaders().set('content-type', 'application/json')
    return this.httpClient.post<boolean>(`${this.urlLocal}/api/configuracion/addprinter`,model,{headers})
  }
  eliminarImpresora(id:number):Observable<boolean>{
    const headers = new HttpHeaders().set('content-type', 'application/json')
    return this.httpClient.post<boolean>(`${this.urlLocal}/api/configuracion/deleteprinter/${id}`,{},{headers})
  }
}
