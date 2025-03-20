import { CommonModule, NgIf } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { ItemService } from '../../../../core/services/item/item.service';
import { IItem } from '../../../../core/interfaces/IItem.interface';
;

@Component({
  selector: 'app-card-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-item.component.html',
  styleUrl: './card-item.component.scss'
})
export class CardItemComponent implements OnInit {
  @Input() visible: boolean = true;
  @Input() getItens: IItem[] = []

  @Output() itemDeleted = new EventEmitter<void>();

  #itemService = inject(ItemService)

  isMobile: boolean = false;

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.isMobile = window.innerWidth <= 768;
    }
  }

  visibled() {
    this.visible = false
  }

  getImageUrl(caminhoImagem: string | undefined): string {
    return `http://localhost:8080/${caminhoImagem}`;
  }

  deleteItem(id: number):void {
    this.#itemService.httpDelete$(id).subscribe({
      next: () => {
        this.itemDeleted.emit();
      },
      error: (error) => {
        console.log("erro: ", error.error.message)
      }
    })
  }

  updateItem(id: number):void {
    this.#itemService.httpUpdate$(id).subscribe({
      next: () => {
        this.itemDeleted.emit();
      },
      error: (error) => {
        console.log("erro: ", error.error.message)
      }
    })
  }

  getConcateEspecificacao(item: any): string {
    return item.especificacoes
      .map((e: any) => `${e.nome.toUpperCase()}`)
      .join(', ');
  }

  getConcateAdicional(item: any): string {
    return item.adicionais
      .map((e: any) => `+${e.quantidade} ${e.nome.toUpperCase()}`)
      .join(', ');
  }

}
