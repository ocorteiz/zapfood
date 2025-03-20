import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IResumoPedido } from '../../../../core/interfaces/IPedido.interface';
import { CommonModule } from '@angular/common';
import { PedidoService } from '../../../../core/services/pedido/pedido.service';
import { SlugService } from '../../../../core/resolver/slug.service';

@Component({
  selector: 'app-card-pedido',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-pedido.component.html',
  styleUrl: './card-pedido.component.scss'
})
export class CardPedidoComponent implements OnInit {

  @Input() getPedido: IResumoPedido[] = []

  dynamicParam: string = '';

  #router = inject(Router);
  #slugService = inject(SlugService);

  ngOnInit(): void {
    this.dynamicParam = this.#slugService.getParam();
  }

  redirectPage(status: string | undefined, id: number): void {
    if(status == "AGUARDANDO PAGAMENTO") {
      this.#router.navigate(['/',  this.dynamicParam, 'pagamento', id])
    } else {
      this.#router.navigate(['/', this.dynamicParam, 'pedido', id])
    }
  }

}
