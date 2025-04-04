import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {
  productForm: FormGroup;
  submitted = false;
  error = '';
  productId!: number; // Utilizando el operador '!' para evitar el error de no inicialización
  categorias: any[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute
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
    this.productId = +this.route.snapshot.paramMap.get('id')!; // Obtener el ID desde la URL
    this.loadProduct(); // Cargar los datos del producto a editar
    this.loadCategories(); // Cargar las categorías disponibles
  }

  // Cargar el producto a editar
  loadProduct(): void {
    this.productService.getProductById(this.productId).subscribe({
      next: (data) => {
        const product: Product = data.producto;
        this.productForm.patchValue({
          nombre: product.nombre,
          descripcion: product.descripcion,
          precio: product.precio,
          stock: product.stock,
          idCategoria: product.idCategoria
        });
      },
      error: (err) => {
        console.error('Error al cargar producto:', err);
        this.error = 'No se pudo cargar el producto';
      }
    });
  }

  // Cargar las categorías
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

  // Enviar el formulario para actualizar el producto
  onSubmit(): void {
    this.submitted = true;
    if (this.productForm.invalid) {
      return;
    }
    const updatedProduct = this.productForm.value;
    this.productService.updateProduct(this.productId, updatedProduct).subscribe({
      next: () => {
        this.router.navigate(['/productos']); // Redirigir a la lista de productos
      },
      error: (err) => {
        console.error('Error al actualizar producto:', err);
        this.error = 'Error al actualizar el producto';
      }
    });
  }

  // Redirigir al usuario cuando cancele la edición
  onCancel(): void {
    this.router.navigate(['/productos']); // Redirigir a la lista de productos
  }
}
