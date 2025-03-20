import { Component, inject, OnInit, signal } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CardItemComponent } from "../../components/card-item/card-item.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { PedidoService } from '../../../../core/services/pedido/pedido.service';
import { IPedido } from '../../../../core/interfaces/IPedido.interface';
import { CommonModule } from '@angular/common';
import { SlugService } from '../../../../core/resolver/slug.service';
import { ILoja } from '../../../../core/interfaces/ILoja.interface';
import { LojaService } from '../../../../core/services/loja/loja.service';

@Component({
  selector: 'app-pedido',
  standalone: true,
  imports: [HeaderComponent, RouterLink, CardItemComponent, FooterComponent, CommonModule],
  templateUrl: './pedido.component.html',
  styleUrl: './pedido.component.scss'
})
export class PedidoComponent implements OnInit {

  dynamicParam: string = '';

  #id: string | null = null;
  #pedidoService = inject(PedidoService);
  #slugService = inject(SlugService);
  #lojaService = inject(LojaService);

  #router = inject(Router);
  #activatedRouter = inject(ActivatedRoute);

  ngOnInit(): void {
    this.#activatedRouter.paramMap.subscribe(params => {
      this.dynamicParam = params.get('slug') ?? '';
      this.#slugService.setParam(this.dynamicParam);
    });

    this.dynamicParam = this.#slugService.getParam();

    this.#activatedRouter.paramMap.subscribe(paraMap => {
      this.#id = paraMap.get('id');
      if (this.#id) {
        this.findById()
      }
    })
  }

  public pedidoStatus = signal<string | null>(null);

  public getPedido = signal<null | IPedido>(null);

  findById(): void {
    this.#pedidoService.httpFindByIdPedido$(this.#id).subscribe({
      next: (data) => {
        this.getPedido.set(data);
        this.pedidoStatus.set(data.status);
      },
      error: (error) => console.log("error: ", error.error.message)
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
