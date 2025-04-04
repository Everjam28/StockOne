import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'app-usuario-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './usuario-create.component.html',
  styleUrls: ['./usuario-create.component.css']
})
export class UsuarioCreateComponent implements OnInit {
  usuarioForm: FormGroup;
  submitted = false;
  error = '';
  roles: any[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private roleService: RoleService,
    private router: Router
  ) {
    this.usuarioForm = this.fb.group({
      idUsuario: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]],
      nombreCompleto: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      clave: [
        '', 
        [
          Validators.required, 
          Validators.minLength(8), 
          Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
        ]
      ],
      idRol: ['', [Validators.required]],
      esActivo: [true, [Validators.required]]
    });
    
  }

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.roleService.getRoles().subscribe({
      next: (data) => {
        this.roles = data; // Carga los roles desde el backend
      },
      error: (err) => {
        console.error('Error al cargar roles:', err);
        this.error = 'No se pudieron cargar los roles';
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
  
    if (this.usuarioForm.invalid) {
      console.log('Formulario inválido:', this.usuarioForm.value);
      return;
    }
  
    console.log('✅ Enviando usuario:', this.usuarioForm.value);  // <-- Agrega esto para verificar si el método se ejecuta
  
    this.userService.createUsuario(this.usuarioForm.value).subscribe({
      next: (response) => {
        console.log('Usuario creado con éxito:', response);
        this.router.navigate(['/usuarios']);
        this.usuarioForm.reset();
        this.submitted = false;
      },
      error: (err) => {
        console.error('❌ Error al crear usuario:', err);
        this.error = 'Error al crear el usuario';
      }
    });
  }
  

  onCancel(): void {
    this.router.navigate(['/usuarios']);
  }
}
