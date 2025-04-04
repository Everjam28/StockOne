import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { HttpClientModule } from '@angular/common/http';
import { ProductService } from '../../services/product.service'; 
import { Product } from '../../models/product.model'; 
import { VentaService } from '../../services/venta.service'
import { Venta } from '../../models/venta.model';
@Component({
  selector: 'app-venta-create',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './venta-create.component.html',
  styleUrls: ['./venta-create.component.css']
})
export class VentaCreateComponent implements OnInit {
  tipoPago: string = 'Efectivo';
  productosDisponibles: Product[] = [];
  productosFiltrados: Product[] = [];
  productosSeleccionados: any[] = [];

  productoBuscado: string = ''; // Campo de búsqueda independiente

  constructor(
    private productService: ProductService,
    private ventaService: VentaService // Inyectar el servicio de ventas
  ) {}

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.productosDisponibles = data.productos;
      },
      error: (error) => console.error('Error al cargar productos', error),
    });
  }

  filtrarProductos(event: any) {
    const query = event.target.value.toLowerCase().trim();
    if (query === '') {
      this.productosFiltrados = [];
      return;
    }

    this.productosFiltrados = this.productosDisponibles.filter(
      (p) => p.nombre.toLowerCase().includes(query) || p.idProducto.toString().includes(query)
    );
  }

  seleccionarProducto(producto: Product) {
    // Verificar si el producto ya está agregado
    const existe = this.productosSeleccionados.find((p) => p.idProducto === producto.idProducto);

    if (!existe) {
      this.productosSeleccionados.push({
        idProducto: producto.idProducto,  // Solo el idProducto se necesita para el backend
        nombre: producto.nombre,         // Se guarda el nombre solo para mostrar en la UI
        cantidad: 1,                     // Valor predeterminado o lo puedes ajustar según el caso
        precio: producto.precio,         // El precio del producto
        total: producto.precio           // Este total se actualizará cuando el usuario cambie la cantidad
      });
    }

    // Limpiar la búsqueda y ocultar la lista
    this.productoBuscado = '';
    this.productosFiltrados = [];
  }

  calcularTotal(index: number) {
    this.productosSeleccionados[index].total =
      this.productosSeleccionados[index].cantidad * this.productosSeleccionados[index].precio;
  }

  eliminarProducto(index: number) {
    this.productosSeleccionados.splice(index, 1);
  }

  registrarVenta() {
    if (this.productosSeleccionados.length === 0) {
      alert("Debe agregar al menos un producto a la venta.");
      return;
    }
  
    const total = this.productosSeleccionados.reduce((sum, p) => sum + p.total, 0);
  
    // Crear el objeto exactamente como lo aceptó Postman
    const nuevaVenta = { 
      tipoPago: this.tipoPago,
      total: total,
      productos: this.productosSeleccionados.map(p => ({
        idProducto: p.idProducto,
        cantidad: p.cantidad,
        precio: p.precio
      }))
    };
  
    // Agregar más logs para depuración
    console.log('Estructura completa a enviar:', JSON.stringify(nuevaVenta, null, 2));
  
    this.ventaService.createVenta(nuevaVenta).subscribe({
      next: (response) => {
        console.log('Respuesta exitosa:', response);
        alert('Venta registrada exitosamente');
        this.productosSeleccionados = [];
      },
      error: (error) => {
        console.error('Error completo:', error);
        alert(`Error: ${error.error?.error || error.message || 'Error desconocido'}`);
      }
    });
  }
  
}
  

