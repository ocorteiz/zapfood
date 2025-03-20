import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { IAdicional, ICreateAdicional, IUpdateAdicional } from '../../../../core/interfaces/IAdicionais.interface';
import { ICategoriaDeAdicional, ICategoriaDeEspecificacao } from '../../../../core/interfaces/ICategoria.interface';
import { CategoriaService } from '../../../../core/services/categoria/categoria.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdicionalService } from '../../../../core/services/adicional/adicional.service';
import { EspecificacaoService } from '../../../../core/services/especificacao/especificacao.service';
import { IEspecificacao, IUpdateEspecificacao } from '../../../../core/interfaces/IEspecificacoes.interface';

@Component({
  selector: 'app-form-especificacao',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './form-especificacao.component.html',
  styleUrl: './form-especificacao.component.scss'
})
export class FormEspecificacaoComponent implements OnInit {

  ngOnInit(): void {
    this.httpFindAllCategorias()

    if (this.id) {
      this.httpFindByIdEspecificacao(this.id)
    }
  }

  #categoriaService = inject(CategoriaService);
  #especificacaoService = inject(EspecificacaoService);

  @Input() mode: string = "add"
  @Output() close = new EventEmitter<void>();
  @Output() messageEvent = new EventEmitter<string | null>();
  @Input() id: number | undefined = undefined;

  especificacaoForm: FormGroup;
  private fb = inject(FormBuilder);

  message: string | null = null
  erro: string = '';

  constructor() {
    this.especificacaoForm = this.fb.group({
      nome: ['', Validators.required],
      descricao: ['', Validators.required],
      idCategoria: [null, Validators.required]
    })
  }

  closeModal() {
    this.close.emit();
    this.messageEvent.emit(this.message)
  }


  // GET ESPECIFICAOES BY ID

  public getEspecificacao = signal<IEspecificacao | null>(null)

  httpFindByIdEspecificacao(idEspecificacao: number): void {
    this.#especificacaoService.httpFindByIdEspecificacao$(idEspecificacao).subscribe({
      next: (data) => this.getEspecificacao.set(data),
      error: (error) => console.log('erro: ', error.error.message)
    })
  }

  // GET CATEGORIAS DE ESPECIFICAOES

  public getCategorias = signal<ICategoriaDeEspecificacao[] | []>([])

  httpFindAllCategorias(): void {
    this.#categoriaService.httpFindAllCategoriaEspecificacao$().subscribe({
      next: (data) => this.getCategorias.set(data),
      error: (error) => console.log('erro: ', error.error.message)
    })
  }

  // CREATE ESPECIFICACAO

  onSubmitCadastro(): void {
    this.erro = '';

    const validations = [
      { isValid: () => this.especificacaoForm.get('nome')?.value !== '', message: 'NOME É OBRIGATÓRIO' },
      { isValid: () => this.especificacaoForm.get('descricao')?.value !== '', message: 'DESCRIÇAO É OBRIGATÓRIO' },
      { isValid: () => this.especificacaoForm.get('idCategoria')?.value !== null, message: 'CATEGORIA É OBRIGATÓRIO' },
    ]

    const invalidField = validations.find(validation => !validation.isValid());

    if (invalidField) {
      this.erro = invalidField.message;
      return;
    }

    const adicional = this.especificacaoForm.value

    this.#especificacaoService.httpCreateEspecificacao$(adicional).subscribe({
      next: () => {
        this.message = 'ESPECIFICAÇÃO CADASTRADA COM SUCESSO'
        this.closeModal()
      },
      error: (error) => console.log('erro: ', error.error.message)
    })

  }

  // UPDATE ADICIONAL

  onSubmitUpdate(): void {
    this.erro = '';

    const adicional = this.getEspecificacao()

    if (adicional == null) {
      this.erro = 'ADICIONAL NÃO CARREGADO'
      return
    }

    const validations = [
      { isValid: () => adicional.descricao !== '', message: 'DESCRIÇAO É OBRIGATÓRIO' },
    ]

    const invalidField = validations.find(validation => !validation.isValid());

    if (invalidField) {
      this.erro = invalidField.message;
      return;
    }

    const body: IUpdateEspecificacao = {
      descricao: adicional.descricao,
    }

    this.#especificacaoService.httpUpdateEspecificacao$(this.id, body).subscribe({
      next: () => {
        this.message = 'ESPECIFICAÇÃO ATUALIZADA COM SUCESSO'
        this.closeModal()
      },
      error: (error) => console.log('erro: ', error.error.message)
    })

  }
}
