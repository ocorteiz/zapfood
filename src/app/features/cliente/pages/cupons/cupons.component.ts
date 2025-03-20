import { Component, inject, OnInit, signal } from '@angular/core';
import { FooterComponent } from "../../components/footer/footer.component";
import { HeaderComponent } from "../../components/header/header.component";
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ICupom } from '../../../../core/interfaces/ICupom.interface';
import { CupomService } from '../../../../core/services/cupom/cupom.service';
import { CardCupomComponent } from "../../components/card-cupom/card-cupom.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SlugService } from '../../../../core/resolver/slug.service';
import { ILoja } from '../../../../core/interfaces/ILoja.interface';
import { LojaService } from '../../../../core/services/loja/loja.service';

@Component({
  selector: 'app-cupons',
  standalone: true,
  imports: [FooterComponent, HeaderComponent, RouterLink, CardCupomComponent, FormsModule, CommonModule],
  templateUrl: './cupons.component.html',
  styleUrl: './cupons.component.scss'
})
export class CuponsComponent implements OnInit {

  dynamicParam: string = '';

  #cupomService = inject(CupomService);
  #slugService = inject(SlugService);
  #lojaService = inject(LojaService);

  #router = inject(Router);
  #activatedRouter = inject(ActivatedRoute);

  usuario = {
    id: 0,
    nome: '',
  }

  codigo: string = '';
  messageSucess: string | null = null;
  messageErro: string | null = null;

  ngOnInit(): void {
    this.#activatedRouter.paramMap.subscribe(params => {
      this.dynamicParam = params.get('slug') ?? '';
      this.#slugService.setParam(this.dynamicParam);
    });

    this.dynamicParam = this.#slugService.getParam();

    if (typeof window !== "undefined" && window.localStorage) {
      const usuario = localStorage.getItem('usuario')

      if (usuario) {
        this.usuario = JSON.parse(usuario)
        this.findCuponsByCliente(this.usuario.id)
      }
    }
  }

  public getCupons = signal<ICupom[]>([])

  findCuponsByCliente(idCliente: number): void {
    this.#cupomService.httpFindCuponsByCliente$(idCliente).subscribe({
      next: (data) => {
        this.getCupons.set(data)
      },
      error: (error) => {
        console.log("error: ", error.error.message)
      }
    })
  }

  // RESGATAR CUPOM

  resgate(): void {
    this.#cupomService.httpResgatarCupom$(this.usuario.id, this.codigo).subscribe({
      next: () => {
        this.findCuponsByCliente(this.usuario.id)
        this.messageSucess = "CUPOM RESGATADO COM SUCESSO"

        setTimeout(() => {
          this.messageSucess = null;
        }, 2000);
      },
      error: (error) => {
        this.messageErro = error.error?.message || "CUPOM NÃO ENCOTRADO"
        console.log("error: ", error.error.message)

        setTimeout(() => {
          this.messageErro = null;
        }, 2000);
      }
    })
  }

  public getLoja = signal<ILoja | null>(null);

  findByNomeLoja(slug: string): void {
    this.#lojaService.httpFindByNome$(slug).subscribe({
      next: (data) => {
        this.getLoja.set(data)
      },
      error: (error) => {
        console.log("erro: ", error.error.message)
        this.#router.navigate(['/loja/inativa']);
      }
    })
  }

}
