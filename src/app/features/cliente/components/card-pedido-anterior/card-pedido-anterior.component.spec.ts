import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardPedidoAnteriorComponent } from './card-pedido-anterior.component';

describe('CardPedidoAnteriorComponent', () => {
  let component: CardPedidoAnteriorComponent;
  let fixture: ComponentFixture<CardPedidoAnteriorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardPedidoAnteriorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardPedidoAnteriorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
