import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { IConectarInstancia, ICreateNotificacao, IResponseConectarInstancia } from '../../interfaces/INotificacao.interface';
import { Observable, shareReplay } from 'rxjs';
import { ICodigoRequest, ICodigoResponse } from '../../interfaces/IAuh.interface';

@Injectable({
  providedIn: 'root'
})
export class NotificacaoService {

  #http = inject(HttpClient);
  #url = environment.api
  private eventSourcePayment: EventSource | null = null;
  private eventSourcePedido: EventSource | null = null;

  constructor() { }

  // CONECTAR INSTANCIA
  httpConectarInstancia$(instancia: string): Observable<IResponseConectarInstancia> {
    const apiUrl = `${this.#url}/notificacao/${instancia}/conectar-intancia`;
    return this.#http.get<IResponseConectarInstancia>(apiUrl).pipe(
      shareReplay()
    );
  }

  // ENVIAR PROMO E ETC.
  httpNotificacao$(notificacao: ICreateNotificacao): Observable<void> {
    const apiUrl = `${this.#url}/notificacao/promo`;
    return this.#http.post<void>(apiUrl, notificacao).pipe(
      shareReplay()
    );
  }

  // ENVIAR CODIGO DE VERIFICAÇÃO
  httpEnviarCodigo$(body: ICodigoRequest): Observable<ICodigoResponse> {
    const apiUrl = `${this.#url}/notificacao/codigo`;
    return this.#http.post<ICodigoResponse>(apiUrl, body).pipe(
      shareReplay()
    );
  }

  // NOTIFICAÇÃO DE PAGAMENTO CONFIRMADO (SSH)
  connectPayment(userId: number, onMessage: (message: string) => void): void {
    if (typeof window !== 'undefined' && typeof EventSource !== 'undefined') {
      this.eventSourcePayment = new EventSource(`${this.#url}/webflux/pagamento/${userId}`);

      this.eventSourcePayment.onmessage = (event) => {
        onMessage(event.data);
      };

      this.eventSourcePayment.onerror = (error) => {
        console.error('Erro na conexão SSE:', error);
        this.eventSourcePayment?.close();
      };
    } else {
      console.warn('SSE não suportado neste ambiente.');
    }
  }

  disconnectPayment(): void {
    this.eventSourcePayment?.close();
  }

  // NOTIFICAÇÃO DE NOVO PEDIDO (SSH)
  connectPedido(userId: number, onMessage: (message: string) => void): void {
    if (typeof window !== 'undefined' && typeof EventSource !== 'undefined') {
      this.eventSourcePedido = new EventSource(`${this.#url}/webflux/pedido/${userId}`);

      this.eventSourcePedido.onmessage = (event) => {
        onMessage(event.data);
      };

      this.eventSourcePedido.onerror = (error) => {
        console.error('Erro na conexão SSE:', error);
        this.eventSourcePedido?.close();
      };
    } else {
      console.warn('SSE não suportado neste ambiente.');
    }
  }

  disconnectPedido(): void {
    this.eventSourcePedido?.close();
  }

}
