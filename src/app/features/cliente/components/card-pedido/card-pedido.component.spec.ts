import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardPedidoComponent } from './card-pedido.component';

describe('CardPedidoComponent', () => {
  let component: CardPedidoComponent;
  let fixture: ComponentFixture<CardPedidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardPedidoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
