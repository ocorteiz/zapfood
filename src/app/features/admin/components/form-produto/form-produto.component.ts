import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriaService } from '../../../../core/services/categoria/categoria.service';
import { ICategoriaDeProduto } from '../../../../core/interfaces/ICategoria.interface';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProdutoService } from '../../../../core/services/produto/produto.service';
import { IProduto } from '../../../../core/interfaces/IProdutos.interface';



@Component({
  selector: 'app-form-produto',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './form-produto.component.html',
  styleUrl: './form-produto.component.scss'
})
export class FormProdutoComponent implements OnInit {

  ngOnInit(): void {
    this.findAllBairro()

    if (this.id) {
      this.findByIdProduto(this.id);
    }
  }

  #categoriaService = inject(CategoriaService);
  #produtoService = inject(ProdutoService);

  @Input() mode: string = "add"
  @Input() id: number | null = null
  @Output() close = new EventEmitter<void>();
  @Output() messageEvent = new EventEmitter<string | null>();

  imageFile: File | null = null;
  imagePreview: string | null = null;
  produtoForm: FormGroup;
  private fb = inject(FormBuilder);

  message: string | null = null
  erro: string = "";

  constructor() {
    this.produtoForm = this.fb.group({
      nome: ['', Validators.required],
      descricao: ['', Validators.required],
      preco: [null, [Validators.required, Validators.min(1)]],
      idCategoria: [null, Validators.required]
    })
  }

  closeModal() {
    this.close.emit();
    this.messageEvent.emit(this.message);
  }

  getImageUrl(caminhoImagem: string): string {
    return `http://localhost:8080/${caminhoImagem}`;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.imageFile = input.files[0];

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(this.imageFile);
    }
  }

  // FIND BY ID

  public getProduto = signal<IProduto | null>(null);

  findByIdProduto(id: number): void {
    this.#produtoService.httpFindByIdProduto$(id).subscribe({
      next: (data) => {
        this.getProduto.set(data)
      },
      error: (error) => console.log('erro: ', error.error.message)
    })
  }

  // GET ALL CATEGORIAS

  public getCategoriasDeProduto = signal<ICategoriaDeProduto[] | []>([])

  findAllBairro(): void {
    this.#categoriaService.httpFindAllCategoriaDeProduto$().subscribe({
      next: (data) => {
        this.getCategoriasDeProduto.set(data)
      },
      error: (error) => console.log('erro: ', error.error.message)
    })
  }

  // CADASTRAR PRODUTO

  onSubmitCadastro(): void {
    this.erro = '';

    if (!this.imageFile) {
      this.erro = "IMAGEM DO PRODUTO É OBRIGATÓRIA"
      return;
    }

    const validations = [
      { isValid: () => this.produtoForm.get('nome')?.value !== '', message: 'NOME É OBRIGATÓRIO' },
      { isValid: () => this.produtoForm.get('descricao')?.value !== '', message: 'DESCRIÇAO É OBRIGATÓRIO' },
      {
        isValid: () => {
          const preco = this.produtoForm.get('preco')?.value;
          return preco !== null && preco !== undefined && preco > 0
        }, message: "PREÇO É OBRIGATÓRIO"
      },
      { isValid: () => this.produtoForm.get('idCategoria')?.value !== null, message: 'CATEGORIA É OBRIGATÓRIO' },
    ]

    const invalidField = validations.find(validation => !validation.isValid());

    if (invalidField) {
      this.erro = invalidField.message;
      return;
    }

    const formData = new FormData();
    formData.append('imagem', this.imageFile);
    formData.append('nome', this.produtoForm.get('nome')?.value);
    formData.append('descricao', this.produtoForm.get('descricao')?.value);
    formData.append('preco', this.produtoForm.get('preco')?.value);
    formData.append('idCategoria', this.produtoForm.get('idCategoria')?.value);

    this.#produtoService.httpCreateProduto$(formData).subscribe({
      next: () => {
        this.message = 'PRODUTO CADASTRADO COM SUCESSO'
        this.closeModal()
      },
      error: (error) => console.log('erro: ', error.error.message)
    })

  }

  // CADASTRAR PROMOÇÃO

  onSubmitPromocao(): void {
    this.erro = '';

    if (!this.imageFile) {
      this.erro = "IMAGEM DO PRODUTO É OBRIGATÓRIA"
      return;
    }

    const validations = [
      { isValid: () => this.produtoForm.get('nome')?.value !== '', message: 'NOME É OBRIGATÓRIO' },
      { isValid: () => this.produtoForm.get('descricao')?.value !== '', message: 'DESCRIÇAO É OBRIGATÓRIO' },
      {
        isValid: () => {
          const preco = this.produtoForm.get('preco')?.value;
          return preco !== null && preco !== undefined && preco > 0
        }, message: "PREÇO É OBRIGATÓRIO"
      }
    ]

    const invalidField = validations.find(validation => !validation.isValid());

    if (invalidField) {
      this.erro = invalidField.message;
      return;
    }

    const formData = new FormData();
    formData.append('imagem', this.imageFile);
    formData.append('nome', this.produtoForm.get('nome')?.value);
    formData.append('descricao', this.produtoForm.get('descricao')?.value);
    formData.append('preco', this.produtoForm.get('preco')?.value);

    this.#produtoService.httpCreatePromocao$(formData).subscribe({
      next: () => {
        this.message = 'PROMOÇÃO CADASTRADA COM SUCESSO'
        this.closeModal()
      },
      error: (error) => console.log('erro: ', error.error.message)
    })

  }

  // ATUALIZAR PRODUTO

  onSubmitUpdate(): void {
    this.erro = '';

    const produto = this.getProduto();

    if (!produto) {
      this.erro = 'Os dados da loja não foram carregados!';
      return;
    }

    const validations = [
      { isValid: () => produto.descricao.trim() !== '', message: 'DESCRIÇAO É OBRIGATÓRIO' },
      {
        isValid: () => {
          const preco = produto.preco
          return preco !== null && preco !== undefined
        }, message: "PREÇO É OBRIGATÓRIO"
      }
    ];

    const invalidField = validations.find(validation => !validation.isValid());

    if (invalidField) {
      this.erro = invalidField.message;
      return;
    }

    const formData = new FormData();

    if (this.imageFile) {
      formData.append('imagem', this.imageFile);
    }

    formData.append('descricao', produto.descricao);
    formData.append('preco', produto.preco.toString());


    this.#produtoService.httpUpdateProduto$(this.id, formData).subscribe({
      next: () => {
        this.message = 'PRODUTO ATUALIZADO COM SUCESSO'
        this.closeModal()
      },
      error: (error) => console.log('erro: ', error.error.message)
    })
  }

}
