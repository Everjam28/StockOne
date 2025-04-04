import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  loading: boolean = false;
  error: string = '';
  
  // Variables para paginación
  pageSize: number = 10;
  currentPage: number = 1;
  totalPages: number = 1;

  constructor(private productService: ProductService, private router: Router) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = '';
    
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data.productos;  // Extraer el array de productos
        this.filteredProducts = [...this.products];
        this.calculateTotalPages();
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.error = 'No se pudieron cargar los productos. Intente nuevamente.';
      },
      complete: () => {
        this.loading = false;
      }
    });
    
  }

  deleteProduct(id: number): void {
    if (confirm('¿Está seguro de eliminar este producto?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.products = this.products.filter(p => p.idProducto !== id);
          this.filteredProducts = [...this.products];
          this.calculateTotalPages();
        },
        error: (err) => {
          console.error('Error al eliminar producto:', err);
          this.error = 'No se pudo eliminar el producto. Intente nuevamente.';
        }
      });
    }
  }

  editProduct(id: number): void {
    this.router.navigate([`/productos/editar/${id}`]);
  }

  filterProducts(event: any): void {
    const searchTerm = event.target.value.trim().toLowerCase(); // Elimina espacios adicionales
  
    this.filteredProducts = this.products.filter(product => {
      const nombre = product.nombre ? product.nombre.toLowerCase() : '';
      const descripcion = product.descripcion ? product.descripcion.toLowerCase() : '';
      
      return nombre.includes(searchTerm) || descripcion.includes(searchTerm);
    });
  
    this.calculateTotalPages();
  }
  

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.pageSize);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  get paginatedProducts(): Product[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredProducts.slice(startIndex, startIndex + this.pageSize);
  }
}
