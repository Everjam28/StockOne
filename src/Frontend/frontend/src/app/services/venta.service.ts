// src/app/services/venta.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Venta } from '../models/venta.model';
import { VentaDetalle } from '../models/venta-detalle.model';
import { throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class VentaService {
  private apiUrl = 'http://localhost:5000/api/ventas'; // Reemplaza con tu API

  constructor(private http: HttpClient) {}

  getVentas(): Observable<{ ventas: Venta[] }> {
    const token = localStorage.getItem('token'); 
    if (!token) {
      console.error("❌ No hay token en localStorage");
      return throwError(() => new Error("No hay token disponible"));
    }
  
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
  
    console.log("🛠️ Enviando headers:", headers);
    return this.http.get<{ ventas: Venta[] }>(this.apiUrl, { headers });
  }
  
  

  getVentaById(id: number): Observable<{ venta: Venta }> {
    return this.http.get<{ venta: Venta }>(`${this.apiUrl}/detalle/${id}`);
  }
  
  
  getDetalleVenta(id: number): Observable<VentaDetalle[]> {
    return this.http.get<VentaDetalle[]>(`${this.apiUrl}/detalle/${id}`);
  }
  
  

  //createVenta(venta: Omit<Venta, 'idVentas'>): Observable<any> {
    //return this.http.post(this.apiUrl, venta);
  //}
  createVenta(venta: any): Observable<any> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post(this.apiUrl, venta, { headers });
  }

  deleteVenta(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
