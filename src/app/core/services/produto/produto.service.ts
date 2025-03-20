import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable, shareReplay } from 'rxjs';
import { IProduto, IProdutos } from '../../interfaces/IProdutos.interface';
import { IAdicional } from '../../interfaces/IAdicionais.interface';
import { IEspecificacao } from '../../interfaces/IEspecificacoes.interface';
import { SlugService } from '../../resolver/slug.service';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  constructor() { }

  #http = inject(HttpClient);
  #url = environment.api

  // CRIAR PRODUTO

  httpCreateProduto$(produto: FormData): Observable<void> {
    const apiUrl = `${this.#url}/produto`;
    return this.#http.post<void>(apiUrl, produto).pipe(
      shareReplay()
    );
  };

  // CRIAR PROMOÇÃO

  httpCreatePromocao$(promocao: FormData): Observable<void> {
    const apiUrl = `${this.#url}/produto/promocao`;
    return this.#http.post<void>(apiUrl, promocao).pipe(
      shareReplay()
    );
  };

  // DESATIVAR PRODUTO

  httpDesativarProduto$(id: number): Observable<void> {
    const apiUrl = `${this.#url}/produto/${id}/desativar`;
    return this.#http.put<void>(apiUrl, {}).pipe(
      shareReplay()
    );
  };

  // ATIVAR PRODUTO

  httpAtivarProduto$(id: number): Observable<void> {
    const apiUrl = `${this.#url}/produto/${id}/ativar`;
    return this.#http.put<void>(apiUrl, {}).pipe(
      shareReplay()
    );
  };

  // ATUALIZAR PRODUTO

  httpUpdateProduto$(id: number | null, produto: FormData): Observable<void> {
    const apiUrl = `${this.#url}/produto/${id}`;
    return this.#http.put<void>(apiUrl, produto).pipe(
      shareReplay()
    );
  };

  // DELETAR PRODUTO

  httpDeleteProduto$(id: number | null): Observable<void> {
    const apiUrl = `${this.#url}/produto/${id}`;
    return this.#http.delete<void>(apiUrl).pipe(
      shareReplay()
    );
  };

  // GET PRODUTOS

  httpFindAllProdutos$(): Observable<IProduto[]> {
    const apiUrl = `${this.#url}/produto`;
    return this.#http.get<IProduto[]>(apiUrl).pipe(
      shareReplay()
    );
  };

  // GET PRODUTOS POR CATEGORIA

  httpFindAllProdutosPorCategoria$(): Observable<IProdutos[]> {
    const apiUrl = `${this.#url}/produto/categoria`;
    return this.#http.get<IProdutos[]>(apiUrl).pipe(
      shareReplay()
    );
  };

  // GET PRODUTOS POR CATEGORIA (ATIVOS)

  httpFindAllProdutoAtivos$(): Observable<IProdutos[]> {
    const apiUrl = `${this.#url}/produto/categoria/ativos`;
    return this.#http.get<IProdutos[]>(apiUrl).pipe(
      shareReplay()
    );
  };

  // GET PRODUTOS (PROMOÇÕES)

  httpFindByPromocao$(): Observable<IProduto[]> {
    const apiUrl = `${this.#url}/produto/promocao`;
    return this.#http.get<IProduto[]>(apiUrl).pipe(
      shareReplay()
    );
  };

  // GET PRODUTO POR ID

  httpFindByIdProduto$(id: number | null): Observable<IProduto> {
    const apiUrl = `${this.#url}/produto/${id}`
    return this.#http.get<IProduto>(apiUrl).pipe(
      shareReplay()
    );
  };

  // GET ADICIONAIS CONTIDOS EM PRODUTO

  httpFindAdicionaisByProduto$(id: number | null): Observable<IAdicional[]> {
    const apiUrl = `${this.#url}/produto/adicionais/${id}/by-produto`
    return this.#http.get<IAdicional[]>(apiUrl).pipe(
      shareReplay()
    );
  }

  // GET ADICIONAIS NÃO CONTIDOS PRODUTO

  httpFindAdicionaisWhitoutProduto$(id: number | null): Observable<IAdicional[]> {
    const apiUrl = `${this.#url}/produto/adicionais/${id}/whitout-produto`
    return this.#http.get<IAdicional[]>(apiUrl).pipe(
      shareReplay()
    );
  }

  // GET ESPECIFICACOES CONTIDAS EM PRODUTO

  httpFindEspecificacoesByProduto$(id: number | null): Observable<IEspecificacao[]> {
    const apiUrl = `${this.#url}/produto/especificacoes/${id}/by-produto`
    return this.#http.get<IEspecificacao[]>(apiUrl).pipe(
      shareReplay()
    );
  }

  // !GET ESPECIFICACOES NÃO CONTIDAS EM  PRODUTO

  httpFindEspecificacoesWhitoutProduto$(id: number | null): Observable<IEspecificacao[]> {
    const apiUrl = `${this.#url}/produto/especificacoes/${id}/whitout-produto`
    return this.#http.get<IEspecificacao[]>(apiUrl).pipe(
      shareReplay()
    );
  }

}
