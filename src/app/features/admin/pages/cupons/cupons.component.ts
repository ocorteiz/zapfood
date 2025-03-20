import { Component, inject, OnInit, signal } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { ICupom, ICupons } from '../../../../core/interfaces/ICupom.interface';
import { CommonModule } from '@angular/common';
import { ContainerClientesComponent } from "../../components/container-clientes/container-clientes.component";
import { FormCupomComponent } from "../../components/form-cupom/form-cupom.component";
import { CupomService } from '../../../../core/services/cupom/cupom.service';
import { error } from 'console';

@Component({
  selector: 'app-cupons',
  standalone: true,
  imports: [HeaderComponent, CommonModule, ContainerClientesComponent, FormCupomComponent],
  templateUrl: './cupons.component.html',
  styleUrl: './cupons.component.scss'
})
export class CuponsComponent implements OnInit {

  ngOnInit(): void {
    this.findAllCupons()
  }

  #cupomService = inject(CupomService);

  mode: string = '';
  idCupom: number | null = null;

  showDelete = false;
  showAddCliente =  false;
  showAddCupom =  false;

  messageSucess: string | null = null;
  messageError: string | null = null;

  receberMensagem(message: string | null): void {
    this.messageSucess = message;

    setTimeout(() => {
      this.messageSucess = null;
    }, 2000);
  }

  toggleContainerCliente() {
    this.showAddCliente = !this.showAddCliente
  }

  toggleAddCliente(idCupom: number | null) {
    this.idCupom = idCupom
    this.mode = 'add'
    this.showAddCliente = !this.showAddCliente
  }

  toggleRemoveCliente(idCupom: number | null) {
    this.idCupom = idCupom
    this.mode = 'remove'
    this.showAddCliente = !this.showAddCliente
  }

  toggleAddCupom() {
    this.findAllCupons()
    this.showAddCupom = !this.showAddCupom
  }

  toggleDelete() {
    this.showDelete = !this.showDelete
  }

  // FIND TODOS CUPONS

  public getCupons = signal<ICupons[]>([])

  findAllCupons(): void {
    this.#cupomService.httpFindAllCupom$().subscribe({
      next: (data) => this.getCupons.set(data),
      error: (error) => console.log('erro: ', error.error.message)
    })
  }

  // DELETAR CUPOM

  deletarCupom(id: number): void {
    this.#cupomService.httpDeleteCupom$(id).subscribe({
      next: (data) => {
        this.findAllCupons()

        this.messageSucess = "CUPOM DELETADO COM SUCESSO"
        setTimeout(() => {
          this.messageSucess = null
        }, 2000)
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

  // DESTATIVAR CUPOM

  desativarCupom(id: number): void {
    this.#cupomService.httpDesativarCupom$(id).subscribe({
      next: (data) => {
        this.findAllCupons()

        this.messageSucess = "CUPOM DESATIVADO COM SUCESSO"
        setTimeout(() => {
          this.messageSucess = null
        }, 2000)
      },
      error: (error) => console.log('erro: ', error.error.message)
    })
  }

  ativarCupom(id: number): void {
    this.#cupomService.httpAtivarCupom$(id).subscribe({
      next: (data) => {
        this.findAllCupons()

        this.messageSucess = "CUPOM ATIVADO COM SUCESSO"
        setTimeout(() => {
          this.messageSucess = null
        }, 2000)
      },
      error: (error) => {
        this.messageError = error.error.message
        setTimeout(() => {
          this.messageError = null
        }, 2000)
      }
    })
  }

}
