import { Component, inject, OnInit, signal } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { CommonModule } from '@angular/common';
import { IBairro } from '../../../../core/interfaces/IEndereco.interface';
import { FormEnderecoComponent } from "../../components/form-endereco/form-endereco.component";
import { EnderecoService } from '../../../../core/services/endereco/endereco.service';
import { error } from 'console';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-enderecos',
  standalone: true,
  imports: [HeaderComponent, CommonModule, FormEnderecoComponent, FormsModule],
  templateUrl: './enderecos.component.html',
  styleUrl: './enderecos.component.scss'
})
export class EnderecosComponent implements OnInit {

  ngOnInit(): void {
    this.findAllBairros()
  }

  #enderecoService = inject(EnderecoService);

  searchText: string = '';
  mode: string | null = null;

  showFreteGratis = false;
  showAddEndereco = false;
  showDelete = false;

  idBairro: number | null = null

  messageSucess: string | null = null;
  messageError: string | null = null;

  receberMessagem(message: string | null) {
    this.messageSucess = message;

    setTimeout(() => {
      this.messageSucess = null;
    }, 2000);
  }

  toggleFreteGratis() {
    this.showFreteGratis = !this.showFreteGratis
  }

  toggleAddEndereco() {
    this.mode = "add"
    this.showAddEndereco = !this.showAddEndereco
    this.findAllBairros()
  }

  toggleUpdateEndereco(idBairro: number) {
    this.idBairro = idBairro;
    this.mode = "update"
    this.showAddEndereco = !this.showAddEndereco
    this.findAllBairros()
  }

  toggleDelete() {
    this.showDelete = !this.showDelete
  }

  /// GET TODOS

  public getBairros = signal<IBairro[] | []>([])

  findAllBairros(): void {
    this.#enderecoService.httpFindAllBairro$().subscribe({
      next: (data) => this.getBairros.set(data),
      error: (error) => console.log("erro: ", error.error.message)
    })
  }

  /// DELETAR BAIRRO

  deleteBairro(id: number): void {
    this.#enderecoService.httpDeleteBairro$(id).subscribe({
      next: () => {
        this.messageSucess = "BAIRRO DELETADO COM SUCESSO"
        this.findAllBairros();

        setTimeout(() => {
          this.messageSucess = null;
        }, 2000);
      },
      error: (error) => {
        if (error.error && error.error.message) {
          this.messageError = error.error.message;

          setTimeout(() => {
            this.messageError = null;
          }, 2000);
        } else {
          console.log("Erro desconhecido:", error);
        }
      }
    })
  }

  // FRETE GRATIS

  freteGratis(): void {
    this.#enderecoService.httpFreteGratis$().subscribe({
      next: () => {
        this.toggleFreteGratis()
        this.findAllBairros()

        this.messageSucess = "FRETES ATUALIZADOS PARA GRATUITO COM SUCESSO"

        setTimeout(() => {
          this.messageSucess = null;
        }, 2000);
      },
      error: (error) => console.log("erro: ", error.error.message)
    })
  }

  // FILTRO

  bairrosFiltrados: IBairro[] = [...this.getBairros()];

  get filteredBairros() {
    return this.getBairros().filter(bairro =>
      bairro.nome.toUpperCase().includes(this.searchText.toUpperCase())
    )
  }

}
