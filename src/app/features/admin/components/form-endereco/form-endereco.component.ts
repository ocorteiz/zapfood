import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { IBairro, IBairroCreate, IBairroUpdate } from '../../../../core/interfaces/IEndereco.interface';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EnderecoService } from '../../../../core/services/endereco/endereco.service';

@Component({
  selector: 'app-form-endereco',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './form-endereco.component.html',
  styleUrl: './form-endereco.component.scss'
})
export class FormEnderecoComponent {

  #enderecoService = inject(EnderecoService);

  @Input() mode: string | null = null
  @Input() idBairro: number | null = null

  @Output() close = new EventEmitter<void>();
  @Output() messageEvent = new EventEmitter<string | null>()

  private fb = inject(FormBuilder);

  erro: string = "";
  message: string | null = null;
  enderecoForm: FormGroup;

  constructor() {
    this.enderecoForm = this.fb.group({
      nome: ['', Validators.required],
      taxaDeEntrega: [null, [Validators.required, Validators.min(0)]]
    })
  }

  closeModal() {
    this.close.emit()
    this.messageEvent.emit(this.message)
  }

  onSubmitCadastro(): void {
    this.erro = ""

    const validations = [
      {isValid: () => this.enderecoForm.get("nome")?.value !== '', message: 'NOME É OBRIGATÓRIO' },
      {isValid: () => {
        const taxa = this.enderecoForm.get("taxaDeEntrega")?.value;
        return taxa !== null && taxa != undefined && taxa > -1;
      }, message: "TAXA DE ENTREGA É OBRIGATÓRIA" }
    ]

    const invalidField = validations.find(validation => !validation.isValid())

    if (invalidField) {
      this.erro = invalidField.message
      return
    }

    const bairro: IBairroCreate = this.enderecoForm.value

    this.#enderecoService.httpCreateBairro$(bairro).subscribe({
      next: () => {
        this.message = 'BAIRRO CADASTRADO COM SUCESSO'
        this.closeModal()
      },
      error: (error) => console.log("erro: ", error.error.message)
    })

  }

  onSubmitUpdate(): void {
    this.erro = ""

    const taxaDeEntrega = this.enderecoForm.get("taxaDeEntrega")?.value

    const validations = [
      {isValid: () => {
        return taxaDeEntrega !== null && taxaDeEntrega != undefined && taxaDeEntrega > -1;
      }, message: "TAXA DE ENTREGA É OBRIGATÓRIA" }
    ]

    const invalidField = validations.find(validation => !validation.isValid())

    if (invalidField) {
      this.erro = invalidField.message
      return
    }


    const body: IBairroUpdate = {taxaDeEntrega: taxaDeEntrega};

    this.#enderecoService.httpUpdateBairro$(this.idBairro, body).subscribe({
      next: () => {
        this.message = 'BAIRRO ATUALIZADO COM SUCESSO'
        this.closeModal()
      },
      error: (error) => console.log("erro: ", error.error.message)
    })

  }



}
