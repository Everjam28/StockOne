// src/app/models/venta.model.ts
export interface Venta {
    idVenta: number;
    numeroDocumento: string;
    tipoPago: string;
    total: number;
    fechaRegistro: string;
    detalleVentas?: DetalleVenta[]; // Relación con detalle de venta
  }
  
  export interface DetalleVenta {
    idDetalleVenta: number;
    idProducto: number;
    cantidad: number;
    precio: number;
    total: number;
  }
  

  