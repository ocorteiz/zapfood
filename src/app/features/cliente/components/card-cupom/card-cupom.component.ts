import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ICupom } from '../../../../core/interfaces/ICupom.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-cupom',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-cupom.component.html',
  styleUrl: './card-cupom.component.scss'
})
export class CardCupomComponent {

  @Input() getCupons: ICupom[] = [];
  @Output() cupomClicked = new EventEmitter<void>();
  @Output() cupomSelecionado = new EventEmitter<ICupom>();

  onCupomClick(): void {
    this.cupomClicked.emit();
  }

  cupom: ICupom | null = null;

  selectedCupom: number | null = null;

  selectCupom(index: number) {
    this.cupom = this.getCupons[index]
    this.cupomSelecionado.emit(this.cupom)
  }

}
