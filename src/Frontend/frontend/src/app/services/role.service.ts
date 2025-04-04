import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role } from '../models/role.model';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private apiUrl = 'http://localhost:5000/api/roles'; // Asegúrate de que coincide con tu backend

  constructor(private http: HttpClient) {}

  // Obtener todos los roles
  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(this.apiUrl);
  }

  // Obtener un rol por ID
  getRoleById(idRol: number): Observable<Role> {
    return this.http.get<Role>(`${this.apiUrl}/${idRol}`);
  }

  // Crear un nuevo rol
  createRole(role: Role): Observable<Role> {
    return this.http.post<Role>(this.apiUrl, role);
  }

  // Actualizar un rol existente
  updateRole(idRol: number, role: Partial<Role>): Observable<boolean> {
    return this.http.put<boolean>(`${this.apiUrl}/${idRol}`, role);
  }

  // Eliminar un rol
  deleteRole(idRol: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${idRol}`);
  }
}
