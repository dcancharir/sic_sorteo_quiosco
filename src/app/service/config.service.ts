import { Injectable } from '@angular/core'
import { Config } from '../model/Config'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from '../../environments/environment'
import { tap } from 'rxjs'
@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config:Config[] = []
  private urlLocal:string = environment.url_local
  constructor(private http:HttpClient) { 
    if(this.urlLocal.endsWith('/')){
      this.urlLocal = this.urlLocal.slice(0,-1)
    }
  }
  loadConfig():Observable<Config[]>{
    return this.http.get<Config[]>(`${this.urlLocal}/api/configuracion/getconfiguration`).pipe(
      tap(data=>this.config = data)
    )
  }
  getConfig(key:string){
    return this.config?this.config.find(x=>x.ConfiguracionQuioscoId === key)?.Valor:null
  }
}
