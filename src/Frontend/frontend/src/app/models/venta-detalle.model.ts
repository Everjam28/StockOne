// src/app/models/venta-detalle.model.ts
export interface VentaDetalle {
    idDetalleVenta: number;
    idProducto: number;
    nombreProducto: string;
    cantidad: number;
    precio: number;
    total: number;
  }
  