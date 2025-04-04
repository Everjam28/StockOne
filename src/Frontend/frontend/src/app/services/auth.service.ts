import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

interface LoginResponse {
  token: string;
  usuario: {
    idUsuario: string;
    nombreCompleto: string;
    correo: string;
    idRol: number;
    nombreRol: string;
    primeraVez: boolean;
  };
}

interface Usuario {
  idUsuario: string;
  nombreCompleto: string;
  correo: string;
  idRol: number;
  nombreRol: string;
  primeraVez: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:5000/api';
  private http = inject(HttpClient);
  private router = inject(Router);
  
  // BehaviorSubject para mantener el estado de autenticación
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  
  // BehaviorSubject para el usuario actual
  private currentUserSubject = new BehaviorSubject<Usuario | null>(this.getStoredUser());
  currentUser$ = this.currentUserSubject.asObservable();
  
  constructor() {
    // Verifica la autenticación cuando el servicio se inicializa
    this.checkAuthStatus();
  }
  
  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }
  
  private getStoredUser(): Usuario | null {
    const userStr = localStorage.getItem('usuario');
    return userStr ? JSON.parse(userStr) : null;
  }
  
  // Verifica si el token es válido
  private checkAuthStatus(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.handleLogout();
      return;
    }
    
    try {
      // Decodifica el token
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      // Verifica si el token ha expirado
      if (Date.now() >= payload.exp * 1000) {
        this.handleLogout();
      } else {
        this.isAuthenticatedSubject.next(true);
      }
    } catch (error) {
      this.handleLogout();
    }
  }
  
  login(credenciales: { correo: string; clave: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credenciales).pipe(
      tap((res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('usuario', JSON.stringify(res.usuario));
        localStorage.setItem('correo', res.usuario.correo);
        localStorage.setItem('primeraVez', res.usuario.primeraVez ? '1' : '0');
        
        // Actualiza los subjects
        this.isAuthenticatedSubject.next(true);
        this.currentUserSubject.next(res.usuario);
      })
    );
  }
  
  cambiarClave(data: { nuevaCedula: string; nuevaClave: string; correo: string }): Observable<{ mensaje: string }> {
    return this.http.post<{ mensaje: string }>(`${this.apiUrl}/auth/cambiar-clave`, data).pipe(
      tap(() => {
        localStorage.setItem('primeraVez', '0');
        
        // Actualiza el usuario almacenado
        const usuario = this.getStoredUser();
        if (usuario) {
          usuario.primeraVez = false;
          localStorage.setItem('usuario', JSON.stringify(usuario));
          this.currentUserSubject.next(usuario);
        }
      })
    );
  }
  
  logout(): void {
    this.handleLogout();
    this.router.navigate(['/login']);
  }
  
  private handleLogout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('correo');
    localStorage.removeItem('primeraVez');
    
    // Actualiza los subjects
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
  }
  
  isPrimeraVez(): boolean {
    return localStorage.getItem('primeraVez') === '1';
  }
  
  getCorreo(): string | null {
    return localStorage.getItem('correo');
  }
  
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  
  isLoggedIn(): boolean {
    return this.hasToken();
  }
}