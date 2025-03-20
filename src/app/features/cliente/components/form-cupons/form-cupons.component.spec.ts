import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCuponsComponent } from './form-cupons.component';

describe('CuponsComponent', () => {
  let component: FormCuponsComponent;
  let fixture: ComponentFixture<FormCuponsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCuponsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormCuponsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
