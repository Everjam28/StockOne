import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from './components/menu/menu.component'; // Importar el menú

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MenuComponent], // Asegurar que RouterOutlet y MenuComponent están aquí
  templateUrl: './app.component.html',
})
export class AppComponent {
  isLoginPage(): boolean {
    const currentUrl = window.location.pathname;
    return currentUrl === '/login' || currentUrl === '/cambiar-clave';
  }
}
