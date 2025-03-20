import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CategoriaService } from '../../../../core/services/categoria/categoria.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ICreateCategoriaDeAdicional } from '../../../../core/interfaces/ICategoria.interface';

@Component({
  selector: 'app-form-categoria-adicional',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './form-categoria-adicional.component.html',
  styleUrl: './form-categoria-adicional.component.scss'
})
export class FormCategoriaAdicionalComponent {

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
      maximoPorCategoria: [null, Validators.required]
    })
  }

  closeModal() {
    this.close.emit();
    this.messageEvent.emit(this.message)
  }

  onSubmit() {
    this.erro = ''

    const validations = [
      {isValid: () => this.categoriaForm.get('nome')?.value !== '', message: 'NOME É OBRIGATÓRIO'},
      {
        isValid: () => {
          const maximoPorCategoria = this.categoriaForm.get('maximoPorCategoria')?.value;
          return maximoPorCategoria !== null && maximoPorCategoria !== undefined && maximoPorCategoria > 0
        }, message: "MAXIMO POR CATEGORIA É OBRIGATÓRIO"
      },
    ]

    const invalidField = validations.find(validation => !validation.isValid())

    if (invalidField) {
      this.erro = invalidField.message;
      return;
    }

    const categoria: ICreateCategoriaDeAdicional = this.categoriaForm.value

    this.#categoriaService.httpCreateCategoriaDeAdicional$(categoria).subscribe({
      next: () => {
        this.message = "CATEGORIA CRIADA COM SUCESSO"
        this.closeModal()
      }
    })

  }

}
