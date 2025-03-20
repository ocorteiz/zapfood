import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { IAdicional, ICreateAdicional, IUpdateAdicional } from '../../../../core/interfaces/IAdicionais.interface';
import { ICategoriaDeAdicional } from '../../../../core/interfaces/ICategoria.interface';
import { CategoriaService } from '../../../../core/services/categoria/categoria.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdicionalService } from '../../../../core/services/adicional/adicional.service';

@Component({
  selector: 'app-form-adicional',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './form-adicional.component.html',
  styleUrl: './form-adicional.component.scss'
})
export class FormAdicionalComponent implements OnInit {

  ngOnInit(): void {
    this.httpFindAllCategorias()

    if(this.id) {
      this.httpFindByIdAdicional(this.id)
    }
  }

  #categoriaService = inject(CategoriaService);
  #adicionalService = inject(AdicionalService);

  @Input() mode: string = "add"
  @Output() close = new EventEmitter<void>();
  @Output() messageEvent = new EventEmitter<string | null>();
  @Input() id: number | undefined = undefined;

  adicionalForm: FormGroup;
  private fb = inject(FormBuilder);

  message: string | null = null
  erro: string = '';

  constructor(){
    this.adicionalForm = this.fb.group({
      nome: ['', Validators.required],
      descricao: ['', Validators.required],
      preco: [null, [Validators.required, Validators.min(1)]],
      idCategoria: [null, Validators.required]
    })
  }

  closeModal() {
    this.close.emit();
    this.messageEvent.emit(this.message)
  }


  // GET ADICIONAL BY ID

  public getAdicional = signal<IAdicional | null>(null)

  httpFindByIdAdicional(idAdicional: number): void {
    this.#adicionalService.httpFindByIdAdicional$(idAdicional).subscribe({
      next: (data) => this.getAdicional.set(data),
      error: (error) => console.log('erro: ', error.error.message)
    })
  }


  // GET CATEGORIAS DE ADICIONAIS

  public getCategorias = signal<ICategoriaDeAdicional[] | []>([])

  httpFindAllCategorias(): void {
    this.#categoriaService.httpFindAllCategoriaAdicional$().subscribe({
      next: (data) => this.getCategorias.set(data),
      error: (error) => console.log('erro: ', error.error.message)
    })
  }

  // CREATE ADICIONAL

  onSubmitCadastro(): void {
    this.erro = '';

    const validations = [
      { isValid: () => this.adicionalForm.get('nome')?.value !== '', message: 'NOME É OBRIGATÓRIO' },
      { isValid: () => this.adicionalForm.get('descricao')?.value !== '', message: 'DESCRIÇAO É OBRIGATÓRIO' },
      {
        isValid: () => {
          const preco = this.adicionalForm.get('preco')?.value;
          return preco !== null && preco !== undefined && preco > 0
        }, message: "PREÇO É OBRIGATÓRIO"
      },
      { isValid: () => this.adicionalForm.get('idCategoria')?.value !== null, message: 'CATEGORIA É OBRIGATÓRIO' },
    ]

    const invalidField = validations.find(validation => !validation.isValid());

    if (invalidField) {
      this.erro = invalidField.message;
      return;
    }

    const adicional = this.adicionalForm.value

    this.#adicionalService.httpCreateAdicional$(adicional).subscribe({
      next: () => {
        this.message = 'ADCIONAL CADASTRADO COM SUCESSO'
        this.closeModal()
      },
      error: (error) => console.log('erro: ', error.error.message)
    })

  }

  // UPDATE ADICIONAL

  onSubmitUpdate(): void {
    this.erro = '';

    const adicional = this.getAdicional()

    if(adicional == null) {
      this.erro = 'ADICIONAL NÃO CARREGADO'
      return
    }

    const validations = [
      { isValid: () => adicional.descricao !== '', message: 'DESCRIÇAO É OBRIGATÓRIO' },
      {
        isValid: () => {
          const preco = adicional.preco;
          return preco !== null && preco !== undefined && preco > 0
        }, message: "PREÇO É OBRIGATÓRIO"
      }
    ]

    const invalidField = validations.find(validation => !validation.isValid());

    if (invalidField) {
      this.erro = invalidField.message;
      return;
    }

    const body: IUpdateAdicional = {
      descricao: adicional.descricao,
      preco: adicional.preco,
    }

    this.#adicionalService.httpUpdateAdicional$(this.id, body).subscribe({
      next: () => {
        this.message = 'ADCIONAL ATUALIZADO COM SUCESSO'
        this.closeModal()
      },
      error: (error) => console.log('erro: ', error.error.message)
    })

  }

}
