import { Component, inject, OnInit, signal } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FooterComponent } from "../../components/footer/footer.component";
import { CardPedidoComponent } from "../../components/card-pedido/card-pedido.component";
import { PedidoService } from '../../../..//core/services/pedido/pedido.service';
import { IResumoPedido } from '../../../../core/interfaces/IPedido.interface';
import { CommonModule } from '@angular/common';
import { SlugService } from '../../../../core/resolver/slug.service';
import { ILoja } from '../../../../core/interfaces/ILoja.interface';
import { LojaService } from '../../../../core/services/loja/loja.service';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [HeaderComponent, RouterLink, FooterComponent, CardPedidoComponent, CommonModule],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.scss'
})
export class PedidosComponent implements OnInit {

  dynamicParam: string = '';

  #pedidoService = inject(PedidoService);
  #slugService = inject(SlugService);
  #lojaService = inject(LojaService);

  messageSucess: string | null = null;
  messageError: string | null = null;

  usuario = {
    id: 0,
    nome: '',
  }

  #router = inject(Router);
  #activatedRouter = inject(ActivatedRoute);

  ngOnInit(): void {
    this.#activatedRouter.paramMap.subscribe(params => {
      this.dynamicParam = params.get('slug') ?? '';
      this.#slugService.setParam(this.dynamicParam);
    });

    this.dynamicParam = this.#slugService.getParam();

    if (typeof window !== "undefined" && window.localStorage) {
      const usuario = localStorage.getItem('usuario')

      if (usuario) {
        this.usuario = JSON.parse(usuario)
        this.findPedidosByCliente(this.usuario.id)
      }
    }
  }

  receberMensagem(message: string | null): void {
    this.findPedidosByCliente(this.usuario.id)

    if (message?.includes('SUCESSO')) {
      this.messageSucess = message;
    } else {
      this.messageError = message;
    }

    setTimeout(() => {
      this.messageSucess = null;
      this.messageError = null;
    }, 2000);
  }

  public getPedido = signal<IResumoPedido[]>([])

  findPedidosByCliente(idCliente: number) {
    this.#pedidoService.httpFindPedidosByCliente$(idCliente).subscribe({
      next: (data) => {
        this.getPedido.set(data)
      },
      error: (error) => {
        console.log("error: ", error.error.messaage)
      }
    })
  }

  public getLoja = signal<ILoja | null>(null);

  findByNomeLoja(slug: string): void {
    this.#lojaService.httpFindByNome$(slug).subscribe({
      next: (data) => {
        this.getLoja.set(data)
      },
      error: (error) => {
        console.log("erro: ", error.error.message)
        this.#router.navigate(['/loja/inativa']);
      }
    })
  }

}
