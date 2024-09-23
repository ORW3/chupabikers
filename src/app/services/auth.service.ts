import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://mtbapi.onrender.com/api';
  private currentUserSubject: BehaviorSubject<Usuario | null>;
  public currentUser: Observable<Usuario | null>;
  public fotoBici2: String = "";

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<Usuario | null>(this.getUserFromStorage());
    this.currentUser = this.currentUserSubject.asObservable();
  }

  // Login
  login(correoElectronico: string, contrasena: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuarios/login`, { correoElectronico, contrasena }).pipe(
      tap((response: any) => {
        // Guardar token en el almacenamiento local
        this.setUserInStorage(response.nombreCompleto);
        this.currentUserSubject.next(response.nombreCompleto);
        localStorage.setItem('userToken', response.token);
        this.fotoBici2 = response.fotoBici;
      })
    );
  }

  // Registro
  register(
    nombreCompleto: string,
    contrasena: string,
    equipoMTB: string,
    correoElectronico: string,
    numeroCelular: string,
    contactoEmergencia: string,
    edad: number,
    tipoSangre: string,
    sexo: string,
    estado: string,
    fotoBici: string,
    logo: string
  ): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuarios`, {
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
    });
  }

  // Obtener token del usuario autenticado
  getToken() {
    return localStorage.getItem('userToken');
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!localStorage.getItem('userToken');
  }

  // Logout
  logout() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !! this.getToken();
  }

  getCurrentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  getFotoBici(): String{
    return this.fotoBici2;
  }

  private setUserInStorage(usuario: Usuario): void {
    localStorage.setItem('currentUser', JSON.stringify(usuario));
  }

  private getUserFromStorage(): Usuario | null {
    const userString = localStorage.getItem('currentUser');
    if (userString) {
      return JSON.parse(userString);
    }
    return null;
  }
}

