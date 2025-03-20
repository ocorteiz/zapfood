import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardEspecificacaoComponent } from './card-especificacao.component';

describe('CardEspecificacaoComponent', () => {
  let component: CardEspecificacaoComponent;
  let fixture: ComponentFixture<CardEspecificacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardEspecificacaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardEspecificacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
