import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { IEspecificacao } from '../../../../core/interfaces/IEspecificacoes.interface';
import { EspecificacaoService } from '../../../../core/services/especificacao/especificacao.service';
import { FormEspecificacaoComponent } from "../form-especificacao/form-especificacao.component";

@Component({
  selector: 'app-card-especificacao',
  standalone: true,
  imports: [CommonModule, FormEspecificacaoComponent],
  templateUrl: './card-especificacao.component.html',
  styleUrl: './card-especificacao.component.scss'
})
export class CardEspecificacaoComponent {

  @Input() getEspecificacoes: IEspecificacao[] | [] = []
  @Output() messageEvent = new EventEmitter<string | null>()

  especificacao: IEspecificacao | null = null;

  showDelete = false;
  showAddEspecificacao = false;
  showContainerEspecificacaos = false;

  #especificaoService = inject(EspecificacaoService);

  id: number | null = null;

  receberMensagem(message: string | null): void {
    this.messageEvent.emit(message)
  }

  selectEspecificacaoToUpdate(especificacao: IEspecificacao | null) {
    this.especificacao = especificacao
  }

  toggleUpdateEspecificacao() {
    this.showAddEspecificacao = !this.showAddEspecificacao;
  }

  toggleDelete(id: number | null) {
    this.id = id;
    this.showDelete = !this.showDelete
  }

  // DELETAR ESPECIFICAÇÃO

  deletarAdicional(idEspecificacao: number | null): void {
    this.#especificaoService.httpDeleteEspecificacao$(idEspecificacao).subscribe({
      next: () => {
        this.toggleDelete(null)

        const message = 'ESPECIFICAÇÃO DELETADA COM SUCESSO';
        this.messageEvent.emit(message)
      },
      error: (error) => {
        const errorMessage = error.error.message || 'Erro desconhecido ao deletar o produto.';
        this.messageEvent.emit(errorMessage);
      }
    })
  }

  // DESATIVAR ESPECIFICAÇÃO

  desativarEspecificacao(idEspecificacao: number): void {
    this.#especificaoService.httpDesativarEspecificacao$(idEspecificacao).subscribe({
      next: () => {
        const message = 'ESPECIFICAÇÃO DESATIVADA COM SUCESSO';
        this.messageEvent.emit(message)
      },
      error: (error) => {
        const errorMessage = error.error.message || 'Erro desconhecido ao deletar o produto.';
        this.messageEvent.emit(errorMessage);
      }
    })
  }

  // ATIVAR ESPECIFICAÇÃO

  ativarEspecificacao(idEspecificacao: number): void {
    this.#especificaoService.httpAtivarEspecificacao$(idEspecificacao).subscribe({
      next: () => {
        const message = 'ADICIONAL ATIVADO COM SUCESSO';
        this.messageEvent.emit(message)
      },
      error: (error) => {
        const errorMessage = error.error.message || 'Erro desconhecido ao deletar o produto.';
        this.messageEvent.emit(errorMessage);
      }
    })
  }

}
