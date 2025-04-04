import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-categoria-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categoria-create.component.html',
  styleUrls: ['./categoria-create.component.css']
})
export class CategoriaCreateComponent {
  nombre: string = ''; // Campo para el nombre de la categoría
  error: string = '';
  loading: boolean = false;

  constructor(private categoryService: CategoryService, private router: Router) {}

  createCategory(): void {
    if (!this.nombre.trim()) {
      this.error = 'El nombre de la categoría es obligatorio.';
      return;
    }

    this.loading = true;
    this.error = '';

    const newCategory = { nombre: this.nombre };

    this.categoryService.createCategory(newCategory).subscribe({
      next: () => {
        alert('Categoría creada con éxito');
        this.nombre = ''; // ← LIMPIA EL CAMPO DESPUÉS DE CREAR LA CATEGORÍA
      },
      error: (err) => {
        console.error('Error al crear categoría:', err);
        this.error = 'No se pudo crear la categoría. Intente nuevamente.';
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/categorias']); // Esto redirige correctamente a /productos
  }
}
