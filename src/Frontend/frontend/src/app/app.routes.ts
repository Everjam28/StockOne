import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductCreateComponent } from './components/product-create/product-create.component';
import { ProductEditComponent } from './components/product-edit/product-edit.component';
import { UserListComponent } from './components/usuario-list/usuario-list.component';
import { UsuarioCreateComponent } from './components/usuario-create/usuario-create.component';
import { UsuarioEditComponent } from './components/usuario-edit/usuario-edit.component';
import { CategoriaListComponent } from './components/categoria-list/categoria-list.component';
import { CategoriaCreateComponent } from './components/categoria-create/categoria-create.component';
import { CategoriaEditComponent } from './components/categoria-edit/categoria-edit.component';
import { VentasComponent } from './components/ventas/ventas.component';
import { VentaCreateComponent } from './components/venta-create/venta-create.component';
import { VentasDetalleComponent } from './components/venta-detalle/venta-detalle.component';
import { LoginComponent } from './components/login/login.component';
import { CambiarClaveComponent } from './components/cambiar-clave/cambiar-clave.component';

export const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'cambiar-clave', component: CambiarClaveComponent },
  // Rutas protegidas con AuthGuard
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'productos', component: ProductListComponent, canActivate: [AuthGuard] },
  { path: 'productos/crear', component: ProductCreateComponent, canActivate: [AuthGuard] },
  { path: 'productos/editar/:id', component: ProductEditComponent, canActivate: [AuthGuard] },
  { path: 'usuario', component: UserListComponent, canActivate: [AuthGuard] },
  { path: 'Usuarios/crear', component: UsuarioCreateComponent, canActivate: [AuthGuard] },
  { path: 'Usuarios/editar/:id', component: UsuarioEditComponent, canActivate: [AuthGuard] },
  { path: 'categorias', component: CategoriaListComponent, canActivate: [AuthGuard] },
  { path: 'categorias/crear', component: CategoriaCreateComponent, canActivate: [AuthGuard] },
  { path: 'categorias/editar/:id', component: CategoriaEditComponent, canActivate: [AuthGuard] },
  { path: 'ventas', component: VentasComponent, canActivate: [AuthGuard] },
  { path: 'ventas/crear', component: VentaCreateComponent, canActivate: [AuthGuard] },
  { path: 'ventas/detalle/:id', component: VentasDetalleComponent, canActivate: [AuthGuard] },
  
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];