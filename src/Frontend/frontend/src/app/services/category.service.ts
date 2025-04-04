import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/categoria.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:5000/api/categoria'; // Ajusta la URL según tu backend

  constructor(private http: HttpClient) { }

  // Obtener todas las categorías
  getCategories(): Observable<{ categorias: Category[] }> {
    return this.http.get<{ categorias: Category[] }>(this.apiUrl);
  }
  

  // Obtener una categoría por ID
  getCategoryById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Crear una nueva categoría
  createCategory(category: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, category);
  }

  // Actualizar una categoría
  updateCategory(id: number, category: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, category);
  }

  // Eliminar una categoría
  deleteCategory(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
