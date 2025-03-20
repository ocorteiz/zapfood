import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardPromocaoComponent } from './card-promocao.component';

describe('CardPromocaoComponent', () => {
  let component: CardPromocaoComponent;
  let fixture: ComponentFixture<CardPromocaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardPromocaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardPromocaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
