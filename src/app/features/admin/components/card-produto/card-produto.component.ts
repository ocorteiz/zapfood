import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { IProduto } from '../../../../core/interfaces/IProdutos.interface';
import { CommonModule } from '@angular/common';
import { FormProdutoComponent } from "../form-produto/form-produto.component";
import { ContainerAdicionaisComponent } from "../container-adicionais/container-adicionais.component";
import { ProdutoService } from '../../../../core/services/produto/produto.service';
import { ContainerEspecificacaoComponent } from "../container-especificacao/container-especificacao.component";

@Component({
  selector: 'app-card-produto',
  standalone: true,
  imports: [CommonModule, FormProdutoComponent, ContainerAdicionaisComponent, ContainerEspecificacaoComponent],
  templateUrl: './card-produto.component.html',
  styleUrl: './card-produto.component.scss'
})
export class CardProdutoComponent {

  #produtosService = inject(ProdutoService);

  @Input() getProdutos: IProduto[] | null = null;
  @Output() messageEvent = new EventEmitter<string | null>()

  id: number | null = null;
  mode: string = ''

  showDeleteProduto = false;
  showAddProduto = false;
  showAdicional = false;
  showEspecificacao = false;

  idDelete: number | null = null;

  toggleProduto() {
    this.showAddProduto = !this.showAddProduto;
  }

  toggleUpdateProduto(id: number) {
    this.id = id;
    this.mode = "update"
    this.showAddProduto = !this.showAddProduto;
  }

  toggleDeleteProduto(id: number | null) {
    this.idDelete = id;
    this.showDeleteProduto = !this.showDeleteProduto
  }

  toggleAddAdicional(id: number | null) {
    this.id = id
    this.mode = 'add'
    this.showAdicional = !this.showAdicional;
  }

  toggleRemoveAdicional(id: number | null) {
    this.id = id
    this.mode = 'remove'
    this.showAdicional = !this.showAdicional;
  }

  toggleAddEspecificacao(id: number | null) {
    this.id = id
    this.mode = 'add'
    this.showEspecificacao = !this.showEspecificacao;
  }

  toggleRemoveEspecificacao(id: number | null) {
    this.id = id
    this.mode = 'remove'
    this.showEspecificacao = !this.showEspecificacao;
  }


  getImageUrl(caminhoImagem: string): string {
    return `http://localhost:8080/${caminhoImagem}`;
  }

  receberMensagem(message: string | null): void {
    this.messageEvent.emit(message)
  }

  // DELETE PRODUTO

  deletarProduto(idProduto: number | null): void {
    this.#produtosService.httpDeleteProduto$(idProduto).subscribe({
      next: (data) => {
        console.log(data)

        this.toggleDeleteProduto(null)
        const message = 'PRODUTO DELETADO COM SUCESSO';
        this.messageEvent.emit(message)
      },
      error: (error) => {
        console.log(error.error.message)

        const errorMessage = error.error.message || 'Erro desconhecido ao deletar o produto.';
        this.messageEvent.emit(errorMessage);
      }
    })
  }

  // DESATIVAR PRODUTO

  desativarProduto(idProduto: number): void {
    this.#produtosService.httpDesativarProduto$(idProduto).subscribe({
      next: () => {
        const message = 'PRODUTO DESATIVADO COM SUCESSO';
        this.messageEvent.emit(message)
      },
      error: (error) => {
        const errorMessage = error.error.message || 'Erro desconhecido ao deletar o produto.';
        this.messageEvent.emit(errorMessage);
      }
    })
  }

  // ATIVAR PRODUTO

  ativarProduto(idProduto: number): void {
    this.#produtosService.httpAtivarProduto$(idProduto).subscribe({
      next: () => {
        const message = 'PRODUTO ATIVADO COM SUCESSO';
        this.messageEvent.emit(message)
      },
      error: (error) => {
        const errorMessage = error.error.message || 'Erro desconhecido ao deletar o produto.';
        this.messageEvent.emit(errorMessage);
      }
    })
  }

}
