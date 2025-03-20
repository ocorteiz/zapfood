import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LojaService } from '../../../../core/services/loja/loja.service';
import { ILoja } from '../../../../core/interfaces/ILoja.interface';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  ngOnInit(): void {
    this.showLoja()
  }

  #lojaService = inject(LojaService);

  getImageUrl(caminhoImagem: string): string {
    return `http://localhost:8080/${caminhoImagem}`;
  }

  // SHOW (LOJA)

  public getLoja = signal<ILoja | null>(null);

  showLoja(): void {
    this.#lojaService.httpFind$().subscribe({
      next: (data) => {
        this.getLoja.set(data)
      },
      error: (error) => console.log("erro: ", error.error.message)
    })
  }

}
