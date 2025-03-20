import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PedidoService } from '../../../../core/services/pedido/pedido.service';
import { CommonEngine } from '@angular/ssr';
import { CommonModule } from '@angular/common';
import { NotificacaoService } from '../../../../core/services/notificacao/notificacao.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  #pedidoService = inject(PedidoService);
  #notificacaoService = inject(NotificacaoService);

  usuario = {
    id: 0,
    nome: '',
  };

  ngOnInit(): void {
    this.quantidadePedidos()

    if (typeof window !== "undefined" && window.localStorage) {
      const usuario = localStorage.getItem('usuario')

      if (usuario) {
        this.usuario = JSON.parse(usuario);

        this.#notificacaoService.connectPedido(this.usuario.id, (message) => {
          this.quantidadePedidos();
        });
      }

    }
  }

  public getQuantidade = signal<number>(0);

  quantidadePedidos(): void {
    this.#pedidoService.httpQuantidadePedidos$().subscribe({
      next: (data) => {
        this.getQuantidade.set(data);
      },
      error: (error) => {
        console.log('erro: ', error.error.message)
      }
    })
  }


}
