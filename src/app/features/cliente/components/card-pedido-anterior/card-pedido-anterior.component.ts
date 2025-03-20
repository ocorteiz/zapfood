import { Component, inject, Input } from '@angular/core';
import { IResumoPedido } from '../../../../core/interfaces/IPedido.interface';
import { CommonModule } from '@angular/common';
import { PedidoService } from '../../../../core/services/pedido/pedido.service';
import { Router } from '@angular/router';
import { error } from 'console';

@Component({
  selector: 'app-card-pedido-anterior',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-pedido-anterior.component.html',
  styleUrl: './card-pedido-anterior.component.scss'
})
export class CardPedidoAnteriorComponent {

  #pedidoService = inject(PedidoService);

  #router = inject(Router);

  @Input() getUltimosPedidos: IResumoPedido[] = []

  getImageUrl(caminhoImagem: string | undefined): string {
    return `http://localhost:8080/${caminhoImagem}`;
  }

  // CREATE ORDER FROM LAST

  createOrderFromLast(idPedido: number): void {
    this.#pedidoService.httpCreateOrderFromLast$(idPedido).subscribe({
      next: () => {
        this.#router.navigate(['/carrinho'])
      },
      error: (error) => {
        console.log('erro: ', error.error.message)
      }

    })
  }

  getConcatenatedItems(pedido: any, maxLength: number): string {
    const concatenatedNames = pedido.itens.map((item: any) => item.nome.toUpperCase()).join(' + ');
    return concatenatedNames.length > maxLength
      ? concatenatedNames.slice(0, maxLength) + '...'
      : concatenatedNames;
  }

}
