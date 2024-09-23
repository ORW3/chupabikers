import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { OrdenService } from '../../services/orden.service';
import { DesafioService } from '../../services/desafio.service';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { RutasService } from '../../services/rutas.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

declare function animacion(): any;

@Component({
  selector: 'app-ordenes',
  templateUrl: './ordenes.component.html',
  styleUrl: './ordenes.component.css',
})
export class OrdenesComponent implements OnInit {
  rutas: any;
  isLoggedIn: boolean = false;
  ordenes: any = [];
  desafios: any = [];
  @ViewChild('pagarDiv', { static: true }) pagarDiv!: ElementRef;
  @ViewChild('pagarButton') pagarButton!: ElementRef;
  @ViewChild('paypal') paypal!: ElementRef;
  public payPalConfig?: IPayPalConfig;
  total: number = 0;
  ordenS: String = 'Ninguna';
  isMaxWidth: boolean = true;
  mostrar: boolean = true;

  constructor(
    private rutasService: RutasService,
    private authService: AuthService,
    private router: Router,
    private ordenService: OrdenService,
    private desafioService: DesafioService,
    private cdr: ChangeDetectorRef,
    private breakpointObserver: BreakpointObserver
  ) {
    this.rutas = this.rutasService;
    this.getOrdenes();
    this.getDesafios();
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    animacion();
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

  //metodo para obtener todas las ordenes del usuario
  getOrdenes() {
    this.ordenService.getOrdenes().subscribe((data) => {
      this.ordenes = data;
    });
  }

  getDesafios() {
    this.desafioService.getDesafios().subscribe((data) => {
      this.desafios = data;
    });
  }

  pagar(precio: number, id: String, nombre: String) {
    this.ordenService.actualizarKitOrden(id).subscribe(
      (response) => {
        this.ordenS = nombre;
        this.total = precio;

        /** Configuración de Paypal */

        this.payPalConfig = {
          currency: 'MXN',
          clientId:
            'AR56CAtezsTVMwR7MsQjtIBPew9DmpzDV7gehPZ5-tRoOy0kxXBjYtRyCrlGQEUxzZSbKvwdcMod74WX',
          createOrderOnClient: (data: any) =>
            <ICreateOrderRequest>{
              intent: 'CAPTURE',
              purchase_units: [
                {
                  amount: {
                    currency_code: 'MXN',
                    value: precio.toString(),
                    breakdown: {
                      item_total: {
                        currency_code: 'MXN',
                        value: precio.toString(),
                      },
                    },
                  },
                  items: [
                    {
                      name: `Chupi Bikers - ${nombre}`,
                      quantity: '1',
                      category: 'DIGITAL_GOODS',
                      unit_amount: {
                        currency_code: 'MXN',
                        value: precio.toString(),
                      },
                    },
                  ],
                },
              ],
            },
          advanced: {
            commit: 'true',
          },
          style: {
            label: 'paypal',
            layout: 'vertical',
          },
          onApprove: (data: any, actions: any) => {
            actions.order.get().then((details: any) => {
              
            });
          },
          onClientAuthorization: (data: any) => {
            this.ordenService.actualizarOrden(id).subscribe(
              (response) => {
                console.log('Orden actualizada');
                this.getOrdenes();
                this.cdr.detectChanges();
              },
              (error) => {
                console.error('Error al actualizar la orden', error);
              }
            );
            this.limpiarElementos();
          },
          onCancel: (data: any, actions: any) => {
            this.ordenService.cancelarKitOrden(id).subscribe(
              (response) => {
                console.log('Orden actualizada');
                this.getOrdenes();
                this.cdr.detectChanges();
              },
              (error) => {
                console.error('Error al actualizar la orden', error);
              }
            );
          },
          onError: (err: any) => {
            this.ordenService.cancelarKitOrden(id).subscribe(
              (response) => {
                console.log('Orden actualizada');
                this.getOrdenes();
                this.cdr.detectChanges();
              },
              (error) => {
                console.error('Error al actualizar la orden', error);
              }
            );
          },
        };
      },
      (error) => {
        alert(error.error);
      }
    );

    /*render({
      id: '#pagarDiv',
      currency: 'MXN',
      value: precio.toString(),

      onApprove: (details) => {
        console.log(details)
        //actualizar orden
        this.ordenService.actualizarOrden(id).subscribe(
          (response) => {
            console.log('Orden actualizada');
            this.eliminarElementos();
            this.getOrdenes();
            this.cdr.detectChanges();
          },
          (error) => {
            console.error('Error al actualizar la orden', error);
          }
        );
      },
    });*/
  }

  limpiarElementos(){
    const payp = this.paypal.nativeElement;
    while (payp.firstChild) {
      payp.removeChild(payp.firstChild);
    }
    this.ordenS = "Ninguna";
    this.total = 0;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  getNombreDesafio(idDesafio: string): string {
    const desafio = this.desafios.find((d: any) => d._id === idDesafio);
    return desafio
      ? `${desafio.nombreDesafio} ${desafio.numeroDesafio}`
      : 'Desafío no encontrado';
  }
}
