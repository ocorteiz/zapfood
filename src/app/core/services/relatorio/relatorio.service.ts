import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable, shareReplay } from 'rxjs';
import { IRelatorioPedidosPorBairro, IRelatorioPedidosPorPagamento, IRelatorioProdutosMais, IRelatorioProdutosMenos, IRelatorioProdutosNaoVendidos, IRelatorioResumoPedidos } from '../../interfaces/IRelatorio.interface';

@Injectable({
  providedIn: 'root'
})
export class RelatorioService {

  #http = inject(HttpClient);
  #url = environment.api

  constructor() { }

  httpFindResumoPedidos$(): Observable<IRelatorioResumoPedidos> {
    const apiUrl = `${this.#url}/resumo-pedidos`
    return this.#http.get<IRelatorioResumoPedidos>(apiUrl).pipe(
      shareReplay()
    )
  }

  httpFindPedidosPorBairro$(): Observable<IRelatorioPedidosPorBairro[]> {
    const apiUrl = `${this.#url}/pedidos-por-bairro`
    return this.#http.get<IRelatorioPedidosPorBairro[]>(apiUrl).pipe(
      shareReplay()
    )
  }

  httpFindPedidosPorPagamento$(): Observable<IRelatorioPedidosPorPagamento[]> {
    const apiUrl = `${this.#url}/pedidos-por-pagamento`
    return this.#http.get<IRelatorioPedidosPorPagamento[]>(apiUrl).pipe(
      shareReplay()
    )
  }

  httpFindProdutosMaisVendidos$(): Observable<IRelatorioProdutosMais[]> {
    const apiUrl = `${this.#url}/produtos-mais-vendidos`
    return this.#http.get<IRelatorioProdutosMais[]>(apiUrl).pipe(
      shareReplay()
    )
  }

  httpFindProdutosMenosVendidos$(): Observable<IRelatorioProdutosMenos[]> {
    const apiUrl = `${this.#url}/produtos-menos-vendidos`
    return this.#http.get<IRelatorioProdutosMenos[]>(apiUrl).pipe(
      shareReplay()
    )
  }

  httpFindProdutosNaoVendidos$(): Observable<IRelatorioProdutosNaoVendidos[]> {
    const apiUrl = `${this.#url}/produtos-nao-vendidos`
    return this.#http.get<IRelatorioProdutosNaoVendidos[]>(apiUrl).pipe(
      shareReplay()
    )
  }

}
