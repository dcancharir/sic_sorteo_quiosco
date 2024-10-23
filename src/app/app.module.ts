import { NgModule,CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
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
@NgModule({
  declarations: [
    AppComponent,
    QuioscoComponent,
    SesionClienteComponent,
    FooterComponent
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
  providers: [],
  bootstrap: [AppComponent],
  schemas:[
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule { }
