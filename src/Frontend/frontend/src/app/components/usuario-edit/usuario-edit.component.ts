import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service'; 
import { RoleService } from '../../services/role.service'; 
import { User } from '../../models/user.model'; 

@Component({
  selector: 'app-usuario-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './usuario-edit.component.html',
  styleUrls: ['./usuario-edit.component.css']
})
export class UsuarioEditComponent implements OnInit {
  usuarioForm: FormGroup;
  submitted = false;
  error = '';
  usuarioId!: number;
  roles: any[] = [];

  constructor(
    private fb: FormBuilder,
    private usuarioService: UserService,
    private rolService: RoleService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.usuarioForm = this.fb.group({
      nombreCompleto: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      clave: ['', [Validators.required, Validators.minLength(6)]],
      esActivo: [true, [Validators.required]],
      idRol: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.usuarioId = +this.route.snapshot.paramMap.get('id')!;
    this.loadUsuario();
    this.loadRoles();
  }

  loadUsuario(): void {
    this.usuarioId = +this.route.snapshot.paramMap.get('id')!; // Obtiene el ID desde la URL
  
    this.usuarioService.obtenerUsuarioPorId(this.usuarioId).subscribe({
      next: (data) => {
        const usuario: User = data; // Aquí asumimos que `data` es un objeto, no un array
        this.usuarioForm.patchValue({
          nombreCompleto: usuario.nombreCompleto,
          correo: usuario.correo,
          clave: usuario.clave,
          esActivo: usuario.esActivo,
          idRol: usuario.idRol
        });
      },
      error: (err) => {
        console.error('Error al cargar usuario:', err);
        this.error = 'No se pudo cargar el usuario';
      }
    });
  }
  

  loadRoles(): void {
    this.rolService.getRoles().subscribe({
      next: (data) => {
        this.loadRoles();

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
      return;
    }
  
    const updatedUsuario = this.usuarioForm.value;
    this.usuarioService.editarUsuario(this.usuarioId, updatedUsuario).subscribe({
      next: () => {
        alert('✅ Usuario actualizado correctamente.');
        this.router.navigate(['/usuarios']); // Redirige a la lista de usuarios
      },
      error: (err) => {
        console.error('Error al actualizar usuario:', err);
        this.error = 'Error al actualizar el usuario';
      }
    });
  }
  

  onCancel(): void {
    this.router.navigate(['/usuario']); // Redirige a la lista de usuarios
  }
}
