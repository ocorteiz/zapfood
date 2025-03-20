import { AfterViewInit, ChangeDetectorRef, Component, inject, Input, OnInit, signal } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { CommonModule } from '@angular/common';
import { CardItemComponent } from "../../../cliente/components/card-item/card-item.component";
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IPedido } from '../../../../core/interfaces/IPedido.interface';
import { PedidoService } from '../../../../core/services/pedido/pedido.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pedido',
  standalone: true,
  imports: [HeaderComponent, CommonModule, CardItemComponent, RouterLink, FormsModule],
  templateUrl: './pedido.component.html',
  styleUrl: './pedido.component.scss'
})
export class PedidoComponent implements OnInit, AfterViewInit {


  #cdr = inject(ChangeDetectorRef)
  #pedidoService = inject(PedidoService);
  #route = inject(ActivatedRoute);
  #id: string | null = null;

  motivo: string = '';

  messageSucess: string | null = null;
  messageError: string | null = null;

  showNegar = false;
  showCancelar = false;

  ngOnInit(): void {
    this.#route.paramMap.subscribe(paraMap => {
      this.#id = paraMap.get('id');
      if (this.#id) {
        this.findByIdPedido(this.#id)
      }
    })
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.findByIdPedido(this.#id)
    }, 200)
  }

  toggleNegar() {
    this.showNegar = !this.showNegar
  }

  toggleCancelar() {
    this.showCancelar = !this.showCancelar
  }

  public getPedido = signal<IPedido | null>(null)

  findByIdPedido(id: string | null): void {
    this.#pedidoService.httpFindByIdPedido$(id).subscribe({
      next: (data) => {
        this.getPedido.set(data)
        this.#cdr.detectChanges()
      },
      error: (error) => {
        console.log('erro: ', error.error.message)
      }
    })
  }

  aceitarPedido(idPedido: number) {
    this.#pedidoService.httpAceitarPedido$(idPedido).subscribe({
      next: () => {
        if (this.#id) {
          this.findByIdPedido(this.#id)

          this.messageSucess = 'PEDIDO ACEITO COM SUCESSO';

          setTimeout(() => {
            this.messageSucess = null;
          }, 2000);
        }
      },
      error: (error) => {
        console.log('erro: ', error.error.message)
      }
    })
  }

  enviarPedido(idPedido: number) {
    this.#pedidoService.httpEnviarPedido$(idPedido).subscribe({
      next: () => {
        if (this.#id) {
          this.findByIdPedido(this.#id)


          this.messageSucess = 'PEDIDO ENVIADO COM SUCESSO';

          setTimeout(() => {
            this.messageSucess = null;
          }, 2000);
        }
      },
      error: (error) => {
        console.log('erro: ', error.error.message)
      }
    })
  }

  finalizarPedido(idPedido: number) {
    this.#pedidoService.httpFinalizarPedido$(idPedido).subscribe({
      next: () => {
        if (this.#id) {
          this.findByIdPedido(this.#id)

          this.messageSucess = 'PEDIDO FINALIZADO COM SUCESSO';

          setTimeout(() => {
            this.messageSucess = null;
          }, 2000);
        }
      },
      error: (error) => {
        console.log('erro: ', error.error.message)
      }
    })
  }

  negarPedido(idPedido: number) {
    this.#pedidoService.httpNegarPedido$(idPedido, this.motivo).subscribe({
      next: () => {
        if (this.#id) {
          this.toggleNegar()
          this.findByIdPedido(this.#id)

          this.messageSucess = 'PEDIDO NEGADO COM SUCESSO';

          setTimeout(() => {
            this.messageSucess = null;
          }, 2000);
        }
      },
      error: (error) => {
        console.log('erro: ', error.error.message)
      }
    })
  }

  cancelarPedido(idPedido: number) {
    this.#pedidoService.httpCancelarPedido$(idPedido).subscribe({
      next: () => {
        if (this.#id) {
          this.toggleCancelar()
          this.findByIdPedido(this.#id)

          this.messageSucess = 'PEDIDO CANCELADO COM SUCESSO';

          setTimeout(() => {
            this.messageSucess = null;
          }, 2000);
        }
      },
      error: (error) => {
        console.log('erro: ', error.error.message)
      }
    })
  }

  gerarNota(idPedido: number): void {
    this.#pedidoService.gerarNota$(idPedido)
  }

}
