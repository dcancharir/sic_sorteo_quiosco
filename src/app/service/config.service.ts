import { Injectable } from '@angular/core'
import { Config } from '../model/Config'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config!:Config
  constructor(private http:HttpClient) { }
  loadConfig():Observable<Config>{
    return this.http.get<Config>('/assets/config.json')
  }
  get QuioscoId():number{
    return this.config.QuioscoId
  }
  get UrlSorteos():string{
    return this.config.UrlSorteos
  }
  get TiempoInactividad():number{
    return this.config.TiempoInactividad
  }
  get TiempoConteo():number{
    return this.config.TiempoConteo
  }
}
