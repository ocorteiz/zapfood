import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SlugService } from '../../resolver/slug.service';

export const checkLoginGuard: CanActivateFn = (route, state) => {

  const router = inject(Router)

  const slugService = inject(SlugService);
  const dynamicParam = slugService.getParam();

  if (typeof window === 'undefined') {
    return true;
  }

  const usuario = localStorage.getItem('usuario');
  const token = localStorage.getItem('token');
  const expirationTime = localStorage.getItem('data');

  if (!usuario || !token || !expirationTime) {
    router.navigate(['/', dynamicParam, 'cliente', 'register'])
    return false;
  }

  const now = new Date().getTime();
  const expiresAt = JSON.parse(expirationTime);

  if (now > expiresAt) {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    localStorage.removeItem('data');
    router.navigate(['/', dynamicParam, 'cliente', 'register'])
    return false;
  }

  return true;
};
