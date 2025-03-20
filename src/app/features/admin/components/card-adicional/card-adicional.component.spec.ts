import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardAdicionalComponent } from './card-adicional.component';

describe('CardAdicionalComponent', () => {
  let component: CardAdicionalComponent;
  let fixture: ComponentFixture<CardAdicionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardAdicionalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardAdicionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
