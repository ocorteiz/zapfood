import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IResumoPedido } from '../../../../core/interfaces/IPedido.interface';
import { PedidoService } from '../../../../core/services/pedido/pedido.service';

@Component({
  selector: 'app-card-pedido',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './card-pedido.component.html',
  styleUrl: './card-pedido.component.scss'
})
export class CardPedidoComponent {

  @Input() pedidos: IResumoPedido[] | [] = [];
  #pedidoService = inject(PedidoService);

  @Output() messageEvent = new EventEmitter<number | null>();

  aceitarPedido(idPedido: number) {
    this.#pedidoService.httpAceitarPedido$(idPedido).subscribe({
      next: () => {
        this.messageEvent.emit(idPedido)
      }
    })
  }

  enviarPedido(idPedido: number) {
    this.#pedidoService.httpEnviarPedido$(idPedido).subscribe({
      next: () => {
        this.messageEvent.emit(idPedido)
      }
    })
  }

  finalizarPedido(idPedido: number) {
    this.#pedidoService.httpFinalizarPedido$(idPedido).subscribe({
      next: () => {
        this.messageEvent.emit(idPedido)
      }
    })
  }

  getConcateEspecificacao(item: any): string {
    return item.especificacoes
      .map((e: any) => `${e.nome.toUpperCase()}`)
      .join(', ');
  }

  getConcateAdicional(item: any): string {
    return item.adicionais
      .map((e: any) => `+${e.quantidade} ${e.nome.toUpperCase()}`)
      .join(', ');
  }

}
