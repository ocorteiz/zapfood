import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { EspecificacaoService } from '../../../../core/services/especificacao/especificacao.service';
import { ProdutoService } from '../../../../core/services/produto/produto.service';
import { IEspecificacao } from '../../../../core/interfaces/IEspecificacoes.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-container-especificacao',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './container-especificacao.component.html',
  styleUrl: './container-especificacao.component.scss'
})
export class ContainerEspecificacaoComponent implements OnInit {


  ngOnInit(): void {
    if (this.mode == 'remove') {
      this.findEspecificacoesByProduto(this.idProduto)
    }

    if (this.mode == 'add') {
      this.findEspecificacoesWhitoutProduto(this.idProduto)
    }
  }

  #produtoService = inject(ProdutoService);
  #especificacaoService = inject(EspecificacaoService);

  @Output() close = new EventEmitter<void>();
  @Output() messageEvent = new EventEmitter<string | null>();
  @Input() mode: string = 'add';
  @Input() idProduto: number | null = null

  searchText: string = '';
  message: string | null = null

  closeModal() {
    this.close.emit();
    this.messageEvent.emit(this.message)
  }

  // GET ADICIONAIS DE PRODUTO

  public getEspecificacoes = signal<IEspecificacao[] | []>([])

  findEspecificacoesByProduto(idProduto: number | null): void {
    this.#produtoService.httpFindEspecificacoesByProduto$(idProduto).subscribe({
      next: (data) => {
        this.getEspecificacoes.set(data)
      },
      error: (error) => console.log('erro: ', error.error.message)
    })
  }

  // GET ADICIONAIS DE NÃO PRODUTO

  findEspecificacoesWhitoutProduto(idProduto: number | null): void {
    this.#produtoService.httpFindEspecificacoesWhitoutProduto$(idProduto).subscribe({
      next: (data) => {
        this.getEspecificacoes.set(data)
      },
      error: (error) => console.log('erro: ', error.error.message)
    })
  }

  // ADD ADICIONAL

  addEspecificacao(idEspecificacao: number | null, idProduto: number | null): void {
    this.#especificacaoService.httpAddEspecificacao$(idEspecificacao, idProduto).subscribe({
      next: () => {
        this.message = 'ESPECIFICAÇÃO ADICIONADA COM SUCESSO'
        this.closeModal()
      },
      error: (error) => console.log('erro: ', error.error.message)
    })
  }

  // REMOVER ADICIONAL

  removerEspecificacao(idEspecificacao: number | null, idProduto: number | null): void {
    this.#especificacaoService.httprRemoverEspecificacao$(idEspecificacao, idProduto).subscribe({
      next: () => {
        this.message = 'ESPECIFICAÇÃO REMOVIDA COM SUCESSO'
        this.closeModal()
      },
      error: (error) => console.log('erro: ', error.error.message)
    })
  }

  // FILTRO

  especificacoesFiltradas: IEspecificacao[] = [...this.getEspecificacoes()];

  get filteredEspecificacao() {
    return this.getEspecificacoes().filter((especificacao) => {
      const searchUpper = this.searchText.toUpperCase();

      const nomeMatch = especificacao.nome.toUpperCase().includes(searchUpper);

      return nomeMatch;
    });
  }

}
