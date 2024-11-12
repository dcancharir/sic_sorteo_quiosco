import { Injectable } from '@angular/core'
import * as signalR from '@microsoft/signalr'
import { Observable,Subject } from 'rxjs'
import { environment } from '../../environments/environment'
import { SignalrModel } from '../model/SignalrModel'
@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  hubConnection!:signalR.HubConnection
  private readonly urlLocal = environment.url_local
  printMessageSubject = new Subject<SignalrModel>()
  prinConnectionSubject = new Subject<string>()
  constructor() { 
    this.hubConnection = new signalR.HubConnectionBuilder()
    .withUrl(`${this.urlLocal}/hubs/print`,{
      skipNegotiation:true,
      transport:signalR.HttpTransportType.WebSockets
    }) // SignalR hub URL
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
    if(this.hubConnection){
      this.hubConnection.stop()
    }
  }
  receiveMessage(){
    return new Observable<any>((observer)=>{
      this.hubConnection.on('ReceiveProgress',data=>{
        observer.next(data)
      })
    })
  }
}
