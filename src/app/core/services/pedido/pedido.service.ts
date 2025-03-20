import { inject, Injectable } from '@angular/core';
import { environment } from '../../../..//environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { IPedido, ICreatePedido, IResumoPedido } from '../../interfaces/IPedido.interface';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  #url = environment.api;
  #http = inject(HttpClient);

  // CRIAR PEDIDO

  httpCreatePedido$(idCarrinho: number, idCliente: number, pedido: ICreatePedido): Observable<IResumoPedido | null> {
    const apiUrl = `${this.#url}/pedido/${idCarrinho}/${idCliente}`
    return this.#http.post<IResumoPedido | null>(apiUrl, pedido).pipe(
      shareReplay()
    );
  };

  // DELETAR PEDIDO

  httpDeletePedido$(idPedido: string | null): Observable<void> {
    const apiUrl = `${this.#url}/pedido/${idPedido}`
    return this.#http.delete<void>(apiUrl).pipe(
      shareReplay()
    );
  };

  // CRIAR CARRINHO COM ITENS DO ULTIMO PEDIDO

  httpCreateOrderFromLast$(idPedido: number): Observable<void> {
    const apiUrl = `${this.#url}/pedido/${idPedido}`
    return this.#http.post<void>(apiUrl, {}).pipe(
      shareReplay()
    );
  };

  // GET PEDIDO (POR ID)

  httpFindByIdPedido$(idPedido: string | null): Observable<IPedido> {
    const apiUrl = `${this.#url}/pedido/${idPedido}`
    return this.#http.get<IPedido>(apiUrl).pipe(
      shareReplay()
    );
  };

  // GET QUANTIDADE DE PEDIDOS

  httpQuantidadePedidos$(): Observable<number> {
    const apiUrl = `${this.#url}/pedido/quantidade`
    return this.#http.get<number>(apiUrl).pipe(
      shareReplay()
    );
  };

  // GET PEDIDO (POR STATUS)

  httpFindByStatusPedido$(status: string): Observable<IResumoPedido[]> {
    const apiUrl = `${this.#url}/pedido/${status}/status`
    return this.#http.get<IResumoPedido[]>(apiUrl).pipe(
      shareReplay()
    );
  };

  // GET PEDIDOS (DE CLIENTE)

  httpFindPedidosByCliente$(idCliente: number): Observable<IResumoPedido[]> {
    const apiUrl = `${this.#url}/pedido/${idCliente}/cliente`
    return this.#http.get<IResumoPedido[]>(apiUrl).pipe(
      shareReplay()
    );
  };

  // GET ULTIMOS PEDIDOS

  httpFindUltimosPedidos$(idCliente: number): Observable<IResumoPedido[]> {
    const apiUrl = `${this.#url}/pedido/${idCliente}/ultimos`
    return this.#http.get<IResumoPedido[]>(apiUrl).pipe(
      shareReplay()
    );
  }

  // ACEITAR PEDIDO

  httpAceitarPedido$(idPedido: number): Observable<void> {
    const apiUrl = `${this.#url}/pedido/${idPedido}/aceitar`
    return this.#http.put<void>(apiUrl, {}).pipe(
      shareReplay()
    );
  }

  // ENVIAR PEDIDO

  httpEnviarPedido$(idPedido: number): Observable<void> {
    const apiUrl = `${this.#url}/pedido/${idPedido}/enviar`
    return this.#http.put<void>(apiUrl, {}).pipe(
      shareReplay()
    );
  }

  // FINALIZAR PEDIDO

  httpFinalizarPedido$(idPedido: number): Observable<void> {
    const apiUrl = `${this.#url}/pedido/${idPedido}/finalizar`
    return this.#http.put<void>(apiUrl, {}).pipe(
      shareReplay()
    );
  }

  // NEGAR PEDIDO

  httpNegarPedido$(idPedido: number, motivo: string): Observable<void> {
    const apiUrl = `${this.#url}/pedido/${idPedido}/negar`
    return this.#http.put<void>(apiUrl, { motivo }).pipe(
      shareReplay()
    );
  }

  // CANCELAR PEDIDO

  httpCancelarPedido$(idPedido: number): Observable<void> {
    const apiUrl = `${this.#url}/pedido/${idPedido}/cancelar`
    return this.#http.put<void>(apiUrl, {}).pipe(
      shareReplay()
    );
  }

  // GERAR NOTA FISCAL
  gerarNota$(idPedido: number): void {
    const apiUrl = `${this.#url}/pedido/${idPedido}/nota`;
    this.#http.get(apiUrl, { responseType: 'blob' }).subscribe({
      next: (pdfBlob) => {
        const blob = new Blob([pdfBlob], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);

        // Criar um link temporário para download
        const a = document.createElement('a');
        a.href = url;
        a.download = `pedido-${idPedido}.pdf`;
        a.click();

        // Liberar o objeto Blob após o download
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Erro ao gerar nota fiscal:', err);
      },
    });
  }

}
