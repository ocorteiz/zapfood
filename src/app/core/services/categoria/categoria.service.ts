import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { ICategoriaDeAdicional, ICategoriaDeEspecificacao, ICategoriaDeProduto, ICreateCategoriaDeAdicional, ICreateCategoriaDeEspecificacao, ICreateCategoriaDeProduto } from '../../interfaces/ICategoria.interface';
import { Observable, shareReplay } from 'rxjs';
import { } from '../../interfaces/IAdicionais.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  constructor() { }

  #http = inject(HttpClient);
  #url = environment.api

  /// CATEGORIA DE PRODUTO

  httpFindAllCategoriaDeProduto$(): Observable<ICategoriaDeProduto[]> {
    const apiUrl = `${this.#url}/categoria-de-produto`;
    return this.#http.get<ICategoriaDeProduto[]>(apiUrl).pipe(
      shareReplay()
    );
  };

  httpCreateCategoriaDeProduto$(categoriaDeProduto: ICreateCategoriaDeProduto): Observable<void> {
    const apiUrl = `${this.#url}/categoria-de-produto`;
    return this.#http.post<void>(apiUrl, categoriaDeProduto).pipe(
      shareReplay()
    );
  };

  httpDeleteCategoriaDeProduto$(idCategoriaDeProduto: number | null): Observable<void> {
    const apiUrl = `${this.#url}/categoria-de-produto/${idCategoriaDeProduto}`;
    return this.#http.delete<void>(apiUrl).pipe(
      shareReplay()
    );
  };

  /// CATEGORIA DE ADICIONAL

  httpFindAllCategoriaAdicional$(): Observable<ICategoriaDeAdicional[]> {
    const apiUrl = `${this.#url}/categoria-de-adicional`;
    return this.#http.get<ICategoriaDeAdicional[]>(apiUrl).pipe(
      shareReplay()
    );
  };

  httpCreateCategoriaDeAdicional$(categoriaDeAdicional: ICreateCategoriaDeAdicional): Observable<void> {
    const apiUrl = `${this.#url}/categoria-de-adicional`;
    return this.#http.post<void>(apiUrl, categoriaDeAdicional).pipe(
      shareReplay()
    );
  };

  httpDeleteCategoriaDeAdicional$(idCategoriaDeAdicional: number | null): Observable<void> {
    const apiUrl = `${this.#url}/categoria-de-adicional/${idCategoriaDeAdicional}`;
    return this.#http.delete<void>(apiUrl).pipe(
      shareReplay()
    );
  };

  /// CATEGORIA DE ESPECIFICACAO

  httpFindAllCategoriaEspecificacao$(): Observable<ICategoriaDeEspecificacao[]> {
    const apiUrl = `${this.#url}/categoria-de-especificacao`;
    return this.#http.get<ICategoriaDeEspecificacao[]>(apiUrl).pipe(
      shareReplay()
    );
  };

  httpCreateCategoriaDeEspecificacao$(categoriaDeEspecificacao: ICreateCategoriaDeEspecificacao): Observable<void> {
    const apiUrl = `${this.#url}/categoria-de-especificacao`;
    return this.#http.post<void>(apiUrl, categoriaDeEspecificacao).pipe(
      shareReplay()
    );
  };

  httpDeleteCategoriaDeEspecificacao$(idCategoriaDeEspecificacao: number | null): Observable<void> {
    const apiUrl = `${this.#url}/categoria-de-especificacao/${idCategoriaDeEspecificacao}`;
    return this.#http.delete<void>(apiUrl).pipe(
      shareReplay()
    );
  };

}
