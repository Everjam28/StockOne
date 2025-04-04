import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CategoryService } from '../../services/category.service'; 
import { Category } from '../../models/categoria.model'; 

@Component({
  selector: 'app-categoria-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './categoria-list.component.html',
  styleUrls: ['./categoria-list.component.css']
})
export class CategoriaListComponent implements OnInit {
  Category: Category[] = [];
  filteredCategory: Category[] = [];
  loading: boolean = false;
  error: string = '';
  
  // Variables para paginación
  pageSize: number = 10;
  currentPage: number = 1;
  totalPages: number = 1;

  constructor(private CategoryService: CategoryService, private router: Router) { }

  ngOnInit(): void {
    this.loadCategory();
  }

  loadCategory(): void {
    this.loading = true;
    this.error = '';
  
    this.CategoryService.getCategories().subscribe({
      next: (data) => {
        console.log("🔍 Datos recibidos:", data); // Depuración en consola
        this.Category = data.categorias ?? []; // Acceder a 'categorias' correctamente
        this.filteredCategory = [...this.Category];
        this.calculateTotalPages();
      },
      error: (err) => {
        console.error('❌ Error al cargar categorías:', err);
        this.error = 'No se pudieron cargar las categorías. Intente nuevamente.';
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
  

  deletCategory(id: number): void {
    if (confirm('¿Está seguro de eliminar esta categoria?')) {
      this.CategoryService.deleteCategory(id).subscribe({
        next: () => {
          this.Category = this.Category.filter(p => p.idCategoria !== id);
          this.filteredCategory = [...this.Category];
          this.calculateTotalPages();
        },
        error: (err) => {
          console.error('Error al eliminar categoria:', err);
          this.error = 'No se pudo eliminar la categoria. Intente nuevamente.';
        }
      });
    }
  }

  editCategory(id: number): void {
    this.router.navigate([`/categorias/editar/${id}`]);
  }

  filterCategory(event: any): void {
    const searchTerm = event.target.value.trim().toLowerCase(); // Elimina espacios adicionales
  
    this.filteredCategory = this.Category.filter(category => {
      const nombre = category.nombre ? category.nombre.toLowerCase() : '';
      
      return nombre.includes(searchTerm);
    });
  
    this.calculateTotalPages();
  }
  

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredCategory.length / this.pageSize);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  get paginatedCategory(): Category[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredCategory.slice(startIndex, startIndex + this.pageSize);
  }
}
