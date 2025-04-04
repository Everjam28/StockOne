import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private fb = inject(FormBuilder);  // ✅ Inyectamos FormBuilder con 'inject()'
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup;
  errorMessage: string = '';

  constructor() {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      clave: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          if (response.usuario.primeraVez) {
            this.router.navigate(['/cambiar-clave']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        },
        error: (error) => {
          console.error('Error al iniciar sesión', error);
          this.errorMessage = error.error?.error || 'Error al iniciar sesión';
        }
      });
    }
  }
}
