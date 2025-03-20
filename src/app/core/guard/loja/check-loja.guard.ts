import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LojaService } from '../../services/loja/loja.service';
import { map } from 'rxjs';

export const checkLojaGuard: CanActivateFn = (route, state) => {

  const lojaService = inject(LojaService);
  const router = inject(Router);

  return lojaService.httpFind$().pipe(
    map((loja) => {
      if (loja === null) {
        router.navigate(['/inativa']);
        return false;
      } else {
        return true;
      }
    })
  );

};
