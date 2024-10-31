import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'
import { ConfigService } from './config.service'
@Injectable({
  providedIn: 'root'
})
export class IddleuserserviceService {
  private IdleTime : number = 0
  private CountdownTime : number = 0
  private timeoutId: any
  private countdownId: any
  private countdownValue!: number
  userInactive = new Subject<{inactive :boolean , message : string, logout : boolean}>()
  constructor(private configService : ConfigService) { 
    const TIEMPO_ESPERA_INACTIVIDAD = this.configService.getConfig('TIEMPO_ESPERA_INACTIVIDAD')
    const TIEMPO_ESPERA_CONTADOR = this.configService.getConfig('TIEMPO_ESPERA_CONTADOR')
    if (TIEMPO_ESPERA_INACTIVIDAD && TIEMPO_ESPERA_CONTADOR) {
      this.IdleTime = parseInt(TIEMPO_ESPERA_INACTIVIDAD);
      this.CountdownTime = parseInt(TIEMPO_ESPERA_CONTADOR);
      this.reset()
      this.initListener()
    } else {
      console.error("Configuración 'TIEMPO_ESPERA_INACTIVIDAD' o 'TIEMPO_ESPERA_CONTADOR' no encontrada.");
    }
  }
  initListener() {
    window.addEventListener('mousemove', () => this.reset())
    window.addEventListener('click', () => this.reset())
    window.addEventListener('keypress', () => this.reset())
    window.addEventListener('DOMMouseScroll', () => this.reset())
    window.addEventListener('mousewheel', () => this.reset())
    window.addEventListener('touchmove', () => this.reset())
    window.addEventListener('MSPointerMove', () => this.reset())
  }
  reset() {
    clearTimeout(this.timeoutId)
    clearTimeout(this.countdownId)
    this.startIdleTimer()
    this.userInactive.next({
      inactive: false,
      message: '',
      logout:false
    })
  }
  startIdleTimer() {
    this.timeoutId = setTimeout(() => {
      this.startCountdown()
    }, this.IdleTime)
  }
  startCountdown() {
    this.countdownValue = this.CountdownTime / 1000
    this.countdownId = setInterval(() => {
      this.countdownValue--
      this.userInactive.next({
        inactive: true,
        message: 'Su sesión se cerrara automaticamente en : ' + this.countdownValue+' segundos.',
        logout:false
      })
      if (this.countdownValue <= 0) {
        clearInterval(this.countdownId)
        this.userInactive.next({
          inactive: true,
          message: 'Cerrando sesión',
          logout:true
        })
      }
    }, 1000)
  }
  stop(){
    clearTimeout(this.timeoutId)
    clearTimeout(this.countdownId)
    this.userInactive.next({
      inactive: false,
      message: '',
      logout:false
    })
  }
}
