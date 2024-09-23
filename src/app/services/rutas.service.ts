import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RutasService {

  constructor( private router: Router) { }

  irRegistro(){
    this.router.navigate(['/registro']);
  }

  irInfo(){
    this.router.navigate(['/info'])
  }

  irInicio(){
    this.router.navigate(['/'])
  }

  irOrdenes(){
    window.location.href = './ordenes';
  }
}
