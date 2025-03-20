import { Component, ElementRef, inject, OnInit, Renderer2, signal, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CardProdutoComponent } from "../../components/card-produto/card-produto.component";
import { CardPromocaoComponent } from "../../components/card-promocao/card-promocao.component";
import { CardPedidoAnteriorComponent } from "../../components/card-pedido-anterior/card-pedido-anterior.component";
import { IProduto, IProdutos } from '../../../../core/interfaces/IProdutos.interface';
import { ProdutoService } from '../../../../core/services/produto/produto.service';
import { CommonModule, } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LojaService } from '../../../../core/services/loja/loja.service';
import { ILoja } from '../../../../core/interfaces/ILoja.interface';
import { IResumoPedido } from '../../../../core/interfaces/IPedido.interface';
import { PedidoService } from '../../../../core/services/pedido/pedido.service';
import { ICupom } from '../../../../core/interfaces/ICupom.interface';
import { CupomService } from '../../../../core/services/cupom/cupom.service';
import { SlugService } from '../../../../core/resolver/slug.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CardProdutoComponent, CardPromocaoComponent, CommonModule, RouterLink, CardPedidoAnteriorComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  dynamicParam: string = '';

  private scrollListener?: () => void;
  @ViewChild('menuContainer') menuContainer: ElementRef | undefined;

  #produtoService = inject(ProdutoService);
  #lojaService = inject(LojaService);
  #pedidoService = inject(PedidoService);
  #cupomService = inject(CupomService);
  #slugService = inject(SlugService);

  #activatedRouter = inject(ActivatedRoute);
  #renderer = inject(Renderer2)
  #router = inject(Router);

  usuario = {
    id: 0,
    nome: '',
  }

  ngOnInit(): void {
    this.#activatedRouter.paramMap.subscribe(params => {
      this.dynamicParam = params.get('slug') ?? '';
      this.#slugService.setParam(this.dynamicParam);
    });

    const dynamicParam = this.#slugService.getParam();

    this.findByNomeLoja(dynamicParam)
    this.findAllProdutos()
    this.findByPromocao()

    if (typeof window !== "undefined" && window.localStorage) {
      const usuario = localStorage.getItem('usuario')

      if (usuario) {
        this.usuario = JSON.parse(usuario)
        this.findUltimosPedidos(this.usuario.id)
        this.findCuponsByCliente(this.usuario.id)
      }
    }

    this.scrollListener = this.#renderer.listen('window', 'scroll', () => {
      this.handleScroll();
    });
  }

  ngOnDestroy(): void {
    if (this.scrollListener) {
      this.scrollListener();
    }
  }

  private handleScroll(): void {
    const menuElement = this.menuContainer?.nativeElement;
    if (menuElement) {
      const topPosition = menuElement.offsetTop;
      const isFixed = window.pageYOffset > topPosition;
      if (isFixed) {
        this.#renderer.addClass(menuElement, 'fixed');
      } else {
        this.#renderer.removeClass(menuElement, 'fixed');
      }
    }
  }

  isMobile(): boolean {
    return window.innerWidth <= 576;
  }

  // FIND ULTIMOS PEDIDOS

  public getUltimosPedidos = signal<IResumoPedido[]>([]);
  public getUltimosPedidosFilter = signal<IResumoPedido[]>([]);

  findUltimosPedidos(idCliente: number) {
    this.#pedidoService.httpFindUltimosPedidos$(idCliente).subscribe({
      next: (data) => {
        this.getUltimosPedidos.set(data)
        if (this.isMobile()) {
          this.getUltimosPedidosFilter.set(data.slice(0, 2));
        } else {
          this.getUltimosPedidosFilter.set(data);
        }
      },
      error: (error) => {
        console.log("erro: ", error.error.message)
      }
    })
  }
  // FIND ALL PRODUTOS

  public getProdutos = signal<IProdutos[]>([]);
  public getProdutos$ = this.#produtoService.httpFindAllProdutoAtivos$()

  findAllProdutos(): void {
    this.getProdutos$.subscribe({
      next: (data) => {
        this.getProdutos.set(data);
      },
      error: (error) => console.log("erro: ", error.error.message)
    })
  }

  // FIND BY PRODUTO (PROMOCAO)

  public getPromocao = signal<IProduto[] | []>([]);
  public getPromocao$ = this.#produtoService.httpFindByPromocao$()


  findByPromocao(): void {
    this.getPromocao$.subscribe({
      next: (data) => {
        this.getPromocao.set(data);
      },
      error: (error) => console.log("erro: ", error.error.message)
    })
  }

  // CARROSEL

  public currentIndex = 0;

  showNextCard(): void {
    const promocaoList = this.getPromocao();
    if (promocaoList && promocaoList.length > 0) {
      this.currentIndex = (this.currentIndex + 1) % promocaoList.length;
    }
  }

  showPrevCard(): void {
    const promocaoList = this.getPromocao();
    if (promocaoList && promocaoList.length > 0) {
      this.currentIndex = (this.currentIndex - 1 + promocaoList.length) % promocaoList.length;
    }
  }

  // SHOW (LOJA)

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

  // FIND CUPONS CLIENTE

  public getCupons = signal<ICupom[]>([])

  findCuponsByCliente(idCliente: number): void {
    this.#cupomService.httpFindCuponsByCliente$(idCliente).subscribe({
      next: (data) => {
        this.getCupons.set(data)
      },
      error: (error) => {
        console.log("error: ", error.error.message)
      }
    })
  }

}
