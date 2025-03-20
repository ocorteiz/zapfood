import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { IPagamento, IPagamentoCreate } from '../../interfaces/IPagamento.interface';
import { Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PagamentoService {

  #url = environment.api;
  #http = inject(HttpClient);

  constructor() { }


  // CRIAR PAGA

  httpCreate$(pagamento: IPagamentoCreate): Observable<void> {
    const apiUrl = `${this.#url}/pagamento`
    return this.#http.post<void>(apiUrl, pagamento).pipe(
      shareReplay()
    );
  };

  // GET PAGAMENTOS

  httpFindAllPagamentos$(): Observable<IPagamento[]> {
    const apiUrl = `${this.#url}/pagamento`
    return this.#http.get<IPagamento[]>(apiUrl).pipe(
      shareReplay()
    );
  };

  // GET PAGAMENTOS (ATIVOS)

  httpFindByAtivosPagamentos$(): Observable<IPagamento[]> {
    const apiUrl = `${this.#url}/pagamento/ativos`
    return this.#http.get<IPagamento[]>(apiUrl).pipe(
      shareReplay()
    );
  };

  // GET PAGAMENTO VIA PIX

  httpFindPagamentoViaPix$(): Observable<IPagamento> {
    const apiUrl = `${this.#url}/pagamento/pix`
    return this.#http.get<IPagamento>(apiUrl).pipe(
      shareReplay()
    );
  };

  // DESATIVAR PAGAMENTO

  httpDesativarPagamento$(idPagamento: number): Observable<void> {
    const apiUrl = `${this.#url}/pagamento/${idPagamento}/desativar`
    return this.#http.put<void>(apiUrl, {}).pipe(
      shareReplay()
    );
  };

  // ATIVAR PAGAMENTO

  httpAtivarPagamento$(idPagamento: number): Observable<void> {
    const apiUrl = `${this.#url}/pagamento/${idPagamento}/ativar`
    return this.#http.put<void>(apiUrl, {}).pipe(
      shareReplay()
    );
  };

  // DELETAR PAGAMENTO

  httpDeletarPagamento$(idPagamento: number): Observable<void> {
    const apiUrl = `${this.#url}/pagamento/${idPagamento}`
    return this.#http.delete<void>(apiUrl).pipe(
      shareReplay()
    );
  };

  // DESATIVAR PAGAMENTO VIA PIX

  httpDesativarPagamentoViaPix$(): Observable<void> {
    const apiUrl = `${this.#url}/pagamento/pix/desativar`
    return this.#http.put<void>(apiUrl, {}).pipe(
      shareReplay()
    );
  };

  // ATIVAR PAGAMENTO VIA PIX

  httpAtivarPagamentoViaPix$(): Observable<void> {
    const apiUrl = `${this.#url}/pagamento/pix/ativar`
    return this.#http.put<void>(apiUrl, {}).pipe(
      shareReplay()
    );
  };

}
