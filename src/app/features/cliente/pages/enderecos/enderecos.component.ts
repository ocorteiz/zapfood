import { Component, inject, OnInit, signal } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EnderecoService } from '../../../../core/services/endereco/endereco.service';
import { IEndereco } from '../../../../core/interfaces/IEndereco.interface';
import { CommonModule } from '@angular/common';
import { SlugService } from '../../../../core/resolver/slug.service';
import { ILoja } from '../../../../core/interfaces/ILoja.interface';
import { LojaService } from '../../../../core/services/loja/loja.service';

@Component({
  selector: 'app-enderecos',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterLink, CommonModule],
  templateUrl: './enderecos.component.html',
  styleUrl: './enderecos.component.scss'
})
export class EnderecosComponent implements OnInit {

  dynamicParam: string = '';

  #enderecoService = inject(EnderecoService);
  #slugService = inject(SlugService);
  #lojaService = inject(LojaService);

  usuario = {
    id: 0,
    nome: '',
  }

  #router = inject(Router);
  #activatedRouter = inject(ActivatedRoute);

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
        this.findEnderecosByCliente(this.usuario.id)
      }
    }
  }

  public getEnderecos = signal<IEndereco[]>([])

  findEnderecosByCliente(idCliente: number): void {
    this.#enderecoService.httpFindEnderecosByCliente$(idCliente).subscribe({
      next: (data) => {
        this.getEnderecos.set(data)
      },
      error: (error) => {
        console.log("error: ", error.error.message)
      }
    })
  }

  deleteEndereco(idEndereco: number): void {
    this.#enderecoService.httpDeleteEndereco$(idEndereco).subscribe({
      next: () => {
        this.findEnderecosByCliente(this.usuario.id)
      },
      error: (error) => {
        console.log("error: ", error.error.message)
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
