import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { ConfigService } from '../../../service/config.service'
import { NgxSpinnerService } from "ngx-spinner"
import { ToastrService } from 'ngx-toastr'
import { QuioscoService } from '../../../service/quiosco.service'
import { QuioscoResult } from '../../../model/QuioscoResult'
import { Cliente } from '../../../model/Cliente'
import moment from 'moment'
import { IddleuserserviceService } from '../../../service/iddleuserservice.service'
@Component({
  selector: 'app-sesioncliente',
  templateUrl: './sesioncliente.component.html',
  styleUrl: './sesioncliente.component.css'
})
export class SesionClienteComponent implements OnInit {
  userMessage : string = ''
  isUserIdle: boolean = false
  listResult : QuioscoResult[] = []
  cliente!:Cliente
  uriSorteos : string = 'http://localhost:5148/'
  quioscoId : number = 0
  fondo:string = 'assets/images/feeling-lucky-with-slot-machine-2023-11-27-05-20-01-utc.webp';
  logo:string = 'assets/logos/21.png'
  constructor(
    private route:Router,
    private configService:ConfigService,
    private toastr: ToastrService,
    private spinnerService:NgxSpinnerService,
    private quioscoService : QuioscoService, 
    private idleUserService : IddleuserserviceService
  ){}
  ngOnInit(): void {
    if(localStorage.getItem("cliente")){
      const itemString = localStorage.getItem('cliente')
      this.cliente = itemString ? JSON.parse(itemString) : null
      this.cargarInfoQuiosco()
      this.cargarDataImpresion()
      this.idleUserService.stop()
    }
    else{
      this.route.navigate(['sesioncliente'],{
        replaceUrl:true
      })
    }
  }
  cargarInfoQuiosco(){
    this.configService.loadConfig().subscribe({
      next:result=>{
        this.quioscoId = result.QuioscoId
      }
    })
  }
  cerrarSesion(){
    if(this.cliente){
      this.spinnerService.show()
      this.quioscoService.LogoutCliente(this.cliente.ClienteId).subscribe({
        next:result=>{
          if(result.status){
            localStorage.removeItem("cliente")
            this.route.navigate(['quiosco'],{
              replaceUrl:true
            })
          }
          else{
            this.toastr.error(result.msg)
          }
        },
        complete:()=>{
          this.spinnerService.hide()
        },
        error:()=>{
          this.spinnerService.hide()
        }
      })
    }
  }
  abrirModalImpresion(sorteoid: number, cantidad: number, nombreSorteo : string){
  }
  convertDate(fecha:Date){
    return moment(fecha,"YYYY-MM-DD").format("DD-MM-YYYY");
  }
  cargarDataImpresion(){
    if(this.cliente.ClienteId){
      this.spinnerService.show()
      this.quioscoService.GetPrintData(this.cliente.ClienteId).subscribe({
        next:result=>{
          if(result.status){
            this.idleUserService.reset()
            this.idleUserService.userInactive.subscribe(
              (data: any) => {
                this.isUserIdle = data.inactive
                this.userMessage = data.message
                if(data.logout && data.inactive ) this.cerrarSesion()
              }
            )
            this.listResult = result.value.sorteos
            this.toastr.success(result.msg)
          }
          else{
            this.toastr.error(result.msg)
          }
        },
        complete:()=>{
          this.spinnerService.hide()
        },
        error:()=>{
          this.spinnerService.hide()
        }
      })
    }
  }
}
