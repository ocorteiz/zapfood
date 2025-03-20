import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { IAdicional } from '../../../../core/interfaces/IAdicionais.interface';
import { CommonModule } from '@angular/common';
import { ProdutoService } from '../../../../core/services/produto/produto.service';
import { FormsModule } from '@angular/forms';
import { AdicionalService } from '../../../../core/services/adicional/adicional.service';

@Component({
  selector: 'app-container-adicionais',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './container-adicionais.component.html',
  styleUrl: './container-adicionais.component.scss'
})
export class ContainerAdicionaisComponent implements OnInit {

  ngOnInit(): void {
    if (this.mode == 'remove') {
      this.findAdicionaisByProduto(this.idProduto)
    }

    if (this.mode == 'add') {
      this.findAdicionaisWhitoutProduto(this.idProduto)
    }
  }

  #produtoService = inject(ProdutoService);
  #adicionalService = inject(AdicionalService);

  @Output() close = new EventEmitter<void>();
  @Output() messageEvent = new EventEmitter<string | null>();
  @Input() mode: string = 'add';
  @Input() idProduto: number | null = null

  searchText: string = '';
  message: string | null = null

  closeModal() {
    this.close.emit();
    this.messageEvent.emit(this.message)
  }

  // GET ADICIONAIS DE PRODUTO

  public getAdicionais = signal<IAdicional[] | []>([])

  findAdicionaisByProduto(idProduto: number | null): void {
    this.#produtoService.httpFindAdicionaisByProduto$(idProduto).subscribe({
      next: (data) => {
        this.getAdicionais.set(data)
      },
      error: (error) => console.log('erro: ', error.error.message)
    })
  }

  // GET ADICIONAIS DE NÃO PRODUTO

  findAdicionaisWhitoutProduto(idProduto: number | null): void {
    this.#produtoService.httpFindAdicionaisWhitoutProduto$(idProduto).subscribe({
      next: (data) => {
        this.getAdicionais.set(data)
      },
      error: (error) => console.log('erro: ', error.error.message)
    })
  }

  // ADD ADICIONAL

  addAdicional(idAdicional: number | null, idProduto: number | null): void {
    this.#adicionalService.httpAddAdicional$(idAdicional, idProduto).subscribe({
      next: () => {
        this.message = 'ADICIONAL ADICIONADO COM SUCESSO'
        this.closeModal()
      },
      error: (error) => console.log('erro: ', error.error.message)
    })
  }

  // REMOVER ADICIONAL

  removerAdicional(idAdicional: number | null, idProduto: number | null): void {
    this.#adicionalService.httprRemoverAdicional$(idAdicional, idProduto).subscribe({
      next: () => {
        this.message = 'ADICIONAL REMOVIDO COM SUCESSO'
        this.closeModal()
      },
      error: (error) => console.log('erro: ', error.error.message)
    })
  }

  // FILTRO

  adiconaisFiltrados: IAdicional[] = [...this.getAdicionais()];

  get filteredAdicionais() {
    return this.getAdicionais().filter((adicional) => {
      const searchUpper = this.searchText.toUpperCase();

      const nomeMatch = adicional.nome.toUpperCase().includes(searchUpper);

      return nomeMatch;
    });
  }


}
