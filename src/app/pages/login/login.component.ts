import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

declare function animacion():any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      correoElectronico: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    animacion();
  }

  regresar(){
    window.history.back();
  }
  
  onSubmit() {
    if (this.loginForm.valid) {
      const { correoElectronico, contrasena } = this.loginForm.value;
      this.authService.login(correoElectronico, contrasena).subscribe({
        next: () => this.router.navigate(['/']),
        error: err => this.errorMessage = 'Datos incorrectos'
      });
    }
  }
}
