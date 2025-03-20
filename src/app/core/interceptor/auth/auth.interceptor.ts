import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  if (typeof window !== "undefined" && window.localStorage) {
    const token = localStorage.getItem('token');

    if(token) {
      const cleanedToken = token ? token.replace(/^"(.*)"$/, '$1') : null;

      const clonedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${cleanedToken}`
        }
      })

      return next(clonedRequest);
    }
  }

  return next(req);
};
