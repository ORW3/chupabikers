import { Component, OnInit } from '@angular/core';
import { RutasService } from '../../services/rutas.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-informacion',
  templateUrl: './informacion.component.html',
  styleUrl: './informacion.component.css'
})
export class InformacionComponent implements OnInit{
  rutas: any;
  isLoggedIn: boolean = false
  isMaxWidth: boolean = true;
  mostrar: boolean = true;

  constructor(
    private rutasService: RutasService,
    private authService: AuthService,
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ){
    this.rutas = this.rutasService;
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.breakpointObserver.observe(['(max-width: 767px)']).subscribe(result => {
      this.isMaxWidth = result.matches;
      if (this.isMaxWidth) {
        this.mostrar = false;
      }
    });
  }
  
  logout(): void {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      this.authService.logout();
      this.isLoggedIn = false;
      this.router.navigate(['/login']);
    }
  }
}
