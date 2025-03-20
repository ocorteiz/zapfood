import { Routes } from '@angular/router';;

export const routes: Routes = [
  {
    path: ':slug',
    loadChildren: () => import('./features/cliente/cliente.routes').then(m => m.clienteRoutes)
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.adminRoutes)
  },
  {
    path: '**',  // <- Rota coringa
    loadComponent: () => import('./features/cliente/pages/inativa/inativa.component').then(m => m.InativaComponent)
  }
];
