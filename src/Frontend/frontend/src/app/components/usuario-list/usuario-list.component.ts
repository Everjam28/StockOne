import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service'; 
import { User } from '../../models/user.model'; 

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './usuario-list.component.html',
  styleUrls: ['./usuario-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  loading: boolean = false;
  error: string = '';
  
  // Variables para paginación
  pageSize: number = 10;
  currentPage: number = 1;
  totalPages: number = 1;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = '';
    
    this.userService.getUsuarios().subscribe({
      next: (data) => {
        this.users = data;
 // Correcto si `data` ya es un array de usuarios
 // Extraer el array de usuarios
        this.filteredUsers = [...this.users];
        this.calculateTotalPages();
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.error = 'No se pudieron cargar los usuarios. Intente nuevamente.';
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  deleteUser(id: number): void {
    if (confirm('¿Está seguro de eliminar este usuario?')) {
      this.userService.deleteUsuario(id).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.idUsuario !== id);
          this.filteredUsers = [...this.users];
          this.calculateTotalPages();
        },
        error: (err) => {
          console.error('Error al eliminar usuario:', err);
          this.error = 'No se pudo eliminar el usuario. Intente nuevamente.';
        }
      });
    }
  }

  editUser(id: number): void {
    this.router.navigate([`/Usuarios/editar/${id}`]);
  }

  filterUsers(event: any): void {
    const searchTerm = event.target.value.trim().toLowerCase(); // Elimina espacios adicionales
  
    this.filteredUsers = this.users.filter(user => {
      const nombre = user.nombreCompleto ? user.nombreCompleto.toLowerCase() : '';
      const correo = user.correo ? user.correo.toLowerCase() : '';
      
      return nombre.includes(searchTerm) || correo.includes(searchTerm);
    });
  
    this.calculateTotalPages();
  }
  
  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredUsers.length / this.pageSize);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  get paginatedUsers(): User[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredUsers.slice(startIndex, startIndex + this.pageSize);
  }
}
