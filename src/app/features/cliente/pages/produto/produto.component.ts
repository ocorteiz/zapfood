import { Component, inject, OnInit, signal } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { CommonModule } from '@angular/common';
import { FooterComponent } from "../../components/footer/footer.component";
import { ProdutoService } from '../../../../core/services/produto/produto.service';
import { IProduto } from '../../../../core/interfaces/IProdutos.interface';
import { FormsModule } from '@angular/forms';
import { AdicionalService } from '../../../../core/services/adicional/adicional.service';
import { IItemCreate } from '../../../../core/interfaces/IItem.interface';
import { ItemService } from '../../../../core/services/item/item.service';
import { IAdicionais, IAdicional } from '../../../../core/interfaces/IAdicionais.interface';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { IEspecificacao, IEspecificacoes } from '../../../../core/interfaces/IEspecificacoes.interface';
import { EspecificacaoService } from '../../../../core/services/especificacao/especificacao.service';
import { SlugService } from '../../../../core/resolver/slug.service';

@Component({
  selector: 'app-produto',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CommonModule, FormsModule, RouterLink],
  templateUrl: './produto.component.html',
  styleUrl: './produto.component.scss'
})
export class ProdutoComponent implements OnInit {

  #id: string | null = null;
  #produtoService = inject(ProdutoService);
  #itemService = inject(ItemService);
  #adicionalService = inject(AdicionalService);
  #especifacacoService = inject(EspecificacaoService);
  #activatedRouter = inject(ActivatedRoute);
  #router = inject(Router);
  #slugService = inject(SlugService);

  dynamicParam: string = '';
  idProduto: number | null = null;
  quantidade: number = 1;
  observacao: string = '';
  adicionais: IAdicional[] = [];
  especificacoes: IEspecificacao[] = [];

  usuario = {
    id: 0,
    nome: '',
  }

  erro: string = '';

  ngOnInit(): void {
    this.#activatedRouter.paramMap.subscribe(params => {
      this.dynamicParam = params.get('slug') ?? '';
      this.#slugService.setParam(this.dynamicParam);
    });

    this.dynamicParam = this.#slugService.getParam();

    this.#activatedRouter.paramMap.subscribe(paramMap => {
      this.#id = paramMap.get('id');
      if (this.#id) {
        this.idProduto = Number(this.#id)
        this.findById()
        this.findAllAdicionais()
        this.findAllEspecificacoes()
      };
    });

    if (typeof window !== "undefined" && window.localStorage) {
      const usuario = localStorage.getItem('usuario')

      if (usuario) {
        this.usuario = JSON.parse(usuario)
      }
    }
  }

  onDivClick(event: Event): void {
    const target = event.currentTarget as HTMLElement;

    const parentSection = target.closest('.adicionais');
    const parentSection2 = target.closest('.especificacoes');

    if (parentSection) {
      const adicionais = parentSection.querySelectorAll('.adicional');
      adicionais.forEach((adicional) => {
        adicional.classList.toggle('active');
      });

      target.classList.toggle('active');
    }

    if (parentSection2) {
      const especificacoes = parentSection2.querySelectorAll('.especificacao');
      especificacoes.forEach((especificacao) => {
        especificacao.classList.toggle('active');
      });

      target.classList.toggle('active');
    }
  };

  // VALOR TOTAL DO ITEM

  calcularTotal(produto: IProduto): number {
    const valorProduto = produto.preco * this.quantidade;

    const valorAdicionais = this.adicionais.reduce((total, adicional) => {
      return total + (adicional.preco * (adicional.quantidade || 0));
    }, 0);

    return valorProduto + valorAdicionais;
  }

  // FIND PRODUTO BY ID

  public getProduto = signal<null | IProduto>(null);

  findById(): void {
    this.#produtoService.httpFindByIdProduto$(Number(this.#id)).subscribe({
      next: (data) => {
        this.getProduto.set(data);
      },
      error: (error) => console.log("error: ", error.error.message)
    })
  }

  getImageUrl(caminhoImagem: string | undefined): string {
    return `http://localhost:8080/${caminhoImagem}`;
  }

  // FIND ADICIONAIS BY PRODUTO

  public getAdicionais = signal<IAdicionais[]>([]);

  findAllAdicionais(): void {
    this.#adicionalService.httpFindAdicionaisByProduto$(this.#id).subscribe({
      next: (data) => {
        this.getAdicionais.set(data)
      },
      error: (error) => console.log("error: ", error.error.message)
    })
  }

  // FIND ESPECIFICAÇÕES BY PRODUTO

  public getEspecificacoes = signal<IEspecificacoes[]>([]);

  findAllEspecificacoes(): void {
    this.#especifacacoService.httpFindEspecificacoesByProduto$(this.#id).subscribe({
      next: (data) => {
        this.getEspecificacoes.set(data)
      },
      error: (error) => console.log("error: ", error.error.message)
    })
  }

  // CREATE ITEM DE CARRINHO

  onQuantidadeChange(event: any) {
    this.quantidade = event.target.value;
  }

  incrementeQuantidadeItem() {
    this.quantidade++
  }

  decrementarQuantidadeItem() {
    if (this.quantidade > 1) {
      this.quantidade--
    }
  }

  // ADICIONAIS

  incrementarQuantidadeAdicional(adicional: IAdicional, categoriaMaximo: number, adicionaisDaCategoria: IAdicional[]) {
    const totalSelecionado = adicionaisDaCategoria.reduce((acc, item) => acc + item.quantidade, 0);

    if (totalSelecionado < categoriaMaximo) {
      adicional.quantidade++;
      if (adicional.quantidade > 0 && !this.adicionais.includes(adicional)) {
        this.adicionais.push(adicional);
      }
    }
  }

  decrementarQuantidadeAdicional(adicional: IAdicional) {
    if (adicional.quantidade > 0) {
      adicional.quantidade--;
      if (adicional.quantidade === 0) {
        this.adicionais = this.adicionais.filter(item => item.id !== adicional.id);
      }
    }
  }

  // ESPECIFICACOES

  toggleEspecificacao(
    especificacao: IEspecificacao,
    categoriaMaximo: number,
    especificacaoDaCategoria: IEspecificacao[]
  ) {
    const totalSelecionado = this.totalSelecionado(especificacaoDaCategoria);

    if (especificacao.selecionado) {
      // Desmarcar item
      especificacao.selecionado = false;
      this.especificacoes = this.especificacoes.filter(item => item.id !== especificacao.id);
    } else if (totalSelecionado < categoriaMaximo) {
      // Marcar item
      especificacao.selecionado = true;
      if (!this.especificacoes.includes(especificacao)) {
        this.especificacoes.push(especificacao);
      }
    }
  }

  totalSelecionado(especificacoes: IEspecificacao[]): number {
    return especificacoes.filter(especificacao => especificacao.selecionado).length;
  }

  // CHECAR QUANTIDADE ESPECIFICAÇÕES

  verificarQuantidadeNecessaria(especificacoes: IEspecificacao[], minimoPorCategoria: number): boolean {
    const selecionados = especificacoes.filter(especificacao => especificacao.selecionado).length;
    return selecionados >= minimoPorCategoria;
  }

  onSubmit() {
    this.erro = ""

    const adicionaisSelecionados = this.adicionais
      .filter(adicional => adicional.quantidade > 0)
      .map(adicional => ({ id: adicional.id, quantidade: adicional.quantidade }));

    // Obter as especificações selecionadas
    const especificacoesSelecionados = this.especificacoes
      .filter(especificacao => especificacao.selecionado)  // Verifica se a especificação foi selecionada
      .map(especificacao => ({ id: especificacao.id}));

    // Verificar se todas as categorias obrigatórias têm o mínimo de itens selecionados
    const especificacoesInvalidas = this.getEspecificacoes().some(categoria => {
      const especificacoesDaCategoria = this.especificacoes.filter(
        especificacao => especificacao.categoria.id === categoria.categoria.id
      );
      const totalSelecionado = especificacoesDaCategoria.filter(especificacao => especificacao.selecionado).length;
      return totalSelecionado < categoria.categoria.minimoPorCategoria;
    });

    if (especificacoesInvalidas) {
      this.erro = "SELECIONE OS ITENS OBRIGATÓRIOS";
      return;
    }

    const item: IItemCreate = {
      idProduto: this.idProduto,
      quantidade: this.quantidade,
      observacao: this.observacao,
      adicionais: adicionaisSelecionados.length > 0 ? adicionaisSelecionados : [],
      especificacoes: especificacoesSelecionados
    };

    this.create(this.usuario.id, item)
  }

  create(idCliente: number, item: IItemCreate): void {
    this.#itemService.httpCreate(idCliente, item).subscribe({
      next: () => {
        this.#router.navigate(['/' , this.dynamicParam, 'carrinho'])
      },
      error: (error) => {
        console.log("error: ", error.error.message)
      }
    })
  }


}
