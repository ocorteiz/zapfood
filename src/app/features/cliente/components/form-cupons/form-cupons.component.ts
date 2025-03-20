import { Component, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { CardCupomComponent } from "../card-cupom/card-cupom.component";
import { CupomService } from '../../../../core/services/cupom/cupom.service';
import { ICupom } from '../../../../core/interfaces/ICupom.interface';

@Component({
  selector: 'app-form-cupons',
  standalone: true,
  imports: [CardCupomComponent],
  templateUrl: './form-cupons.component.html',
  styleUrl: './form-cupons.component.scss'
})
export class FormCuponsComponent implements OnInit {

  @Output() close = new EventEmitter<void>();
  @Output() cupomSelecionado = new EventEmitter<ICupom>()
  isFormOpen = true;
  #cupomService = inject(CupomService);

  cupom: ICupom | null = null;

  usuario = {
    id: 0,
    nome: '',
  }

  ngOnInit(): void {
    if (typeof window !== "undefined" && window.localStorage) {
      const usuario = localStorage.getItem('usuario')

      if (usuario) {
        this.usuario = JSON.parse(usuario)
        this.findByCliente(this.usuario.id)
      }
    }
  }

  closeModal() {
    this.close.emit();
    this.isFormOpen = false;
  }

  public getCupons = signal<ICupom[]>([])

  findByCliente(idCliente: number): void {
    this.#cupomService.httpFindCuponsByCliente$(idCliente).subscribe({
      next: (data) => {
        this.getCupons.set(data)
      },
      error: (error) => {
        console.log("error: ", error.error.message)
      }
    })
  }

  //

  error: string = ""

  onCupomSelecionado(cupom: ICupom): void {
    this.cupom = cupom;
    this.cupomSelecionado.emit(this.cupom)
  }

}
