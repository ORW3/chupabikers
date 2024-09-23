import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class OrdenService {
  private apiUrl = 'https://mtbapi.onrender.com/api/ordenes';
  private token = this.authService.getToken();

  constructor(private http: HttpClient, private authService: AuthService) {}

  //registrar orden
  registrarOrden(ordenData: any): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.token}`
    );
    return this.http.post(`${this.apiUrl}/`, ordenData, { headers });
  }

  //métodos para obtener todas las ordenes
  getOrdenes() {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.token}`
    );
    return this.http.get(`${this.apiUrl}`, { headers });
  }

  //método para actualizar la orden
  actualizarOrden(id: any): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.token}`
    );
    return this.http.put(`${this.apiUrl}/${id}/payment`,{}, { headers });
  }

  actualizarKitOrden(id: any): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.token}`
    );
    return this.http.put(`${this.apiUrl}/${id}/kit`,{}, { headers });
  }

  cancelarKitOrden(id: any): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.token}`
    );
    return this.http.put(`${this.apiUrl}/${id}/cancelKit`,{}, { headers });
  }
}
