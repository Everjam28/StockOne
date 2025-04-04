import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { VentaService } from '../../services/venta.service';
import { Venta } from '../../models/venta.model';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit {
  ventas: Venta[] = [];
  loading: boolean = false;
  error: string = '';

  constructor(private ventaService: VentaService, private router: Router) {}

  ngOnInit(): void {
    this.loadVentas();
  }

  loadVentas(): void {
    this.ventaService.getVentas().subscribe({
      next: (respuesta) => {
        console.log("🔍 Ventas recibidas:", respuesta);
        
        // Si la API devuelve un objeto con una propiedad 'ventas', extraer el array
        this.ventas = Array.isArray(respuesta) ? respuesta : respuesta.ventas;
      },
      error: (err) => {
        console.error("🚨 Error al obtener ventas:", err);
      }
    });
    
    
  }
  verDetalle(idVenta: number | undefined) {
    if (!idVenta) {
      console.error("🚨 Error: idVenta es undefined");
      return;
    }
    this.router.navigate(["/ventas/detalle", idVenta]);
  }
  
  
  
  

  deleteVenta(id: number): void {
    if (confirm('¿Está seguro de eliminar esta venta?')) {
      this.ventaService.deleteVenta(id).subscribe({
        next: () => {
          this.ventas = this.ventas.filter(v => v.idVenta !== id);
        },
        error: (err) => {
          console.error('Error al eliminar venta:', err);
          this.error = 'No se pudo eliminar la venta. Intente nuevamente.';
        }
      });
    }
  }
}
