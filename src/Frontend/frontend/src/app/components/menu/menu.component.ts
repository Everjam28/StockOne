import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],  
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  isMenuOpen = true;

  menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: 'fa-home' },
    { label: 'Usuarios', path: '/usuario', icon: 'fa-users' },
    { label: 'Categorías', path: '/categorias', icon: 'fa-tags' },
    { label: 'Productos', path: '/productos', icon: 'fa-box' },
    { label: 'Ventas', path: '/ventas', icon: 'fa-shopping-cart' }
  ];

  constructor(private router: Router) {} // Inyecta Router

  logout() {
    console.log('Cerrando sesión...');
    
    // Eliminar datos de sesión
    localStorage.removeItem('usuario');
    localStorage.removeItem('token'); // Si usas token de autenticación

    // Redirigir al login
    this.router.navigate(['/login']);
  }
}
