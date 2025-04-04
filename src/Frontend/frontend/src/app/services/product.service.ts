// src/app/services/product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:5000/api/productos';

  constructor(private http: HttpClient) { }

  getProducts(): Observable<{productos: Product[]}> {
    return this.http.get<{productos: Product[]}>(this.apiUrl);
  }

  getProductById(id: number): Observable<{producto: Product}> {
    return this.http.get<{producto: Product}>(`${this.apiUrl}/${id}`);
  }

  createProduct(product: Omit<Product, 'idProducto'>): Observable<any> {
    return this.http.post(this.apiUrl, product);
  }

  updateProduct(id: number, product: Partial<Product>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}