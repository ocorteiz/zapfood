import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoriaService } from '../../../../core/services/categoria/categoria.service';
import { ICreateCategoriaDeProduto } from '../../../../core/interfaces/ICategoria.interface';

@Component({
  selector: 'app-form-categoria-produto',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './form-categoria-produto.component.html',
  styleUrl: './form-categoria-produto.component.scss'
})
export class FormCategoriaProdutoComponent {

  #categoriaService = inject(CategoriaService);

  @Output() close = new EventEmitter<void>();
  @Output() messageEvent = new EventEmitter<string | null>();

  message: string | null = null
  erro: string = ''

  categoriaForm: FormGroup;
  private fb = inject(FormBuilder);

  constructor() {
    this.categoriaForm = this.fb.group(
      {nome: ['', Validators.required]}
    )
  }

  closeModal() {
    this.close.emit();
    this.messageEvent.emit(this.message);
  }

  onSubmit(): void {
    this.erro = ''

    const validations = [
      {isValid: () => this.categoriaForm.get('nome')?.value !== '', message: 'NOME É OBRIGATÓRIO'}
    ]

    const invalidField = validations.find(validation => !validation.isValid())

    if (invalidField) {
      this.erro = invalidField.message
      return
    }

    const categoriaDeProduto: ICreateCategoriaDeProduto = {nome: this.categoriaForm.get('nome')?.value}

    this.#categoriaService.httpCreateCategoriaDeProduto$(categoriaDeProduto).subscribe({
      next: () => {
        this.message = "CATEGORIA CADASTRADA COM SUCESSO"
        this.closeModal()
      }
    })

  }

}
