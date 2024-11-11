import { NgModule,CUSTOM_ELEMENTS_SCHEMA,APP_INITIALIZER   } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QuioscoComponent } from './component/cliente/quiosco/quiosco.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http';
import { SesionClienteComponent } from './component/cliente/sesioncliente/sesioncliente.component';
import { FooterComponent } from './component/utilidades/footer/footer.component';
import { NgSelectModule } from '@ng-select/ng-select'
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { ToastrModule } from 'ngx-toastr'
import { ConfigService } from './service/config.service';
import { ConfiguracionquioscoComponent } from './component/configuracion/configuracionquiosco/configuracionquiosco.component';
export function initializeApp(configService:ConfigService){
  return ():Promise<any>=>{
    return configService.loadConfig().toPromise()
  }
}
@NgModule({
  declarations: [
    AppComponent,
    QuioscoComponent,
    SesionClienteComponent,
    FooterComponent,
    ConfiguracionquioscoComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' }),
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgSelectModule,
    ToastrModule.forRoot({ progressBar: true, progressAnimation: 'decreasing', preventDuplicates: true, }),
  ],
  providers: [
    ConfigService,{
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [ConfigService],
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  schemas:[
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule { }
