import { Component, inject, OnInit, signal } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { CardProdutoComponent } from "../../components/card-produto/card-produto.component";
import { IProduto, IProdutos } from '../../../../core/interfaces/IProdutos.interface';
import { CommonModule } from '@angular/common';
import { IAdicionais, IAdicional } from '../../../../core/interfaces/IAdicionais.interface';
import { CardAdicionalComponent } from "../../components/card-adicional/card-adicional.component";
import { FormsModule } from '@angular/forms';
import { FormProdutoComponent } from "../../components/form-produto/form-produto.component";
import { FormAdicionalComponent } from "../../components/form-adicional/form-adicional.component";
import { FormCategoriaProdutoComponent } from "../../components/form-categoria-produto/form-categoria-produto.component";
import { FormCategoriaAdicionalComponent } from "../../components/form-categoria-adicional/form-categoria-adicional.component";
import { ProdutoService } from '../../../../core/services/produto/produto.service';
import { CategoriaService } from '../../../../core/services/categoria/categoria.service';
import { AdicionalService } from '../../../../core/services/adicional/adicional.service';
import { FormCategoriaEspecificacaoComponent } from "../../components/form-categoria-especificacao/form-categoria-especificacao.component";
import { IEspecificacao, IEspecificacoes } from '../../../../core/interfaces/IEspecificacoes.interface';
import { EspecificacaoService } from '../../../../core/services/especificacao/especificacao.service';
import { FormEspecificacaoComponent } from "../../components/form-especificacao/form-especificacao.component";
import { CardEspecificacaoComponent } from "../../components/card-especificacao/card-especificacao.component";

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [HeaderComponent, CardProdutoComponent, CommonModule, CardAdicionalComponent, FormsModule, FormProdutoComponent, FormAdicionalComponent, FormCategoriaProdutoComponent, FormCategoriaAdicionalComponent, FormCategoriaEspecificacaoComponent, FormEspecificacaoComponent, CardEspecificacaoComponent],
  templateUrl: './produtos.component.html',
  styleUrl: './produtos.component.scss'
})
export class ProdutosComponent implements OnInit {

  ngOnInit(): void {
    this.findAllProdutos()
    this.findAllProdutosPorCategoria();

    this.findAllAdicionais()
    this.findAllAdicionaisPorCategoria();

    this.findAllEspecificacoes()
    this.findAllEspecificacoesPorCategoria()
  }

  #produtoService = inject(ProdutoService);
  #adicionalService = inject(AdicionalService);
  #especificacaoService = inject(EspecificacaoService);
  #categoriaService = inject(CategoriaService);

  pagina: string | null = "PRODUTOS";
  searchText: string = '';

  id: number | null = null;

  showAddProduto = false;
  showDeleteCategoriaProduto = false;
  showAddCategoriaProduto = false;

  showAddAdicional = false;
  showAddCategoriaAdicional = false;
  showDeleteCategoriaAdicional = false;

  showAddEspecificacao = false;
  showDeleteCategoriaEspecificacao = false;
  showAddCategoriaEspecificacao = false;

  messageSucess: string | null = null;
  messageError: string | null = null;

  mode: string = ""

  receberMensagem(message: string | null): void {
    this.findAllProdutos();
    this.findAllProdutosPorCategoria()

    this.findAllAdicionais()
    this.findAllAdicionaisPorCategoria();

    this.findAllEspecificacoes()
    this.findAllEspecificacoesPorCategoria()

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

  selectStatus(newStatus: string, event: Event): void {
    this.pagina = newStatus;

    const headers = document.querySelectorAll('.item-status');
    headers.forEach(h => h.classList.remove('active'));

    const clickedElement = event.target as HTMLElement;
    clickedElement.classList.add('active');
  }

  // TOGGLES PRODUTOS

  toggleAddProduto() {
    this.mode = 'add'
    this.showAddProduto = !this.showAddProduto;
  }

  toggleAddCategoriaProduto() {
    this.showAddCategoriaProduto = !this.showAddCategoriaProduto;
  }

  toggleDeleteCategoriaProduto(id: number | null) {
    this.id = id;
    this.showDeleteCategoriaProduto = !this.showDeleteCategoriaProduto
  }

  // TOGGLES ADICIONAIS

  toggleAddAdicional() {
    this.showAddAdicional = !this.showAddAdicional;
  }

  toggleAddCategoriaAdicional() {
    this.showAddCategoriaAdicional = !this.showAddCategoriaAdicional;
  }

  toggleDeleteCategoriaAdicional(id: number | null) {
    this.id = id;
    this.showDeleteCategoriaAdicional = !this.showDeleteCategoriaAdicional
  }

  // TOGGLES ESPECIFICAÇÕES

  toggleAddEspecificao() {
    this.showAddEspecificacao = !this.showAddEspecificacao;
  }

  toggleAddCategoriaEspecificacao() {
    this.showAddCategoriaEspecificacao = !this.showAddCategoriaEspecificacao;
  }

  toggleDeleteCategoriaEspecificacao(id: number | null) {
    this.id = id
    this.showDeleteCategoriaEspecificacao = !this.showDeleteCategoriaEspecificacao
  }

  // GET TODOS PRODUTOS

  public getProdutos = signal<IProduto[] | []>([])

  findAllProdutos(): void {
    this.#produtoService.httpFindAllProdutos$().subscribe({
      next: (data) => {
        this.getProdutos.set(data)
      },
      error: (error) => console.log('erro: ', error.error.message)
    })
  }

  // GET TODOS PRODUTOS POR CATEGORIA

  public getProdutosPorCategoria = signal<IProdutos[] | []>([])

  findAllProdutosPorCategoria(): void {
    this.#produtoService.httpFindAllProdutosPorCategoria$().subscribe({
      next: (data) => {
        this.getProdutosPorCategoria.set(data)
      },
      error: (error) => console.log('erro: ', error.error.message)
    })
  }

  // DELETAR CATEGORIA DE PRODUTOS

  deleteCategoriaDeProdutos(idCategoriaDeProduto: number | null): void {
    this.#categoriaService.httpDeleteCategoriaDeProduto$(idCategoriaDeProduto).subscribe({
      next: (data) => {
        this.toggleDeleteCategoriaProduto(null)

        this.findAllProdutosPorCategoria()
        this.findAllProdutos()

        this.messageSucess = 'CATEGORIA REMOVIDA COM SUCESSO';

        setTimeout(() => {
          this.messageSucess = null;
        }, 2000);
      },
      error: (error) => {
        if (error.error && error.error.message) {
          this.messageError = error.error.message;

          setTimeout(() => {
            this.messageError = null;
          }, 2000);
        } else {
          console.log("Erro desconhecido:", error);
        }
      }
    })
  }

  // GET TODOS ADICIONAIS

  public getAdicionais = signal<IAdicional[] | []>([])

  findAllAdicionais(): void {
    this.#adicionalService.httpFindAllAdicionais$().subscribe({
      next: (data) => {
        this.getAdicionais.set(data)
      },
      error: (error) => console.log('erro: ', error.error.message)
    })
  }

  // GET ADICIONAIS POR CATEGORIA

  public getAdicionaisPorCategoria = signal<IAdicionais[] | []>([])

  findAllAdicionaisPorCategoria(): void {
    this.#adicionalService.httpFindAllAdicionaisPorCategoria$().subscribe({
      next: (data) => {
        this.getAdicionaisPorCategoria.set(data)
      },
      error: (error) => console.log('erro: ', error.error.message)
    })
  }

  // DELETAR CATEGORIA DE ADICIONAIS

  deleteCategoriaDeAdicionais(idCategoriaDeAdicionais: number | null): void {
    this.#categoriaService.httpDeleteCategoriaDeAdicional$(idCategoriaDeAdicionais).subscribe({
      next: (data) => {
        this.toggleDeleteCategoriaAdicional(null)

        this.findAllAdicionais()
        this.findAllAdicionaisPorCategoria()

        this.messageSucess = 'CATEGORIA REMOVIDA COM SUCESSO';

        setTimeout(() => {
          this.messageSucess = null;
        }, 2000);
      },
      error: (error) => {
        if (error.error && error.error.message) {
          this.messageError = error.error.message;

          setTimeout(() => {
            this.messageError = null;
          }, 2000);
        } else {
          console.log("Erro desconhecido:", error);
        }
      }
    })
  }

  // GET ESPECIFICAÇÕES

  public getEspecificacoes = signal<IEspecificacao[] | []>([])

  findAllEspecificacoes(): void {
    this.#especificacaoService.httpFindAllEspecificacoes$().subscribe({
      next: (data) => {
        this.getEspecificacoes.set(data)
      },
      error: (error) => console.log('erro: ', error.error.message)
    })
  }

  // GET ESPECIFICAÇÕES POR CATEGORIA

  public getEspecificacoesPorCategoria = signal<IEspecificacoes[] | []>([])

  findAllEspecificacoesPorCategoria(): void {
    this.#especificacaoService.httpFindAllEspecificacoesPorCategoria$().subscribe({
      next: (data) => {
        this.getEspecificacoesPorCategoria.set(data)
      },
      error: (error) => console.log('erro: ', error.error.message)
    })
  }

  // DELETAR CATEGORIA DE ESPECIFICACOES

  deleteCategoriaDeEspecificacoes(idCategoriaDeEspecificacoes: number | null): void {
    this.#categoriaService.httpDeleteCategoriaDeEspecificacao$(idCategoriaDeEspecificacoes).subscribe({
      next: (data) => {
        this.toggleDeleteCategoriaEspecificacao(null)

        this.findAllEspecificacoes()
        this.findAllEspecificacoesPorCategoria()

        this.messageSucess = 'CATEGORIA REMOVIDA COM SUCESSO';

        setTimeout(() => {
          this.messageSucess = null;
        }, 2000);
      },
      error: (error) => {
        if (error.error && error.error.message) {
          this.messageError = error.error.message;

          setTimeout(() => {
            this.messageError = null;
          }, 2000);
        } else {
          console.log("Erro desconhecido:", error);
        }
      }
    })
  }

  // FILTROS

  get filteredProdutos() {
    return this.getProdutos().filter((produto) =>
      produto.nome?.toUpperCase().includes(this.searchText.toUpperCase()) ||
      produto.descricao?.toUpperCase().includes(this.searchText.toUpperCase())
    );
  }

  get filteredProdutosPorCategoria() {
    return this.getProdutosPorCategoria().filter(categoria =>
      categoria.categoria.nome?.toLowerCase().includes(this.searchText.toLowerCase()) ||
      categoria.produtos?.some(produto =>
        produto.nome?.toLowerCase().includes(this.searchText.toLowerCase())
      )
    );
  }

  get filteredAdicionais() {
    return this.getAdicionais().filter((adicional) =>
      adicional.nome.toUpperCase().includes(this.searchText.toUpperCase()) ||
      adicional.descricao.toUpperCase().includes(this.searchText.toUpperCase())
    );
  }

  get filteredAdicionaisPorCategoria() {
    return this.getAdicionaisPorCategoria().filter(categoria =>
      categoria.categoria.nome?.toUpperCase().includes(this.searchText.toUpperCase()) ||
      categoria.adicionais?.some(adicional =>
        adicional.nome?.toUpperCase().includes(this.searchText.toUpperCase())
      )
    )
  }

  get filteredEspecificacoesPorCategoria() {
    return this.getEspecificacoesPorCategoria().filter(categoria =>
      categoria.categoria.nome?.toUpperCase().includes(this.searchText.toUpperCase()) ||
      categoria.especificacoes?.some(adicional =>
        adicional.nome?.toUpperCase().includes(this.searchText.toUpperCase())
      )
    )
  }

  get filteredEspecificacoes() {
    return this.getEspecificacoes().filter((especificacao) =>
      especificacao.nome.toUpperCase().includes(this.searchText.toUpperCase()) ||
      especificacao.descricao.toUpperCase().includes(this.searchText.toUpperCase())
    );
  }

}
