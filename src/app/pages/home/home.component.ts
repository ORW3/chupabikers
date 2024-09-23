import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  Renderer2,
  ViewChild,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Usuario } from '../../models/usuario';
import { DesafioService } from '../../services/desafio.service';
import { Desafio } from '../../models/desafio';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrdenService } from '../../services/orden.service';
import { KitService } from '../../services/kit.service';
import { RutasService } from '../../services/rutas.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

declare function animacionIn(): any
declare function principal(): any;
declare function carrusel(): any;


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  @ViewChild('conditionalContent') conditionalContent!: ElementRef;
  @ViewChildren('toggleButton') toggleButtons!: QueryList<ElementRef>;
  @ViewChild('selectSelect') selectSelect!: ElementRef;

  anchoPantalla: any;
  currentUser: Usuario | null = null;
  currentImg: String = "";
  isLoggedIn: boolean = false;
  desafios: Desafio[] = [];
  showContent: boolean = false;
  selectedDesafio: Desafio | null = null;
  ordenForm: FormGroup;
  kits: any = [];
  precio: number = 0;
  kitSeleccionado: String = '';
  rutas: any;
  isMaxWidth: boolean = true;
  mostrar: boolean = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private desafioService: DesafioService,
    private fb: FormBuilder,
    private ordenService: OrdenService,
    private kitService: KitService,
    private rutasService: RutasService,
    private el: ElementRef,
    private renderer: Renderer2,
    private breakpointObserver: BreakpointObserver
  ) {
    this.rutas = this.rutasService;
    this.getDesafios();
    this.ordenForm = this.fb.group({
      estaPagado: [false],
      kitSeleccion: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.isLoggedIn = this.authService.isLoggedIn();
    this.currentImg = this.authService.getFotoBici();
    console.log(this.currentImg)
    carrusel();
    this.breakpointObserver.observe(['(max-width: 767px)']).subscribe(result => {
      this.isMaxWidth = result.matches;
      if (this.isMaxWidth) {
        this.mostrar = false;
        animacionIn();
      }
    });
  }

  ngAfterViewInit(){
    principal();
  }

  getDesafios() {
    this.desafioService
      .getDesafios()
      .subscribe((data) => (this.desafios = data));
  }

  //metodo para obtener kits
  getKits(idDesafio: String) {
    this.kitService.getKits(idDesafio).subscribe((data) => {
      this.kits = data;
    });
  }

  logout(): void {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      this.authService.logout();
      this.isLoggedIn = false;
      this.showContent = false;
      this.router.navigate(['/login']);
    }
  }

  toggleContent(desafio: Desafio): void {
    if (this.isLoggedIn) {
      if (this.showContent == true) {
        this.ocultar();
      } else {
        this.showContent = !this.showContent;
      }
      this.selectedDesafio = desafio;
      this.getKits(desafio._id);
    } else {
      this.router.navigate(['/login']);
    }
  }

  ocultar() {
    this.selectSelect.nativeElement.value = '';
    this.ordenForm.get('kitSeleccion')!.setValue('');
    const menu = this.el.nativeElement.querySelector('.menu');
    this.renderer.addClass(menu, 'menu-adios');
    this.renderer.removeClass(menu, 'menu');
    setTimeout(() => {
      this.showContent = !this.showContent;
    }, 300);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.showContent && this.isLoggedIn) {
      const targetElement = event.target as HTMLElement;

      if (
        !this.conditionalContent.nativeElement.contains(targetElement) &&
        this.toggleButtons
          .toArray()
          .every((button) => !button.nativeElement.contains(targetElement))
      ) {
        if (this.showContent == true) {
          this.ocultar();
        } else {
          this.showContent = !this.showContent;
        }
      }
    }
  }

  onSubmit() {
    if (this.ordenForm.invalid) return;

    const ordenData = {
      desafio: this.selectedDesafio?._id,
      metodoPago: 'Ninguno',
      kit: this.kitSeleccionado, //this.ordenForm.value.kitSeleccion,
      estaPagado: this.ordenForm.value.estaPagado,
      precio: (this.selectedDesafio?.precio ?? 0) + this.precio,
    };

    this.ordenService.registrarOrden(ordenData).subscribe(
      (response) => {
        console.log('Orden registrada');
        this.ocultar();
      },
      (error) => {
        console.error('Error al registrar la orden', error);
        alert(error.error)
      }
    );
  }

  onSelectionChange() {
    const selectedValue = this.ordenForm.get('kitSeleccion')?.value;
    if (selectedValue) {
      const { nombreKit, precioKit } = this.separarTexto(selectedValue);
      this.kitSeleccionado = nombreKit;
      this.precio = precioKit;
    } else {
      this.kitSeleccionado = '';
      this.precio = 0;
    }
  }

  isValidKitSelection(): boolean {
    const selectedValue = this.ordenForm.get('kitSeleccion')?.value;
    return selectedValue !== '' && selectedValue !== ' , 0';
  }

  separarTexto(texto: string): { nombreKit: string; precioKit: number } {
    const partes = texto.split(',');
    const nombreKit = partes[0].trim();
    const precioKit = parseInt(partes[1].trim(), 10);

    return { nombreKit, precioKit };
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.anchoPantalla = window.innerWidth;
    if (this.anchoPantalla <= 767) {
      this.mostrar = false;
    } else {
      this.mostrar = true;
      principal()
    }
  }
}
