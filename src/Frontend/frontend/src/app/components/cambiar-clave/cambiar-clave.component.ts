// cambiar-clave.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cambiar-clave',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cambiar-clave.component.html',
  styleUrls: ['./cambiar-clave.component.css']
})
export class CambiarClaveComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  cambiarClaveForm: FormGroup;

  constructor() {
    this.cambiarClaveForm = this.fb.group({
      nuevaCedula: ['', [Validators.required, Validators.minLength(10)]],
      nuevaClave: ['', [Validators.required, Validators.minLength(6)]],
      confirmarClave: ['', [Validators.required]]
    });
  }

  cambiarClave() {
    console.log("Formulario enviado");

    if (this.cambiarClaveForm.invalid) {
      console.log("Formulario inválido", this.cambiarClaveForm.errors);
      return;
    }

    const { nuevaCedula, nuevaClave, confirmarClave } = this.cambiarClaveForm.value;

    if (nuevaClave !== confirmarClave) {
      alert("Las contraseñas no coinciden");
      return;
    }

    // Obtenemos el correo de localStorage, no de sessionStorage
    const correo = localStorage.getItem('correo');
    console.log("Correo encontrado:", correo);

    if (!correo) {
      alert("Error: No se encontró el correo del usuario.");
      return;
    }

    this.authService.cambiarClave({ nuevaCedula, nuevaClave, correo }).subscribe({
      next: (res) => {
        console.log("Respuesta del backend:", res);
        alert(res.mensaje);
        // Redirigir al login después de cambiar la contraseña
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error("Error en la petición:", err);
        alert("Error al cambiar la clave: " + (err.error?.error || err.message || "Inténtalo de nuevo."));
      }
    });
  }
}