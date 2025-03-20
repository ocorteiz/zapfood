import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IPagamentoCreate } from '../../../../core/interfaces/IPagamento.interface';
import { PagamentoService } from '../../../../core/services/pagamento/pagamento.service';
import { error } from 'console';

@Component({
  selector: 'app-form-pagamento',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form-pagamento.component.html',
  styleUrl: './form-pagamento.component.scss'
})
export class FormPagamentoComponent {

  @Output() close = new EventEmitter<void>()
  @Output() messageEvent = new EventEmitter<string | null>()

  #pagamentoService = inject(PagamentoService);

  pagamentoForm: FormGroup;
  private fb = inject(FormBuilder);

  erro: string = '';
  message: string | null = null;

  constructor() {
    this.pagamentoForm = this.fb.group({
      nome: ['', Validators.required]
    })
  }

  closeModal() {
    this.close.emit()
    this.messageEvent.emit(this.message)
  }

  onSubmit() {
    this.erro = ''

    const validation = [
      {isvalid: () => this.pagamentoForm.get('nome')?.value !== '', message: 'NOME É OBRIGATÓRIO'}
    ]

    const invalidField = validation.find(validation => !validation.isvalid())

    if (invalidField) {
      this.erro = invalidField.message
      return
    }

    if (this.pagamentoForm.get('nome')?.value.includes('pix')) {
      this.erro = 'PARA ATIVAR PAGAMENTO VIA PIX UTILIZE A ABA "PAGAMENTO VIA PIX"'
      return
    }

    const pagamento: IPagamentoCreate = this.pagamentoForm.value

    this.#pagamentoService.httpCreate$(pagamento).subscribe({
      next: () => {
        this.message = "MÉTODO DE PAGAMENTO CADASTRADA COM SUCESSO"
        this.closeModal()
      },
      error: (error) => console.log('erro: ', error.error.message)
    })


  }


}
