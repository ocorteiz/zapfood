import { CommonModule, NgFor, SlicePipe } from '@angular/common';
import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IProduto } from '../../../../core/interfaces/IProdutos.interface';
import { SlugService } from '../../../../core/resolver/slug.service';

@Component({
  selector: 'app-card-produto',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './card-produto.component.html',
  styleUrl: './card-produto.component.scss'
})
export class CardProdutoComponent implements OnInit {

  @Input() getProdutos: IProduto[] | null = null;

  dynamicParam: string = '';

  #slugService = inject(SlugService);

  ngOnInit(): void {
    this.dynamicParam = this.#slugService.getParam();
  }

  getImageUrl(caminhoImagem: string): string {
    return `http://localhost:8080/${caminhoImagem}`;
  }

}
