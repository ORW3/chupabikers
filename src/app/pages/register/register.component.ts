import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CloudinaryService } from '../../services/cloudinary.service';

declare function animacion(): any;
declare var cloudinary: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  subirImgBiciClick = false;
  fotoBici: any;
  logoBici: any;
  logoForm: string = '';
  fotoBiciForm: string = '';
  idBici:string = '';
  idLogo:string = '';
  registerForm: FormGroup;
  errorMessage: string = '';
  tiposSangre = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  sexos = ['Masculino', 'Femenino', 'Otro'];
  estados = [
    'Aguascalientes',
    'Baja California',
    'Baja California Sur',
    'Campeche',
    'Chiapas',
    'Chihuahua',
    'Coahuila',
    'Colima',
    'Durango',
    'Guanajuato',
    'Guerrero',
    'Hidalgo',
    'Jalisco',
    'Mexico',
    'Mexico City',
    'Michoacán',
    'Morelos',
    'Nayarit',
    'Nuevo León',
    'Oaxaca',
    'Puebla',
    'Querétaro',
    'Quintana Roo',
    'San Luis Potosí',
    'Sinaloa',
    'Sonora',
    'Tabasco',
    'Tamaulipas',
    'Tlaxcala',
    'Veracruz',
    'Yucatán',
    'Zacatecas',
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cloudinaryService: CloudinaryService
  ) {
    this.registerForm = this.fb.group({
      nombreCompleto: ['', [Validators.required]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      equipoMTB: [''],
      correoElectronico: ['', [Validators.required, Validators.email]],
      numeroCelular: ['', [Validators.required, Validators.minLength(10)]],
      contactoEmergencia: ['', [Validators.required, Validators.minLength(10)]],
      edad: ['', [Validators.required, Validators.min(0)]],
      tipoSangre: ['', [Validators.required]],
      sexo: ['', [Validators.required]],
      estado: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    animacion();

    this.idBici = sessionStorage.getItem('idBici') ?? '';
    this.idLogo = sessionStorage.getItem('idLogo') ?? '';

    if (this.idBici !== '') {
      this.cloudinaryService.destroyResource(this.idBici).subscribe(
        (response) => {
          console.log('Imagen de bici eliminada con éxito', response);
          sessionStorage.removeItem('idBici');
        },
        (error) => {
          console.error('Error al eliminar la imagen de bici', error);
        }
      );
    }

    if (this.idLogo !== '') {
      this.cloudinaryService.destroyResource(this.idLogo).subscribe(
        (response) => {
          console.log('Imagen de logo eliminada con éxito', response);
          sessionStorage.removeItem('idLogo');
        },
        (error) => {
          console.error('Error al eliminar la imagen de logo', error);
        }
      );
    }

    this.fotoBici = cloudinary.createUploadWidget(
      {
        cloudName: 'dogupuezd',
        uploadPreset: 'illurito',
        multiple: false,
        thumbnails: '.contenedor-button',
        form: '.contenedor-button',
        folder: 'imagenesBici',
        showAdvancedOptions: true,
        tags: ['usuario', 'bici'],
      },
      (error: any, result: any) => {
        if (!error && result && result.event === 'success') {
          this.fotoBiciForm = result.info.url;
          this.idBici = result.info.public_id;
          sessionStorage.setItem('idBici', this.idBici);
        }
      }
    );

    this.logoBici = cloudinary.createUploadWidget(
      {
        cloudName: 'dogupuezd',
        uploadPreset: 'illurito',
        multiple: false,
        thumbnails: '.contenedor-button2',
        form: '.contenedor-button2',
        folder: 'imagenesLogo',
        showAdvancedOptions: true,
        tags: ['usuario', 'logo'],
      },
      (error: any, result: any) => {
        if (!error && result && result.event === 'success') {
          this.logoForm = result.info.url;
          this.idLogo = result.info.public_id;
          sessionStorage.setItem('idLogo', this.idLogo);
        }
      }
    );
  }

  regresar() {
    window.history.back();
  }

  subirImagenBici() {
    this.fotoBici.open();
  }

  subirImagenLogo() {
    this.logoBici.open();
  }

  onSubmit() {
    if (this.registerForm.valid) {
      if (this.fotoBiciForm === '') {
        return;
      }

      const {
        nombreCompleto,
        contrasena,
        equipoMTB,
        correoElectronico,
        numeroCelular,
        contactoEmergencia,
        edad,
        tipoSangre,
        sexo,
        estado,
      } = this.registerForm.value;
      const logo = this.logoForm;
      const fotoBici = this.fotoBiciForm;

      this.authService
        .register(
          nombreCompleto,
          contrasena,
          equipoMTB,
          correoElectronico,
          numeroCelular,
          contactoEmergencia,
          edad,
          tipoSangre,
          sexo,
          estado,
          fotoBici,
          logo
        )
        .subscribe({
          next: () => this.router.navigate(['/login']),
          error: (err) => (this.errorMessage = 'Error al registrar el usuario'),
        });
    }
  }
}
