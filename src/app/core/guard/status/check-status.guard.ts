import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LojaService } from '../../services/loja/loja.service';
import { catchError, map, of } from 'rxjs';

export const checkStatusGuard: CanActivateFn = (route, state) => {

  const lojaService = inject(LojaService);

  return lojaService.httpFind$().pipe(
    map((loja) => {
      if (loja?.status === true) {
        return true;
      } else {
        return false;
      }
    })
  );
};
