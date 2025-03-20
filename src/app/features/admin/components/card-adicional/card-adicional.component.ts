import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { IAdicional } from '../../../../core/interfaces/IAdicionais.interface';
import { FormAdicionalComponent } from "../form-adicional/form-adicional.component";
import { ContainerAdicionaisComponent } from "../container-adicionais/container-adicionais.component";
import { AdicionalService } from '../../../../core/services/adicional/adicional.service';

@Component({
  selector: 'app-card-adicional',
  standalone: true,
  imports: [CommonModule, FormAdicionalComponent],
  templateUrl: './card-adicional.component.html',
  styleUrl: './card-adicional.component.scss'
})
export class CardAdicionalComponent {

  @Input() getAdicionais: IAdicional[] | [] = []
  @Output() messageEvent = new EventEmitter<string | null>()

  adicional: IAdicional | null = null;

  showDelete = false;
  showAddAdicional = false;

  #adicionalService = inject(AdicionalService);

  id: number | null = null;

  receberMensagem(message: string | null): void {
    this.messageEvent.emit(message)
  }

  selectAdcionalToUpdate(adicional: IAdicional | null) {
    this.adicional = adicional
  }

  toggleUpdateAdicional() {
    this.showAddAdicional = !this.showAddAdicional;
  }

  toggleDelete(id: number | null) {
    this.id = id;
    this.showDelete = !this.showDelete
  }

  // DELETAR ADICIONAL

  deletarAdicional(idAdicional: number | null): void {
    this.#adicionalService.httpDeleteAdicional$(idAdicional).subscribe({
      next: () => {
        this.toggleDelete(null)

        const message = 'ADICIONAL DELETADO COM SUCESSO';
        this.messageEvent.emit(message)
      },
      error: (error) => {
        const errorMessage = error.error.message || 'Erro desconhecido ao deletar o produto.';
        this.messageEvent.emit(errorMessage);
      }
    })
  }

  // DESATIVAR ADICIONAL

  desativarAdicional(idAdicional: number): void {
    this.#adicionalService.httpDesativarAdicional$(idAdicional).subscribe({
      next: () => {
        const message = 'ADICIONAL DESATIVADO COM SUCESSO';
        this.messageEvent.emit(message)
      },
      error: (error) => {
        const errorMessage = error.error.message || 'Erro desconhecido ao deletar o produto.';
        this.messageEvent.emit(errorMessage);
      }
    })
  }

  // ATIVAR ADICIONAL

  ativarAdicional(idAdicional: number): void {
    this.#adicionalService.httpAtivarAdicional$(idAdicional).subscribe({
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
