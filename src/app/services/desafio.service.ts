import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Desafio } from '../models/desafio';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DesafioService {

  private apiUrl = 'https://mtbapi.onrender.com/api';

  constructor(private http:HttpClient) { }

  //método para obtener todos los desafios
  getDesafios(): Observable<Desafio[]> {
    let url = `${this.apiUrl}/desafios`;
    return this.http.get<Desafio[]>(url);
  }

  //métodos para obtener un kit especifico
  getDesafio(id: String):Observable<any>{
    let url = `${this.apiUrl}/desafios/${id}`;
    return this.http.get(url)
  }
}
