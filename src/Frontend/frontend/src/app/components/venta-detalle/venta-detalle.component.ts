import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VentaService } from '../../services/venta.service';
import { VentaDetalle } from '../../models/venta-detalle.model';

@Component({
  selector: 'app-ventas-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './venta-detalle.component.html',
  styleUrls: ['./venta-detalle.component.css']
})
export class VentasDetalleComponent implements OnInit {
  detalles: VentaDetalle[] = [];
  loading: boolean = false;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private ventaService: VentaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    console.log('ID recibido en detalle:', id);
    if (id) {
      this.loadDetalle(id);
    }
  }

  loadDetalle(id: number): void {
    this.loading = true;

    this.ventaService.getDetalleVenta(id).subscribe({
      next: (detalleData) => {
        this.detalles = detalleData;
      },
      error: (err) => {
        console.error('Error al cargar los detalles:', err);
        this.error = 'No se pudo cargar el detalle de la venta.';
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
