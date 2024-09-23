import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { OrdenesComponent } from './pages/ordenes/ordenes.component';
import { LogGuard } from './guards/log.guard';
import { InformacionComponent } from './pages/informacion/informacion.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  { path: 'registro', component: RegisterComponent, canActivate: [AuthGuard] },
  { path: 'ordenes', component: OrdenesComponent, canActivate: [LogGuard]  },
  { path: 'info', component: InformacionComponent },
  { path: '**', component: HomeComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
