import { Component, OnInit, TemplateRef,ViewChild,ElementRef } from '@angular/core';
import { Router } from '@angular/router'
import { ConfigService } from '../../../service/config.service'
import { NgxSpinnerService } from "ngx-spinner"
import { ToastrService } from 'ngx-toastr'
import { QuioscoService } from '../../../service/quiosco.service'
import { QuioscoResult } from '../../../model/QuioscoResult'
import { Cliente } from '../../../model/Cliente'
import moment from 'moment'
import { IddleuserserviceService } from '../../../service/iddleuserservice.service'
import { NgbModal, ModalDismissReasons,NgbModalRef } from '@ng-bootstrap/ng-bootstrap'
import { SignalrService } from '../../../service/signalr.service';
@Component({
  selector: 'app-sesioncliente',
  templateUrl: './sesioncliente.component.html',
  styleUrl: './sesioncliente.component.css'
})
export class SesionClienteComponent implements OnInit {
  mensajeProgressBar : string = ''
  progresactive:boolean = false
  @ViewChild('modalImpresion') public templateModalImpresion!: TemplateRef<any>
  messages : string[] = []
  sorteoSeleccionado:string = ''
  tope:number = 0
  clienteId:number = 0
  sorteoId:number =0
  cantidad:number = 0
  cantidadStr:string = ''
  closeResult = ''
  modalRef!: NgbModalRef
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
    private idleUserService : IddleuserserviceService,
    private modalService: NgbModal,
    private signalrService:SignalrService
  ){}
  ngOnInit(): void {
    if(localStorage.getItem("cliente")){
      const itemString = localStorage.getItem('cliente')
      this.cliente = itemString ? JSON.parse(itemString) : null
      if(this.cliente){
        this.clienteId = this.cliente.ClienteId
      }
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
    this.tope = cantidad
    this.sorteoId = sorteoid
    this.open(this.templateModalImpresion,'xs')
    this.cantidadStr = ''
    this.sorteoSeleccionado = nombreSorteo
  }
  open(modal:TemplateRef<any>,size:string){
    this.modalRef = this.modalService.open(modal,{ariaLabelledBy:'modal-basic-title',size:size,backdrop:'static'})
    this.modalRef.result.then(result=>{
      this.closeResult = `Closed with : ${result}`
    },reason=>{
      this.closeResult = `Dismissed ${this.getDisMissReason(reason)}`
    })
  }
  getDisMissReason(reason:any):string{
    if(reason === ModalDismissReasons.ESC){
      return 'by pressing ESC'
    }
    else if (reason === ModalDismissReasons.BACKDROP_CLICK){
      return 'by clicking on a backdrop'
    }
    else{
      return `with ${reason}`
    }
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
  addChar(value : string){
    if(parseInt(this.cantidadStr) > this.tope){
      this.toastr.warning(`No puede imprimir mas de ${this.tope} cupones`)
      return
    }
    this.cantidadStr += value
    this.cantidad = parseInt(this.cantidadStr)

  }
  backspace(){
    this.cantidadStr = ''
    this.cantidad=0
  }
  enter(){
    this.imprimir()
  }
  imprimir(){
    if(this.cantidad == 0){
      this.toastr.warning("Debe ingresar una cantidad a imprimir")
      return
    }
    this.messages = []
    if(this.cantidad > 0 && this.cantidad <= this.tope){
      this.signalrService.startSignalrConnection().subscribe({
        next:()=>{
          this.signalrService.receiveMessage().subscribe({
            next:innerRes=>{
              this.idleUserService.stop()
              this.progresactive=true
              this.mensajeProgressBar = `${innerRes.serie} - ${innerRes.impreso?'IMPRESO':'ERROR'}`
              if(innerRes.hide){
                this.mensajeProgressBar = `${innerRes.message}`

                this.modalRef.close()
                this.toastr.success("Se terminó de Imprimir")
                setTimeout(() => 
                  {
                    this.cargarDataImpresion()
                    this.progresactive=false;
                  },
                  1500);
              }
            },
            complete:()=>{
              this.progresactive=false
            }
            ,error:()=>{
              this.progresactive=false
            }
          })
        }
        ,complete:()=>{

        },
        error:()=>{

        }
      })
      this.quioscoService.Print(this.sorteoId,this.clienteId,this.cantidad).subscribe({
        next:result =>{
          if(result.status){
            this.toastr.success(`${result.msg}`)
          }
          else{
            this.toastr.success(`${result.msg}`)
          }
        }
        ,complete:()=>{
          this.toastr.success(`Ha ocurrido un error`)
        }
        ,error:()=>{
          this.toastr.success(`Ha ocurrido un error`)
        }
      })
    }
    else{
      this.toastr.error("Verifique cantidad de cupones")
    }
  }
}
