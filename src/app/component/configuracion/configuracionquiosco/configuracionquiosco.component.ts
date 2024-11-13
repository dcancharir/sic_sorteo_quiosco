import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { SalaService } from '../../../service/sala.service'
import { Sala } from '../../../model/Sala'
import { ConfigService } from '../../../service/config.service'
import { environment } from '../../../../environments/environment'
import { NgxSpinnerService } from "ngx-spinner"
import { ConfiguracionquioscoService } from '../../../service/configuracionquiosco.service'
import { ConfiguracionQuioscoLocal } from '../../../model/ConfiguracionQuioscoLocal'
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms'
import { ImpresoraLocal } from '../../../model/ImpresoraLocal';
import { NgbModal, ModalDismissReasons,NgbProgressbarConfig,NgbModalRef } from '@ng-bootstrap/ng-bootstrap'
import { ToastrService } from 'ngx-toastr'
@Component({
  selector: 'app-configuracionquiosco',
  templateUrl: './configuracionquiosco.component.html',
  styleUrl: './configuracionquiosco.component.css'
})
export class ConfiguracionquioscoComponent implements OnInit{
  impresoraLocal! : ImpresoraLocal
  modalRef: NgbModalRef | undefined;
  @ViewChild('modalImpresora') public templateModalImpresora!: TemplateRef<any>
  listaImpresoras:ImpresoraLocal[] = []
  listaConfiguraciones:ConfiguracionQuioscoLocal[] = []
  fondo:string = 'assets/images/feeling-lucky-with-slot-machine-2023-11-27-05-20-01-utc.webp';
  logo:string = ''
  uriLocal : string = environment.url_local
  onCreateForm = this.formBuilder.group({
    // 'id': ['', Validators.compose([
    //   Validators.required,
    //   Validators.pattern('^[0-9]*$')
    // ])],
  });
    closeResult = ''
  constructor(
    private spinnerService:NgxSpinnerService,
    private configuracionQuioscoService : ConfiguracionquioscoService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private toastr: ToastrService,
  ) {
  }
  ngOnInit(): void {
    this.cargarConfiguracionQuiosco()
    this.listarImpresoras()
    this.impresoraLocal = {
      Nombre:'',
      ImpresoraId:0,
      Estado : 1
    }
  }
  abrirModalNuevaImpresora() {
    // this.cantidad = cantidad;
    this.impresoraLocal.Nombre = ''
    this.open(this.templateModalImpresora, 'xs');
  }
  open(modal: TemplateRef<any>, size: string) {
    this.modalRef = this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title', size: size, backdrop: 'static' });
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  cargarConfiguracionQuiosco(){
    this.configuracionQuioscoService.cargarConfiguracionQuiosco().subscribe({
      next:response=>{
        this.listaConfiguraciones = response
      },
      complete:()=>{
        this.spinnerService.hide()
      },
      error:(error)=>{

      }
    })
  }
  guardarConfiguracion(){
    this.spinnerService.show()
    this.configuracionQuioscoService.guardarConfiguracionQuiosco(this.listaConfiguraciones).subscribe({
      next:response=>{
        if(response){
          this.toastr.success("Acción realizada")
        }
        else{
          this.toastr.error("No se pudo realizar la acción")
        }
        this.cargarConfiguracionQuiosco()
      },
      complete:()=>{
        this.spinnerService.hide()
      },
      error:(error)=>{
        this.spinnerService.hide()
      }
    })
  }
  listarImpresoras(){
    this.configuracionQuioscoService.listarImpresoras().subscribe({
      next:response=>{
        this.listaImpresoras = response
      },
      complete:()=>{
        this.spinnerService.hide()
      },
      error:(error)=>{

      }
    })
  }
  guardarImpresora(){
    this.spinnerService.show()
    console.log(this.impresoraLocal)
    if(this.impresoraLocal.Nombre){
      this.impresoraLocal.Estado = 1
      this.configuracionQuioscoService.guardarImpresora(this.impresoraLocal).subscribe({
        next:response=>{
          if(response){
            this.toastr.success("Acción realizada")
          }
          else{
            this.toastr.error("No se pudo realizar la acción")
          }
          this.listarImpresoras()
          this.modalRef?.close()
        },
        complete:()=>{
          this.spinnerService.hide()
        },
        error:(error)=>{
          this.spinnerService.hide()
        }
      })
    }
  }
  eliminarImpresora(id:number){
    this.spinnerService.show()
  
      this.configuracionQuioscoService.eliminarImpresora(id).subscribe({
        next:response=>{
          if(response){
            this.toastr.success("Acción realizada")
          }
          else{
            this.toastr.error("No se pudo realizar la acción")
          }
          this.listarImpresoras()
        },
        complete:()=>{
          this.spinnerService.hide()
        },
        error:(error)=>{
          this.spinnerService.hide()
        }
      })
    

    }
}
