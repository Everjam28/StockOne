import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
//import { jwtDecode } from 'jwt-decode'; // Asegúrate de instalar este paquete: npm install jwt-decode

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (typeof window === 'undefined') {
      return false; // Bloquear acceso en SSR
    }

    const token = localStorage.getItem('token');

    if (!token) {
      console.warn('🔴 Acceso denegado: No hay token');
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    try {
      // Puedes usar jwt-decode o el método que ya tienes
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        throw new Error('Token inválido');
      }
      
      // Decodificar manualmente el token
      const payload = JSON.parse(atob(tokenParts[1]));

      // Verificar la expiración del token
      const exp = payload.exp * 1000;
      if (Date.now() > exp) {
        console.warn('🔴 Acceso denegado: Token expirado');
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        localStorage.removeItem('correo');
        localStorage.removeItem('primeraVez');
        this.router.navigate(['/login']);
        return false;
      }

      console.log('🟢 Acceso permitido');
      return true;
    } catch (error) {
      console.error('🔴 Acceso denegado: Token inválido', error);
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      localStorage.removeItem('correo');
      localStorage.removeItem('primeraVez');
      this.router.navigate(['/login']);
      return false;
    }
  }
}