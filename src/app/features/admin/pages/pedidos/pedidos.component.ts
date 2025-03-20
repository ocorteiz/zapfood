import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import {
  Router

} from '@angular/router';
import { CardPedidoComponent } from "../../components/card-pedido/card-pedido.component";
import { HeaderComponent } from "../../components/header/header.component";
import { FormsModule } from '@angular/forms';
import { IResumoPedido } from '../../../../core/interfaces/IPedido.interface';
import { PedidoService } from '../../../../core/services/pedido/pedido.service';
import { Subscription } from 'rxjs';
import { NotificacaoService } from '../../../../core/services/notificacao/notificacao.service';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, CardPedidoComponent, HeaderComponent, FormsModule],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.scss'
})
export class PedidosComponent implements OnInit {

  #router = inject(Router)
  #pedidoService = inject(PedidoService);
  #notificacaoService = inject(NotificacaoService);
  searchText: string = '';

  usuario = {
    id: 0,
    nome: '',
  };

  ngOnInit(): void {
    this.findByStatusPedido('ACEITACAO')

    if (typeof window !== "undefined" && window.localStorage) {
      const usuario = localStorage.getItem('usuario')

      if (usuario) {
        this.usuario = JSON.parse(usuario);

        this.#notificacaoService.connectPedido(this.usuario.id, (message) => {
          this.findByStatusPedido('ACEITACAO')
        });
      }

    }

  }

  receberMensagem(idPedido: number | null): void {
    this.#router.navigate(['/pedido', idPedido, 'detalhes'])
  }

  selectStatus(event: Event, status: string): void {
    const headers = document.querySelectorAll('.item-status');
    headers.forEach(h => h.classList.remove('active'));

    const clickedElement = event.target as HTMLElement;
    clickedElement.classList.add('active');
  }

  public getPedidos = signal<IResumoPedido[] | []>([])

  findByStatusPedido(status: string): void {
    this.#pedidoService.httpFindByStatusPedido$(status).subscribe({
      next: (data) => {
        this.getPedidos.set(data)
      },
      error: (error) => console.log('erro: ', error.error.message)
    })
  }

  get filteredPedidos() {
    const search = this.searchText.trim().toUpperCase();

    return this.getPedidos()?.filter((pedido) =>
      pedido.id.toString().includes(search) ||
      pedido.nomeCliente?.toUpperCase().includes(search) ||
      pedido.itens.some((item) =>
        item.nome.toUpperCase().includes(search)
      )
    ) || [];
  }

}
