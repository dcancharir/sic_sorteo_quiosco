import { Injectable } from '@angular/core'
import * as signalR from '@microsoft/signalr'
import { Observable,Subject } from 'rxjs'
@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  hubConnection!:signalR.HubConnection
  private readonly signalrUrl = 'http://localhost:7000/progress-hub'
  printMessageSubject = new Subject<{message:string,hide:boolean,serie:string,impresora:string,impreso:boolean,cantidadProcesados:number}>()
  prinConnectionSubject = new Subject<string>()
  constructor() { 
    this.hubConnection = new signalR.HubConnectionBuilder()
    .withUrl(this.signalrUrl) // SignalR hub URL
    .build();
  }
  startSignalrConnection():Observable<void>{
    return new Observable<void>(observer=>{
      this.hubConnection
      .start()
      .then(()=>{
        console.log('Connection established with signalr Hub')
        observer.next()
        observer.complete()
      })
      .catch(error=>{
        console.error('Error connecting to SignalR hub : ' , error)
        observer.error(error)
      })
    })
  }
  stopSignalrConnection():void{
    if(this.hubConnection!=null){
      this.hubConnection.stop()
    }
  }
  addPrintStatuListener():void{
    this.hubConnection.on('ReceiveProgress',data=>{
      this.printMessageSubject.next(data)
    })
  }
  receiveMessage(){
    return new Observable<any>((observer)=>{
      this.hubConnection.on('ReceiveProgress',data=>{
        observer.next(data)
      })
    })
  }
  getPrintStatus():Observable<any>{
    return this.printMessageSubject.asObservable()
  }

}
