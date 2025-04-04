// src/app/services/usuario.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:5000/api'; // Ajusta la URL según corresponda

  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<User[]> {
    return this.http.get<{ usuarios: User[] }>(`${this.apiUrl}/usuarios`).pipe(
      map((response) => response.usuarios || []),
      catchError((error) => {
        console.error('Error en la API:', error);
        return of([]);
      })
    );
  }

  createUsuario(data: any): Observable<any> {
    console.log('🚀 Enviando datos al backend:', data);
    return this.http.post(`${this.apiUrl}/usuarios`, data);
  }

  // Corregido: Faltaba "usuarios" en la ruta
  editarUsuario(id: number, usuario: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/usuarios/${id}`, usuario);
  }

  // Corregido: Faltaba "usuarios" en la ruta
  obtenerUsuarioPorId(id: number): Observable<User> {
    return this.http.get<{usuario: User}>(`${this.apiUrl}/usuarios/${id}`).pipe(
      map(response => response.usuario)
    );
  }

  deleteUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/usuarios/${id}`);
  }
}