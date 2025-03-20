import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable, shareReplay } from 'rxjs';
import { IAdicionais, IAdicional, ICreateAdicional, IUpdateAdicional } from '../../interfaces/IAdicionais.interface';

@Injectable({
  providedIn: 'root'
})
export class AdicionalService {

  constructor() { }

  #http = inject(HttpClient);
  #url = environment.api

  // CREATE ADICIONAL

  httpCreateAdicional$(adicional: ICreateAdicional): Observable<void> {
    const apiUrl = `${this.#url}/adicional`;
    return this.#http.post<void>(apiUrl, adicional).pipe(
      shareReplay()
    );
  };

  // UPDATE ADICIONAL

  httpUpdateAdicional$(idAdicional: number | undefined, adicional: IUpdateAdicional): Observable<void> {
    const apiUrl = `${this.#url}/adicional/${idAdicional}`;
    return this.#http.put<void>(apiUrl, adicional).pipe(
      shareReplay()
    );
  };

  // DELETE ADICIONAL

  httpDeleteAdicional$(idAdicional: number | null): Observable<void> {
    const apiUrl = `${this.#url}/adicional/${idAdicional}`;
    return this.#http.delete<void>(apiUrl).pipe(
      shareReplay()
    );
  };

  // DESATIVAR ADICIONAL

  httpDesativarAdicional$(idAdicional: number): Observable<void> {
    const apiUrl = `${this.#url}/adicional/${idAdicional}/desativar`;
    return this.#http.put<void>(apiUrl, {}).pipe(
      shareReplay()
    );
  };

  // ATIVAR ADICIONAL

  httpAtivarAdicional$(idAdicional: number): Observable<void> {
    const apiUrl = `${this.#url}/adicional/${idAdicional}/ativar`;
    return this.#http.put<void>(apiUrl, {}).pipe(
      shareReplay()
    );
  };

  // GET TODOS ADICIONAIS

  httpFindAllAdicionais$(): Observable<IAdicional[]> {
    const apiUrl = `${this.#url}/adicional`;
    return this.#http.get<IAdicional[]>(apiUrl).pipe(
      shareReplay()
    );
  };

  // GET TODOS ADICIONAIS POR CATEGORIA

  httpFindAllAdicionaisPorCategoria$(): Observable<IAdicionais[]> {
    const apiUrl = `${this.#url}/adicional/categoria`;
    return this.#http.get<IAdicionais[]>(apiUrl).pipe(
      shareReplay()
    );
  };

  // GET ADICIONAIS DE PRODUTO

  httpFindAdicionaisByProduto$(id: string | null): Observable<IAdicionais[]> {
    const apiUrl = `${this.#url}/adicional/${id}/produto`
    return this.#http.get<IAdicionais[]>(apiUrl).pipe(
      shareReplay()
    )
  }

  // GET ADICIONAL BY ID

  httpFindByIdAdicional$(idAdicional: number): Observable<IAdicional> {
    const apiUrl = `${this.#url}/adicional/${idAdicional}`;
    return this.#http.get<IAdicional>(apiUrl).pipe(
      shareReplay()
    );
  };

  // ADD ADICIONAL TO PRODOUTO

  httpAddAdicional$(idAdicional: number | null, idProduto: number | null): Observable<void> {
    const apiUrl = `${this.#url}/adicional/${idAdicional}/${idProduto}/add`;
    return this.#http.put<void>(apiUrl, {}).pipe(
      shareReplay()
    );
  };

  // REMOVER ADICIONAL TO PRODOUTO

  httprRemoverAdicional$(idAdicional: number | null, idProduto: number | null): Observable<void> {
    const apiUrl = `${this.#url}/adicional/${idAdicional}/${idProduto}/remover`;
    return this.#http.put<void>(apiUrl, {}).pipe(
      shareReplay()
    );
  };

}
