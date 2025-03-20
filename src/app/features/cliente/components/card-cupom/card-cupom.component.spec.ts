import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardCupomComponent } from './card-cupom.component';

describe('CardCupomComponent', () => {
  let component: CardCupomComponent;
  let fixture: ComponentFixture<CardCupomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardCupomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardCupomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
