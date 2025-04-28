import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { TipoDocumento } from '../../../model/TipoDocumento';
import { ConfigService } from '../../../service/config.service';
import { TipodocumentoService } from '../../../service/tipodocumento.service';
import { QuioscoService } from '../../../service/quiosco.service';
import { LoginQuiosco } from '../../../model/LoginQuiosco';
import { environment } from '../../../../environments/environment';
import { SalaService } from '../../../service/sala.service';
import { Sala } from '../../../model/Sala';
@Component({
  selector: 'app-sesionquiosco',
  templateUrl: './quiosco.component.html',
  styleUrls: ['./quiosco.component.css'],
})
export class QuioscoComponent implements OnInit {
  @ViewChild('nrodocumento_input') nrodocumento_input!: ElementRef;
  @ViewChild('clave_input') codigo_input!: ElementRef;
  currentInput: 'nrodocumento_input' | 'clave_input' = 'nrodocumento_input';
  sala!: Sala;
  uriLocal: string = environment.url_local;
  loginRequest!: LoginQuiosco;
  quioscoId: number = 0;
  fondo: string =
    'assets/images/feeling-lucky-with-slot-machine-2023-11-27-05-20-01-utc.webp';
  logo: string = '';
  listatipodocumento: TipoDocumento[] = [];
  nrodocumento: string = '';
  claveSeguridad: string = '';
  tipodocumento: number = 0;
  onCreateForm = this.formBuilder.group({
    claveSeguridad: [''],
    nrodocumento: [''],
    tipodocumento: [''],
  });
  constructor(
    private configService: ConfigService,
    private formBuilder: FormBuilder,
    private tipoDocumentoService: TipodocumentoService,
    private spinnerService: NgxSpinnerService,
    private quioscoService: QuioscoService,
    private toastr: ToastrService,
    private route: Router,
    private salaService: SalaService
  ) {}
  ngAfterViewInit() {
    this.setFocus();
  }
  setFocus() {
    this.nrodocumento_input.nativeElement.focus();
  }
  onFocus(inputName: 'nrodocumento_input' | 'clave_input') {
    this.currentInput = inputName;
  }
  ngOnInit(): void {
    if (localStorage.getItem('cliente')) {
      this.route.navigate(['sesioncliente'], {
        replaceUrl: true,
      });
    } else {
      this.configService.loadConfig().subscribe({
        next: (res) => {
          console.log(res);
          const ID_QUIOSCO = res.find(
            (x) => x.ConfiguracionQuioscoId == 'ID_QUIOSCO'
          )?.Valor;
          if (ID_QUIOSCO) {
            this.quioscoId = parseInt(ID_QUIOSCO);
          } else {
            console.error('Configuración no encontrada.');
          }
        },
        error: (err) => {
          console.error('Error al cargar la configuración', err);
        },
      });
      this.cargarInfoSala();

      this.cargarTipoDocumento();
    }
  }
  cargarInfoSala() {
    this.spinnerService.show();
    this.salaService.GetSala().subscribe({
      next: (response) => {
        if (response.status) {
          this.logo = `assets/logos/${response.value.Cod_Sala}.png`;
        }
      },
      complete: () => {
        this.spinnerService.hide();
      },
      error: (error) => {},
    });
  }
  // cargarInfoQuiosco(){
  //   const ID_QUIOSCO = this.configService.getConfig('ID_QUIOSCO')
  //   if(ID_QUIOSCO){
  //     this.quioscoId = parseInt(ID_QUIOSCO);
  //   }
  // }
  cargarTipoDocumento() {
    this.spinnerService.show();
    this.tipoDocumentoService.GetTipoDocumento().subscribe({
      next: (response) => {
        if (response.status) {
          this.listatipodocumento = response.value;
          if (this.listatipodocumento.length > 0) {
            this.tipodocumento = this.listatipodocumento[0].TipoDocumentoId;
          }
        }
      },
      complete: () => {
        this.spinnerService.hide();
      },
      error: (error) => {
        this.spinnerService.hide();
      },
    });
  }
  loginCliente() {
    if (this.tipodocumento && this.nrodocumento && this.claveSeguridad) {
      this.loginRequest = {
        TipoDocumentoId: this.tipodocumento,
        NroDocumento: this.nrodocumento,
        ClaveSeguridad: this.claveSeguridad,
      };
      this.spinnerService.show();
      this.quioscoService.LoginCliente(this.loginRequest).subscribe({
        next: (result) => {
          if (result.status) {
            localStorage.setItem('cliente', JSON.stringify(result.value));
            this.route.navigate(['sesioncliente'], {
              replaceUrl: true,
            });
          } else {
            this.toastr.error(result.msg);
          }
        },
        complete: () => {
          this.spinnerService.hide();
        },
        error: (error) => {
          this.spinnerService.hide();
        },
      });
    } else {
      this.toastr.warning('Complete los campos obligatorios');
    }
  }
  addChar(value: string) {
    value = value.toUpperCase();
    if (this.currentInput == 'nrodocumento_input') {
      this.nrodocumento += value;
    } else if (this.currentInput == 'clave_input') {
      if (this.claveSeguridad.length < 4) {
        this.claveSeguridad += value;
      }
    }
  }
  backspace() {
    if (this.currentInput == 'nrodocumento_input') {
      this.nrodocumento = '';
    } else if (this.currentInput == 'clave_input') {
      this.claveSeguridad = '';
    }
  }
  enter() {
    this.loginCliente();
  }
  addback() {
    if (this.currentInput == 'nrodocumento_input') {
      if (this.nrodocumento.length > 0) {
        this.nrodocumento = this.nrodocumento.slice(0, -1);
      }
    } else if (this.currentInput == 'clave_input') {
      if (this.claveSeguridad.length > 0) {
        this.claveSeguridad = this.claveSeguridad.slice(0, -1);
      }
    }
  }
  refrescarPagina() {
    window.location.reload();
  }
}
