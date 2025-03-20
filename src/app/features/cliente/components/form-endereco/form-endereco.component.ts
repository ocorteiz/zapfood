import { Component, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { EnderecoService } from '../../../../core/services/endereco/endereco.service';
import { IBairro, IEnderecoCreate } from '../../../../core/interfaces/IEndereco.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { error } from 'console';

@Component({
  selector: 'app-form-endereco',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form-endereco.component.html',
  styleUrl: './form-endereco.component.scss'
})
export class FormEnderecoComponent implements OnInit {

  usuario = {
    id: 0,
    nome: '',
  }

  ngOnInit(): void {
    this.findAllBairro()

    if (typeof window !== "undefined" && window.localStorage) {
      const usuario = localStorage.getItem('usuario')

      if (usuario) {
        this.usuario = JSON.parse(usuario)
      }
    }
  }

  @Output() close = new EventEmitter<void>();
  @Output() updateEndereco = new EventEmitter<void>();

  #enderecoService = inject(EnderecoService);

  closeModal() {
    this.close.emit();
  }

  public getBairros = signal<IBairro[]>([])

  findAllBairro(): void {
    this.#enderecoService.httpFindAllBairro$().subscribe({
      next: (data) => {
        this.getBairros.set(data)
      },
      error: (error) => {
        console.log("error: ", error.error.message)
      }
    })
  }

  endereco: IEnderecoCreate = {
    idBairro: null,
    rua: null,
    numero: null,
    complemento: null
  }

  erro: string = '';

  onSubmit(): void {
    this.erro = ""

    if (this.endereco.idBairro == null || this.endereco.rua == null || this.endereco.numero == null) {
      this.erro = "PREENCHA TODOS OS CAMPOS"
      return
    }

    if (this.endereco.idBairro !== null) {
      this.endereco.idBairro = Number(this.endereco.idBairro);
    }

    this.createEndereco(this.usuario.id, this.endereco)
  }

  createEndereco(idCliente: number, endereco: IEnderecoCreate): void {
    this.#enderecoService.httpCreateEndereco$(idCliente, endereco).subscribe({
      next: () => {
        this.closeModal()
        this.updateEndereco.emit()
      },
      error: (error) => console.log("error: ", error.error.message)
    })
  }
}
