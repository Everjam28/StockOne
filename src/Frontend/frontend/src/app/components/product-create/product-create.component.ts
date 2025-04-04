import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service'; // Importar el servicio de categorías

@Component({
  selector: 'app-product-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css']
})
export class ProductCreateComponent implements OnInit {
  productForm: FormGroup;
  submitted = false;
  error = '';
  categorias: any[] = []; // Agregar la propiedad categorias

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService, // Inyectar servicio de categorías
    private router: Router
  ) {
    this.productForm = this.fb.group({
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      precio: ['', [Validators.required, Validators.min(0)]],
      stock: ['', [Validators.required, Validators.min(0)]],
      idCategoria: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadCategories(); // Cargar las categorías cuando el componente se inicie
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categorias = data.categorias;
      },
      error: (err) => {
        console.error('Error al cargar categorías:', err);
        this.error = 'No se pudieron cargar las categorías';
      }
    });
  }

  onSubmit(): void {
    this.submitted = true; // Establecer submitted en true cuando se envía el formulario
    if (this.productForm.invalid) {
      return; // Si el formulario es inválido, no hacemos nada
    }
    this.productService.createProduct(this.productForm.value).subscribe({
      next: () => {
        this.router.navigate(['/product-list']);
        this.productForm.reset(); // Limpiar el formulario después de crear el producto
        this.submitted = false; // Restablecer "submitted" a false para evitar mostrar las validaciones
      },
      error: (err) => {
        console.error('Error al crear producto:', err);
        this.error = 'Error al crear el producto';
      }
    });
  }
  onCancel(): void {
    this.router.navigate(['/productos']); // Esto redirige correctamente a /productos
  }
  
  
}
