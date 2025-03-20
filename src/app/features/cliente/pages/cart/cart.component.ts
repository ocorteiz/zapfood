import { Component, inject, OnInit, signal } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';
import { CardItemComponent } from "../../components/card-item/card-item.component";
import { CarrinhoService } from '../../../../core/services/carrinho/carrinho.service';
import { ICarrinho } from '../../../../core/interfaces/ICarrinho.interface';
import { CommonModule } from '@angular/common';
import { SlugService } from '../../../../core/resolver/slug.service';
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterLink, CardItemComponent, CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {

  usuario = {
    id: 0,
    nome: '',
  }

  dynamicParam: string = '';

  #carrinhoService = inject(CarrinhoService);
  #router = inject(Router);
  #slugService = inject(SlugService);
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
        this.findByCarrinho(this.usuario.id)
      }

    }
  }

  getCarrinho = signal<ICarrinho>({
    id: 0,
    itens: [],
    total: 0
  });

  findByCarrinho(idCliente: number | null): void {
    this.#carrinhoService.httpfindByCarrinho$(idCliente).subscribe({
      next: (data) => {
        this.getCarrinho.set(data);
      },
      error: (error) => {
        console.log("erro: ", error.error.message)
      }
    })
  }

  onItemDeleted() {
    this.findByCarrinho(this.usuario.id);
  }

  //

  carrinho: { id: number | null; total: number | null } = {
    id: null,
    total: null
  }

  avancar(): void {
    this.carrinho = {
      id: this.getCarrinho().id,
      total: this.getCarrinho().total
    }

    this.#router.navigate(['/', this.dynamicParam, 'finalizar'], {
      state: this.carrinho
    })
  }

}
