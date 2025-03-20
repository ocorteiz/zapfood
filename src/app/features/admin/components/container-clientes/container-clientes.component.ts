import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { ICliente } from '../../../../core/interfaces/ICliente.interface';
import { FormsModule } from '@angular/forms';
import { CupomService } from '../../../../core/services/cupom/cupom.service';

@Component({
  selector: 'app-container-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './container-clientes.component.html',
  styleUrl: './container-clientes.component.scss'
})
export class ContainerClientesComponent implements OnInit {

  ngOnInit(): void {
    if (this.mode == 'remove') {
      this.findClientesByCupom(this.idCupom)
    }

    if (this.mode == 'add') {
      this.findClientesWhitoutCupom(this.idCupom)
    }
  }

  #cupomService = inject(CupomService);

  @Input() idCupom: number | null = null;
  @Input() mode: string = '';
  @Output() close = new EventEmitter<void>();
  @Output() messageEvent = new EventEmitter<string | null>();

  message: string | null = null;
  searchText: string = '';

  closeModal() {
    this.messageEvent.emit(this.message);
    this.close.emit();
  }

  // GET CLIENTES COM CUPOM

  public getClientesByCUpom = signal<ICliente[] | []>([])

  findClientesByCupom(idCupom: number | null): void {
    this.#cupomService.httpFindClientesByCupom$(idCupom).subscribe({
      next: (data) => {
        this.getClientesByCUpom.set(data)
      },
      error: (error) => console.log('erro: ', error.error.message)
    })
  }

  // GET CLIENTES SEM CUPOM

  public getClientesWhitoutCupom = signal<ICliente[] | []>([])

  findClientesWhitoutCupom(idCupom: number | null): void {
    this.#cupomService.httpFindClientesWhitoutCupom$(idCupom).subscribe({
      next: (data) => {
        this.getClientesWhitoutCupom.set(data)
      },
      error: (error) => console.log('erro: ', error.error.message)
    })
  }

  // ADD CUPOM A CLIENTES

  selecoesAdd: { [id: number]: boolean } = {};

  onSubmitAdicionar(): void {
    const idsSelecionados = Object.entries(this.selecoesAdd)
      .filter(([id, selecionado]) => selecionado)
      .map(([id]) => Number(id));

    console.log("IDs Selecionados:", idsSelecionados);

    this.#cupomService.httpAddCupomToCliente$(this.idCupom, idsSelecionados).subscribe({
      next: () => {
        this.message = 'CUPOM ADICIONADO A CLIENTES'
        this.closeModal()
      },
      error: (error) => console.log('erro: ', error.error.message)
    })
  }

  // REMOVE CUPOM

  selecoesRemove: { [id: number]: boolean } = {};

  onSubmitRemove(): void {
    const idsSelecionados = Object.entries(this.selecoesRemove)
      .filter(([id, selecionado]) => selecionado)
      .map(([id]) => Number(id));

    this.#cupomService.httpRemoveCupomToCliente$(this.idCupom, idsSelecionados).subscribe({
      next: () => {
        this.message = 'CUPOM REMOVIDO DE CLIENTES'
        this.closeModal()
      },
      error: (error) => console.log('erro: ', error.error.message)
    })
  }

  // FILTRO

  clientesWhitouCupomFiltrados: ICliente[] = [...this.getClientesWhitoutCupom()];

  get filteredClientesWhitouCupomFiltrados() {
    return this.getClientesWhitoutCupom().filter((cliente) => {
      const searchUpper = this.searchText.toUpperCase();

      const nomeMatch = cliente.nome.toUpperCase().includes(searchUpper);

      const enderecoMatch = cliente.ultimoEndereco?.bairro.toUpperCase().includes(searchUpper);

      const pedidoMatch = cliente.ultimoPedido?.some(item =>
        item.nome.toUpperCase().includes(searchUpper)
      );

      return nomeMatch || enderecoMatch || pedidoMatch;
    });
  }

  clientesByCupomFiltrados: ICliente[] = [...this.getClientesByCUpom()];

  get filteredClientesByCupomFiltrados() {
    return this.getClientesByCUpom().filter((cliente) => {
      const searchUpper = this.searchText.toUpperCase();

      const nomeMatch = cliente.nome.toUpperCase().includes(searchUpper);

      const enderecoMatch = cliente.ultimoEndereco?.bairro.toUpperCase().includes(searchUpper);

      const pedidoMatch = cliente.ultimoPedido?.some(item =>
        item.nome.toUpperCase().includes(searchUpper)
      );

      return nomeMatch || enderecoMatch || pedidoMatch;
    });
  }

  // SELECIONRAR TODOS

  selectAll: boolean = false;

  selectAllClientesWhitoutCupom(): void {
    this.filteredClientesWhitouCupomFiltrados.forEach(cliente => {
      this.selecoesAdd[cliente.id] = this.selectAll;
    });
  }

  selectAllClientesByCupom(): void {
    this.filteredClientesByCupomFiltrados.forEach(cliente => {
      this.selecoesRemove[cliente.id] = this.selectAll;
    });
  }

}
