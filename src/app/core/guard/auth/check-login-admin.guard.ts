import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const checkLoginAdminGuard: CanActivateFn = (route, state) => {
    const router = inject(Router)

    if (typeof window === 'undefined') {
      return true;
    }

    const usuarioStorage = localStorage.getItem('usuario');
    const token = localStorage.getItem('token');
    const expirationTime = localStorage.getItem('data');

    if (!usuarioStorage || !token || !expirationTime) {
      router.navigate(['admin/login'])
      return false;
    }

    const usuario = JSON.parse(usuarioStorage)

    if(usuario.tipo != "ADMIN") {
      router.navigate(['admin/login'])
      return false;
    }

    const now = new Date().getTime();
    const expiresAt = JSON.parse(expirationTime);

    if (now > expiresAt) {
      localStorage.removeItem('usuario');
      localStorage.removeItem('token');
      localStorage.removeItem('data');
      router.navigate(['admin/login']);
      return false;
    }

    return true;
};
