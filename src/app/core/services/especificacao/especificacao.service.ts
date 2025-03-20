import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { ICreateEspecificacao, IEspecificacao, IEspecificacoes, IUpdateEspecificacao } from '../../interfaces/IEspecificacoes.interface';
import { Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EspecificacaoService {

  #http = inject(HttpClient);
  #url = environment.api

  constructor() { }

  // CREATE ADICIONAL

  httpCreateEspecificacao$(Especificacao: ICreateEspecificacao): Observable<void> {
    const apiUrl = `${this.#url}/especificacao`;
    return this.#http.post<void>(apiUrl, Especificacao).pipe(
      shareReplay()
    );
  };

  // UPDATE Especificacao

  httpUpdateEspecificacao$(idEspecificacao: number | undefined, Especificacao: IUpdateEspecificacao): Observable<void> {
    const apiUrl = `${this.#url}/especificacao/${idEspecificacao}`;
    return this.#http.put<void>(apiUrl, Especificacao).pipe(
      shareReplay()
    );
  };

  // DELETE Especificacao

  httpDeleteEspecificacao$(idEspecificacao: number | null): Observable<void> {
    const apiUrl = `${this.#url}/especificacao/${idEspecificacao}`;
    return this.#http.delete<void>(apiUrl).pipe(
      shareReplay()
    );
  };

  // DESATIVAR Especificacao

  httpDesativarEspecificacao$(idEspecificacao: number): Observable<void> {
    const apiUrl = `${this.#url}/especificacao/${idEspecificacao}/desativar`;
    return this.#http.put<void>(apiUrl, {}).pipe(
      shareReplay()
    );
  };

  // ATIVAR Especificacao

  httpAtivarEspecificacao$(idEspecificacao: number): Observable<void> {
    const apiUrl = `${this.#url}/especificacao/${idEspecificacao}/ativar`;
    return this.#http.put<void>(apiUrl, {}).pipe(
      shareReplay()
    );
  };

  // GET TODOS Especificacoes

  httpFindAllEspecificacoes$(): Observable<IEspecificacao[]> {
    const apiUrl = `${this.#url}/especificacao`;
    return this.#http.get<IEspecificacao[]>(apiUrl).pipe(
      shareReplay()
    );
  };

  // GET TODOS Especificacoes POR CATEGORIA

  httpFindAllEspecificacoesPorCategoria$(): Observable<IEspecificacoes[]> {
    const apiUrl = `${this.#url}/especificacao/categoria`;
    return this.#http.get<IEspecificacoes[]>(apiUrl).pipe(
      shareReplay()
    );
  };

  // GET Especificacoes DE PRODUTO

  httpFindEspecificacoesByProduto$(id: string | null): Observable<IEspecificacoes[]> {
    const apiUrl = `${this.#url}/especificacao/${id}/produto`
    return this.#http.get<IEspecificacoes[]>(apiUrl).pipe(
      shareReplay()
    )
  }

  // GET Especificacao BY ID

  httpFindByIdEspecificacao$(idEspecificacao: number): Observable<IEspecificacao> {
    const apiUrl = `${this.#url}/especificacao/${idEspecificacao}`;
    return this.#http.get<IEspecificacao>(apiUrl).pipe(
      shareReplay()
    );
  };

  // ADD Especificacao TO PRODOUTO

  httpAddEspecificacao$(idEspecificacao: number | null, idProduto: number | null): Observable<void> {
    const apiUrl = `${this.#url}/especificacao/${idEspecificacao}/${idProduto}/add`;
    return this.#http.put<void>(apiUrl, {}).pipe(
      shareReplay()
    );
  };

  // REMOVER Especificacao TO PRODOUTO

  httprRemoverEspecificacao$(idEspecificacao: number | null, idProduto: number | null): Observable<void> {
    const apiUrl = `${this.#url}/especificacao/${idEspecificacao}/${idProduto}/remover`;
    return this.#http.put<void>(apiUrl, {}).pipe(
      shareReplay()
    );
  };

}
