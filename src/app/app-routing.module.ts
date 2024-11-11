import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { QuioscoComponent } from './component/cliente/quiosco/quiosco.component'
import { SesionClienteComponent } from './component/cliente/sesioncliente/sesioncliente.component'
import { ConfiguracionquioscoComponent } from './component/configuracion/configuracionquiosco/configuracionquiosco.component'

const routes: Routes = [
  { path: '', redirectTo: '/quiosco', pathMatch: 'full' },
  { path: 'quiosco', component: QuioscoComponent },
  { path: 'sesioncliente', component: SesionClienteComponent },
  { path: 'configuracion', component: ConfiguracionquioscoComponent },
  { path: '**', redirectTo: 'quiosco' }
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
