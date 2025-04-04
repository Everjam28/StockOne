import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/categoria.model'; 

@Component({
  selector: 'app-categoria-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './categoria-edit.component.html',
  styleUrls: ['./categoria-edit.component.css']
})
export class CategoriaEditComponent implements OnInit {
  categoriaForm: FormGroup;
  submitted = false;
  error = '';
  categoriaId!: number; // ID de la categoría
  categoria!: Category; // Datos de la categoría

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.categoriaForm = this.fb.group({
      nombre: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.categoriaId = +this.route.snapshot.paramMap.get('id')!;
    console.log('ID de la categoría:', this.categoriaId); // 👀 Verifica el ID
    this.loadCategoria();
  }
  

  // Cargar la categoría a editar
  loadCategoria(): void {
    this.categoryService.getCategoryById(this.categoriaId).subscribe({
      next: (data) => {
        console.log('Datos recibidos del backend:', data); // 👀 Verifica la respuesta
        if (data && data.categoria) {
          this.categoriaForm.patchValue({ nombre: data.categoria.nombre });
        } else {
          this.error = 'No se pudo cargar la categoría';
        }
      },
      error: (err) => {
        console.error('Error al cargar categoría:', err); // 👀 Captura el error exacto
        this.error = 'No se pudo cargar la categoría';
      }
    });
  }
  

  // Enviar el formulario para actualizar la categoría
  onSubmit(): void {
    this.submitted = true;
    if (this.categoriaForm.invalid) {
      return;
    }
    const updatedCategoria = this.categoriaForm.value;
    this.categoryService.updateCategory(this.categoriaId, updatedCategoria).subscribe({
      next: () => {
        this.router.navigate(['/categorias']); // Redirigir a la lista de categorías
      },
      error: (err) => {
        console.error('Error al actualizar categoría:', err);
        this.error = 'Error al actualizar la categoría';
      }
    });
  }

  // Cancelar y volver a la lista de categorías
  onCancel(): void {
    this.router.navigate(['/categorias']);
  }
}
