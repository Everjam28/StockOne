// Crea un archivo src/app/models/product.model.ts
export interface Product {
    idProducto: number;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    idCategoria: number;
  }