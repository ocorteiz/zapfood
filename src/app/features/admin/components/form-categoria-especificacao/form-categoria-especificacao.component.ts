import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CategoriaService } from '../../../../core/services/categoria/categoria.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ICreateCategoriaDeEspecificacao } from '../../../../core/interfaces/ICategoria.interface';

@Component({
  selector: 'app-form-categoria-especificacao',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './form-categoria-especificacao.component.html',
  styleUrl: './form-categoria-especificacao.component.scss'
})
export class FormCategoriaEspecificacaoComponent {

  #categoriaService = inject(CategoriaService);

  @Output() close = new EventEmitter<void>();
  @Output() messageEvent = new EventEmitter<string | null>();

  categoriaForm: FormGroup;
  private fb = inject(FormBuilder);

  erro: string = '';
  message: string | null = null;

  constructor() {
    this.categoriaForm = this.fb.group({
      nome: ['', Validators.required],
      minimoPorCategoria: [null, Validators.required]
    })
  }

  closeModal() {
    this.close.emit();
    this.messageEvent.emit(this.message)
  }

  onSubmit() {
    this.erro = ''

    const validations = [
      { isValid: () => this.categoriaForm.get('nome')?.value !== '', message: 'NOME É OBRIGATÓRIO' },
      {
        isValid: () => {
          const maximoPorCategoria = this.categoriaForm.get('minimoPorCategoria')?.value;
          return maximoPorCategoria !== null && maximoPorCategoria !== undefined && maximoPorCategoria > 0
        }, message: "MAXIMO POR CATEGORIA É OBRIGATÓRIO"
      },
    ]

    const invalidField = validations.find(validation => !validation.isValid())

    if (invalidField) {
      this.erro = invalidField.message;
      return;
    }

    const categoria: ICreateCategoriaDeEspecificacao = this.categoriaForm.value

    this.#categoriaService.httpCreateCategoriaDeEspecificacao$(categoria).subscribe({
      next: () => {
        this.message = "CATEGORIA CRIADA COM SUCESSO"
        this.closeModal()
      }
    })

  }

}
