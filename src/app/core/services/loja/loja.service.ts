import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable, shareReplay } from 'rxjs';
import { ILoja, ILojaCredenciais, ILojaToken } from '../../interfaces/ILoja.interface';
import { IAuth } from '../../interfaces/IAuh.interface';

@Injectable({
  providedIn: 'root'
})
export class LojaService {

  constructor() { }

  #http = inject(HttpClient);
  #url = environment.api

  httpCreate$(loja: FormData): Observable<void> {
    const apiUrl = `${this.#url}/loja`
    return this.#http.post<void>(apiUrl, loja).pipe(
      shareReplay()
    );
  };

  httpUpdate$(loja: FormData): Observable<void> {
    const apiUrl = `${this.#url}/loja`
    return this.#http.put<void>(apiUrl, loja).pipe(
      shareReplay()
    );
  };

  httpUpdateStatus$(): Observable<void> {
    const apiUrl = `${this.#url}/loja/expediente`
    return this.#http.put<void>(apiUrl, null).pipe(
      shareReplay()
    );
  }

  httpFind$(): Observable<ILoja | null> {
    const apiUrl = `${this.#url}/loja`
    return this.#http.get<ILoja | null>(apiUrl).pipe(
      shareReplay()
    );
  };

  httpFindByNome$(slug: String): Observable<ILoja | null> {
    const apiUrl = `${this.#url}/loja/${slug}`
    return this.#http.get<ILoja | null>(apiUrl).pipe(
      shareReplay()
    );
  };

  httpLogin$(body: ILojaCredenciais): Observable<IAuth> {
    const apiUrl = `${this.#url}/loja/login`
    return this.#http.post<IAuth>(apiUrl, body).pipe(
      shareReplay()
    );
  };

  httpLogout$(): Observable<void> {
    const apiUrl = `${this.#url}/auth/logout`
    return this.#http.post<void>(apiUrl, {}).pipe(
      shareReplay()
    );
  };

}
