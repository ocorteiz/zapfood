import { Component, inject, Input } from '@angular/core';
import { IProduto } from '../../../../core/interfaces/IProdutos.interface';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-promocao',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './card-promocao.component.html',
  styleUrl: './card-promocao.component.scss'
})
export class CardPromocaoComponent {

  @Input() getPromocao: IProduto[] | [] = [];

  getImageUrl(caminhoImagem: string | undefined): string {
    return `http://localhost:8080/${caminhoImagem}`;
  }

}
