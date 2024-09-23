import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KitService {
  private apiUrl = 'https://mtbapi.onrender.com/api/kits';

  constructor(private http:HttpClient) { }

  //métodos para obtener todos los kits para un desafio especifico
  getKits(id: String):Observable<any>{
    let url = `${this.apiUrl}/${id}`;
    return this.http.get(url)
  }
}
